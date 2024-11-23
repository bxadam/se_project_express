class FORBIDDEN extends Error {
  constructor(message) {
    super(message);
    this.name = "FORBIDDEN";
    this.statusCode = 403;
  }
}
module.exports = FORBIDDEN;
