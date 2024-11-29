const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { BAD_REQUEST } = require("../utils/errors/bad-request");
const { NOT_FOUND } = require("../utils/errors/not-found");
const { UNAUTHORIZED } = require("../utils/errors/unauthorized");
const { CONFLICT } = require("../utils/errors/conflict");
const { DEFAULT } = require("../utils/errors/default");

const JWT_SECRET = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user.userId)
    .then((data) => res.send({ data }))
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(req.user.userId, { name, avatar }, { new: true })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST("Invalid data"));
      }
      if (err.name === "NotFoundError") {
        return next(new NOT_FOUND("User not found."));
      }
      return next(new DEFAULT("An error has occurred."));
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new CONFLICT("A user with that email already exists."));
      }
      return bcrypt.hash(password, 10).then((pass) => {
        User.create({ name, avatar, email, password: pass })
          .then((data) => {
            res.send({
              data: { name: data.name, avatar: data.avatar, email: data.email },
            });
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              return next(new BAD_REQUEST("Invalid data"));
            }
            return next(new DEFAULT("An error has occurred."));
          });
      });
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BAD_REQUEST("Invalid data"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({
        token,
        user: {
          name: user.name,
          _id: user._id,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.message === "Invalid email or password") {
        return next(new UNAUTHORIZED("Invalid email or password."));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
