const express = require("express");
const productController = require("../controllers/productController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/pvc-decorative-film", asyncHandler(productController.listDecorativeFilms));

router.get("/pvc-wpc-interior-louvers", asyncHandler(productController.listLouvers));

router.get("/wpc-doors", asyncHandler(productController.listWpcDoors));

router.get("/wpc-door-frames", asyncHandler(productController.listWpcDoorFrames));

router.get("/pvc-wpc-baffles", asyncHandler(productController.listPvcWpcBaffles));

router.get("/wpc-louvers/:product", asyncHandler(productController.showLouver));

module.exports = router;
