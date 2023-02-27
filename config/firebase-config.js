const admin = require('firebase-admin');
const MISFirebase = require('./MISFirebase.json');

admin.initializeApp({
    credential: admin.credential.cert(MISFirebase),
});

module.exports = admin;