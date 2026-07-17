const express = require("express");
const productController = require("../controllers/productController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  [
    "/pvc-decorative-film",
    "/pvc-decorative-film.php",
    "/pvc-decorative-films",
    "/pvc-decorative-films.php",
    "/pvc-decorative-louvers",
    "/pvc-decorative-louvers.php"
  ],
  asyncHandler(productController.listDecorativeFilms)
);

router.get(
  ["/wpc-louvers", "/wpc-louvers.php", "/pvc-wpc-interior-louvers", "/pvc-wpc-interior-louvers.php"],
  asyncHandler(productController.listLouvers)
);

router.get(["/wpc-doors", "/wpc-doors.php"], asyncHandler(productController.listWpcDoors));

router.get(["/wpc-door-frames", "/wpc-door-frames.php"], asyncHandler(productController.listWpcDoorFrames));

router.get(["/wpc-doors-and-frames", "/wpc-doors-and-frames.php"], productController.listWpcDoorsAndFrames);

router.get(
  ["/pvc-wpc-baffles", "/pvc-wpc-baffles.php"],
  asyncHandler(productController.listPvcWpcBaffles)
);

router.get(
  ["/wpc-louvers/:product", "/wpc-louvers-single-product", "/wpc-louvers-single-product.php"],
  asyncHandler(productController.showLouver)
);

module.exports = router;
