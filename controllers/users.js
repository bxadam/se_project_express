const User = require("../models/user");

const getUsers = (req, res) => {
  console.log(req.user);
  User.find()
    .then((data) => {
      res.send({ data: data });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from getUser" });
    });
};

const getUserById = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((data) => {
      if (!data) {
        res.send(Error); // need fix
      }
      res.send({ data: data });
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
      res.send({ data: data });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from createUser" });
    });
};

module.exports = { getUsers, getUserById, createUser };
