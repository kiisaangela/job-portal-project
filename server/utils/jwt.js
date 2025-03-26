const jwt = require('jsonwebtoken');
const { ErrorResponse } = require('./errorHandler');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h' 
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ErrorResponse('Invalid or expired token', 401);
  }
};

module.exports = {
  generateToken,
  verifyToken
};
