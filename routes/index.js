const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");

router.use("/items", clothingItem);
router.use("/users", user);

router.get("/items", (req, res) => {
  res.send("Got the items");
});
router.post("/items", (req, res) => {
  res.send("posted the item");
});
router.delete("/items/:id", (req, res) => {
  res.send("item deleted");
});

router.get("/users", (req, res) => {
  res.send("users found");
});
router.get("users/:id", (req, res) => {
  res.send("user found by id");
});
router.post("/users", (req, res) => {
  res.send("user created");
});

router.use((req, res) => {
  res.status(404).send({ message: "Not found" });
  res.status(500).send({ message: "Requested resource not found" });
});

module.exports = router;
