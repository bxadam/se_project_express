const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner, likes, createdAt })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.send({ data: items });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const id = req.params.id;
  ClothingItem.findByIdAndRemove(id)
    .then(res.send({ message: "Item deleted" }))
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from deleteItem" });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );

module.exports = { createItem, getItems, deleteItem };
