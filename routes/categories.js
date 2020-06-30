const router = require("express").Router();
const categoryService = require("../services/categoryService")
const {processSessionToken} = require("../middleware/authMiddleware")

router.get("/", categoryService.viewCategories);
router.post("/", processSessionToken, categoryService.addCategory);
router.post("/rank", processSessionToken, categoryService.rank);
router.post("/:categoryId", processSessionToken, categoryService.editCategory);
router.post("/:categoryId/enable", processSessionToken, categoryService.enableCategory);
router.post("/:categoryId/disable", processSessionToken, categoryService.disableCategory);

module.exports = router;