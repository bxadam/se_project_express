const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { NOT_FOUND } = require("../utils/errors/not-found");

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res, next) =>
  next(new NOT_FOUND("Requested resource not found."))
);

module.exports = router;
