const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    date: {
        type: String
    },
    field: {
        type: String
    },
    descp: {
        type: String
    }
}, {
    timestamps: true
});

const MISNotifications = mongoose.model('misnotifications', NotificationSchema);
module.exports = MISNotifications;