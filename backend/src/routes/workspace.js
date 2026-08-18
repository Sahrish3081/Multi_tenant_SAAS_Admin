import express from "express";

import { authMiddleware } from "#middleware/auth.js";
import { ownerMiddleware } from "#middleware/owner.js";
import { ownerOrAdminMiddleware } from "#middleware/ownerOrAdmin.js";

import { workspaceCreate } from "#controllers/workspace.js";
import { deleteMember } from "#controllers/deleteMembers.js";
import { changeRole } from "#controllers/changeRole.js";

import { getMyWorkspace } from "#controllers/getMyWorkspace.js";
import { getWorkspaceMembers } from "#controllers/getWorkspaceMembers.js";
import { getMemberOnBaseOfRole } from "#controllers/onBaseOfRole.js";

import { deleteWorkspace } from "#controllers/deleteWorkspace.js";
import { updateWorkspace } from "#controllers/updateWorkspace.js";
import { transferWorkspaceOwnership } from "#controllers/ownershipTransfer.js";

const workspace = express.Router();

// All workspace routes require authentication.

workspace.use(authMiddleware);

workspace.post("/", workspaceCreate);

workspace.patch("/", ownerMiddleware, updateWorkspace);

workspace.delete("/", ownerMiddleware, deleteWorkspace);

workspace.post(
  "/transfer-ownership",
  ownerMiddleware,
  transferWorkspaceOwnership,
);

//One GET endpoint with optional filters.

//   /members
//   /members?workspaceId=123
//   /members?workspaceId=123&memberId=456
//   /members?workspaceId=123&role=admin

workspace.get("/members", (req, res, next) => {
  const { workspaceId, memberId, role } = req.query;

  if (!workspaceId && !memberId && !role) {
    return getMyWorkspace(req, res);

    if (workspaceId && memberId && role) {
      req.params.workspaceId = workspaceId;
      req.params.memberId = memberId;
      req.params.role = role;

      return getWorkspaceMembers(req, res);
    }

    if (workspaceId && memberId) {
      req.params.workspaceId = workspaceId;
      req.params.memberId = memberId;

      return getWorkspaceMembers(req, res);
    }

    if (workspaceId && role) {
      req.body.workspaceId = workspaceId;
      req.params.role = role;

      return getMemberOnBaseOfRole(req, res);
    }

    if (workspaceId) {
      req.params.workspaceId = workspaceId;

      return getWorkspaceMembers(req, res);
    }

    return res.status(400).json({
      message: "Invalid query parameters",
    });
  }
});

workspace.delete("/member/:memberId", ownerOrAdminMiddleware, deleteMember);

workspace.patch("/member/role/:memberId", ownerOrAdminMiddleware, changeRole);

export default workspace;
