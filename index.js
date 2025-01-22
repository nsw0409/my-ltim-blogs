const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require("cors");
const dotenv = require("dotenv");
if (process.env.ENV_PROFILE !== 'development') {
    dotenv.config({ path: __dirname + `/.env.${process.env.ENV_PROFILE}` });
  } else {
    dotenv.config({ path: __dirname + "/.env" });
}
const port = process.env.PORT || 3000;
const https = require('https');
https.globalAgent.options.rejectUnauthorized = false;

const app = express();

passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  // Here you can save the user profile to your database
  return done(null, profile);
}));
// Serialize and deserialize user (required for session handling)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Initialize passport and session
app.use(require('express-session')({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());
// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('<a href="/auth/github">Login with GitHub for doing oAuth</a>');
});

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
      res.redirect('/welcome');
  }
);

app.get('/welcome', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user);
});

app.listen(port, () => { 
  console.log(`Server is running on port ${port}`);
})