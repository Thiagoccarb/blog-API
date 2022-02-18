const INTERNAL_ERROR = 500;

module.exports = (err, _req, res, _next) => {
  console.error(err);
  return res.status(INTERNAL_ERROR).json({ message: err.message });
};