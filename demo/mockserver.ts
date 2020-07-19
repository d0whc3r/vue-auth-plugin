import { Request, Response } from 'express-serve-static-core';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const cors = require('cors');

const PORT = 6001;
const app = express();
const JWTSecret = 'super-secret-password';

const USER_INFO = {
  username: 'demo',
  firstName: 'User',
  lastName: 'Test',
  roles: ['ROLE_ADMIN', 'ROLE_USER'],
  email: 'demo@demo',
};

function generateToken() {
  return jwt.sign({
    sub: 'demo',
    auth: 'ROLE_ADMIN,ROLE_USER',
    exp: +new Date() + (3600 * 1000),
  }, JWTSecret);
}

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Accept-Version', 'Authorization', 'Content-Type'],
  exposedHeaders: ['Authorization'],
};
app.all('*', cors(corsOptions));
app.use(bodyParser.json());

app.post('/api/authenticate', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === 'demo' && password === 'demo') {
    const token = generateToken();
    res
      .set('Authorization', `Bearer ${token}`)
      .send({
        id_token: token,
        userInfo: USER_INFO,
      });
  } else {
    res.statusCode = 401;
    res.send({ error: 'Not logged' });
  }
});

app.get('/api/user', expressJwt({ secret: JWTSecret, algorithms: ['RS256'] }), (req: Request, res: Response) => {
  res.send(USER_INFO);
});

app.get('/api/check', expressJwt({ secret: JWTSecret, algorithms: ['RS256'] }), (req: Request, res: Response) => {
  res.send('OK!');
});

app.get('/api/refresh', expressJwt({ secret: JWTSecret, algorithms: ['RS256'] }), (req: Request, res: Response) => {
  const token = generateToken();
  res
    .set('Authorization', `Bearer ${token}`)
    .send({
      id_token: token,
    });
});

app.listen(PORT, () => {
  console.info(`Mock server listening on port ${PORT}`);
});
