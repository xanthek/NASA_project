const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api.js');

const API_VERSION = process.env.API_VERSION || 'v1';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));

app.use(`/${API_VERSION}`,api)

app.get('/*',(req,res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

module.exports = app;