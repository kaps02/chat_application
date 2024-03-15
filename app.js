const express = require('express');
const path = require('path');

app = express();

app.use(express.static(path.join(__dirname, "view")));

app.listen(8000 , ()=>{
    console.log("running on 8000");
})
