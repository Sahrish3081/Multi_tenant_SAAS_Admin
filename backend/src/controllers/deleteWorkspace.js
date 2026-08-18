import { db } from "#config/client.js";
import { workspace, workspaceMembers, invitations } from "#drizzle/schema.js";
import { and, eq } from "drizzle-orm";
import { createAuditLog } from '#controllers/auditLogs.js';

export async function deleteWorkspace(req, res) {
  const userId = req.user.id;
  const { workspaceId } = req.body; 

  if (!workspaceId) {
    return res.status(400).json({ message: "Workspace ID is required" });
  }

  try {
    /* Verify this SPECIFIC workspace exists AND belongs to the logged-in user */
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

    // allows us to check workspace exist or not
    if (!workspaceExist) {
      return res.status(404).json({
        message: "Workspace not found, or you do not have permission to delete it.",
      });
    }

    //  child tables FIRST to respect foreign keys
    await db.transaction(async (tx) => {
      
      // clear out invitations  to this workspace
      await tx
        .delete(invitations)
        .where(eq(invitations.workspaceId, workspaceId));

      // clear out all recorded workspace members
      await tx
        .delete(workspaceMembers)
        .where(eq(workspaceMembers.workspaceId, workspaceId));

      //  delete the parent workspace container safely
      await tx
        .delete(workspace)
        .where(eq(workspace.id, workspaceId));
    });

    return res.status(200).json({
      message: "Workspace and all related data removed successfully",
    });

  } catch (error) {
    console.log("Delete Workspace Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
  finally{
     const auditResult = await createAuditLog({
       performedBy: req.user.id,
       action: "Delete workspace",
       affectedUser: req.params.workspaceId,
});

return res.status(200).json({
  success: true,
  message: "Delete workspace successfully",
  audit: auditResult.message,
});
  }
}
