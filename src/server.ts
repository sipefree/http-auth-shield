import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import path from 'path';
import { EnvironmentBuilder } from '@hexlabs/env-vars-ts';
import morgan from 'morgan';

const MemoryStore = require('memorystore')(session)

// Load environment variables
const env = EnvironmentBuilder.create(
  'LOGIN_USER',
  'LOGIN_PASS',
  'PROXY_DST',
  'PORT',
  'TITLE'
)
  .transform((num: string) => parseInt(num), 'PORT')
  .defaults({ PORT: 3000, TITLE: 'HTTP Auth Shield' })
  .environment(process.env)

declare module 'express-session' {
  interface SessionData {
    loggedIn: boolean;
  }
}

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates'));

// Set up the session middleware
app.use(session({
  cookie: { maxAge: 86400000 },
  secret: 'keyboard cat', // For production apps, consider a secure, unique secret
  resave: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  saveUninitialized: false
}));

app.use((req, res, next) => {
  if (req.session.loggedIn || req.path === '/favicon.ico') {
    next();
  } else if (req.path === '/login' && req.method === 'POST') {
    const redirectUrl = req.query.redirect?.toString() || '/';

    if (req.body.username === env.LOGIN_USER && req.body.password === env.LOGIN_PASS) {
      console.log('User has logged in.');
      req.session.loggedIn = true;
      res.redirect(redirectUrl);
    } else {
      console.log('Incorrect login attempt.');
      res.status(401).render('login', { title: env.TITLE, error_message: 'Incorrect username or password', redirect: redirectUrl });
    }
  } else {
    res.status(401).render('login', { title: env.TITLE, error_message: null, redirect: req.originalUrl });
  }
});

app.use('/', createProxyMiddleware({ target: env.PROXY_DST, changeOrigin: true, ws: true }));

app.listen(env.PORT, () => {
  console.log('HTTP Auth Shield is running on port ' + env.PORT);
});

