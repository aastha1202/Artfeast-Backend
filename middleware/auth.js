const jwt = require('jsonwebtoken');
const secretKey = 'SECRET'; 

function authenticateToken(req, res, next) {
  const token = req.header('Authorization').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;