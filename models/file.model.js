const sql = require('mssql');
const db = require('../db.js');
const { Connection, Request } = require("tedious");
var TYPES = require('tedious').TYPES;
const dbConfig = require('../config/db.config');

exports.getDetails = function (result, callback) {

    const connection = new Connection(dbConfig);

    let jsonFormat = []
    let rowData = {};

    connection.connect(function (err) {
        if (err) {
            console.error(err);
        } else {
            const request = new Request('GetFiles',
                (err, recordset, rows) => {
                    if (err) {
                        console.error(err);
                    } else {
                        result(null, jsonFormat)
                    }
                })

            request.on("row", columns => {
                rowData = {};
                columns.forEach(column => {
                    // IMPORTANT: Change the conversion logic here to adjust JSON format
                    rowData[column.metadata.colName] = column.value;
                });
                jsonFormat.push(rowData);
            });
            connection.execSql(request);
        }
    });

}

exports.add = (newFile, result) => {


    const connection = new Connection(dbConfig);
    var fileName = newFile.name;
    var subPath = "./uploads/"

    rowData = {}
    connection.connect(function (err) {
        if (err) {
            console.error(err);
        } else {
            const request = new Request('saveFile',
                (err, recordset, rows) => {
                    if (err) {
                        console.error(err);
                    } else {
                        result(null, rowData)
                    }
                })

            request.addParameter('id', TYPES.Int, '1')
            request.addParameter('name', TYPES.NVarChar, fileName)
            request.addParameter('size', TYPES.Int, '200')
            request.addParameter('processed', TYPES.NVarChar, "Not yet processed")
            request.addParameter('url', TYPES.NVarChar, subPath + fileName)
            request.addParameter('isActive', TYPES.NVarChar, "true")
            request.addParameter('ReturnCode', TYPES.NVarChar, '1')
            request.on("row", columns => {
                columns.forEach(column => {
                    // IMPORTANT: Change the conversion logic here to adjust JSON format
                    rowData[column.metadata.colName] = column.value;
                });
            });
            connection.callProcedure(request);
        }


    })
};