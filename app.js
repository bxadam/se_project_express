import express from "express";
const app = express();
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//const express = require("express");
//why does it try to convert the above code from require to import - QF sugg.:
// File is a CommonJS module; it may be converted to an ES module.
