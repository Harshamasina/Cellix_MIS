const express = require('express');
const router = express.Router();
const moment = require('moment/moment');
const NotificationSchema = require('../Models/NotificationModel');
require('dotenv').config();

router.get('/notifications', (req , res) => {
    res.send(`Hello from the Cellix MIS Notification Services`)
});

router.post('/api/cnotification', async (req, res) => {
    const confirmCode = req.header('confirmCode');
    if(confirmCode !== process.env.CONFIRMATION_CODE_TWO && confirmCode !== process.env.CONFIRMATION_CODE_ONE){
        return res.status(401).json({ error: "Invalid Confirmation Code" });
    }
    try {
        const currentDate = moment().startOf('day');
        const eventDate = moment(req.body.date).startOf('day');
        const daysLeft = eventDate.diff(currentDate, 'days');

        const data = new NotificationSchema({
            ref_no: req.body.ref_no,
            date: req.body.date,
            field: req.body.field,
            descp: req.body.descp,
            daysLeft: daysLeft
        });
        const Notification = await data.save();
        res.status(201).json({
            Notification,
            message: "Notification Successfully Stored"
        });
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Notification failed to Stored'
        });
    }
});

router.get('/api/getcnotifications', async (req, res) => {
    try {
        const data = await NotificationSchema.find();
        const sortedData = data.sort((a, b) => {
            if (a.daysLeft < 0 && b.daysLeft >= 0) {
                return 1;
            } else if (a.daysLeft >= 0 && b.daysLeft < 0) {
                return -1;
            } else {
                return a.daysLeft - b.daysLeft;
            }
        });
        res.status(200).json(sortedData);
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Failed to retrieve notifications'
        });
    }
});

router.get('/api/getcnotification/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const data = await NotificationSchema.findById(id);
        if(!data){
            return res.status(404).json({error: "Notification not found"});
        }
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Failed to retrieve notification'
        });
    }
});

router.patch('/api/updatecnotification/:id', async (req, res) => {
    const confirmCode = req.header('confirmCode');
    if(confirmCode !== process.env.CONFIRMATION_CODE_TWO && confirmCode !== process.env.CONFIRMATION_CODE_ONE){
        return res.status(401).json({ error: "Invalid Confirmation Code" });
    }
    try {
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
        if (updates.date) {
            const currentDate = moment().startOf('day');
            const newDate = moment(updates.date).startOf('day');
            const daysLeft = newDate.diff(currentDate, 'days');
            updates.daysLeft = daysLeft;
        }
        const updateNotification = await NotificationSchema.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if(!updateNotification){
            return res.status(404).json({message: "Notification Not Found"});
        }
        res.status(201).json(updateNotification);
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Notification failed to Update'
        });
    }
});

router.delete('/api/deletenotification/:id', async (req, res) => {
    const confirmCode = req.header('confirmCode');
    if(confirmCode !== process.env.CONFIRMATION_CODE_TWO && confirmCode !== process.env.CONFIRMATION_CODE_ONE){
        return res.status(401).json({ error: "Invalid Confirmation Code" });
    }
    try {
        const id = req.params.id;
        const Notification = await NotificationSchema.findById(id);
        if(!Notification){
            return res.status(404).json({error: "Notification not found"});
        }
        const DeleteNotification = await NotificationSchema.findByIdAndDelete(id);
        return res.status(201).json({
            DeleteNotification,
            message: "Successfully Deleted Notification"
        });
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Notification failed to Delete'
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