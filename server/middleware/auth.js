const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Log received headers for debugging
    console.log('Auth middleware received headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token found in request headers');
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }

    console.log('Token received, attempting verification');
    
    // Add some logging to check the JWT secret
    console.log('Using JWT_SECRET:', process.env.JWT_SECRET ? 'Secret is set' : 'No secret set!');
    
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development');
    console.log('Token verified successfully for user:', verified.id);
    
    req.user = verified;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ error: 'Token verification failed, authorization denied' });
  }
};

const employerOnly = (req, res, next) => {
  console.log('Employer check for user:', req.user);
  
  if (!req.user) {
    console.log('No user object in request');
    return res.status(403).json({ error: 'Access denied. No user found.' });
  }
  
  if (req.user.role !== 'employer') {
    console.log(`User role ${req.user.role} is not employer`);
    return res.status(403).json({ error: 'Access denied. Employers only.' });
  }
  
  console.log('User confirmed as employer, proceeding');
  next();
};

module.exports = { auth, employerOnly };
