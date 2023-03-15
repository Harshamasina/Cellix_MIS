const express = require('express');
const router = express.Router();
const patentSchema = require('../Models/PCTPatentModel');
const moment = require('moment');

router.get('/api/patents', (req , res) => {
    res.send(`Hello from the Cellix MIS API`)
});

router.get('/api/getpctpatents', async(req, res) => {
    try{
        const data = await patentSchema.find();
        res.status(201).json(data);
    } catch (err) {
        res.status(422).json({
            error: err,
            message: "Failed to get MIS Information"
        });
    }
});

router.post('/api/pctpatent', async(req, res) => {
    const confirmCode = req.header('confirmCode');
    if(confirmCode !== process.env.CONFIRMATION_CODE_TWO && confirmCode !== process.env.CONFIRMATION_CODE_ONE){
        return res.status(401).json({ error: "Invalid Confirmation Code" });
    }
    try {
        const data = new patentSchema(req.body);
        const existingWno = await patentSchema.findOne({ wno: data.wno });
        const existingPCT = await patentSchema.findOne({ pct: data.pct });
        if(existingWno || existingPCT){
            res.status(422).json({message: "Patent Information Already Exists"});
        } else {
            const PCTPatent = await data.save();
            res.status(201).json({
                data: PCTPatent,
                message: "Patent MIS Information Stored Successfully"
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'MIS Information failed to Stored (Please Fill the fields with *mark or Check the date format)'
        });
    }
});

router.patch('/api/updatepctpatentid/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const updates = {};
        for(const key in req.body){
            if(key === 'wno'){
                continue;
            }
            if(req.body[key] !== undefined && req.body[key] !== ''){
                updates[key] = req.body[key];
            }
        }
        const updatedPatent = await patentSchema.findByIdAndUpdate(id, updates, {new: true, runValidators: true});
        if(!updatedPatent){
            return res.status(404).json({message: "Patent Not Found"});
        }
        res.json(updatedPatent);
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            error: err,
            message: "Failed to Update the MIS Information"
        });
    }
});

module.exports = router;