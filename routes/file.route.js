module.exports = app =>{
    const auth = require('../services/auth/auth.js');
    const file = require('../controllers/file.controller.js');

    app.get("/api/file/", file.getFiles);

    app.post("/api/file/add", file.addFile);

}