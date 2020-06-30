const router = require("express").Router();
const userService = require("../services/userService")
const {processSessionToken} = require("../middleware/authMiddleware")

router.post("/provider/login", userService.authenticateProvider);
router.post("/provider/register", userService.registerProvider);
router.post("/provider/change-password", processSessionToken, userService.changeProviderPassword);
router.post("/provider/logout", userService.logout);

router.post("/customer/login", userService.customerLogin);
router.post("/customer/register", userService.registerCustomer);
router.post("/customer/logout", () => { console.log("Implementation not done") });

router.post("/admin/login", () => { console.log("Implementation not done") });
router.post("/admin/register", () => { console.log("Implementation not done") });
router.post("/admin/logout", () => { console.log("Implementation not done") });

module.exports = router;