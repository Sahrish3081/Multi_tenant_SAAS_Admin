import { db } from '#config/client.js';
import { invitations} from '#drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { generateSecureToken , hashToken } from '#utils/cryptoUtils.js';
export const createInvitation = async (req, res) => {

    
    const { email } = req.body;
    const workspaceId = req.body.workspaceId;
    const invitedBy = req.user.id;
  try{
    if(!email){
        return res.status(400).json({
            message: "Email is required",
        });
    
    }
  const token = generateSecureToken();
  const hashedToken= hashToken(token);
  const expiresAt = new Date(Date.now() + 12 * 60 * 1000); // 12 hours

  const [invitation]= await db.insert(invitations).values({
        workspaceId,
        email,
        invitedBy,
        token:hashedToken,
        status: 'Pending',
        expiresAt
     })
    .returning();

    return res.status(201).json({
      message: 'Invitation created successfully',
      invitation,
    });

  }
  catch(error){
  console.log("Invitation error:", error)
  return res.status(500).json({
    message:"Failed to create invitation.",
    error: error.message
  });
  }

};





