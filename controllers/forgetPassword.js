import crypto from 'crypto';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import pool from '../database/db.js';
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});
export async function forgetPassword(req, res) {
    // Implementation for forget password functionality
    const {email}= req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    const  userEmail=await pool.query('SELECT  * FROM users WHERE email=$1',[email]);
    if(userEmail.rows.length===0){
        return res.status(404).json({error:"User email not found"});
    }
    /* Generate token for reset password */
    const token = crypto.randomBytes(20).toString('hex');
    console.log("Generated Token:",token);
    /* Store token in database */
  await pool.query('UPDATE users SET reset_token=$1 WHERE email=$2',[token,email]);
   /* Send email with reset link */

      // 5. Send the token to the user's email inbox using Mailgun
    const mailOptions = {
      from: `Auth System <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: 'Password Reset Token',
      text: `You requested a password reset. Your secure reset token is:\n\n${token}\n\nUse this token to change your password.`
    };
    try {
        await mg.messages.create(process.env.MAILGUN_DOMAIN, mailOptions);
        res.status(200).json({ message: 'Password reset token sent to your email.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send reset email.' });
    }
}