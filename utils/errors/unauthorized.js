class UNAUTHORIZED extends Error {
  constructor(message) {
    super(message);
    this.name = "UNAUTHORIZED";
    this.statusCode = 401;
  }
}

module.exports = UNAUTHORIZED;
