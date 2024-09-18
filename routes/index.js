const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res) => {
  res.status(404).send({ message: "Not found" });
  res.status(500).send({ message: "Requested resource not found" });
});

module.exports = router;