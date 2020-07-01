const router = require("express").Router();
const businessService = require("../services/businessService")

router.post("/search", businessService.searchBusiness);

module.exports = router;