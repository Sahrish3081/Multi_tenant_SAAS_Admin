import { db } from '#config/client.js';
import { users } from '#drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import { verifiedEmailValidation } from '#validators/authValidation.js'
export async function verifyEmail(req, res) {
    const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({
                error: 'Email and token are required'
            });
        }
       
          /* throw error in valid form  */
            const validation = verifiedEmailValidation.safeParse({ email: email });
            
            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    error: validation.error.flatten().fieldErrors 
                });
            }
    try {
        const user = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.email, email),
                    eq(users.resetToken, token)
                )
            );

        if (user.length === 0) {
            return res.status(400).json({
                error: 'Invalid verification token'
            });
        }

        if (user[0].tokenExpiresAt < new Date()) {
            return res.status(400).json({
                error: 'Verification token has expired'
            });
        }

        if (user[0].isTokenUsed) {
            return res.status(400).json({
                error: 'Verification token has already been used'
            });
        }

        await db
            .update(users)
            .set({
                isEmailVerified: true,
                isTokenUsed: true,
                resetToken: null,
                tokenExpiresAt: null
            })
            .where(eq(users.email, email));

        return res.status(200).json({
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Email Verification Error:', error);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}