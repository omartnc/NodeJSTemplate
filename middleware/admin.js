const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; 

  if (!req.user.isAdmin) return res.status(403).json('Access denied.');
    next();
  }
  catch (ex) {
    res.status(400).json('Invalid token.');
  }
}