
import express from "express";
import { signup, login } from "#controllers/auth.js";
import { forgetPassword } from "#controllers/forgetPassword.js";
import { resetPassword } from "#controllers/resetPassword.js";
import { emailVerification } from "#controllers/emailVerification.js";
import { verifyEmail } from "#controllers/isVerifiedEmail.js";

import { authMiddleware } from "#middleware/auth.js";
import {  profileController } from "#controllers/profile.js";
import { changePassword } from '#controllers/change-password.js';
import { workspaceCreate } from "#controllers/workspace.js";
//import { workSpaceMembers } from "#controllers/workSpaceMember.js";
import { ownerMiddleware } from  "#middleware/owner.js";
import { deleteMember } from "#controllers/deleteMembers.js";
// import { updateRole } from "#controllers/updateRole.js";
import { adminMiddleware } from "#middleware/admin.js";
import { ownerOrAdminMiddleware } from "#middleware/ownerOrAdmin.js";
import { createInvitation } from "#controllers/invitation.js";
import { acceptInvitation , revokeInvitation } from "#controllers/acceptInvitation.js";
import { getMyWorkspace} from "#controllers/getMyWorkspace.js";
import { getWorkspaceMembers } from  "#controllers/getWorkspaceMembers.js";
import { changeRole } from "#controllers/changeRole.js";
import { getMemberOnBaseOfRole } from "#controllers/onBaseOfRole.js";
import { checkInvitationStatus } from "#controllers/checkStatus.js";
import { deleteWorkspace } from "#controllers/deleteWorkspace.js";
import { updateWorkspace } from "#controllers/updateWorkspace.js";
import { transferWorkspaceOwnership } from "#controllers/ownershipTransfer.js";

const auth = express.Router();
// Auth management routing definitions
auth.post('/signup', signup);
auth.post('/login', login);
auth.post('/forget-password', forgetPassword);
auth.post('/reset-password', resetPassword);
auth.post('/email-verification-token', emailVerification);
auth.post('/verify-Email', verifyEmail);
auth.patch('/change-password', authMiddleware, changePassword);
auth.get("/profile", authMiddleware, profileController);
/* Clean Resource-Based Workspace Router with Query Filters */

const workspace = express.Router();
// Global Base Protection for Workspace Endpoint Resource Sets
workspace.use(authMiddleware);
/**
 * 1. WORKSPACE CORE MANAGEMENT
 */
workspace.post("/", workspaceCreate);
workspace.patch("/", ownerMiddleware, updateWorkspace);
workspace.delete("/", ownerMiddleware, deleteWorkspace);
workspace.post("/transfer-ownership", ownerMiddleware, transferWorkspaceOwnership);
workspace.get("/my-workspaces", getMyWorkspace);
/**
 * 2. MEMBERS RESOURCE ROUTING (FILTER-BASED GET)
 * Standardized path names to "/members" to maintain resource consistency
 */
workspace.get("/members", (req, res, next) => {

  const { workspaceId, role, memberId } = req.query;
  //all parameter get first now all conditions have already values
  if (workspaceId) req.params.workspaceId = workspaceId;
  if (memberId) req.params.memberId = memberId;
  if (role) req.params.role = role;

  // Case A: Role base filter check (?role=admin)
  if (role) {
    req.params.role = role; 
    return ownerMiddleware(req, res, () => getMemberOnBaseOfRole(req, res, next));
  }

  // Case B: Workspace context members lookup (?workspaceId=123)
  if (workspaceId) {
    req.params.workspaceId = workspaceId;
    return getWorkspaceMembers(req, res, next);
  }

  // Case C: Single member direct query lookup (?memberId=57ed848f...)
  if (memberId) {
    req.params.workspaceId = workspaceId; // Pass workspace context if needed by controller
    req.params.memberId = memberId;
    return getWorkspaceMembers(req, res, next);

  }

  return res.status(400).json({ error: "Missing required query parameters: workspaceId, role, or memberId" });
});
// Member Mutations (Delete & Modify Tasks mapped neatly onto parameters)
workspace.delete("/member/:memberId", ownerOrAdminMiddleware, deleteMember);
workspace.patch("/member/role/:memberId", ownerOrAdminMiddleware, changeRole);
/**
 * 3. INVITATIONS MANAGEMENT RESOURCE
 */
workspace.post("/invitation", ownerOrAdminMiddleware, createInvitation);
workspace.post("/invitation/accept", acceptInvitation);
workspace.post("/invitation/revoke", revokeInvitation);
// Filter invitations by tracking query strings: /workspace/invitations/status?status=pending
workspace.get("/invitation/status", ownerMiddleware, (req, res, next) => {
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({ error: "Query parameter 'status' is required" });
  }
  req.params.status = status;
  return checkInvitationStatus(req, res, next);
});
export { auth, workspace };






// import express from "express";
// import { signup, login } from "#controllers/auth.js";
// import { forgetPassword } from "#controllers/forgetPassword.js";
// import { resetPassword } from "#controllers/resetPassword.js";
// import { emailVerification } from "#controllers/emailVerification.js";
// import { verifyEmail } from "#controllers/isVerifiedEmail.js";

// import { authMiddleware } from "#middleware/auth.js";
// import {  profileController } from "#controllers/profile.js";
// import { changePassword } from '#controllers/change-password.js';
// import { workspaceCreate } from "#controllers/workspace.js";
// //import { workSpaceMembers } from "#controllers/workSpaceMember.js";
// import { ownerMiddleware } from  "#middleware/owner.js";
// import { deleteMember } from "#controllers/deleteMembers.js";
// // import { updateRole } from "#controllers/updateRole.js";
// import { adminMiddleware } from "#middleware/admin.js";
// import { ownerOrAdminMiddleware } from "#middleware/ownerOrAdmin.js";
// import { createInvitation } from "#controllers/invitation.js";
// import { acceptInvitation , revokeInvitation } from "#controllers/acceptInvitation.js";
// import { getMyWorkspace} from "#controllers/getMyWorkspace.js";
// import { getWorkspaceMembers } from  "#controllers/getWorkspaceMembers.js";
// import { changeRole } from "#controllers/changeRole.js";
// import { getMemberOnBaseOfRole } from "#controllers/onBaseOfRole.js";
// import { checkInvitationStatus } from "#controllers/checkStatus.js";
// import { deleteWorkspace } from "#controllers/deleteWorkspace.js";
// import { updateWorkspace } from "#controllers/updateWorkspace.js";
// import { transferWorkspaceOwnership } from "#controllers/ownershipTransfer.js";
// const auth = express.Router();

// auth.post('/signup', signup);
// auth.post('/login',login);
// auth.post('/forget-password', forgetPassword);
// auth.post('/reset-password', resetPassword);
// auth.post('/email-verification-token' , emailVerification);
// auth.post('/verify-Email',verifyEmail);
// auth.patch('/change-password', authMiddleware, changePassword);
// // Protected route

// auth.get("/profile", authMiddleware, profileController);
// /* workspace routes */
// const workspace = express.Router();
// workspace.post("/", authMiddleware, workspaceCreate);
// /* do not need this because invitation handle this process
// workspace.post("/members", authMiddleware, ownerMiddleware , workSpaceMembers);/* owner add 
// workspace.post("/members", authMiddleware, adminMiddleware, workSpaceMembers);/* admin add */

// workspace.delete("/member-delete/:memberId", authMiddleware, ownerOrAdminMiddleware, deleteMember);/*admin  or owner delete  */

// // workspace.put("/member-role", authMiddleware, ownerOrAdminMiddleware, updateRole);/* owner or admin role update */
// workspace.post('/invitation',authMiddleware, ownerOrAdminMiddleware,createInvitation);
// workspace.post('/invitation/accept', authMiddleware,acceptInvitation);
// workspace.post('/revoke', revokeInvitation);
// workspace.get('/my-workspaces',authMiddleware,getMyWorkspace);
// workspace.get('/workspace-members/:workspaceId', authMiddleware, getWorkspaceMembers);
// workspace.patch("/change-role/:memberId", authMiddleware,ownerOrAdminMiddleware, changeRole);
// workspace.get('/role/:role',authMiddleware,ownerMiddleware, getMemberOnBaseOfRole);
// workspace.get('/status/:status', authMiddleware,ownerOrAdminMiddleware,checkInvitationStatus);
// workspace.delete('/delete', authMiddleware,ownerMiddleware, deleteWorkspace);
// workspace.patch('/name-update', authMiddleware, ownerMiddleware, updateWorkspace);
// // Owner ship transfer route
// workspace.post("/:workspaceId/transfer-ownership",authMiddleware, ownerMiddleware,transferWorkspaceOwnership,);
// export { auth, workspace };