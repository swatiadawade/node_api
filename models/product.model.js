const sql = require('mssql');
const db = require('../db.js')
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
            const request = new Request('GetProducts',
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

exports.getProductById = (productId, result) => {
    const connection = new Connection(dbConfig);
    rowData = {}
    //connection.input('productId', productId)

    connection.connect(function (err) {
        if (err) {
            console.error(err);
        } else {
            const request = new Request('GetProduct',
                (err, recordset, rows) => {
                    if (err) {
                        console.error(err);
                    } else {
                        result(null, rowData)
                    }
                })

                request.addParameter('productId', TYPES.VarChar, productId)
                request.on("row", columns => {
                    columns.forEach(column => {
                        // IMPORTANT: Change the conversion logic here to adjust JSON format
                        rowData[column.metadata.colName] = column.value;
                    });
                });
                connection.callProcedure(request);
            }


        })

}

exports.create = (newProduct, result) => {
    const connection = new Connection(dbConfig);
        console.log("newProduct", newProduct)

        rowData = {}
        connection.connect(function (err) {
            if (err) {
                console.error(err);
            } else {
                const request = new Request('BatchInsertProducts',
                    (err, recordset, rows) => {
                        if (err) {
                            console.error(err);
                        } else {
                            result(null, rowData)
                        }
                    })
    
                    request.addParameter('jsonObject', TYPES.NVarChar, JSON.stringify(newProduct))
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

exports.update = (updatedData, result) => {
    const connection = new Connection(dbConfig);

    rowData = {}
    connection.connect(function (err) {
        if (err) {
            console.error(err);
        } else {
            const request = new Request('BatchUpdateProducts',
                (err, recordset, rows) => {
                    if (err) {
                        console.error(err);
                    } else {
                        result(null, rowData)
                    }
                })

                request.addParameter('jsonObject', TYPES.NVarChar, JSON.stringify(updatedData))
                request.on("row", columns => {
                    columns.forEach(column => {
                        // IMPORTANT: Change the conversion logic here to adjust JSON format
                        rowData[column.metadata.colName] = column.value;
                    });
                });
                connection.callProcedure(request);
            }


        })

}

exports.import = (newProduct, result) => {

    const connection = new Connection(dbConfig);
    console.log("newProduct", newProduct)

    rowData = {}
    connection.connect(function (err) {
        if (err) {
            console.error(err);
        } else {
            const request = new Request('BatchInsertProducts',
                (err, recordset, rows) => {
                    if (err) {
                        console.error(err);
                    } else {
                        result(null, rowData)
                    }
                })

                request.addParameter('jsonObject', TYPES.NVarChar, JSON.stringify(newProduct))
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

exports.delete = (deletedData, result) => {
    const connection = new Connection(dbConfig);

    rowData = {}
    connection.connect(function (err) {
        if (err) {
            console.error(err);
        } else {
            const request = new Request('BatchDeleteProducts',
                (err, recordset, rows) => {
                    if (err) {
                        console.error(err);
                    } else {
                        result(null, rowData)
                    }
                })

                request.addParameter('jsonObject', TYPES.NVarChar, JSON.stringify(deletedData))
                request.on("row", columns => {
                    columns.forEach(column => {
                        // IMPORTANT: Change the conversion logic here to adjust JSON format
                        rowData[column.metadata.colName] = column.value;
                    });
                });
                connection.callProcedure(request);
            }


        })

}
