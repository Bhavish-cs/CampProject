import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration for Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Generate 6-digit OTP
export const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
    console.log(`Attempting to send OTP ${otp} to ${email}`);
    console.log('Email config:', {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.length} chars: ${process.env.EMAIL_PASS}` : 'Not set'
    });

    const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Your Login OTP - Campora',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Your Login OTP</h2>
                <p>Hello!</p>
                <p>Your One-Time Password (OTP) for logging into Campora is:</p>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #007bff; margin: 0; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
                </div>
                <p><strong>This OTP will expire in 10 minutes.</strong></p>
                <p>If you didn't request this OTP, please ignore this email.</p>
                <p>Best regards,<br>The Campora Team</p>
            </div>
        `
    };

    try {
        console.log('Attempting to send email...');
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        return { success: true, message: 'OTP sent to your email successfully!' };
    } catch (error) {
        console.error('Email sending failed:', error.message);
        return { success: false, message: 'Failed to send OTP email. Please try again.' };
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
