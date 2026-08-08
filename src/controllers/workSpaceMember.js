import { db } from '#config/client.js';
import { users,workspaceMembers } from '#drizzle/schema.js';
import { eq } from 'drizzle-orm';
export async function workSpaceMembers(req, res) {

    const { memberName, email, role, workspaceId } = req.body;

    try {

        const user = await db
            .select({
                id: users.id
            })
            .from(users)
            .where(eq(users.email, email));

        // User does not have an account
        if (user.length === 0) {
            return res.status(404).json({
                message: "User not found. Ask the user to sign up first."
            });
        }

        const userId = user[0].id;

        await db.insert(workspaceMembers).values({
            memberName,
            userId,
            workspaceId,
            role,
            assignedBy: "owner"
        });

        return res.status(201).json({
            message: `${memberName} has been assigned the ${role} role in the workspace.`
        });

    } catch (error) {

        console.log("Workspace Member Error :", error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}