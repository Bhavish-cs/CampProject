import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Clean up expired OTPs
userSchema.methods.clearExpiredOTP = function () {
    if (this.otpExpires && this.otpExpires < new Date()) {
        this.otp = null;
        this.otpExpires = null;
        return this.save();
    }
};

const User = mongoose.model('User', userSchema);
export default User;
