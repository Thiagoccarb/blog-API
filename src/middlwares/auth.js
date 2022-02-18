const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const REQUIRED_TOKEN = 'Token not found';
const INVALID_TOKEN = 'Expired or invalid token';

const UNAUTHORIZED = 401;

module.exports = async (req, res, next) => {
  try {
    const { headers: { authorization: token } } = req;
    if (!token) {
      return res.status(UNAUTHORIZED).json({ message: REQUIRED_TOKEN });
    }
    jwt.verify(token, JWT_SECRET);
    const { email } = jwt.decode(token);
    req.user = email;
    next();
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: INVALID_TOKEN });
  }
};