const express = require('express');
const router = express.Router();
const MISPatentsSchema = require('../Models/PatentModel');
const ModelTest = require('../Models/ModelTest');
const BackupModel = require('../Models/BackupModel');
const moment = require('moment/moment');
require('dotenv').config();

router.get('/', (req , res) => {
    res.send(`Hello from the Cellix MIS Services`)
});

router.post('/api/patent', async(req, res) => {
    try {
        const data = new MISPatentsSchema(req.body);
        const ref_no = req.body.ref_no;
        const ref = await MISPatentsSchema.findOne({ ref_no: data.ref_no });
        const prvDof = moment(data.prv[0].prv_dof, "YYYY-MM-DD");
        if(!ref_no){
            res.status(422).json({message: "Reference Number is Mandatory"});
        } else if(ref){
            res.status(422).json({message: "Patent MIS Information Already Exists"});
        } else {
            const pctDof = prvDof.clone().add(12, "months").format("YYYY-MM-DD");
            const pct18 = prvDof.clone().add(18, "months").format("YYYY-MM-DD");
            const isr = prvDof.clone().add(19, "months").format("YYYY-MM-DD");
            const pct22 = prvDof.clone().add(22, "months").format("YYYY-MM-DD");
            const pct30 = prvDof.clone().add(30, "months").format("YYYY-MM-DD");
            data.pct_dof = pctDof;
            data.pct_18 = pct18;
            data.pct_isr = isr;
            data.pct_22_md = pct22;
            data.pct_30_31 = pct30;
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

router.get('/api/getpatents/:pageindex', async(req, res) => {
    try{
      const pageIndex = parseInt(req.params.pageindex) || 0;
      const pageSize = 5;
      const count = await MISPatentsSchema.countDocuments();
      const sortQuery = {};
      if (req.query.sort) {
        const parts = req.query.sort.split(':');
        const fieldName = parts[0];
        const sortDirection = parts[1] === 'desc' ? -1 : 1;
        if (fieldName === 'prv.prv_dof') {
          sortQuery['prv.0.prv_dof'] = sortDirection;
        } else {
          sortQuery[fieldName] = sortDirection;
        }
      }
      const Patents = await MISPatentsSchema
        .find()
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .sort(sortQuery);
      const totalPages = Math.ceil(count / pageSize);
      res.status(201).json({
        Patents,
        pageIndex,
        pageSize,
        count,
        totalPages,
      });
    } catch(err) {
      res.status(422).json({
        error: err,
        message: "Failed to get MIS Information"
      });
    }
});

router.get('/api/patents/:pageindex', async(req, res) => {
    try{
        const pageIndex = parseInt(req.params.pageindex) || 0;
        const pageSize = parseInt(req.query.pagesize) || 9;
        const count = await MISPatentsSchema.countDocuments();
        const sortQuery = {};
        if (req.query.sort) {
            const parts = req.query.sort.split(':');
            const fieldName = parts[0];
            const sortDirection = parts[1] === 'desc' ? -1 : 1;
            if (fieldName === 'prv.prv_dof') {
                sortQuery['prv.0.prv_dof'] = sortDirection;
            } else {
                sortQuery[fieldName] = sortDirection;
            }
        }
        const Patents = await MISPatentsSchema
            .find()
            .skip(pageIndex * pageSize)
            .limit(pageSize)
            .sort(sortQuery);
        const totalPages = Math.ceil(count / pageSize);
        res.status(201).json({
            Patents,
            pageIndex,
            pageSize,
            count,
            totalPages,
        });
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
    const confirmCode = req.header('confirmCode');
    if(confirmCode !== process.env.CONFIRMATION_CODE){
        return res.status(401).json({ error: "Invalid Confirmation Code" });
    }
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
        res.status(201).json(updatedPatent);
    } catch (err) {
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
                    {'prv.prv_appno': {$regex: search, $options: '$i'}},
                    {pct_appno: {$regex: search, $options: '$i'}},
                    {'npe.npe_appno': {$regex: search, $options: '$i'}},
                    {'npe.npe_patent': {$regex: search, $options: '$i'}}
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

router.delete('/api/deletepatent/:id', async (req, res) => {
    const { id } = req.params;
    const confirmCode = req.header('confirmCode');
    if(confirmCode !== process.env.CONFIRMATION_CODE){
        return res.status(401).json({ error: "Invalid Confirmation Code" });
    }
    try{
        const DeletePatent = await MISPatentsSchema.findById(id);
        if(!DeletePatent){
            return res.status(404).json({error: "Application not found"});
        }
        const backupPatent = new BackupModel(DeletePatent.toObject());
        await backupPatent.save();
        await DeletePatent.remove();
        return res.status(201).json({
            DeletePatent,
            message: "Successfully Deleted Application and stored in BackUp Database"
        });
    } catch (err) {
        return res.status(500).json({
            error: err,
            message: "Failed to Delete Application"
        });
    }
});

router.get('/api/getnotifications', async (req, res) => {
    try{
        const filteredData = await Data.find({
            $or: [
              { 'npe.npe_oa.npe_oa_date': { $lt: moment().add(60, 'days').toDate() } },
              { 'npe.npe_af.npe_af_date': { $lt: moment().add(30, 'days').toDate() } },
              { 'npe.npe_if': { $lt: moment().add(60, 'days').toDate() } },
              { 'npe.npe_rfe': { $lt: moment().add(60, 'days').toDate() } },
              { 'ref-no': { $lt: moment().add(60, 'days').toDate() } },
              { 'pct_isr': { $lt: moment().add(60, 'days').toDate() } },
              { 'pct_18_md': { $lt: moment().add(60, 'days').toDate() } },
              { 'pct_22': { $lt: moment().add(60, 'days').toDate() } },
              { 'pct_30': { $lt: moment().add(60, 'days').toDate() } }
            ]
        });
        const mappedData = filteredData.map(data => {
            const mappedDates = [];
            if (data.npe.npe_oa && data.npe.npe_oa.npe_oa_date < moment().add(60, 'days').toDate()) {
                mappedDates.push({
                  fieldName: 'npe_oa_date',
                  label: 'OA Date',
                  dateValue: moment(data.npe.npe_oa.npe_oa_date).format('YYYY-MM-DD'),
                  diffInDays: moment(data.npe.npe_oa.npe_oa_date).diff(moment(), 'days')
                });
            }
        });
        res.status(200).json(sortedData);
    } catch(err){
        res.status(500).json({
            error: err,
            message: "No notifications Found"
        });
    }
});

module.exports = router;