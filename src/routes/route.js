import express from "express";
import { signup, login } from "#controllers/auth.js";
import { forgetPassword } from "#controllers/forgetPassword.js";
import { resetPassword } from "#controllers/resetPassword.js";
import { emailVerification } from "#controllers/emailVerification.js";
import { verifyEmail } from "#controllers/isVerifiedEmail.js";
import { authMiddleware } from "#middleware/auth.js";
import {  profileController } from "#controllers/profile.js";
import { workspaceCreate } from "#controllers/workspace.js";
//import { workSpaceMembers } from "#controllers/workSpaceMember.js";
import { ownerMiddleware } from  "#middleware/owner.js";
import { deleteMemberFromWorkspace } from "#controllers/deleteMembers.js";
import { updateRole } from "#controllers/updateRole.js";
import { adminMiddleware } from "#middleware/admin.js";
import { ownerOrAdminMiddleware } from "#middleware/ownerOrAdmin.js";
import { createInvitation } from "#controllers/invitation.js";
import { acceptInvitation , revokeInvitation } from "#controllers/acceptInvitation.js";
import { getMyWorkspace} from "#controllers/getMyWorkspace.js";
import { getWorkspaceMembers } from  "#controllers/getWorkspaceMembers.js";
import { changeRole } from "#controllers/changeRole.js";
import { getMemberOnBaseOfRole } from "#controllers/onBaseOfRole.js";
import { checkInvitationStatus } from "#controllers/checkStatus.js";
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
/* do not need this because invitation handle this process
workspace.post("/members", authMiddleware, ownerMiddleware , workSpaceMembers);/* owner add 
workspace.post("/members", authMiddleware, adminMiddleware, workSpaceMembers);/* admin add */

workspace.post("/member-delete/:memberId", authMiddleware, ownerOrAdminMiddleware,  deleteMemberFromWorkspace);/*admin  or owner delete  */

workspace.put("/member-role", authMiddleware, ownerOrAdminMiddleware, updateRole);/* owner or admin role update */
workspace.post('/invitations',authMiddleware, ownerOrAdminMiddleware,createInvitation);
workspace.post('/invitations/accept', authMiddleware,acceptInvitation);
workspace.post('/revoke', revokeInvitation);
workspace.get('/my-workspaces',authMiddleware,getMyWorkspace);
workspace.get('/workspace-members/:workspaceId', authMiddleware, getWorkspaceMembers);
workspace.patch("/change-role/:memberId", authMiddleware,ownerOrAdminMiddleware, changeRole);

workspace.delete( "/member/:memberId", authMiddleware, ownerOrAdminMiddleware, deleteMemberFromWorkspace);
workspace.get('/role/:role',authMiddleware,ownerMiddleware, getMemberOnBaseOfRole);
workspace.get('/status/:status', authMiddleware,ownerMiddleware,checkInvitationStatus);
export { auth, workspace };