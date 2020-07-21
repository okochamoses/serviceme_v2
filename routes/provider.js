const router = require("express").Router();
const providerService = require("../services/providerService")
const {processSessionToken} = require("../middleware/authMiddleware")

router.get("/profile", processSessionToken, providerService.getProfile);
router.post("/profile", processSessionToken, providerService.updateProfile);
router.post("/business", providerService.addBusiness);
router.post("/business/:businessId/images", providerService.addImages);
router.post("/business/:businessId", processSessionToken, providerService.updateBusiness);

module.exports = router;