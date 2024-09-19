const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl, likes, createdAt } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user,
    likes,
    createdAt,
  })
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
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove(itemId)
    .orFail((err) => {
      const error = new Error("item not found");
      error.name = err.name;
      throw error;
    })
    .then(() => {
      return res.send({ message: "Item deleted" });
    })
    .catch((e) => {
      console.error(e.name);
      if (e.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Bad Request Error from deleteItem" });
      } else if (e.name === "TypeError") {
        return res.status(404).send({ message: "404 Error from deleteItem" });
      }
      res.status(500).send({ message: "Error from deleteItem" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail((err) => {
      const error = new Error("item not found");
      error.name = err.name;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((e) => {
      console.log(e.name);
      if (e.name === "TypeError") {
        res.status(404).send({ message: "404 Item not found" });
      } else if (e.name === "CastError") {
        res.status(400).send({ message: "400 Item not found" });
      } else {
        res.status(500).send({ message: "Error from likeItem" });
      }
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user } },
    { new: true }
  )
    .orFail((err) => {
      const error = new Error("item not found");
      error.name = err.name;
      throw error;
    })
    .then(() => {
      return res.send({ message: "Item disliked" });
    })
    .catch((e) => {
      console.log(e.name);
      if (e.name === "CastError") {
        return res.status(400).send({ message: "400 Bad Request" });
      } else if (e.name === "TypeError") {
        return res.status(404).send({ message: "404 Item not found" });
      } else {
        return res.status(500).send({ message: "Error from dislikeItem" });
      }
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
