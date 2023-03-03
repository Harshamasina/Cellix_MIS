const express = require('express');
const router = express.Router();
const MISPatentsSchema = require('../Models/PatentModel');
const ModelTest = require('../Models/ModelTest');

router.get('/', (req , res) => {
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
        res.status(500).json({
            error: err,
            message: 'MIS Information failed to Stored'
        });
    }
});

router.get('/api/getpatents', async(req, res) => {
    try{
        const data = await MISPatentsSchema.find();
        res.status(201).json(data);
    } catch (err) {
        res.status(422).json({
            error: err,
            message: "Failed to get MIS Information"
        });
    }
});

router.get('/api/getpatents/:pageindex', async (req, res) => {
    try{
        const pageIndex = parseInt(req.params.pageindex) || 0;
        const pageSize = 9;
        const count = await MISPatentsSchema.countDocuments();
        const Patents = await MISPatentsSchema.find().skip(pageIndex * pageSize).limit(pageSize);
        const totalPages = Math.ceil(count / pageSize);
        res.status(201).send({
            Patents,
            pageIndex,
            pageSize,
            count,
            totalPages,
        })
    } catch(err) {
        res.status(422).json({
            error: err,
            message: "Failed to get MIS Information"
        });
    }
});

router.get('/api/getpatent/:ref', async(req, res) => {
    const ref = req.params.ref;
    try{
        const data = await MISPatentsSchema.findOne({ ref_no: ref });
        if(!data){
            return res.status(404).json({message: "Patent Reference Number Not Found"});
        }
        res.status(201).json(data);
    } catch (err) {
        res.status(422).json({
            error: err,
            message: "Failed to get MIS Information"
        });
    }
});

router.get('/api/getpatentid/:id', async(req, res) => {
    const id = req.params.id;
    try{
        const data = await MISPatentsSchema.findOne({ _id: id });
        if(!data){
            return res.status(404).json({message: "Patent Not Found"});
        }
        res.status(201).json(data);
    } catch (err) {
        res.status(422).json({
            error: err,
            message: "Failed to get MIS Information"
        });
    }
});

router.patch('/api/updatepatentid/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const updates = {};
        for(const key in req.body){
            if(key === 'ref_no'){
                continue;
            }
            if(req.body[key] !== undefined && req.body[key] !== ''){
                updates[key] = req.body[key];
            }
        }
        const updatedPatent = await MISPatentsSchema.findByIdAndUpdate(id, updates, {new: true, runValidators: true});
        if(!updatedPatent){
            return res.status(404).json({message: "Reference Number Not Found"});
        }
        res.json(updatedPatent);
    } catch (err) {
        res.status(500).json({
            error: err,
            message: "Failed to Update the MIS Information"
        });
    }
});


router.patch('/api/addnewnpe/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const document = await MISPatentsSchema.findById(id);
        if(!document){
            return res.status(404).json({ error: "Patent Not Found" })
        }

        if (!req.body.npe || req.body.npe.length === 0) {
            return res.status(400).send({ error: "No data to update" });
        }
        
        const updatedData = {
            npe: [
                ...document.npe,
                ...req.body.npe,
            ],
        };
        const updateDocument = await MISPatentsSchema.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updateDocument);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err,
            message: "Failed to Update the MIS Information"
        });
    }
});

router.patch('/api/updatepatent/:ref', async(req, res) => {
    const ref = req.params.ref;
    const data = req.body;
    delete data.ref_no;
    try{
        const updatePatent = await MISPatentsSchema.findOneAndUpdate({ ref_no: ref }, data, { new: true });
        if(!updatePatent){
            return res.status(404).json({error: "Patent Reference Number Not Found"});
        }
        res.status(201).json({
            data: updatePatent,
            message: "MIS Information successfully updated"
        });
    } catch (err) {
        res.status(500).json({
            error: err,
            message: "Failed to Update the MIS Information"
        });
    }
});


router.get('/api/searchpatents/:search', async(req, res) => {
    try{
        const search = req.params.search;
        const patentsSearchData = await MISPatentsSchema.find(
            {
                $or: [
                    {ref_no: {$regex: search, $options: '$i'}},
                    {prv_appno: {$regex: search, $options: '$i'}},
                    {pct_appno: {$regex: search, $options: '$i'}}
                ]
            }
        ).exec();
        res.status(201).json(patentsSearchData);        
    } catch (err) {
        res.status(500).json({
            error: err,
            message: "No Patent Found"
        });
    }
});

router.get('/api/notifications', async(req, res) => {
    try{
        const data = await ModelTest.find().lean().exec();
        const currentDate = new Date();
        
        const getDifferenceInDays = (date1, date2) => {
            const oneDay = 24 * 60 * 60 * 1000; // Hours * Minutes * Seconds * Milliseconds
            const diffInMs =  Date.parse(date2) - Date.parse(date1);
            const diffInDays = Math.floor(diffInMs / oneDay);
            return diffInDays;
        }

        const filteredArray = data.filter(item => {
            let flag = false;
            if (item.prv_dof && getDifferenceInDays(currentDate, item.prv_dof) <= 60) {
              flag = true;
            }
            if (item.pct_dof && getDifferenceInDays(currentDate, item.pct_dof) <= 60) {
              flag = true;
            }
            if (item.npe && item.npe.length > 0) {
              item.npe.forEach(subitem => {
                if (subitem.npe_dof && getDifferenceInDays(currentDate, subitem.npe_dof) <= 60) {
                  flag = true;
                }
                if (subitem.npe_grant && getDifferenceInDays(currentDate, subitem.npe_grant) <= 60) {
                  flag = true;
                }
              });
            }
            return flag;
        });

        const sortedArray = filteredArray.map(item => {
            const dates = [];
            if (item.prv_dof && getDifferenceInDays(currentDate, item.prv_dof) <= 60 && getDifferenceInDays(currentDate, item.prv_dof) >= 0) {
              dates.push({
                fieldName: 'prv_dof',
                fieldValue: item.prv_dof,
                differenceInDays: getDifferenceInDays(currentDate, item.prv_dof)
              });
            }
            if (item.pct_dof && getDifferenceInDays(currentDate, item.pct_dof && getDifferenceInDays(currentDate, item.pct_dof) >= 0) <= 60) {
              dates.push({
                fieldName: 'pct_dof',
                fieldValue: item.pct_dof,
                differenceInDays: getDifferenceInDays(currentDate, item.pct_dof)
              });
            }
            if (item.npe && item.npe.length > 0) {
              item.npe.forEach(subitem => {
                if (subitem.npe_dof && getDifferenceInDays(currentDate, subitem.npe_dof) <= 60 && getDifferenceInDays(currentDate, subitem.npe_dof) >= 0) {
                  dates.push({
                    fieldName: 'npe.npe_dof',
                    country: subitem.npe_country,
                    fieldValue: subitem.npe_dof,
                    differenceInDays: getDifferenceInDays(currentDate, subitem.npe_dof)
                  });
                }
                if (subitem.npe_grant && getDifferenceInDays(currentDate, subitem.npe_grant) <= 60 && getDifferenceInDays(currentDate, subitem.npe_grant) >= 0) {
                  dates.push({
                    fieldName: 'npe.npe_grant',
                    country: subitem.npe_country,
                    fieldValue: subitem.npe_grant,
                    differenceInDays: getDifferenceInDays(currentDate, subitem.npe_grant)
                  });
                }
              });
            }
            
            return { 
                _id: item._id, 
                ref_no: item.ref_no,
                dates 
            };
        });
        res.json(sortedArray);
    } catch(err) {
        res.status(500).json({
            error: err,
            message: "No notifications Found"
        })
    }
});

module.exports = router;