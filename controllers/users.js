const User = require("../models/user");

const getUsers = (req, res) => {
  User.find()
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from getUser" });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      if (!data) {
        res.send({ message: "no data found" });
      }
      res.send({ data });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from getUserById" });
    });
};

const createUser = (req, res) => {
  const userInfo = req.body;
  User.create(userInfo)
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from createUser" });
    });
};

module.exports = { getUsers, getUserById, createUser };
