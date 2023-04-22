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

router.get('/api/getcountry/:country', async (req, res) => {
    try {
        const { country } = req.params;
        const countryData = await MISPatentsSchema.find({
            'npe.npe_country': country
        });
        if (!countryData || countryData.length === 0) {
            return res.status(404).json({
                message: "NPE Applications Not Found"
            });
        };
        const npeGroups = {};
        countryData.forEach(patent => {
            patent.npe.forEach(npe => {
                if (npe.npe_country === country) {
                    if (!npeGroups[npe.npe_country]) {
                        npeGroups[npe.npe_country] = [];
                    }
                    npeGroups[npe.npe_country].push(
                        {
                            id: patent._id,
                            ref_no: patent.ref_no,
                            pct_dof: patent.pct_dof,
                            npe: npe
                        }
                    );
                }
            });
        });
        const formattedData = Object.keys(npeGroups).map(key => {
            return {
              countryData: npeGroups[key]
            };
        });
        const sortedData = formattedData.map((obj) => {
            obj.countryData.sort((a, b) => {
                if(!a.pct_dof || a.pct_dof === "") return 1;
                if(!b.pct_dof || b.pct_dof === "") return -1;
                return new Date(b.pct_dof) - new Date(a.pct_dof);
            });
            return obj;
        });
        res.status(201).json(sortedData);
    } catch (err) {
        return res.status(500).json({
            error: err,
            message: "Failed to get NPE Applications"
        });
    }
});

module.exports = router;