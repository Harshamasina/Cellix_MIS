const express = require('express');
const router = express.Router();

router.get('/testing', (res) =>{
    res.send(`Hello from the Cellix MIS Services`)
});