var db = {
    
        authentication: {
          options: {
            userName: "urmila@upstacksolutions.com@bottler.database.windows.net", // update me
            password: "Plenarea1!" // update me
          },
          type: "default"
        },
        server: "bottler.database.windows.net", // update me
        options: {
          database: "bottler", //update me
          encrypt: true,
          rowCollectionOnDone: true,
          rowCollectionOnRequestCompletion:true
        }
    

    // server: "localhost",
    // database: "bottler_db",
    // user: "sa",
    // password: "Neha@123",
    // port: 1433

    // server: "rsg-sqlserver.database.windows.net",
    // database: "ProSuite_Configuration",
    // user: "prowebuser",
    // password: "Pr0$uiteClient1",
    // port: 1433
}

module.exports = db;