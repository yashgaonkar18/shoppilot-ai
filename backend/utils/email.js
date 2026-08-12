import nodemailer from "nodemailer";
import dns from "dns";

const getEmailHTMLTemplate = (title, subtitle, description, otp, footerText = "This is an automated message, please do not reply.") => {
  return `
    <div style="background-color: #f9fafb; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.025em;">ShopPilot AI</h1>
          <p style="color: #c7d2fe; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;">AI Business Copilot for Kiranas</p>
        </div>
        
        <!-- Body Content -->
        <div style="padding: 40px 32px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">${title}</h2>
          <p style="margin: 0 0 12px 0; font-size: 15px; color: #4b5563; font-weight: 500;">Hello,</p>
          <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">${description}</p>
          
          <!-- OTP Token Card -->
          <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
            <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6d28d9;">${subtitle}</p>
            <span style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1; padding-left: 8px;">${otp}</span>
            <p style="margin: 12px 0 0 0; font-size: 13px; color: #6b7280;">Valid for 10 minutes • Do not share this code</p>
          </div>

          <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">${footerText}</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Need help? Reply directly to this email.</p>
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">&copy; 2026 ShopPilot AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
};

export const validateEmailDomain = async (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  const domain = email.split("@")[1];
  if (!domain) return false;

  try {
    const addresses = await dns.promises.resolveMx(domain);
    return addresses && addresses.length > 0;
  } catch (error) {
    return false;
  }
};

export const sendOTPEmail = async (email, otp) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log(`[Forgot Password] Generating email for ${email} with OTP: ${otp}`);

  // If SMTP configuration is provided, try sending using it
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port || "587"),
        secure: parseInt(port || "587") === 465,
        auth: {
          user,
          pass,
        },
      });

      const emailHTML = getEmailHTMLTemplate(
        "Reset Your Password",
        "One-Time Password (OTP)",
        "You requested a password reset for your ShopPilot AI account. Please use the following One-Time Password (OTP) to reset your password:",
        otp,
        "If you did not request this, please ignore this email. Your account security is safe with us."
      );

      const info = await transporter.sendMail({
        from: `"ShopPilot AI" <${user}>`,
        to: email,
        subject: "ShopPilot AI - Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
        html: emailHTML,
      });

      console.log(`[Forgot Password] Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[Forgot Password] SMTP mail send failed:`, error);
      
      const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER || process.env.VERCEL;
                           
      if (isProduction) {
        throw new Error(`Failed to send email: ${error.message}`);
      } else {
        console.warn(`\n===================================================`);
        console.warn(`⚠️  SMTP AUTH/SEND FAILED! FALLING BACK TO CONSOLE FOR LOCAL TEST`);
        console.warn(`[Forgot Password] DEV OTP FOR ${email}: ${otp}`);
        console.warn(`===================================================\n`);
        return true;
      }
    }
  }

  // Fallback 1: Try creating Ethereal account dynamically
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const emailHTML = getEmailHTMLTemplate(
      "Reset Your Password (Test Mode)",
      "Test One-Time Password (OTP)",
      "This email was generated in development mode. Please use the following OTP to reset your password:",
      otp,
      "This is a test notification from ShopPilot AI local development environment."
    );

    const info = await transporter.sendMail({
      from: '"ShopPilot AI (Test)" <no-reply@shoppilot.ai>',
      to: email,
      subject: "ShopPilot AI - Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
      html: emailHTML,
    });

    console.log(`[Forgot Password] Ethereal Email Sent!`);
    console.log(`[Forgot Password] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch (etherealError) {
    // Fallback 2: Console logging
    console.log(`===================================================`);
    console.log(`[Forgot Password] DEV OTP FOR ${email}: ${otp}`);
    console.log(`===================================================`);
    return true;
  }
};

export const sendVerificationEmail = async (email, otp) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log(`[Email Verification] Generating verification email for ${email} with OTP: ${otp}`);

  // If SMTP configuration is provided, try sending using it
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port || "587"),
        secure: parseInt(port || "587") === 465,
        auth: {
          user,
          pass,
        },
      });

      const emailHTML = getEmailHTMLTemplate(
        "Verify Your Email Address",
        "Verification Code (OTP)",
        "Thank you for signing up for ShopPilot AI. Please use the following One-Time Password (OTP) to verify your email address and activate your account:",
        otp,
        "Welcome aboard! We are excited to help you run your shop like the big chains do."
      );

      const info = await transporter.sendMail({
        from: `"ShopPilot AI" <${user}>`,
        to: email,
        subject: "ShopPilot AI - Verify Your Email",
        text: `Your OTP for email verification is: ${otp}. This OTP is valid for 10 minutes.`,
        html: emailHTML,
      });

      console.log(`[Email Verification] Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[Email Verification] SMTP mail send failed:`, error);
      
      const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER || process.env.VERCEL;
                           
      if (isProduction) {
        throw new Error(`Failed to send verification email: ${error.message}`);
      } else {
        console.warn(`\n===================================================`);
        console.warn(`⚠️  SMTP AUTH/SEND FAILED! FALLING BACK TO CONSOLE FOR LOCAL TEST`);
        console.warn(`[Email Verification] DEV OTP FOR ${email}: ${otp}`);
        console.warn(`===================================================\n`);
        return true;
      }
    }
  }

  // Fallback 1: Try Ethereal Test Account
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const emailHTML = getEmailHTMLTemplate(
      "Verify Your Email Address (Test Mode)",
      "Test Verification Code (OTP)",
      "This email was generated in development mode. Please use the following OTP to verify your email address:",
      otp,
      "This is a test notification from ShopPilot AI local development environment."
    );

    const info = await transporter.sendMail({
      from: '"ShopPilot AI (Test)" <no-reply@shoppilot.ai>',
      to: email,
      subject: "ShopPilot AI - Verify Your Email",
      text: `Your OTP for email verification is: ${otp}. This OTP is valid for 10 minutes.`,
      html: emailHTML,
    });

    console.log(`[Email Verification] Ethereal Email Sent!`);
    console.log(`[Email Verification] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch (etherealError) {
    // Fallback 2: Console logging
    console.log(`===================================================`);
    console.log(`[Email Verification] DEV OTP FOR ${email}: ${otp}`);
    console.log(`===================================================`);
    return true;
  }
};
