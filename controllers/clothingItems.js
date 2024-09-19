const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner, likes, createdAt })
    .then((item) => {
      res.send(item);
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Bad Request Error from createItem" });
      }
      res.status(500).send({ message: "Server Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.send(items);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { id } = req.params;
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
  )
    .then(res.send({ message: "Item liked" }))
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from likeItem" });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then(res.send({ message: "Item disliked" }))
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from dislikeItem" });
    });

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
