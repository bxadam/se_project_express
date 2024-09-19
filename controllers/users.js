const User = require("../models/user");

const getUsers = (req, res) => {
  User.find()
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.log(e.name);
      if (e.name === "CastError") {
        return res.status(400).send({ message: "400 Error from getUsers" });
      } else if (e.name === 404) {
        return res.status(404).send({ message: "404 Error from getUsers" });
      }
      res.status(500).send({ message: "Server Error from getUsers" });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      if (!data || data === null) {
        return res.status(404).send({ message: "404 no data found" });
      }
      res.send({ data });
    })
    .catch((e) => {
      console.log(e.name);
      if (e.name === "CastError") {
        return res.status(400).send({ message: "400 Error from getUserById" });
      }
      res.status(500).send({ message: "404 Error from getUserById" });
    });
};

const createUser = (req, res) => {
  const userInfo = req.body;
  User.create(userInfo)
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.log(e);
      if (e.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Validation Error from createUser" });
      }
      res.status(400).send({ message: "Error from createUser" });
    });
};

module.exports = { getUsers, getUserById, createUser };
