const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.send(`Hello from the Cellix MIS Services`)
});

module.exports = router;