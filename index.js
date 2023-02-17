const express = require('express');
const app = express();
app.use(express.json());
require('./db/Conn');
app.use(require('./Router/auth'));

app.listen(5000, () => {
    console.log(`serve is running at port 5000`);
    console.log(`http://localhost:5000`);
});