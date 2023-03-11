const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema({
    claims: {
        type: String 
    },
    compounds: {
        type: String
    },
    diseases: {
        type: String,
        required: true,
    },
    formula: {
        type: String 
    },
    publication_date: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return /^\d{2}\.\d{2}\.\d{4}$/.test(value);
            },
            message: "Invalid date format, should be dd.mm.yyyy",
        },
    },
    therapeutic_area: {
        type: String ,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    wno: {
        type: String,
        required: true,
    },
    pct: {
        type: String,
        required: true,
    }
})

const patents = mongoose.model('testpatents', patentSchema);
module.exports = patents;