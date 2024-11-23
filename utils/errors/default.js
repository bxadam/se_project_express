class DEFAULT extends Error {
  constructor(message) {
    super(message);
    this.name = "DEFAULT";
    this.statusCode = 500;
  }
}
module.exports = DEFAULT;
