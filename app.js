const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;
const { login, createUser } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

const routes = require("./routes");
const auth = require("./middlewares/auth");

app.use(express.json());
app.use(cors());

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getItems);

app.use(auth);
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
