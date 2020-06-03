const router = require("express").Router();
const userService = require("../services/userService")

router.post("/provider/login", userService.authenticateProvider);
router.post("/provider/register", userService.registerProvider);
router.post("/provider/logout", userService.logout);

router.post("/customer/login", () => { console.log("Implementation not done") });
router.post("/customer/register", () => { console.log("Implementation not done") });
router.post("/customer/logout", () => { console.log("Implementation not done") });

router.post("/admin/login", () => { console.log("Implementation not done") });
router.post("/admin/register", () => { console.log("Implementation not done") });
router.post("/admin/logout", () => { console.log("Implementation not done") });

module.exports = router;