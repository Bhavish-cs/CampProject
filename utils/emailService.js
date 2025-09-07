import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true,
    logger: true
});

// Generate 6-digit OTP
export const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP email using the tutorial method
export const sendOTPEmail = async (email, otp) => {
    try {
        console.log('=== EMAIL DEBUG INFO ===');
        console.log(`Sending OTP ${otp} to ${email}`);
        console.log('Environment variables:');
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');
        console.log('EMAIL_PASS value:', process.env.EMAIL_PASS);
        console.log('========================');

        const mailOptions = {
            from: `Campora <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Login OTP - Campora',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #333; text-align: center;">Please confirm your OTP</h1>
                    <p style="font-size: 16px; color: #666;">Hello!</p>
                    <p style="font-size: 16px; color: #666;">Here is your OTP code for logging into Campora:</p>
                    <div style="background-color: #f8f9fa; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px; border: 2px solid #007bff;">
                        <h1 style="color: #007bff; margin: 0; font-size: 48px; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
                    </div>
                    <p style="font-size: 16px; color: #666;"><strong>This OTP will expire in 10 minutes.</strong></p>
                    <p style="font-size: 14px; color: #999;">If you didn't request this OTP, please ignore this email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 14px; color: #666;">Best regards,<br><strong>The Campora Team</strong></p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: ", info.messageId);

        return {
            success: true,
            message: 'OTP sent to your email successfully!',
            info: info
        };

    } catch (error) {
        console.error("Error occurred while sending email: ", error.message);
        console.error("Full error:", error);
        return {
            success: false,
            message: 'Failed to send OTP email. Please try again.',
            error: error.message
        };
    }
};

// Verify OTP
export const verifyOTP = (inputOTP, storedOTP, otpExpires) => {
    if (!storedOTP || !otpExpires) {
        return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    if (new Date() > otpExpires) {
        return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (inputOTP !== storedOTP) {
        return { valid: false, message: 'Invalid OTP. Please try again.' };
    }

    return { valid: true, message: 'OTP verified successfully' };
};
