const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
require('./db/Conn');
app.use(require('./Router/auth'));
app.use(require('./Router/PatentAuth'));
app.use(require('./Router/loginAuth'));
app.use(require('./Router/NotificationAuth'));

app.listen(5000, () => {
    console.log(`server is running at port 5000`);
    console.log(`http://localhost:5000`);
});