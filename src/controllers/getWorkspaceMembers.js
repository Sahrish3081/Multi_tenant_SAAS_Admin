import { db } from '#config/client.js';
import { workspace, workspaceMembers } from '#drizzle/schema.js';
import { eq } from 'drizzle-orm';

export async function getWorkspaceMembers(req,res){
    const userId=req.user.id;
    const workspaceId= req.params.workspaceId;
    try{
     const getWorkspaceMember=await db.select({
        memberId:workspaceMembers.id,
        username:workspaceMembers.memberName,
        user_id:workspaceMembers.userId,
        role:workspaceMembers.role,
        createAt:workspaceMembers.createdAt
     }).from(workspaceMembers)
     .where(eq(workspaceMembers.workspaceId,workspaceId));

     return res.status(200).json({
      message: 'Workspaces fetched successfully',
      count: getWorkspaceMember.length,
      member: getWorkspaceMember,
    });
    }
    
    catch(error){
     console.log('Get Workspaces Member Error:', error);

    return res.status(500).json({
      message: 'Failed to fetch workspace member',
      error: error.message,
    });

    }
}