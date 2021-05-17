const file = require('../models/file.model.js');
//const auth = require('../services/auth/auth.js');
const aad = require('azure-ad-jwt');
//retrieve all books from database
exports.getFiles = (req, res) => {
  token = req.headers['authorization'];
  req_token = token.split(' ');
  aad.verify(req_token[1], null, function(err, result) {
      if (result) {
        file.getDetails(function(err, data){    
            if(err){
                console.log("err", err)
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while retrieving file details."
                })
            }else {
                res.json(data);
            }
        })
      } else {
        //reject("JWT is invalid: " + err);
        console.log("JWT is invalid: " + err);
      res.sendStatus(401)
    }
  })   

}

exports.addFile = (req, res) => {
  token = req.headers['authorization'];
  req_token = token.split(' ');
  aad.verify(req_token[1], null, function(err, result) {
      if (result) {
          let sampleFile;
          let uploadPath;

          if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
          }

          // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
          sampleFile = req.files.file;
          console.log("sampleFile",sampleFile)
          uploadPath = 'C:/Users/nehag/Pictures/images/' + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
          sampleFile.mv(uploadPath, function(err) {
            if (err)
              return res.status(500).send(err);
            // Save file in the database
            file.add(sampleFile, (err, data) => {
              if (err)
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while adding the File."
                });
              else res.send(data);
            });

        });
      } else {
        //reject("JWT is invalid: " + err);
        console.log("JWT is invalid: " + err);
      res.sendStatus(401)
    }
  })   

};