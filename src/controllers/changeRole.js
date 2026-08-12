import { db } from '#config/client.js';
import { workspaceMembers } from '#drizzle/schema.js';
import { eq } from 'drizzle-orm';


export async function changeRole(req, res) {
  const memberId = req.params.memberId;
  const { role } = req.body;
  const userId = req.user.id;

  try {
    if (!memberId) {
      return res.status(400).json({
        message: "Member ID is required"
      });
    }

    if (!role) {
      return res.status(400).json({
        message: "Role is required for update role."
      });
    }
    // your array of allowed roles
   const allowedRoles = ['admin', 'editor', 'viewer'];

  //  Check if the input role is NOT included in the array
   if (!allowedRoles.includes(role)) {
     return res.status(400).json({ 
    message: `Invalid role assigned. You can only choose from: ${allowedRoles.join(', ')}` 
  })
   }

    // User cannot change their own role
    const [targetMember] = await db
      .select({
        memberId: workspaceMembers.id,
        userId: workspaceMembers.userId,
        workspaceId: workspaceMembers.workspaceId,
        role: workspaceMembers.role
      })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.id, memberId));

    if (!targetMember) {
      return res.status(404).json({
        message: "Workspace member is not found"
      });
    }
   /* MEMBER ITSELF DO'NT UPDATE YOUR ROLE */
    if (targetMember.userId === userId) {
      return res.status(403).json({
        message: "You cannot change your own role"
      });
    }

    // Owner role cannot be assigned
    if (role === "owner") {
      return res.status(403).json({
        message: "Owner role cannot be assigned through this API"
      });
    }

    const [updateMember] = await db
      .update(workspaceMembers)
      .set({
        role: role
      })
      .where(eq(workspaceMembers.id, memberId))
      .returning({
        memberId: workspaceMembers.id,
        workspaceId: workspaceMembers.workspaceId,
        role: workspaceMembers.role
      });

    return res.status(200).json({
      message: "Member role updated successfully",
      member: updateMember
    });

  } catch (error) {
    console.log("Change Role Error:", error);

    return res.status(500).json({
      message: "Failed to update role.",
      error: error.message
    });
  }
}