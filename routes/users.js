const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateId, validateUserUpdate } = require("../middlewares/validation");

router.get("/me", validateId, getCurrentUser);
router.patch("/me", validateUserUpdate, updateUser);

module.exports = router;
