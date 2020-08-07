const router = require("express").Router();
const visitorService = require("../services/visitorService")

router.post("/", visitorService.addNewVisitor); // add new visitor 
router.post("/:businessId", visitorService.getVisitorsByDateRange); // Get all visitors for a profile

module.exports = router;