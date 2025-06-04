const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profuilePic: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'mentor'],
        default: 'student'
    },
    isBlocked: {
        type: Boolean,
    },
    joindClass: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    subscription: {
        isActive: { type: Boolean, default: false },
        startDate: Date,
        endDate: Date,
        plan: { type: String, enum: ['monthly', 'yearly', 'lifetime'], default: 'monthly' }
    },
    status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;