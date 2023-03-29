const express = require('express');
const router = express.Router();
const MISPatentsSchema = require('../Models/PatentModel');

router.get('/firms', (req , res) => {
    res.status(201).json(`Hello from the Cellix MIS Firms`);
});

router.get('/api/getfirms/:countrycode', async (req, res) => {
    try{
        const countryCode = req.params.countrycode;
        const documents = await MISPatentsSchema.find({});
        const filteredNPE = documents.reduce((acc, document) => {
            const npeArray = document.npe;
            const filteredNPEArray = npeArray.filter((npeObj) => {
                return npeObj.npe_country === countryCode;
            });
            return acc.concat(filteredNPEArray);
        }, []);
        const sortedFilteredNPE = filteredNPE.sort((a, b) => {
            if (a.npe_dof && b.npe_dof) {
                return new Date(b.npe_dof) - new Date(a.npe_dof);
            } else if (a.npe_dof) {
                return -1;
            } else if (b.npe_dof) {
                return 1;
            } else {
                return 0;
            }
        });
        res.status(201).json(sortedFilteredNPE);
    } catch (err) {
        console.error(err);
        res.status(500).json('Internal Server Error');
    }
});

module.exports = router;