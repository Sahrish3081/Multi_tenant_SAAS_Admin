
export function resetPasswordEmail(token) {
    const resetLink = `http://localhost:3000/api/auth/reset-password?token=${encodeURIComponent(token)}`;

    return `
        <div style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:12px;padding:35px;box-sizing:border-box;">

            <h1 style="margin:0 0 20px;color:#222222;font-size:26px;">
                Reset Your Password
            </h1>

            <p style="color:#555555;font-size:16px;line-height:1.6;">
                We received a request to reset the password for your account.
            </p>

            <p style="color:#555555;font-size:16px;line-height:1.6;">
                Click the button below to continue:
            </p>

            <div style="text-align:center;margin:30px 0;">

                    <a href="${resetLink}" target="_blank"
                       style="display:inline-block;padding:14px 28px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">
                        Reset Password
                    </a>


            </div>

            <p style="color:#777777;font-size:14px;line-height:1.5;">
                This link will expire in <strong>15 minutes</strong>.
            </p>

            <p style="color:#777777;font-size:14px;line-height:1.5;">
                If you did not request a password reset, you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #eeeeee;margin:30px 0;">

            <p style="margin:0;color:#999999;font-size:13px;text-align:center;">
                © 2026 Roll Base System
            </p>

        </div>
    `;
}


export function verificationEmail(token) {
    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${encodeURIComponent(token)}`;

    return `
        <div style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:12px;padding:35px;box-sizing:border-box;">

            <h1 style="margin:0 0 20px;color:#222222;font-size:26px;">
                Verify Your Email
            </h1>

            <p style="color:#555555;font-size:16px;line-height:1.6;">
                Thank you for creating an account with Roll Base System.
            </p>

            <p style="color:#555555;font-size:16px;line-height:1.6;">
                Please click the button below to verify your email address:
            </p>

          
                <div style="text-align:center;margin:30px 0;">

                    <a href="${verificationLink}" target="_blank"
                       style="display:inline-block;padding:14px 28px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">
                        vERIFY EMAIL
                    </a>

                </div>

            <p style="color:#777777;font-size:14px;line-height:1.5;">
                This link will expire in <strong>15 minutes</strong>.
            </p>

            <p style="color:#777777;font-size:14px;line-height:1.5;">
                If you did not create an account, you can safely ignore this email.
            </p>

            <hr style="border:none;border-top:1px solid #eeeeee;margin:30px 0;">

            <p style="margin:0;color:#999999;font-size:13px;text-align:center;">
                © 2026 Auth System
            </p>

        </div>
    `;
}

/* invitation email   when add member in workspace */
export function invitationEmail(token, workspaceName) {
  const invitationLink =
    `http://localhost:3000/api/v1/workspace/invitations/accept?token=${encodeURIComponent(token)}`;

  return `
    <div style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:12px;padding:35px;box-sizing:border-box;">

      <h1 style="margin:0 0 20px;color:#222222;font-size:26px;">
        Workspace Invitation
      </h1>

      <p style="color:#555555;font-size:16px;line-height:1.6;">
        You have been invited to join <strong>${workspaceName}</strong>.
      </p>

      <p style="color:#555555;font-size:16px;line-height:1.6;">
        Click the button below to accept the invitation:
      </p>

      <div style="text-align:center;margin:30px 0;">

        <a href="${invitationLink}"
           target="_blank"
           style="display:inline-block;padding:14px 28px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">
          Accept Invitation
        </a>

      </div>

      <p style="color:#777777;font-size:14px;line-height:1.5;">
        This invitation will expire in <strong>12 hours</strong>.
      </p>

      <hr style="border:none;border-top:1px solid #eeeeee;margin:30px 0;">

      <p style="margin:0;color:#999999;font-size:13px;text-align:center;">
        © 2026 Roll Base System
      </p>

    </div>
  `;
}