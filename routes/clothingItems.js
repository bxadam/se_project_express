const router = require("express").Router();

const { createItem } = require("../controllers/clothingItems");

router.post("/items", createItem);

module.exports = router;
