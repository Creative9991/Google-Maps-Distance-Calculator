const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const apiRoutes = require('./api/routes');

require('dotenv').config()

const app = express();


app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


app.use('/api/', apiRoutes);

app.use((req, res) => {
    res.status(404).send("Can't find the page you are looking for");
});


const dbURI = process.env.MONGODB_ATLAS_CONNECTION_STRING

mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology : true})
   .then((result) => console.log('Successfully established connection to MongoDB Atlas'))
   .catch((err) => console.log('Could not establish MongoDB connection. Error: ', err));


var HOST = process.env.NODE_APP_HOST || '127.0.0.1';
var PORT = process.env.NODE_APP_PORT || '3001';

var use_ssl = (typeof process.env.NODE_USE_SSL !== 'undefined' && process.env.NODE_USE_SSL === 'true') ? true : false;

var server = null;

if(use_ssl){
    server = https.createServer(app);
}else{
    server = http.createServer(app);
}

var COLOR = "\x1b[1m\x1b[35m%s\x1b[0m";

server.listen(PORT, HOST, () => {
    console.log(COLOR, require('./package.json').name + ' running at: '+ HOST + ':' + PORT);
})
