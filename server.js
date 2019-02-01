const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users-db', {
  useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
});

db.once('open', () => {
  console.log('Database Connection Established')
});

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-type,Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'DELETE', 'GET');
    return res.status(200).json();
  }
  next();
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
      res.status(401).json(err);
  }
  else {
      next(err);
  }
});

const userRoute = require('./api/routes/user');
app.use('/api/users/v1', userRoute)

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});


