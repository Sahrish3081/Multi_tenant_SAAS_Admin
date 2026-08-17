import { db } from '#config/client.js';
import { workspaceMembers } from '#drizzle/schema.js';
import { and, eq } from 'drizzle-orm';
export async function updateRole(req,res){
    const { userId, workspaceId, role } = req.body;

      if(!userId || !workspaceId || !role){
      return res.status(400).json({
      message: "Member ID , Workspace ID and role are required"
    });
  }

  try{
  /* member exist or not  */
  const member= await db.select({
    id:workspaceMembers.id,
   role:workspaceMembers.role
  }).from(workspaceMembers)
  .where(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.workspaceId, workspaceId)
    );
    if(member.length===0){
        return res.status(400).json({
      message: "MemberId don't  exist in work space ."
    });
      // Owner's role cannot be changed
    if (member[0].role === "owner") {
      return res.status(403).json({
        message: "Workspace owner's role cannot be changed"
      });
    }
}
/* update role in db */
  await db
      .update(workspaceMembers)
      .set({ role: role})
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          eq(workspaceMembers.workspaceId, workspaceId)
        )
      );

       return res.status(200).json({
      message: `Member role updated to ${role} successfully`
    });
  }
    catch (error) {

    console.log("Update Role Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
      
  
}