const express = require('express');
const cors = require("cors");
const axios = require("axios");
const blogRoutes = require('./routes/blog.routes');
const commentRoutes = require('./routes/comment.routes');
const dotenv = require("dotenv");
if (process.env.ENV_PROFILE !== 'development') {
  dotenv.config({ path: __dirname + `/.env.${process.env.ENV_PROFILE}` });
} else {
  dotenv.config({ path: __dirname + "/.env" });
}
const port = process.env.PORT || 5000;
const connectDB = require('./db');
const https = require('https');
https.globalAgent.options.rejectUnauthorized = false;

const app = express();
connectDB();
let ssn;
app.use(cors());
app.use(require('express-session')({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(express.json());
app.use('/blogs', verifyAccessToken, blogRoutes);
app.use('/comments', verifyAccessToken, commentRoutes);

// Middleware to verify access token
function verifyAccessToken(req, res, next) {
  if (ssn?.accessToken && ssn?.accessToken === req.headers['authorization']) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

app.get("/auth", (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`);
})

app.get('/getAccessToken', (req, res) => {
  const { code } = req.query;
  const params = `?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
  axios.post('https://github.com/login/oauth/access_token'+params)
    .then(response => {
      const accessToken = extractAccessToken(response.data);
      res.status(200).json({accessToken:accessToken})
    })
    .catch(error => {
      res.status(500).send('Error obtaining access token');
    });
});

function extractAccessToken(str) {
  const params = new URLSearchParams(str);
  return params.get('access_token');
}

app.get('/test', (req, res) => {
  const token = req.query.token;
  // Use the token to fetch user details from GitHub API
  axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).send('Error fetching user details');
    });
})

app.get('/welcome', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user);
});

app.get('/profile', verifyAccessToken, (req, res) => {
  res.send('in profile page')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})