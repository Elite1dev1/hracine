const { transporter } = require("../config/email");
const { secret } = require("../config/secret");

const REQUIRED_ADMIN_EMAIL = "hello.hracine@gmail.com";

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

const sendAdminNotification = async ({ subject, html }) => {
  const recipients = [...new Set([
    secret.admin_notification_email,
    REQUIRED_ADMIN_EMAIL,
  ].map((email) => String(email || "").trim()).filter(Boolean))];

  if (!secret.email_user || !secret.email_pass) {
    console.error("Admin notification email skipped: SMTP credentials are not configured");
    return false;
  }

  try {
    await transporter.sendMail({
      from: `HRACINE Website <${secret.email_user}>`,
      to: recipients.join(", "),
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Admin notification email failed:", error.message);
    return false;
  }
};

module.exports = { escapeHtml, sendAdminNotification };
