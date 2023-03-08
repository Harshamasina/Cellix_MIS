const mongoose = require('mongoose');

const NPEOASchema = new mongoose.Schema({
    npe_oa_descp: {
        type: String
    },
    npe_oa_date: {
        type: String
    }
}, {
    timestamps: true
});

const NPEAFSchema = new mongoose.Schema({
    npe_af_descp: {
        type: String
    },
    npe_af_date: {
        type: String
    }
}, {
    timestamps: true
});

const NPESchema = new mongoose.Schema({
    // NPE Country
    npe_country: {
        type: String
    },
    // NPE Country Divisional Number
    npe_country_div: {
        type: String
    },
    // NPE Application Number
    npe_appno: {
        type: String
    },
    // NPE Date of Filing
    npe_dof: {
        type: String
    },
    // NPE Firms
    npe_firms: {
        type: String
    },
    // NPE Office Action
    npe_oa: [NPEOASchema], 
    // NPE Grant Date
    npe_grant: {
        type: String
    },
    // NPE Grant Decision
    npe_grant_desc: {
        type: String
    },
    // NPE Patent Number
    npe_patent: {
        type: String
    },
    // NPE Issue Fee Date
    npe_if: {
        type: String
    },
    // NPE Annuities Date
    npe_af: [NPEAFSchema],
    // NPE Request for Examination Date
    npe_rfe: {
        type: String
    },
    //NPE Notes
    npe_notes: {
        type: String
    }
}, {
    timestamps: true
});

const BackupNPESchema = new mongoose.Schema({
    // Reference Number
    ref_no: {
        type: String
    },
    //NPE
    npe: [NPESchema]
}, {
    timestamps: true
});

const BackupModel = mongoose.model('backupnpepatents', BackupNPESchema);
module.exports = BackupModel;