const employerAuth = (req, res, next) => {
  // User will be set by the auth middleware
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Access denied. Only employers can perform this action.' });
  }

  next();
};

module.exports = employerAuth;
