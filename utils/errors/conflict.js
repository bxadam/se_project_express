class CONFLICT extends Error {
  constructor(message) {
    super(message);
    this.name = "CONFLICT";
    this.statusCode = 409;
  }
}
module.exports = CONFLICT;
