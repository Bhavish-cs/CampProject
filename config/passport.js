import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import dotenv from 'dotenv';

// Load environment variables in passport file as well
dotenv.config();

// Get Google OAuth credentials from environment variables
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

// Validate that required environment variables are set
if (!clientId || !clientSecret || !callbackURL) {
    console.error('Missing Google OAuth environment variables:');
    console.error('GOOGLE_CLIENT_ID:', clientId ? 'Set' : 'Missing');
    console.error('GOOGLE_CLIENT_SECRET:', clientSecret ? 'Set' : 'Missing');
    console.error('GOOGLE_CALLBACK_URL:', callbackURL ? 'Set' : 'Missing');
    throw new Error('Missing required Google OAuth environment variables. Please check your .env file.');
}

// Serialize and deserialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: callbackURL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // User exists, return user
            return done(null, user);
        } else {
            // Check if user exists with same email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Link Google account to existing user
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            } else {
                // Create new user
                const newUser = new User({
                    googleId: profile.id,
                    username: profile.displayName || profile.emails[0].value.split('@')[0],
                    email: profile.emails[0].value,
                    isVerified: true // Google users are automatically verified
                });

                await newUser.save();
                return done(null, newUser);
            }
        }
    } catch (error) {
        return done(error, null);
    }
}));

export default passport;
