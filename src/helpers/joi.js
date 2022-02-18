const BAD_REQUEST = 400;

module.exports = (schema, object) => {
  const { error } = schema.validate(object);
  if (error) {
    return {
      error: {
        code: BAD_REQUEST,
        message: error.details[0].message,
      },
    };
  }
  return true;
};