import { db } from "#config/client.js";
import { workspace, workspaceMembers, users } from "#drizzle/schema.js";
import { eq } from "drizzle-orm";
import { workspaceNameValidation } from "#validators/authValidation.js";
export async function workspaceCreate(req, res) {
  const { workspaceName } = req.body;

  if (!workspaceName) {
    return res.status(400).json({
      message: "Workspace name is required",
    });
}
/* apply email validation  */
const  validation =workspaceNameValidation.safeParse(req.body);
if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Workspace name  Validation failed",
            errors: validation.error.flatten().fieldErrors 
        });
    }

   
  try {
    const createdBy = req.user.id;

    // Get creator's username
    const user = await db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, createdBy));

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Create workspace
    const [newWorkspace] = await db
      .insert(workspace)
      .values({
        workspaceName,
        createdBy,
      })
      .returning({
        id: workspace.id,
      });

    // Creator automatically becomes Owner
    await db.insert(workspaceMembers).values({
      memberName: user[0].username,
      userId: createdBy,
      workspaceId: newWorkspace.id,
      role: "owner",
      assignedBy: createdBy,
    });

    return res.status(201).json({
      message: `${workspaceName} Workspace is successfully created`,
      workspaceId: newWorkspace.id,
      role: "owner",
    });
  } catch (error) {
    console.log("Workspace Error :", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

/* workspace id : 7e4038c1-694c-40f1-bca0-08d0a61c342f devsapce ki owner sahrish */
// workspace id marketing team onwer sahrish 3a15fbf4-005b-49d3-8937-4dedc6dd8f70