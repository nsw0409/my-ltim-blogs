const express = require('express');
const axios = require('axios');
const cors = require("cors");
const WebSocket = require('ws');
const socketServer = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT || 3001 });
const dotenv = require("dotenv");
if (process.env.ENV_PROFILE !== 'development') {
    dotenv.config({ path: __dirname + `/.env.${process.env.ENV_PROFILE}` });
  } else {
    dotenv.config({ path: __dirname + "/.env" });
}
const port = process.env.PORT || 3000;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
if(process.env.NODE_ENV === 'development'){
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    })
    axios.defaults.httpsAgent = httpsAgent;
    console.log(process.env.NODE_ENV, `RejectUnauthorized is disabled.`)
}

socketServer.on('connection', socket => {
  socket.send(clientID);
  socket.on('message', message => {
    // console.log(`Received message: ${message}`);
  });
  socket.on('close', () => {
    // console.log('Client disconnected');
  });
});

app.get('/',(req,res)=>{
    res.sendFile('./index.html');
})

app.get('/auth/callback', (req, res) => {
    const requestToken = req.query.code;
    axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      headers: {
        accept: 'application/json'
      }
    }).then((response) => {
        const accessToken = response.data.access_token;
        res.redirect(`/welcome.html?code=${accessToken}`);
    })
})

app.listen(port, () => { 
    console.log(`Server is running on port ${port}`); 
});