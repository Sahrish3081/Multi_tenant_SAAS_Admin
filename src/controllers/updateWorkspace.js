import { db } from '#config/client.js';
import { workspace } from '#drizzle/schema.js';
import { eq } from 'drizzle-orm';

export async function updateWorkspace(req, res) {
  const userId = req.user.id;
  const { workspaceId } = req.body;
  const workspaceName = req.body.workspace_name;

  try {
    // Check if workspace exists
    const workSpace = await db
      .select({
        workspaceId: workspace.id,
        workspace_name: workspace.workspaceName,
      })
      .from(workspace)
      .where(eq(workspace.id, workspaceId));

    if (workSpace.length === 0) {
      return res.status(404).json({ message: "Workspace ID doesn't exist." });
    }

    // Update workspace name in db
    await db
      .update(workspace)
      .set({ workspaceName: workspaceName })
      .where(eq(workspace.id, workspaceId));

    return res.status(200).json({
      message: `Workspace name updated to ${workspaceName} successfully`,
    });
  } catch (error) {
    console.log("Update workspace name Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
