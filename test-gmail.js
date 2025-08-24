import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Test Gmail connection
const testGmail = async () => {
    console.log('Testing Gmail connection...');
    console.log('Email:', process.env.EMAIL_USER);
    console.log('Password length:', process.env.EMAIL_PASS?.length);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        // Verify connection
        await transporter.verify();
        console.log('✅ Gmail connection successful!');

        // Send test email
        const result = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Test Email - Campora OTP System',
            text: 'This is a test email. If you receive this, Gmail is working correctly!'
        });

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', result.messageId);

    } catch (error) {
        console.error('❌ Gmail connection failed:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        if (error.message.includes('Username and Password not accepted')) {
            console.log('\n💡 Solutions:');
            console.log('1. Generate a NEW App Password');
            console.log('2. Ensure 2-Factor Authentication is ON');
            console.log('3. Use the App Password EXACTLY as generated');
            console.log('4. Check if email address is correct');
        }
    }
};

testGmail();
