module.exports = (err, req, res, next) => {
  console.error(err);
  !err.status === 500
    ? res.status(err.status).send({ message: err.message })
    : res.status(500).send({ message: "Sorry, Internal Server Error" });
  return next(new Error("Authorization error"));
};
