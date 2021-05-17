require('dotenv').config();
const express = require("express");
const app = express();
var sql = require('mssql');
//const auth = require('../services/auth/auth.js')
const aad = require('azure-ad-jwt');
const { Connection, Request } = require("tedious");
var db = require('./db.js');
const cors = require('cors');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const { response } = require('express');
const port = 3000; 

// app.use((req, res, next) => { console.log(req);
//     token = req.headers['authorization'];
//     req_token = token.split(' ');
//     aad.verify(req_token[1], null, function(err, result) {
//         if (result) {
//           console.log("JWT is valid",  req.headers) ;
//           next();
//         }else{
//             console.log("JWT is invalid: " + err);
//                  res.sendStatus(401)
           
//         }
//     })
    
// })


app.use(cors());
app.use(bodyparser.json({limit: "50mb"}));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/upload", express.static('assets')); //use prefix upload and directory assets

app.get("/",(req, res,) => res.send("welocome to node")) ;

app.listen(`${port}`, () => {
    console.log("listing the port at " + `${port}`)
});

//include routes
require('./routes/product.route.js')(app)
require('./routes/file.route.js')(app)