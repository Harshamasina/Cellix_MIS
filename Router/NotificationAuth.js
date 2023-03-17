const express = require('express');
const router = express.Router();
const moment = require('moment/moment');
const NotificationSchema = require('../Models/NotificationModel');
const MISPatentsSchema = require('../Models/PatentModel');
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

router.get('/api/pctnotifications', async (req, res) => {
    try{
        const fields = [
            { name: 'pct_isr', label: 'PCT International Search Report' },
            { name: 'pct_18', label: 'PCT Publication Date' },
            { name: 'pct_22_md', label: 'PCT 22 Month' },
            { name: 'pct_30_31', label: 'PCT 30/31 Month' },
        ];
        const currentDate = new Date();
        let results = [];
        const documents = await MISPatentsSchema.find();
        for (const document of documents) {
            for (const field of fields) {
                const fieldValue = document[field.name];
                if (fieldValue) {
                  const fieldValueDate = new Date(fieldValue);
                  const diffTime = Math.abs(currentDate - fieldValueDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays <= 60) {
                        results.push({
                            ref_no: document.ref_no,
                            fieldName: field.label,
                            fieldValue: fieldValue,
                            daysLeft: diffDays
                        });
                    }
                }
            }
        }
        results.sort((a, b) => a.daysLeft - b.daysLeft);
        res.status(201).json(results);
    } catch(err){
        res.status(500).json({
            error: err,
            message: "Failed To get PCT Notifications"
        });
    }
});

module.exports = router;