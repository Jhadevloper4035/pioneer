const express = require("express");
const productController = require("../controllers/productController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  ["/wpc-louvers", "/wpc-louvers.php", "/pvc-decorative-louvers", "/pvc-decorative-louvers.php"],
  asyncHandler(productController.listLouvers)
);

router.get(
  ["/wpc-louvers/:product", "/wpc-louvers-single-product", "/wpc-louvers-single-product.php"],
  asyncHandler(productController.showLouver)
);

module.exports = router;
