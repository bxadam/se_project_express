const router = require("express").Router();

const { getUsers, getUserById, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);

module.exports = router;
