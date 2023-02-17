const mongoose = require('mongoose');
require('dotenv').config();

// const DB = 'mongodb+srv://root:root@cellixbio.wa5aa69.mongodb.net/cellix-mis-testing?retryWrites=true&w=majority';
const DB = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB is Successfully Connected');
}).catch((err) => console.error( 'No Connection', err));