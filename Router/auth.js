const express = require('express');
const router = express.Router();
const MISPatentsSchema = require('../Models/PatentModel');

router.get('/', (req, res) =>{
    res.send(`Hello from the Cellix MIS Services`)
});

router.post('/api/patent', async(req, res) => {
    try {
        const data = new MISPatentsSchema(req.body);
        const ref = await MISPatentsSchema.findOne({ ref_no: data.ref_no });
        if(ref){
            res.status(422).json({message: "Patent MIS Information Already Exists"});
        } else {
            const MISPatent = await data.save();
            res.status(201).json({
                data: MISPatent,
                message: "Patent MIS Information Stored Successfully"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('MIS Information failed to Stored');
    }
});

router.get('/api/getpatents', async(req, res) => {
    try{
        const data = await MISPatentsSchema.find();
        res.status(201).json({
            data: data,
            message: "Patents MIS Information sent Successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(422).json({message: "Failed to get Patents MIS Information"});
    }
});

router.get('/api/getpatent/:ref', async(req, res) => {
    const ref = req.params.ref;
    try{
        const data = await MISPatentsSchema.find({ ref_no: ref });
        res.status(201).json({
            data: data,
            message: "Patent MIS Information sent Successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(422).send({message: "Failed to get Patent MIS Information"});
    }
});

module.exports = router;