require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

const usersAPI = require('./components/users/usersAPI');
const guestsAPI = require('./components/guests/guestsAPI');
const settingsAPI = require('./components/settings/settingsAPI');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(process.env.CORS_WHITELIST_DOMAINS.split(',')));
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
// });

const db = process.env.DATABASE;

mongoose
  .connect(db)
  .then(() => console.log('Connected to Database'))
  .catch((err) => {
    throw new Error(err);
  });

app.use(passport.initialize());

require('./components/users/usersPassport')(passport);

app.use('/api/users', usersAPI);
app.use('/api/guests', guestsAPI);
app.use('/api/settings', settingsAPI);

app.use('/public', express.static(path.resolve(__dirname + '/public')));

app.listen(process.env.API_PORT, () => {
  console.log(`Server running on port ${process.env.API_PORT}`);
});
