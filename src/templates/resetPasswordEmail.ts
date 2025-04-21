

export function getResetPasswordEmailTemplate(resetLink: string, websiteLink: string = 'http://localhost:3000'): string {
    return `
      <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style type="text/css">
      /* Client-specific styles */
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; }
  
      /* Reset styles */
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      table { border-collapse: collapse !important; }
      body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
  
      /* iOS blue links */
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
  
      /* Gmail blue links */
      u + #body a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
  
      /* Samsung Mail blue links */
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
  
      /* Universal styles */
      body {
        background-color: #36393f;
        color: #dcddde;
        font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 16px;
        line-height: 24px;
        margin: 0;
        padding: 0;
      }
  
      /* Responsive styles */
      @media screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
        }
        .fluid {
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .stack-column,
        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }
        .stack-column-center {
          text-align: center !important;
        }
        .center-on-narrow {
          text-align: center !important;
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
          float: none !important;
        }
        table.center-on-narrow {
          display: inline-block !important;
        }
      }
    </style>
  </head>
  <body bgcolor="#36393f" width="100%" style="margin: 0;" yahoo="yahoo">
    <table bgcolor="#36393f" cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" style="border-collapse:collapse;">
      <tr>
        <td valign="top">
          <center style="width: 100%;">
            <!-- Email Header -->
            <table align="center" width="600" class="email-container" bgcolor="#2f3136" style="border-radius: 8px 8px 0 0; margin-top: 40px;">
              <tr>
                <td style="padding: 30px 40px; text-align: center;">
                  <img src="https://res.cloudinary.com/dx0rctl2g/image/upload/v1745220363/j1bm0kruxxgogqd4of7e.svg" alt="Discord Clone Logo" width="240" height="60" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold;">
                </td>
              </tr>
            </table>
            <!-- Email Body -->
            <table align="center" width="600" class="email-container" bgcolor="#2f3136">
              <tr>
                <td style="padding: 40px; text-align: center; font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                  <h1 style="margin: 0 0 20px 0; font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; line-height: 36px; color: #ffffff; font-weight: 500;">Password Reset Request</h1>
                  <p style="margin: 0 0 15px; font-size: 16px; line-height: 24px; color: #dcddde;">
                    We received a request to reset the password for your Discord Clone account. If you didn't make this request, you can safely ignore this email.
                  </p>
                  <p style="margin: 0 0 25px; font-size: 16px; line-height: 24px; color: #dcddde;">
                    To reset your password, click the button below:
                  </p>
                  <!-- Button : BEGIN -->
                  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
                    <tr>
                      <td style="border-radius: 4px; background: #5865f2; text-align: center;">
                        <a href="${resetLink}" target="_blank" style="background: #5865f2; border: 15px solid #5865f2; font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 4px; font-weight: 500; color: #ffffff !important; padding: 0 10px;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  <!-- Button : END -->
                  <p style="margin: 25px 0 10px; font-size: 16px; line-height: 24px; color: #dcddde;">
                    This link will expire in 10 minutes. If you need a new password reset link, please visit:
                  </p>
                  <p style="margin: 0 0 25px; font-size: 16px; line-height: 24px; color: #dcddde;">
                    <a href="${websiteLink}" style="color: #00aff4; text-decoration: none;">${websiteLink}</a>
                  </p>
                  <p style="margin: 25px 0 0; font-size: 14px; line-height: 20px; color: #a3a6aa;">
                    If you didn't request a password reset, please ignore this email or contact support if you have questions.
                  </p>
                </td>
              </tr>
            </table>
            <!-- Email Footer -->
            <table align="center" width="600" class="email-container" bgcolor="#2f3136" style="border-radius: 0 0 8px 8px; margin-bottom: 40px;">
              <tr>
                <td style="padding: 30px 40px; text-align: center; font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #a3a6aa; border-top: 1px solid #42454a;">
                  <p style="margin: 0 0 15px;">
                    Sent by Discord Clone • <a href="https://example.com/privacy" style="color: #00aff4; text-decoration: none;">Privacy Policy</a> • <a href="https://example.com/terms" style="color: #00aff4; text-decoration: none;">Terms of Service</a>
                  </p>
                  <p style="margin: 0;">
                    Discord Clone, Inc. • 123 Gaming Street, Suite 100 • San Francisco, CA 94107
                  </p>
                </td>
              </tr>
            </table>
            <!-- Unsubscribe : BEGIN -->
            <table align="center" width="600" class="email-container">
              <tr>
                <td style="padding: 20px 10px; text-align: center; font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; color: #8e9297;">
                  <p style="margin: 0;">
                    This is a service email related to your Discord Clone account. You cannot unsubscribe from these emails.
                  </p>
                </td>
              </tr>
            </table>
            <!-- Unsubscribe : END -->
          </center>
        </td>
      </tr>
    </table>
  </body>
  </html>
    `;
}