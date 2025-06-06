const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['quiz', 'class', 'community', 'task', 'system'], 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;