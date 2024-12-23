// Security
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Request limit exceeded. Activating Self-Destruct Mode.",
});
const helmet = require("helmet");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/loggers");

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
const errorHandler = require("./middlewares/error-handler");
const { validateLogin, validateUserInfo } = require("./middlewares/validation");

app.use(express.json());
app.use(cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(limiter);
app.use(helmet());

app.use(requestLogger);

app.post("/signin", validateLogin, login);
app.post("/signup", validateUserInfo, createUser);
app.get("/items", getItems);

app.use(auth);
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
