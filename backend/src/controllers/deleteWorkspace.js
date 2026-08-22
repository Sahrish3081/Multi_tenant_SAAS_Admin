import { db } from "#config/client.js";
import {
  workspace,
  workspaceMembers,
  invitations,
} from "#drizzle/schema.js";
import { and, eq } from "drizzle-orm";
import { createAuditLog } from "#controllers/auditLogs.js";

export async function deleteWorkspace(req, res) {
  const userId = req.user.id;
  const { workspaceId } = req.body;

  if (!workspaceId) {
    return res.status(400).json({
      message: "Workspace ID is required",
    });
  }

  try {
    // Check that this workspace belongs to the logged-in owner
    const [workspaceExist] = await db
      .select({
        id: workspace.id,
        createdBy: workspace.createdBy,
      })
      .from(workspace)
      .where(
        and(
          eq(workspace.id, workspaceId),
          eq(workspace.createdBy, userId)
        )
      );

    if (!workspaceExist) {
      return res.status(404).json({
        message:
          "Workspace not found, or you do not have permission to delete it.",
      });
    }

    // Delete child records first
    await db.transaction(async (tx) => {
      await tx
        .delete(invitations)
        .where(eq(invitations.workspaceId, workspaceId));

      await tx
        .delete(workspaceMembers)
        .where(eq(workspaceMembers.workspaceId, workspaceId));

      await tx
        .delete(workspace)
        .where(eq(workspace.id, workspaceId));
    });

    // Audit log
    const auditResult = await createAuditLog({
      performedBy: userId,
      action: "Delete workspace",
      affectedUser: null,
    });

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
      audit: auditResult.message,
    });
  } catch (error) {
    console.log("Delete Workspace Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}