const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const cors = require('cors');

const PORT = 6001;
const app = express();
const JWTSecret = 'super-secret-password';
const token = jwt.sign({
  sub: 'demo',
  auth: 'ROLE_ADMIN,ROLE_USER',
  exp: +new Date() + (3600 * 1000),
}, JWTSecret);

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Accept-Version', 'Authorization', 'Content-Type'],
  exposedHeaders: ['Authorization'],
};
app.all('*', cors(corsOptions));

app.post('/api/authenticate', (req, res) => {
  res
    .set('Authorization', `Bearer ${token}`)
    .send({
      id_token: token,
    });
});

app.get('/api/user', expressJwt({ secret: JWTSecret }), (req, res) => {
  res.send(req.user);
});

app.get('/api/check', expressJwt({ secret: JWTSecret }), (req, res) => {
  res.send('OK!');
});

app.listen(PORT, () => {
  console.log(`Mock server listening on port ${PORT}`);
});
