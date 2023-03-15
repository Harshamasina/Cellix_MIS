const express = require('express');
const router = express.Router();
const moment = require('moment/moment');
const MISPatentsSchema = require('../Models/PatentModel');
require('dotenv').config();

router.get('/notifications', (req , res) => {
    res.send(`Hello from the Cellix MIS Notification Services`)
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