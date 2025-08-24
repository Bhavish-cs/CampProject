import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

export const sendOTPEmail = async (email, otp) => {
    try {
        console.log('=== EMAIL DEBUG INFO ===');
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');
        console.log('EMAIL_PASS value:', process.env.EMAIL_PASS);

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email credentials not found in environment variables');
        }

        if (process.env.EMAIL_PASS.length !== 16) {
            throw new Error(`Invalid App Password length: ${process.env.EMAIL_PASS.length} (should be 16)`);
        }

        // Test transporter connection first
        console.log('Testing SMTP connection...');
        await transporter.verify();
        console.log('SMTP connection successful!');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Login OTP - Campora',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1>Your OTP Code</h1>
                    <div style="background: #f0f0f0; padding: 20px; text-align: center;">
                        <h2 style="color: #007bff;">${otp}</h2>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: ", info.messageId);

        return {
            success: true,
            message: 'OTP sent successfully!',
        };

    } catch (error) {
        console.error("Email error:", error.message);

        // If it's the PLAIN credentials error, try alternative approach
        if (error.message.includes('Missing credentials for "PLAIN"')) {
            console.log('Trying alternative SMTP approach...');
            return await sendOTPEmailAlternative(email, otp);
        }

        return {
            success: false,
            message: 'Failed to send OTP email.',
            error: error.message
        };
    }
};

// Alternative SMTP approach for Gmail authentication issues
const sendOTPEmailAlternative = async (email, otp) => {
    try {
        console.log('Using alternative SMTP configuration...');

        const alternativeTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            debug: true,
            logger: true
        });

        const mailOptions = {
            from: `"Campora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Login OTP - Campora',
            text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1>Your OTP Code</h1>
                    <div style="background: #f0f0f0; padding: 20px; text-align: center;">
                        <h2 style="color: #007bff;">${otp}</h2>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        };

        const info = await alternativeTransporter.sendMail(mailOptions);
        console.log("Alternative email sent successfully: ", info.messageId);

        return {
            success: true,
            message: 'OTP sent successfully!',
        };

    } catch (error) {
        console.error("Alternative email also failed:", error.message);
        return {
            success: false,
            message: 'Failed to send OTP email with both methods.',
            error: error.message
        };
    }
}; export const verifyOTP = (inputOTP, storedOTP, otpExpires) => {
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
