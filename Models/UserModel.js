const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
    },
    {timestamps: true},
);

const UserModel = mongoose.model('cellixbioqueries', UserSchema);
module.exports = UserModel;