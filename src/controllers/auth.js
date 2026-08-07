import { db } from '#config/client.js';
import { users } from '#drizzle/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { signupValidation, loginValidation } from '#validators/authValidation.js';

/* SIGNUP SYSTEM */
export async function signup(req, res) {

    // const { username, email, password, confirm_password } = req.body;
    
    /* Validate fields */
    // if (!username || !email || !password || !confirm_password) {
    //     return res.status(400).json({ message: "All fields are required" });
    // }
    // if (password !== confirm_password) {
    //     return res.status(400).json({ message: "Passwords do not match" });
    // }

    
    // const validation = signupValidation.safeParse(req.body);
    // if (!validation.success) {
    //     return res.status(400).json({
    //         success: false,
    //         errors: validation.error.errors.map(err => ({
    //             field: err.path[0],
    //             message: err.message
    //         }))
    //     });
    // }

    /* throw error in valid form  */
    const validation = signupValidation.safeParse(req.body);
    
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.error.flatten().fieldErrors 
        });
    }

    // Safely extracting sanitized and parsed fields from Zod validation context
    const { username, email, password } = validation.data;

    try {
        const emailExists = await db.select().from(users).where(eq(users.email, email));
        if (emailExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        /* Hashed password store in database */
        const hashedPassword = await bcrypt.hash(password, 10);
        
        /* insert data in database */
        await db.insert(users).values({
            username: username,
            email: email,
            password: hashedPassword
        });

        /* successful request confirmation */
        return res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.log("Signup Error :", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

/* LOGIN SYSTEM */
export async function login(req, res) {
    
    // const { email, password } = req.body;
    
    /* validate fields */
    // if (!email || !password) {
    //     return res.status(400).json({ message: "All fields are required" });
    // }

    // const validation = loginValidation.safeParse(req.body);
    // if (!validation.success) {
    //     return res.status(400).json({
    //         success: false,
    //         errors: validation.error.errors.map(err => ({
    //             field: err.path[0],
    //             message: err.message
    //         }))
    //     });
    // }

    // Standardizing centralized login error schemas with safe structure
    const validation = loginValidation.safeParse(req.body);
    
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.error.flatten().fieldErrors
        });
    }

    const { email, password } = validation.data;

    try {
        const user = await db.select().from(users).where(eq(users.email, email));
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        /* compare password */
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log("Login Error :", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
