const mongoose = require('mongoose');

const NPESchema = new mongoose.Schema({
    // NPE Country
    npe_country: {
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
    // NPE FER Issue Date
    npe_fer_i: {
        type: String
    }, 
    // NPE FER Final Date
    npe_fer_f: {
        type: String
    },
    // NPE US First Office Action Date
    npe_us_foa: {
        type: String
    },
    // NPE US Second Office Action Date
    npe_us_soa: {
        type: String
    }, 
    // NPE US request for Continuation
    npe_us_rc: {
        type: String
    },
    // NPE US Response to Examination Report
    npe_us_rr: {
        type: String
    },
    // NPE US Final Action
    npe_us_fa: {
        type: String
    },
    // NPE IN Appeal Date
    npe_in_appeal: {
        type: String
    },
    // NPE IN Hearing Date
    npe_in_hearing: {
        type: String
    },
    // NPE IN Second Examination Report
    npe_in_ser: {
        type: String
    },
    // NPE EP Rule 161
    npe_ep_161: {
        type: String
    },
    // NPE EP Granted / Rejected
    npe_ep_desc: {
        type: Boolean
    },
    // NPE EP claim to publication Date
    npe_ep_pub: {
        type: String
    },
    // NPE EP Second Examination Report
    npe_ep_ser: {
        type: String
    },
    // NPE EP translation of accepted Claim
    npe_ep_tac: {
        type: String
    },
    // NPE Validation
    npe_ep_val: {
        type: String
    },
    // NPE Grant Date
    npe_grant: {
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
    npe_annuity: {
        type: String
    },
    // NPE Request for Examination Date
    npe_rfe: {
        type: String
    }
}, {
    timestamps: true
});

const patentMISSchema = new mongoose.Schema({
    // Reference Number
    ref_no: {
        type: String
    },
    // PRV Date of Filing
    prv_dof: {
        type: String
    },
    // PRV Application Number
    prv_appno: {
        type: String
    },
    // PCT Date of Filing
    pct_dof: {
        type: String
    },
    // PCT Number
    pct_appno: {
        type: String
    },
    // PCT ISA Date
    pct_isa: {
        type: String
    },
    // PCT Publication Date
    pct_18: {
        type: String
    },
    // PCT 22 Month Date
    pct_22_md: {
        type: String
    },
    // PCT 30/31 Date
    pct_30_31: {
        type: String
    },
    // PCT Deadline
    pct_dl: {
        type: String
    },
    // NPE
    npe: [NPESchema]
}, {
    timestamps: true
});

const MISpatents = mongoose.model('miscellixibiopatents', patentMISSchema);
module.exports = MISpatents;