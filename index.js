const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
require('./db/Conn');
app.use(require('./Router/auth'));

app.listen(5000, () => {
    console.log(`serve is running at port 5000`);
    console.log(`http://localhost:5000`);
});