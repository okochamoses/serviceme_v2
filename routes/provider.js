const router = require("express").Router();
const providerService = require("../services/providerService")

router.post("/business", providerService.addBusiness);
router.post("/business/:businessId/images", providerService.addImages);

module.exports = router;