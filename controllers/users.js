const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  NOT_FOUND,
  DEFAULT,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require("../utils/errors");
const JWT_SECRET = require("../utils/config");

const getUsers = (req, res) => {
  User.find()
    .then((data) => res.send({ data }))
    .catch((e) => {
      console.log(e.name);
      return res
        .status(DEFAULT)
        .send({ message: "Server Error from getUsers" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((data) => res.send({ data }))
    .catch((e) => {
      console.log(e.name);
      return res.status(DEFAULT).send({ message: "User not found" });
    });
};

const updateUser = (req, res) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true })
    .then((data) => res.send({ data }))
    .catch((e) => {
      console.log(e.name);
      if (e.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid request" });
      }
      if (e.name === "NotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(DEFAULT).send({ message: "Error, User not found" });
    }); // how do I enable validation for this request?
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      if (data === null) {
        return res
          .status(NOT_FOUND)
          .send({ message: "NOT_FOUND no data found" });
      }
      return res.send({ data });
    })
    .catch((e) => {
      console.log(e.name);
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "BAD_REQUEST Error from getUserById" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "500 Error from getUserById" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Account with Email already exists" });
      } else {
        bcrypt.hash(password, 10).then((pass) => {
          User.create({ name, avatar, email, password: pass })
            .then((data) => {
              res.send({ data });
            })
            .catch((e) => {
              console.log(e);
              if (e.name === "ValidationError") {
                return res
                  .status(BAD_REQUEST)
                  .send({ message: "Validation Error from createUser" });
              }
              return res
                .status(BAD_REQUEST)
                .send({ message: "Error from createUser" });
            });
        });
      }
    })
    .catch((e) => {
      console.log(e);
      return res.status(BAD_REQUEST).send({ message: "Error from createUser" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send(token);
    })
    .catch((e) => {
      if (e.name === "AuthenticationError") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }
      return res.status(DEFAULT).send({ message: "500 Error from login" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
