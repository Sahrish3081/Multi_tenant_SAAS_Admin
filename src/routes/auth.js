import express from "express";
import { signup, login } from "#controllers/auth.js";
import { forgetPassword } from "#controllers/forgetPassword.js";
import { resetPassword } from "#controllers/resetPassword.js";
import { emailVerification } from "#controllers/emailVerification.js";
import { verifyEmail } from "#controllers/isVerifiedEmail.js";
import { authMiddleware } from "#middleware/auth.js";
import {  profileController } from "#controllers/profile.js";
import { workspaceCreate } from "#controllers/workspace.js";
import { workSpaceMembers } from "#controllers/workSpaceMember.js";
import { ownerMiddleware } from  "#middleware/owner.js";
import { deleteMemberFromWorkspace } from "#controllers/deleteMembers.js";
import { updateRole } from "#controllers/updateRole.js";
const router = express.Router();

router.post('/signup', signup);
router.post('/login',login);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);
router.post('/email-verification-token' , emailVerification);
router.post('/verify-Email',verifyEmail);
// Protected route
router.get("/profile", authMiddleware, profileController);
router.post("/workspace", authMiddleware, workspaceCreate);
router.post("/members", authMiddleware, ownerMiddleware , workSpaceMembers);
router.post("/member-delete/:memberId", authMiddleware,ownerMiddleware,  deleteMemberFromWorkspace);

router.put("/member-role", authMiddleware, ownerMiddleware, updateRole);
export default router;