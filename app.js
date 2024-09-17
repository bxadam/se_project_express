const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: "66e9c5de563a63b079950b87",
  };
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
