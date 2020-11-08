const router = require("express").Router();
const visitorService = require("../services/visitorService")
const {processSessionToken} = require("../middleware/authMiddleware")

router.post("/", visitorService.addNewVisitor); // add new visitor 
router.post("/user", [processSessionToken], visitorService.getVisitorsByDateRange);
router.post("/:businessId", visitorService.getVisitorsByDateRangeAndBusinessId); // Get all visitors for a profile

module.exports = router;