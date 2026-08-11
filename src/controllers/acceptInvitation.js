
import { db } from '#config/client.js';
import { invitations, workspace, workspaceMembers, users} from '#drizzle/schema.js';
import { eq, and} from 'drizzle-orm';
import {generateSecureToken, hashToken} from '#utils/cryptoUtils.js';
import { invitationEmail } from '#templates/email.js';
import {sendEmailNotification} from '#services/emailService.js';

/* accept invitation  */
export const acceptInvitation = async (req, res) => {
  const { token } = req.query;
  const userId = req.user.id;

  try {
  
    if (!token) {
      return res.status(400).json({
        message: "Invitation token is required"
      });
    }

  
    const hashedToken = hashToken(token);

   /* find invitation */
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(eq(invitations.token, hashedToken));

    if (!invitation) {
      return res.status(404).json({
        message: "Invalid invitation token"
      });
    }

    //  Check invitation status
    if (invitation.status !== "PENDING") {
      return res.status(400).json({
        message: "This invitation has already been accepted or is no longer valid"
      });
    }

    //  Check expiry
    if (new Date() > invitation.expiresAt) {
      return res.status(400).json({
        message: "This invitation has expired"
      });
    }

    //  Check logged-in user's email
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    //  Make sure invitation belongs to this email
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return res.status(403).json({
        message: "This invitation was sent to a different email address"
      });
    }

    //  user is already a workspace member
    const [existingMember] = await db
      .select({
        id: workspaceMembers.id
      })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          eq(workspaceMembers.workspaceId, invitation.workspaceId)
        )
      );

    if (existingMember) {
      return res.status(400).json({
        message: "You are already a member of this workspace"
      });
    }

    // add user to workspace
    await db.insert(workspaceMembers).values({
      memberName: user.username,
      userId: userId,
      workspaceId: invitation.workspaceId,
      role: "member",
      assignedBy: invitation.invitedBy
    });

    //Mark invitation as accepted
    await db
      .update(invitations)
      .set({
        status: "ACCEPTED"
      })
      .where(eq(invitations.id, invitation.id));

    return res.status(200).json({
      message: "Invitation accepted successfully",
      workspaceId: invitation.workspaceId,
      role: "member"
    });

  } catch (error) {
    console.log("Accept Invitation Error:", error);

    return res.status(500).json({
      message: "Failed to accept invitation",
      error: error.message
    });
  }
};