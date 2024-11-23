class NOT_FOUND extends Error {
  constructor(message) {
    super(message);
    this.name = "NOT_FOUND";
    this.statusCode = 404;
  }
}
module.exports = NOT_FOUND;
