const jwt = require('jsonwebtoken');
const secretKey = 'SECRET'; 

function authenticateToken(req, res, next) {
  console.log(req.header('Authorization'))
  const token = req.header('Authorization').split(' ')[1];
  console.log('middleware',token)
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;