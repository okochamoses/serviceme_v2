const router = require("express").Router();
const providerService = require("../services/providerService")

router.get("/profile", providerService.getProfile);
router.post("/profile", providerService.updateProfile);
router.post("/business", providerService.addBusiness);
router.post("/business/:businessId/images", providerService.addImages);
router.post("/business/:businessId", providerService.updateBusiness);

module.exports = router;