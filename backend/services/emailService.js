const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send OTP email
const sendOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'nishthap1410@gmail.com',
      to: email,
      subject: 'Your OTP for HackStreak Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to HackStreak!</h2>
          <p>Your OTP for account verification is:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">HackStreak - Your Competitive Programming Companion</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send password reset OTP
const sendPasswordResetOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'nishthap1410@gmail.com',
      to: email,
      subject: 'Password Reset OTP - HackStreak',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your HackStreak account.</p>
          <p>Your OTP for password reset is:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #dc3545; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">HackStreak - Your Competitive Programming Companion</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
    throw new Error('Failed to send password reset OTP email');
  }
};

// Send contest reminder
const sendContestReminder = async (email, contestName, platform, startTime, contestUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'nishthap1410@gmail.com',
      to: email,
      subject: `Contest Reminder: ${contestName} on ${platform}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Contest Reminder</h2>
          <p><strong>${contestName}</strong> starts soon!</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Platform:</strong> ${platform}</p>
            <p><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${contestUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Join Contest Now</a>
          </div>
          <p>Don't miss out on this competitive programming opportunity!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">HackStreak - Your Competitive Programming Companion</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contest reminder sent to ${email} for ${contestName}`);
  } catch (error) {
    console.error('Error sending contest reminder email:', error);
    throw new Error('Failed to send contest reminder email');
  }
};

module.exports = {
  sendOTP,
  sendPasswordResetOTP,
  sendContestReminder
};
