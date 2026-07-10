const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    const emailUser = process.env.EMAIL_USERNAME || process.env.EMAIL_ADDRESS || process.env.EMAIL_SERVICE;
    this.from = `OrderIt <${process.env.EMAIL_FROM || emailUser || "no-reply@orderit.com"}>`;
  }

  newTransport() {
    const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const smtpPort = process.env.SMTP_PORT || process.env.EMAIL_PORT || 587;
    const smtpUser = process.env.SMTP_USERNAME || process.env.EMAIL_USERNAME || process.env.EMAIL_ADDRESS;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.SMTP_APP_PASSWORD;
    const smtpService = process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE;
    const smtpSecureEnv = (process.env.SMTP_SECURE || process.env.EMAIL_SECURE);
    const smtpSecure = smtpSecureEnv === "true" || smtpPort === 465 || smtpSecureEnv === "1";

    // Prefer explicit host/port credentials (SMTP_HOST)
    if (smtpHost && smtpUser && smtpPass) {
      console.log("Email transport: using SMTP host", { host: smtpHost, port: smtpPort, secure: smtpSecure });
      return nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Boolean(smtpSecure),
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }

    // If a service name is provided (eg. 'gmail' or 'SendGrid'), use it when credentials exist
    if (smtpService && smtpUser && smtpPass) {
      console.log("Email transport: using service", { service: smtpService });
      return nodemailer.createTransport({
        service: smtpService,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }

    // Fallback to Ethereal in development when no SMTP config provided
    console.log("Email transport: falling back to Ethereal (dev test account)");
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../view/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    let transport = this.newTransport();

    // If no SMTP config exists (including SMTP_*), create a test Ethereal account for emails in development.
    let info;
    try {
      if (!process.env.EMAIL_HOST && !process.env.SMTP_HOST && !process.env.EMAIL_SERVICE && !process.env.SMTP_SERVICE && !process.env.ETHEREAL_USER) {
        const testAccount = await nodemailer.createTestAccount();
        transport = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        process.env.ETHEREAL_USER = testAccount.user;
        process.env.ETHEREAL_PASS = testAccount.pass;
      }

      info = await transport.sendMail(mailOptions);

      // Log sendMail info for debugging (messageId, accepted/rejected)
      console.log("Email.send info:", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });

      // If using Ethereal, log preview URL so developer can open the email in browser
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL: ", previewUrl);
      }
    } catch (err) {
      console.error("Email.send failed:", err);
      // rethrow so error middleware handles it
      throw err;
    }
  }

  async sendWelcome() {
    await this.send("welcome", "welcome to the Order It!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "password reset token (valid for only 10 minutes)"
    );
  }
};

// mail traps for development
//  this service, you can fake to send emails to clients, but these emails will then never reach these clients, and instead be trapped in your Mailtrap,
// And so that way you cannot accidentally send some development emails to all of your clients or users,

// webside used for dealing emails
// SendGrid provides an SMTP service that allows you to deliver your email via its servers instead of  own client or server
// Make up any email address @mailsac.com and you can instantly receive mail. No need to create the email first! Everything is public, unless you create an account.
