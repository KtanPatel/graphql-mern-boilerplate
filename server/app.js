var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const _ = require('lodash');

const graphqlHttp = require('express-graphql');

var indexRouter = require('./routes/index');

const graphqlResolver = require('./graphql/resolvers');
const graphqlSchema = require('./graphql/schema');

// config variables
const config = require('./config/config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';

const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// global config 
global.gConfig = finalConfig;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(auth.authentication);
// graphql
app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true
}));

// mongoDB Connection
mongoose.connect(global.gConfig.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.info(`DB connected Successfully on ${global.gConfig.URI}`);
  })
  .catch(() => {
    console.error('DB connection failed');
  })


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
