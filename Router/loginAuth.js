const express = require('express');
const router = express.Router();

router.get('/api/login', (req , res) => {
    res.send(`Hello from the Cellix MIS Login API`)
});

module.exports = router;