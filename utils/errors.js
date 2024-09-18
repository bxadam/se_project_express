const notFound = 404;
const internalServerError = 500;
const unAuthorized = 401;
const badRequest = 400;

const findError = (Error) => {
  if (Error === "Bad Request") {
    return badRequest;
  } else if (Error === "Not Found") {
    return notFound;
  } else if (Error === "Unauthorized") {
    return unAuthorized;
  } else {
    return internalServerError;
  }
};

module.exports = { findError };
