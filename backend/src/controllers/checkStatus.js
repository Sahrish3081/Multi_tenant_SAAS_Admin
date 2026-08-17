import { db } from '#config/client.js';
import { invitations } from '#drizzle/schema.js';
import { eq , and} from 'drizzle-orm';



export async function checkInvitationStatus(req, res){
    const userId=req.user.id;
    const { workspaceId } =req.body;
    const status = req.params.status ? req.params.status.toUpperCase() : null;

    try{
        if(!status){
            res.status(400).json({
                message:"Status  filed is required"
            });
        }

  const allowedStatus=['PENDING', 'ACCEPTED'];
   if(!allowedStatus.includes(status)){
     return res.status(400).json({ 
    message: `Invalid status. You can only choose from: ${allowedStatus.join(', ')}` 
  })
}

    const checkStatus=await db.select({
    id:invitations.id,
    workspaceId:invitations. workspaceId,
    email:invitations. email,
    status:invitations.status
  }).from(invitations)
  .where(
    and(
        eq(invitations.workspaceId, workspaceId),
        eq(invitations.status,status)
    )
  );
 return  res.status(200).json({
    message: " Status fetched successfully",
    count: checkStatus.length,
    member: checkStatus,
 })
    }catch(error){
        console.log("Don't fetch invitation status.", error);
        return res.status(500).json({
            message:"Don't fetch the invitation status.",
            error:error.message
        })

    }
}