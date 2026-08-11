import { db } from '#config/client.js';
import { invitations, workspace } from '#drizzle/schema.js';
import { eq } from 'drizzle-orm';
import {generateSecureToken,hashToken} from '#utils/cryptoUtils.js';
import { invitationEmail } from '#templates/email.js';
import { sendEmailNotification } from '#services/emailService.js';
export const createInvitation = async (req, res) => {
  const { email, workspaceId } = req.body;
  const invitedBy = req.user.id;

  try {
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID is required"
      });
    }

    //  Check workspace exists
    const [existingWorkspace] = await db
      .select({
        id: workspace.id,
        workspaceName: workspace.workspaceName
      })
      .from(workspace)
      .where(eq(workspace.id, workspaceId));

    if (!existingWorkspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // Generate secure invitation token
    const token = generateSecureToken();

    // Store only hashed token in database
    const hashedToken = hashToken(token);

    //  Invitation expires after 12 hours
    const expiresAt = new Date(
      Date.now() + 12 * 60 * 60 * 1000 );

    //  Save invitation
    const [invitation] = await db
      .insert(invitations)
      .values({
        workspaceId,
        email,
        invitedBy,
        token: hashedToken,
        status: "PENDING",
        expiresAt
      })
      .returning();

    // Create email HTML
    const html = invitationEmail(
      token,
      existingWorkspace.workspaceName
    );

    // Send email through existing Mailgun service
    await sendEmailNotification(
      email,
      `Invitation to join ${existingWorkspace.workspaceName}`,
      html
    );
  
    return res.status(201).json({
      message: "Invitation created and email sent successfully",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        workspaceId: invitation.workspaceId,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
         token: token
      }
    });

  } catch (error) {
    console.log("Invitation error:", error);

    return res.status(500).json({
      message: "Failed to create invitation.",
      error: error.message
    });
  }
};
