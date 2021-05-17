module.exports = app =>{
    const auth = require('../services/auth/auth.js');
    const product = require('../controllers/product.controller.js');

    app.get("/api/product/", product.getProducts);

    app.get("/api/product/:productId", product.getProduct);

    app.post("/api/product/update", product.updateProduct);

    app.post("/api/product/add", product.createProduct);

    app.post("/api/product/bulkimport", product.bulkImport);

    app.post("/api/delete", product.deleteProduct);
    
}