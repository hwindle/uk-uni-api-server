'use strict';

const express = require('express');
const pg = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
// fetch post req.body fields as JSON
app.use(express.json());
// database client
const pgClient = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const PORT = process.env.PORT || 3003;
// only start the server if we can connect to the DB
pgClient.connect().then(() => {
  app.listen(PORT, () => {
    console.log('Express, Postgresql API listening port: ', PORT);
  });
});

// Show message for home
const homeHandler = (req, res) => {
  res.status(200).send('Home page');
};

// add 1 university record
const addUniversity = (req, res) => {
  const name = req.body.uniname;
  const website = req.body.uniwebsite;
  let INSERT = 'INSERT INTO universities (uniname, uniwebsite) VALUES ($1, $2)';
  let safeValues = [name, website];
  pgClient.query(INSERT, safeValues).then(dbResult => {
    console.log(`Inserted ${dbResult.rowCount} records. :-D`);
  }).catch(error => console.error(`Insert error: ${error}`));
  // return all data
  pgClient.query('SELECT (uniname, uniwebsite) FROM universities').then(results => {
    return res.status(200).send(results.rows);
  });
};

// return all university data from table
const fetchAllUnis = (req, res) => {
  const SQL = 'SELECT * FROM universities ORDER BY uniname DESC';
  pgClient
    .query(SQL)
    .then((results) => {
      return res.status(200).send(results.rows);
    })
    .catch((error) => console.error('Select error: ', error));
};

// delete records by uniname
const deleteByName = (req, res) => {
  const uniname = req.body.uniname;
  const SQL = 'DELETE FROM universities WHERE uniname = $1';
  let values = [uniname];
  pgClient.query(SQL, values).then(result => {
    console.log(`Delete result: ${result.rowCount}`);
  }).catch(error => console.error(`Delete err: ${error}`));
  // return all data
  pgClient.query('SELECT (uniname, uniwebsite) FROM universities').then(results => {
    return res.status(200).send(results.rows);
  });
};

/***
 * ENDPOINTS
 *
 * For university names and websites.
 */
// Home page
app.get('/', homeHandler);
// > /university CREATE (post)
app.post('/university', addUniversity);
// get all university info
app.get('/university', fetchAllUnis);
// delete all records with the exact name
app.delete('/university', deleteByName);