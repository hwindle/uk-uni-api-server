'use strict';

const express = require('express');
const pg = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
// fetch post req.body fields as JSON
app.use(express.json());

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log('Express, Postgresql API listening port: ', PORT);
});

/***
 * ENDPOINTS
 * 
 * For university names and websites.
 */
// Home page
app.get('/', homeHandler);
// > /university CREATE (post)
app.post('/university', addUniversity);


// Show message for home
const homeHandler = (req, res) => {
  res.status(200).send('Home page');
};

// add 1 university record
const addUniversity = (req, res) => {

};