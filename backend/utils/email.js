import nodemailer from "nodemailer";

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

      const info = await transporter.sendMail({
        from: `"ShopPilot AI" <${user}>`,
        to: email,
        subject: "ShopPilot AI - Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #6366f1; text-align: center;">ShopPilot AI</h2>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;">
            <p>Hello,</p>
            <p>You requested a password reset for your ShopPilot AI account. Please use the following One-Time Password (OTP) to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e1b4b; background-color: #f3f4f6; padding: 10px 20px; border-radius: 8px; border: 1px dashed #6366f1;">${otp}</span>
            </div>
            <p style="color: #ef4444; font-weight: bold;">Note: This OTP is valid for 10 minutes and should not be shared with anyone.</p>
            <p>If you did not request this, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;">
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated message, please do not reply.</p>
          </div>
        `,
      });

      console.log(`[Forgot Password] Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[Forgot Password] SMTP mail send failed, falling back to Ethereal/Console:`, error);
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

    const info = await transporter.sendMail({
      from: '"ShopPilot AI (Test)" <no-reply@shoppilot.ai>',
      to: email,
      subject: "ShopPilot AI - Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #6366f1; text-align: center;">ShopPilot AI (Test Mode)</h2>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;">
          <p>Hello,</p>
          <p>This email was generated in development mode. Please use the following OTP to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e1b4b; background-color: #f3f4f6; padding: 10px 20px; border-radius: 8px; border: 1px dashed #6366f1;">${otp}</span>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
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
