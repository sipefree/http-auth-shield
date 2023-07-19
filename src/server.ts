import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import path from 'path';

// Load environment variables
const LOGIN_USER = process.env.LOGIN_USER;
const LOGIN_PASS = process.env.LOGIN_PASS;
const PROXY_DST = process.env.PROXY_DST;

declare module 'express-session' {
  export interface SessionData {
    loggedIn: boolean;
  }
}

const app = express();

// Define the middleware to parse the body of HTTP requests
app.use(bodyParser.urlencoded({ extended: false }));

// Set up the session middleware
app.use(session({
  secret: 'secret-key', // For production apps, consider a secure, unique secret
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  if (req.session.loggedIn) {
    // User is logged in, proceed to the next middleware
    next();
  } else if (req.path === '/login' && req.method === 'POST') {
    // User is attempting to log in
    if (req.body.username === LOGIN_USER && req.body.password === LOGIN_PASS) {
      // User has provided correct credentials, log them in
      req.session.loggedIn = true;
      res.redirect('/'); // Redirect to the homepage
    } else {
      // User has provided incorrect credentials, show the login form again
      res.status(401).send(renderLoginPage('Incorrect username or password'));
    }
  } else {
    // User is not logged in, show the login form
    res.status(401).send(renderLoginPage());
  }
});

// Middleware for proxying the requests
app.use('/', createProxyMiddleware({ target: PROXY_DST, changeOrigin: true }));

app.listen(3000, () => {
  console.log('HTTP Auth Shield is running on port 3000');
});

function renderLoginPage(errorMessage?: string): string {
  const loginTemplate = fs.readFileSync(path.join(__dirname, '../templates/login.html'), 'utf-8');
  return errorMessage ? loginTemplate.replace('<!-- ERROR_MESSAGE -->', `<p>${errorMessage}</p>`) : loginTemplate;
}
