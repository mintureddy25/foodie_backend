const jwt = require('jsonwebtoken');
// const config = require('../config');

const secretKey = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, secretKey);
}

module.exports = {
  generateToken
};