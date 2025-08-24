import express from 'express';
import User from '../models/user.js';
import catchAsync from '../utils/catchAsync.js';
import { generateOTP, sendOTPEmail, verifyOTP } from '../utils/emailService.js';

const router = express.Router();

// Registration form
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// Handle registration
router.post('/register', catchAsync(async (req, res) => {
    const { username, email } = req.body;

    // Validation
    if (!username || !email) {
        req.flash('error', 'Username and email are required');
        return res.redirect('/register');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existingUser) {
        req.flash('error', 'Username or email already exists');
        return res.redirect('/register');
    }

    // Create user
    const user = new User({ username, email });
    await user.save();

    req.flash('success', 'Registration successful! You can now login with your email.');
    res.redirect('/login');
}));

// Login form (email input)
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Handle login - Step 1: Send OTP
router.post('/login', catchAsync(async (req, res) => {
    console.log('Login route hit with:', req.body);
    const { email } = req.body;

    // Validation
    if (!email) {
        console.log('No email provided');
        req.flash('error', 'Email is required');
        return res.redirect('/login');
    }

    console.log('Looking for user with email:', email);
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        console.log('User not found');
        req.flash('error', 'No account found with this email address');
        return res.redirect('/login');
    }

    console.log('User found, generating OTP');
    // Generate and save OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    console.log('OTP saved to database');

    console.log('Sending OTP email...');
    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    console.log('Email result:', emailResult);

    if (emailResult.success) {
        req.session.tempEmail = email; // Store email in session temporarily
        req.flash('success', 'OTP sent to your email. Please check your inbox.');
        res.redirect('/verify-otp');
    } else {
        req.flash('error', 'Failed to send OTP. Please try again.');
        res.redirect('/login');
    }
}));

// OTP verification form
router.get('/verify-otp', (req, res) => {
    if (!req.session.tempEmail) {
        req.flash('error', 'Please start the login process again');
        return res.redirect('/login');
    }
    res.render('auth/verify-otp', { email: req.session.tempEmail });
});

// Handle OTP verification - Step 2: Verify OTP
router.post('/verify-otp', catchAsync(async (req, res) => {
    const { otp } = req.body;
    const email = req.session.tempEmail;

    if (!email) {
        req.flash('error', 'Session expired. Please login again.');
        return res.redirect('/login');
    }

    if (!otp) {
        req.flash('error', 'OTP is required');
        return res.redirect('/verify-otp');
    }

    // Find user and verify OTP
    const user = await User.findOne({ email });
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/login');
    }

    // Verify OTP
    const verification = verifyOTP(otp, user.otp, user.otpExpires);

    if (verification.valid) {
        // Clear OTP and temp session data
        user.otp = null;
        user.otpExpires = null;
        user.isVerified = true;
        await user.save();

        // Set user session
        req.session.user_id = user._id;
        req.session.username = user.username;
        req.session.tempEmail = null;

        req.flash('success', `Welcome back, ${user.username}!`);
        res.redirect('/campgrounds');
    } else {
        req.flash('error', verification.message);
        res.redirect('/verify-otp');
    }
}));

// Resend OTP
router.post('/resend-otp', catchAsync(async (req, res) => {
    const email = req.session.tempEmail;

    if (!email) {
        req.flash('error', 'Session expired. Please login again.');
        return res.redirect('/login');
    }

    const user = await User.findOne({ email });
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/login');
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send new OTP
    const emailResult = await sendOTPEmail(email, otp);

    if (emailResult.success) {
        req.flash('success', 'New OTP sent to your email');
    } else {
        req.flash('error', 'Failed to send OTP. Please try again.');
    }

    res.redirect('/verify-otp');
}));

// Logout
router.post('/logout', (req, res) => {
    req.session.user_id = null;
    req.session.username = null;
    req.session.tempEmail = null;
    req.flash('success', 'Logged out successfully!');
    res.redirect('/campgrounds');
});

// Middleware to check if user is logged in
export const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

export default router;
