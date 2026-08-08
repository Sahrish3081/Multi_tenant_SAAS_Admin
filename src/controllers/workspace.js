import { db } from '#config/client.js';
import { workspace } from '#drizzle/schema.js';

export async function workspaceCreate(req, res) {
  const { workspaceName } = req.body;

  if (!workspaceName) {
    return res.status(400).json({
      message: "Workspace name is required"
    });
  }

  try {
    const createdBy = req.user.id;

   await db.insert(workspace).values({
    workspaceName: workspaceName,
    createdBy: createdBy
});

    return res.status(201).json({
      message: `${workspaceName} Workspace is successfully created`
    });

  } catch (error) {
    console.log("Workspace Error :", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}