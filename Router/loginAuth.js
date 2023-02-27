const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-config');

router.post('/api/signup', async (req , res) => {
    try{
        const user = { name, email, emp_id, phone, password, cpassword } = req.body;
        const userResponse = await admin.auth().createUser({
            name: user.name,
            email: user.email,
            emp_id: user.emp_id,
            phone: user.phone,
            password: user.password,
            cpassword: user.cpassword,
            emailVerified: false,
            disabled: false
        });
        res.status(201).json(userResponse);
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'MIS Information failed to Stored'
        });
    }
});

module.exports = router;