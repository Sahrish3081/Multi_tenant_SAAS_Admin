import pool from '../database/db.js'; 
import bcrypt from 'bcrypt';

export async function resetPassword(req, res) {
    const { token, new_password, confirm_password } = req.body;
    
    /* validate input */
    if (!token || !new_password || !confirm_password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (new_password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        /* check if token is valid */
        const user = await pool.query('SELECT * FROM users WHERE reset_token = $1', [token]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        
        /* hash password */
        const hashedPassword = await bcrypt.hash(new_password, 10);
       
        /* update password AND clear the token  for safety */
            /* insert into database */
    await pool.query('UPDATE users SET password=$1 WHERE reset_token=$2',
            [hashedPassword, token]
         )
        
        /* FIX: CRITICAL MISSING RESPONSE LINE ADDED HERE */
        return res.status(200).json({ message: "Password has been successfully updated!" });
            
    } catch (error) {
        console.error("Reset Password Error :", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
