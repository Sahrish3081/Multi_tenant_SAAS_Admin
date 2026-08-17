import { db } from "#config/client.js";
import { workspace, workspaceMembers } from "#drizzle/schema.js";
import { eq, and } from "drizzle-orm";

export const transferWorkspaceOwnership = async (req, res) => {
  const { workspaceId } = req.params;
  const { newOwnerId } = req.body;

  // Current authenticated user
  const currentOwnerId = req.user.id;

  if (!workspaceId || !newOwnerId) {
    return res.status(400).json({
      success: false,
      message: "Workspace ID and new owner ID are required",
    });
  }

  if (currentOwnerId === newOwnerId) {
    return res.status(400).json({
      success: false,
      message: "You cannot transfer ownership to yourself",
    });
  }

  try {
    await db.transaction(async (tx) => {
      // Check workspace

      const [currentWorkspace] = await tx
        .select()
        .from(workspace)
        .where(eq(workspace.id, workspaceId))
        .limit(1);

      if (!currentWorkspace) {
        throw new Error("WORKSPACE_NOT_FOUND");
      }

      //  current workspace owner same id as created

      if (currentWorkspace.createdBy !== currentOwnerId) {
        throw new Error("NOT_WORKSPACE_OWNER");
      }

      // Find current owner's workspace membership

      const [currentOwnerMember] = await tx
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, currentOwnerId),
            eq(workspaceMembers.role, "owner"),
          ),
        )
        .limit(1);

      if (!currentOwnerMember) {
        throw new Error("OWNER_MEMBERSHIP_NOT_FOUND");
      }

      /*Find new owner's membership
        ownership should be transferred to an existing ADMIN.
       */
      const [newOwnerMember] = await tx
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, newOwnerId),
            eq(workspaceMembers.role, "admin"),
          ),
        )
        .limit(1);

      if (!newOwnerMember) {
        throw new Error("NEW_OWNER_MUST_BE_EXISTING_WORKSPACE_ADMIN");
      }

      /* first owner become admin then admin become owner */
      await tx
        .update(workspaceMembers)
        .set({
          role: "admin",
          assignedBy: currentOwnerId,
        })
        .where(eq(workspaceMembers.id, currentOwnerMember.id));

      //  New owner becomes owner

      await tx
        .update(workspaceMembers)
        .set({
          role: "owner",
          assignedBy: currentOwnerId,
        })
        .where(eq(workspaceMembers.id, newOwnerMember.id));

      //Update workspace.createdBy

      await tx
        .update(workspace)
        .set({
          createdBy: newOwnerId,
        })
        .where(eq(workspace.id, workspaceId));
    });

    return res.status(200).json({
      success: true,
      message: "Workspace ownership transferred successfully",
      data: {
        previousOwnerId: currentOwnerId,
        newOwnerId,
        workspaceId,
      },
    });
  } catch (error) {
    console.error("Transfer ownership error:", error);

    switch (error.message) {
      case "WORKSPACE_NOT_FOUND":
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });

      case "NOT_WORKSPACE_OWNER":
        return res.status(403).json({
          success: false,
          message: "Only the workspace owner can transfer ownership",
        });

      case "OWNER_MEMBERSHIP_NOT_FOUND":
        return res.status(409).json({
          success: false,
          message: "Current owner membership is inconsistent",
        });

      case "NEW_OWNER_MUST_BE_EXISTING_WORKSPACE_ADMIN":
        return res.status(400).json({
          success: false,
          message:
            "Ownership can only be transferred to an existing workspace admin",
        });

      default:
        return res.status(500).json({
          success: false,
          message: "Failed to transfer workspace ownership",
        });
    }
  }
};
