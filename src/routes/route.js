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
import { adminMiddleware } from "#middleware/admin.js";
import { ownerOrAdminMiddleware } from "#middleware/owneroradmin.js";
const auth = express.Router();

auth.post('/signup', signup);
auth.post('/login',login);
auth.post('/forget-password', forgetPassword);
auth.post('/reset-password', resetPassword);
auth.post('/email-verification-token' , emailVerification);
auth.post('/verify-Email',verifyEmail);
// Protected route

auth.get("/profile", authMiddleware, profileController);
/* workspace routes */
const workspace = express.Router();
workspace.post("/workspace", authMiddleware, workspaceCreate);
workspace.post("/members", authMiddleware, ownerMiddleware , workSpaceMembers);/* owner add */
workspace.post("/members", authMiddleware, adminMiddleware, workSpaceMembers);/* admin add */

workspace.post("/member-delete/:memberId", authMiddleware, ownerOrAdminMiddleware,  deleteMemberFromWorkspace);/*admin  or owner delete  */

workspace.put("/member-role", authMiddleware, ownerOrAdminMiddleware, updateRole);/* owner or admin role update */

export { auth, workspace };