
import { db } from '#config/client.js';
import { users } from '#drizzle/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from "bcrypt";
import { changePasswordValidation } from '#validators/authValidation.js';

export async function changePassword(req, res) {
    try {
        const userId = req.user.id;
        const { old_password, new_password, confirm_password } = req.body;
     /* apply validation in password */
        const validation = changePasswordValidation.safeParse({
            password: new_password,
            confirmPassword: confirm_password
        });
/* check validation apply or not */
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten().fieldErrors 
            });
        }

        //  Select user from database
        const userResult = await db.select().from(users).where(eq(users.id, userId));
        if (userResult.length === 0) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }
        
        const user = userResult[0];

        // Compare with actual saved password field (usually user.password)
        const old_password_valid = await bcrypt.compare(
            old_password,
            user.password // Changed from user.old_password to user.password
        );

        if (!old_password_valid) {
            return res.status(401).json({
                message: "Invalid old password."
            });
        }

        //  Hash new password and update database
        const hashedPassword = await bcrypt.hash(new_password, 10);

        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, userId));

       /* successful status */
        return res.status(200).json({ message: "Password changed successfully!" });

    } catch (error) {
        return res.status(500).json({
            message: "Password not updated due to server error!",
            error: error.message
        });
    }
}
