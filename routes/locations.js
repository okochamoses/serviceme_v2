const router = require("express").Router();
const locationService = require("../services/locationService")

router.get("/states", locationService.getStates);
router.get("/states/:state/lgas", locationService.getLga);

module.exports = router;