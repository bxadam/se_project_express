const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST } = require("../utils/errors/bad-request");
const { NOT_FOUND } = require("../utils/errors/not-found");
const { FORBIDDEN } = require("../utils/errors/forbidden");
const { DEFAULT } = require("../utils/errors/default");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user.userId,
  })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST("Invalid data"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => {
      res.send(items);
    })
    .catch((err) => next(err));
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail(() => next(new DEFAULT("An unknown error has occurred.")))
    .then((item) => {
      if (item.owner.toString() !== req.user.userId) {
        return next(new FORBIDDEN("Authorization Required"));
      }
      return ClothingItem.findByIdAndRemove(itemId);
    })
    .then(() => res.send({ message: "Item deleted" }))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Invalid data"));
      }
      if (
        err.statusCode === NOT_FOUND ||
        err.name === "DocumentNotFoundError"
      ) {
        return next(new NOT_FOUND("Not found. Please adjust and try again."));
      }
      if (err.statusCode === FORBIDDEN) {
        return next(new FORBIDDEN("Authorization Required"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user.userId } },
    { new: true }
  )
    .orFail(() => next(new DEFAULT("An unknown error has occurred.")))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NOT_FOUND("Not found. Please adjust and try again."));
      }
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Invalid data"));
      }
      if (err.statusCode === NOT_FOUND) {
        return next(new NOT_FOUND("Not found. Please adjust and try again."));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user.userId } },
    { new: true }
  )
    .orFail(() => next(new DEFAULT("An unknown error has occurred.")))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BAD_REQUEST("Invalid data"));
      }
      if (
        err.name === "DocumentNotFoundError" ||
        err.statusCode === NOT_FOUND
      ) {
        return next(new NOT_FOUND("Not found. Please adjust and try again."));
      }

      return next(err);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
