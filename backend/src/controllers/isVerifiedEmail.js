import { db } from '#config/client.js';
import { users } from '#drizzle/schema.js';
import { eq, and } from 'drizzle-orm';
import { verifiedEmailValidation } from '#validators/authValidation.js';
import  { hashToken } from  "#utils/cryptoUtils.js";

export async function verifyEmail(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Verification token is required.",
    });
  }

  try {
    const hashedToken = hashToken(token);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, hashedToken));

    if (user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    if (user[0].tokenExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired.",
      });
    }

    if (user[0].isTokenUsed) {
      return res.status(400).json({
        success: false,
        message: "Verification token has already been used.",
      });
    }

    await db
      .update(users)
      .set({
        isEmailVerified: true,
        isTokenUsed: true,
        resetToken: null,
        tokenExpiresAt: null,
      })
      .where(eq(users.id, user[0].id));

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Email Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}