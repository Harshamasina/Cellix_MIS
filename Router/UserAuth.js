const express = require('express');
const router = express.Router();
const UserSchema = require('../Models/UserModel');

router.get('/api/users', (req , res) => {
    res.send(`Hello from the User Cellix MIS Services`)
});

router.get('/api/getusers', async (req, res) => {
    try{
        const data = await UserSchema.find().sort({createdAt: -1});
        res.status(200).json(data);
    } catch (err) {
        res.status(422).json({
            error: err,
            message: "Failed to get MIS Information"
        });
    }
});

module.exports = router;