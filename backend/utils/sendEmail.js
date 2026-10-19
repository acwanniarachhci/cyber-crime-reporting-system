const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendWelcomeEmail = async (toEmail, name) => {
  try {
    await transporter.sendMail({
      from: `"Cybercrime Reporting System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Welcome to Cybercrime Reporting System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0b1120; color: #f1f5f9; border-radius: 12px;">
          <h2 style="color: #60a5fa;">🔒 Welcome, ${name}!</h2>
          <p>You have successfully signed in to the <strong>Cybercrime Reporting System</strong> using your Google account.</p>
          <p>You can now:</p>
          <ul>
            <li>Report scams and cybercrime incidents</li>
            <li>Track your submitted cases</li>
            <li>Browse the verified scam database</li>
          </ul>
          <p style="margin-top: 24px; font-size: 0.85rem; color: #94a3b8;">
            If you did not sign in to this account, please ignore this email.
          </p>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error.message);
  }
};

const STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  investigating: 'Investigating',
  verified: 'Verified',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const sendStatusUpdateEmail = async (toEmail, caseId, newStatus) => {
  try {
    await transporter.sendMail({
      from: `"Cybercrime Reporting System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Case ${caseId} — Status Updated`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0b1120; color: #f1f5f9; border-radius: 12px;">
          <h2 style="color: #60a5fa;">🔒 Case Status Update</h2>
          <p>Your reported case <strong>${caseId}</strong> has a status update:</p>
          <p style="font-size: 1.2rem; background: rgba(59,130,246,0.15); padding: 10px 16px; border-radius: 8px; display: inline-block;">
            ${STATUS_LABELS[newStatus] || newStatus}
          </p>
          <p style="margin-top: 20px;">You can track the full details of your case anytime using your Case ID on our tracking page.</p>
          <p style="margin-top: 24px; font-size: 0.85rem; color: #94a3b8;">
            Thank you for helping keep our community safe from scams.
          </p>
        </div>
      `,
    });
    console.log(`Status update email sent to ${toEmail} for case ${caseId}`);
  } catch (error) {
    console.error('Failed to send status update email:', error.message);
  }
};

module.exports = { sendWelcomeEmail, sendStatusUpdateEmail };