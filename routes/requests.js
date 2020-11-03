const router = require("express").Router();
const providerService = require("../services/providerService")
const {processSessionToken} = require("../middleware/authMiddleware")

router.post("/homeservice", providerService.requestHomeService);

module.exports = router;