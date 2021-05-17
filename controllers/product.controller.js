const product = require('../models/product.model.js');
const auth = require('../services/auth/auth.js')
const aad = require('azure-ad-jwt');
var fs = require("fs");
var Promise = require('promise');

//retrieve all products from database
exports.getProducts = (req, res) => {

    token = req.headers['authorization'];
    req_token = token.split(' ');
    aad.verify(req_token[1], null, function(err, result) {
        if (result) {
          product.getDetails(function(err, data){        
            if(err){
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving product details."
                })
            }else {
              for(var i=0; i<data.length; i++){
                data[i].small_image = process.env.UPLOAD_IMG_URL + data[i].small_image
              }
                res.json(data);
            }
          })
        } else {
          //reject("JWT is invalid: " + err);
        res.sendStatus(401)
      }
    })   
}

exports.getProduct = (req, res) => {
  token = req.headers['authorization'];
  req_token = token.split(' ');
  aad.verify(req_token[1], null, function(err, result) {
      if (result) {
        product.getProductById(req.params.productId, (err, data)=>{        
          if(err){
              console.log("err", err)
              res.status(500).send({
                  message: err.message || "Some error occurred while retrieving product details."
              })
          }else {
              data.small_image = process.env.UPLOAD_IMG_URL + data .small_image
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
   
exports.createProduct = (req, res) => { 
  token = req.headers['authorization'];
  req_token = token.split(' ');
  aad.verify(req_token[1], null, function(err, result) {
      if (result) {
       // Validate request
        if (!req.body) {
          res.status(400).send({
            message: "Content can not be empty!"
          });
        }
        var base64Image = req.body['file'];
        var fileName = uploadImage(base64Image);
          //var data = JSON.stringify(res.body);
          var inputs = {"Products" : {
            '_id': '',
            'epid': req.body.epid,
            'product_id': '',
            'bottler_id': '',
            'customer_id': req.body.customer_id,
            'store_id': '',
            'name': req.body.name,
            'retail_price': req.body.retail_price,
            'sale_price': req.body.sale_price,
            'skuid': req.body.skuid,
            'small_image': fileName,
            'active': 'active',
            'availability': '',
            'description': req.body.description,
            'promotion': '',
            'size': '',
            'configuration': '',
            'color': '',
            'picture': '',
            'contract': '',
            'store': '',
            'created_at': new Date().toISOString(),
            'ReturnCode': ''
          }};
          // Save Product in the database
          product.create(inputs, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Product."
              });
              else res.send(data);
          });
        } else {
          //reject("JWT is invalid: " + err);
          console.log("JWT is invalid: " + err);
        res.sendStatus(401)
      }
    })   
};

exports.updateProduct = (req, res) => {
  token = req.headers['authorization'];
  req_token = token.split(' ');
  aad.verify(req_token[1], null, function(err, result) {
      if (result) {
          // Validate Request
          if (!req.body) {
            res.status(400).send({
              message: "Content can not be empty!"
            });
          }
          var base64Image = req.body['file'];
          var fileName = req.body['small_image'];
          if(base64Image){
          fileName = uploadImage(base64Image);
          }
          var inputs = {"Products" : {
            'id': req.body.id,
            '_id': '',
            'epid': req.body.epid,
            'product_id': '',
            'bottler_id': '',
            'customer_id': req.body.customer_id,
            'store_id': '',
            'name': req.body.name,
            'retail_price': req.body.retail_price,
            'sale_price': req.body.sale_price,
            'skuid': req.body.skuid,
            'small_image': fileName,
            'active': 'active',
            'availability': '',
            'description': req.body.description,
            'promotion': '',
            'size': '',
            'configuration': '',
            'color': '',
            'picture': '',
            'contract': '',
            'store': '',
            'created_at': '',
            'ReturnCode': req.body.ReturnCode
          }};

          product.update(inputs,
            (err, data) => {
              if (err) {
                  res.status(500).send({
                    message: "Some error occurred while updating product."
                  });
              } else res.send(data);
            }
          );
        } else {
          //reject("JWT is invalid: " + err);
          console.log("JWT is invalid: " + err);
        res.sendStatus(401)
      }
    })   
};

exports.bulkImport = (req, res) => { 
  token = req.headers['authorization'];
  req_token = token.split(' ');
  aad.verify(req_token[1], null, function(err, result) {
      if (result) {
        // Validate request
        if (!req.body) {
          res.status(400).send({
            message: "Content can not be empty!"
          });
        }
        var bulkData = req.body.data;
        bulkData = JSON.parse(bulkData);
        inserted_rows = 0;
        not_inserted_rows = 0;
        // let insertBulkData = new Promise((resolve, reject)=>{
        //    resolve (insertData(bulkData))
        // })
        insertData(bulkData)
        .then(response  => {
        setTimeout(()=>
          res.send({"message": inserted_rows + " row's affected." + not_inserted_rows + " rows's getting error to insert."})
        ,2000)
        })
      } else {
        //reject("JWT is invalid: " + err);
        console.log("JWT is invalid: " + err);
      res.sendStatus(401)
    }
  })
}

exports.deleteProduct = (req, res) => {
  token = req.headers['authorization'];
  req_token = token.split(' ');
  aad.verify(req_token[1], null, function(err, result) {
      if (result) {
        var inputs = {"Products" : {
          'id': req.body.id,
          'active': 'inactive',
          }};

        product.delete(inputs,
          (err, data) => {
            if (err) {
                res.status(500).send({
                  message: "Some error occurred while deleting product."
                });
            } else res.send(data);
          }
        );
      } else {
        //reject("JWT is invalid: " + err);
        console.log("JWT is invalid: " + err);
      res.sendStatus(401)
    }
  })
};

async function insertData(bulkData){
  for(var i=0; i< bulkData.Products.length; i++){

    var inputs = {"Products" :  bulkData.Products[i]}
    product.import(inputs, (err, data) => {
      if (err){
        not_inserted_rows = not_inserted_rows + 1;
      }else{ 
          inserted_rows = inserted_rows + 1;
        }
    });
  }
  return true;
}

function uploadImage(base64Image) {
  let sampleFile;
  let uploadPath;
  var mime = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    mimeInfo = mime[1];
  }
  var mimeInfo = mimeInfo.split("/");
  var base64Data;
  sampleFile =  Date.now() + '.' + mimeInfo[1];
  if(mimeInfo[1] == "png" ){
    base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
  }

  if(mimeInfo[1] == "jpeg" ){
    base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, "");
  }

  uploadPath = './assets/images/' + sampleFile;

  const buffer = Buffer.from(base64Data, "base64"); //convert base64 to buffer
  fs.writeFile(uploadPath, buffer, function(err) {}); // buffer to image
  return sampleFile;
}