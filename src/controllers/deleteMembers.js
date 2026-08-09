import { db } from '#config/client.js';
import { workspaceMembers } from '#drizzle/schema.js';
import { and, eq } from 'drizzle-orm';

export async function deleteMemberFromWorkspace(req,res){
  const memberId = Number(req.params.memberId);
  const workspaceId = Number(req.body.workspaceId);

  if(!memberId || !workspaceId){
      return res.status(400).json({
      message: "Member ID and Workspace ID are required"
    });
  }
  try{
    /* check member exist in table */
  const member= await db .select({
    id:workspaceMembers.id,
    role:workspaceMembers.role
  }) .from(workspaceMembers)
 .where(
        and(
          eq(workspaceMembers.id, memberId),
          eq(workspaceMembers.workspaceId, workspaceId)
        ));
 
        if(member.length===0){
              return res.status(400).json({
      message: "Member don't  exist in work space ."
    });
        }
        /* owner not delete  */
           // Owner cannot be deleted
    if (member[0].role === "owner") {
      return res.status(403).json({
        message: "Workspace owner cannot be removed"
      });
    }
    /* delete member  */
   await db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.id, memberId),
          eq(workspaceMembers.workspaceId, workspaceId)
        )
      );

       return res.status(200).json({
      message: "Workspace member removed successfully"
    });
}
  catch(error){
    console.log("Delete Workspace Member Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}