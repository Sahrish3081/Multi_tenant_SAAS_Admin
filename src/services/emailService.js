
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { db } from '#config/client.js';      
import { users } from '#drizzle/schema.js';   
import { eq } from 'drizzle-orm';
import { generateSecureToken } from '#utils/cryptoUtils.js'; // Utils se import

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || ''
});

// Email sending logic
export async function sendEmailNotification(email, subject, text) {
  const mailOptions = {
    from: `Auth System <mailgun@${process.env.MAILGUN_DOMAIN}>`,
    to: [email],
    subject: subject,
    text: text
  };

  await mg.messages.create(process.env.MAILGUN_DOMAIN, mailOptions);
  return true;
}

// Central token handling service
export const generateAndSendToken = async (email, type) => {
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 Mins

  // Database (Drizzle) update
  await db.update(users)
    .set({ 
        resetToken: token, 
        tokenExpiresAt: expiresAt,
        isTokenUsed: false 
    })
    .where(eq(users.email, email));
 
  let subject, text;
  
  if (type === 'RESET_PASSWORD') {
    subject = 'Password Reset Token';
    text = `You requested a password reset. Your secure reset token is:\n\n${token}\n\nUse this token to change your password.`;
  } else if (type === 'EMAIL_VERIFICATION') {
    subject = 'Verify Your Email';
    text = `Welcome! Please verify your email. Your secure verification token is:\n\n${token}\n\nThis token will expire in 15 minutes.`;
  }

  // Mailgun function call
  await sendEmailNotification(email, subject, text);
  return true;
};
