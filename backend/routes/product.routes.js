const express = require('express');
const router = express.Router();
const multer = require('multer');
// internal
const productController = require('../controller/product.controller');
const verifyToken = require('../middleware/verifyToken');
const { authorizePermission } = require('../middleware/authorization');

// Configure multer for file uploads (memory storage for Excel/CSV)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.'));
    }
  }
});

// add a product (requires store manager or super admin)
router.post('/add', verifyToken, authorizePermission("products", "create"), productController.addProduct);
// add all product (requires store manager or super admin)
router.post('/add-all', verifyToken, authorizePermission("products", "create"), productController.addAllProducts);
// get all products
router.get('/all', productController.getAllProducts);
// get offer timer product
router.get('/offer', productController.getOfferTimerProducts);
// top rated products
router.get('/top-rated', productController.getTopRatedProducts);
// reviews products
router.get('/review-product', productController.reviewProducts);
// get popular products by type
router.get('/popular/:type', productController.getPopularProductByType);
// get Related Products
router.get('/related-product/:id', productController.getRelatedProducts);
// get Single Product
router.get("/single-product/:id", productController.getSingleProduct);
// stock Product
router.get("/stock-out", productController.stockOutProducts);
// Export products (MUST be before /:type route)
router.get('/export/all', verifyToken, authorizePermission("products", "view"), productController.exportProducts);
// Import products
router.post('/import', verifyToken, authorizePermission("products", "create"), upload.single('file'), productController.importProducts);
// edit product (requires store manager or super admin)
router.patch("/edit-product/:id", verifyToken, authorizePermission("products", "edit"), productController.updateProduct);
// get Products ByType (MUST be last to avoid catching other routes)
router.get('/:type', productController.getProductsByType);
// delete product (requires store manager or super admin)
router.delete('/:id', verifyToken, authorizePermission("products", "delete"), productController.deleteProduct);

module.exports = router;