import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendLeadNotification({
  to,
  vcardName,
  leadData,
}: {
  to: string;
  vcardName: string;
  leadData: {
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    note?: string | null;
  };
}) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/leads`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Captured</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #1a1a1b; margin: 0; padding: 0; }
        .wrapper { padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 32px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 32px; }
        .lead-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .lead-name { font-size: 20px; font-weight: 700; margin-bottom: 4px; color: #111827; }
        .lead-detail { font-size: 14px; color: #64748b; margin-bottom: 16px; }
        .grid { display: grid; gap: 12px; }
        .info-row { display: flex; align-items: center; gap: 8px; font-size: 15px; color: #334155; margin-bottom: 8px; }
        .info-label { font-weight: 600; color: #000; min-width: 80px; }
        .note { border-left: 4px solid #000; background: #fff; padding: 12px; font-style: italic; color: #475569; margin-top: 16px; font-size: 14px; }
        .footer { padding: 24px; text-align: center; border-top: 1px solid #f1f5f9; background: #fafafa; font-size: 13px; color: #94a3b8; }
        .button { display: inline-block; padding: 14px 28px; background-color: #000000; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; margin-top: 10px; }
        .tag { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Imprint</h1>
          </div>
          <div class="content">
            <div class="tag">New Connection</div>
            <p style="font-size: 16px; line-height: 1.5; color: #334155;">
              Great news! Someone just exchanged their contact details with your card: <strong>${vcardName}</strong>.
            </p>
            
            <div class="lead-card">
              <div class="lead-name">${leadData.name}</div>
              <div class="lead-detail">${leadData.jobTitle ? `${leadData.jobTitle} at ` : ""}${leadData.company || "Independent"}</div>
              
              <div class="grid">
                ${leadData.email ? `
                  <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span>${leadData.email}</span>
                  </div>
                ` : ""}
                ${leadData.phone ? `
                  <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span>${leadData.phone}</span>
                  </div>
                ` : ""}
              </div>

              ${leadData.note ? `
                <div class="note">
                  &ldquo;${leadData.note}&rdquo;
                </div>
              ` : ""}
            </div>

            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="button">View all Leads</a>
            </div>
          </div>
          <div class="footer">
            &copy; 2026 Imprint. All rights reserved.<br>
            Sent via your Digital Business Card Platform.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `🚀 New Lead from ${vcardName}: ${leadData.name}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send lead notification email:", error);
    return { success: false, error };
  }
}
