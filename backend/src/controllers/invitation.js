import { db } from '#config/client.js';
import { users,invitations, workspace , workspaceMembers} from '#drizzle/schema.js';
import { eq , and } from 'drizzle-orm';
import {generateSecureToken,hashToken} from '#utils/cryptoUtils.js';
import { invitationEmail } from '#templates/email.js';
import { sendEmailNotification } from '#services/emailService.js';
import { createAuditLog } from '#controllers/auditLogs.js';

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

    // Check workspace exists
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

    // Check whether invited user already exists
    const [existingUser] = await db
      .select({
        id: users.id,
        email: users.email
      })
      .from(users)
      .where(eq(users.email, email));

    // If user exists, check workspace membership
    if (existingUser) {

      const [existingMember] = await db
        .select({
          id: workspaceMembers.id
        })
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.userId, existingUser.id),
            eq(workspaceMembers.workspaceId, workspaceId)
          )
        );

      if (existingMember) {
        return res.status(400).json({
          message: "This user is already a member of this workspace"
        });
      }
    }

    // Check existing pending invitation
    const [existingInvitation] = await db
      .select({
        id: invitations.id,
        status: invitations.status
      })
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email),
          eq(invitations.workspaceId, workspaceId),
          eq(invitations.status, "PENDING")
        )
      );

    if (existingInvitation) {
      return res.status(400).json({
        message: "An invitation is already pending for this email"
      });
    }

    // Generate secure invitation token
    const token = generateSecureToken();

    // Store only hashed token in database
    const hashedToken = hashToken(token);

    // Invitation expires after 12 hours
    const expiresAt = new Date(
      Date.now() + 12 * 60 * 60 * 1000
    );

    // Create invitation
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

    // Send invitation email
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
        token:token
      }
    });

  } catch (error) {
    console.log("Invitation error:", error);

    return res.status(500).json({
      message: "Failed to create invitation.",
      error: error.message
    });
  }
  finally{
     const auditResult = await createAuditLog({
           performedBy: req.user.id,
           action: "Send invitation to new member",
           affectedUser: req.body.workspaceId,
    });
    
    return res.status(200).json({
      success: true,
      message: "Send invitation to new member  successfully",
      audit: auditResult.message,
    });
  }
};