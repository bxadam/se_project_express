const ClothingItem = require("../models/clothingItem");
const { NOT_FOUND, DEFAULT, BAD_REQUEST } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user,
  })
    .then((item) => res.send(item))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Bad Request Error from createItem" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.send(items);
    })
    .catch((e) => {
      console.error(e);
      res.status(DEFAULT).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove(itemId)
    .orFail(() => {
      const error = new Error("item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then(() => res.send({ message: "Item deleted" }))
    .catch((e) => {
      console.error(e.name);
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Bad Request Error from deleteItem" });
      }
      if (e.statusCode === NOT_FOUND || e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "NOT_FOUND Error from deleteItem" });
      }
      return res.status(DEFAULT).send({ message: "Error from deleteItem" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((e) => {
      console.log(e.name);
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "NOT_FOUND Item not found" });
      }
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "BAD_REQUEST Item not found" });
      }
      if (e.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: "404 from likeItem" });
      }
      return res.status(DEFAULT).send({ message: "Error from likeItem" });
    });
};

const dislikeItem = (req, res) => {
  //configure user rights ?
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then(() => res.send({ message: "Item disliked" }))
    .catch((e) => {
      console.log(e.name);
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "BAD_REQUEST Bad Request" });
      }
      if (e.name === "DocumentNotFoundError" || e.statusCode === NOT_FOUND) {
        return res
          .status(NOT_FOUND)
          .send({ message: "NOT_FOUND Item not found" });
      }

      return res.status(DEFAULT).send({ message: "Error from dislikeItem" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
