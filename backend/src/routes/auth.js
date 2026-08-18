import express from "express";

import { signup, login } from "#controllers/auth.js";
import { forgetPassword } from "#controllers/forgetPassword.js";
import { resetPassword } from "#controllers/resetPassword.js";
import { emailVerification } from "#controllers/emailVerification.js";
import { verifyEmail } from "#controllers/isVerifiedEmail.js";

import { authMiddleware } from "#middleware/auth.js";
import { profileController } from "#controllers/profile.js";
import { changePassword } from "#controllers/change-password.js";

const auth = express.Router();

auth.post("/signup", signup);
auth.post("/login", login);
auth.post("/forget-password", forgetPassword);
auth.post("/reset-password", resetPassword);
auth.post("/email-verification-token", emailVerification);
auth.post("/verify-Email", verifyEmail);

auth.patch("/change-password", authMiddleware, changePassword);

auth.get("/profile", authMiddleware, profileController);

export default auth;
