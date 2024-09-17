const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner, likes, createdAt })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem" }, e);
    });
};

module.exports = { createItem };
