import express from "express";

import { ownerOrAdminMiddleware } from "#middleware/ownerOrAdmin.js";
import { ownerMiddleware } from "#middleware/owner.js";
import { createInvitation } from "#controllers/invitation.js";
import {
  acceptInvitation,
  revokeInvitation,
} from "#controllers/acceptInvitation.js";

import { checkInvitationStatus } from "#controllers/checkStatus.js";

const invitation = express.Router();

invitation.post("/", ownerOrAdminMiddleware, createInvitation);

invitation.post("/accept", acceptInvitation);

invitation.post("/revoke", revokeInvitation);

invitation.get("/status", ownerMiddleware, (req, res, next) => {
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({
      error: "Query parameter 'status' is required",
    });
  }

  req.params.status = status;

  return checkInvitationStatus(req, res, next);
});

export default invitation;
