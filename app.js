require('app-module-path').addPath('./');
process.on('uncaughtException', (err) => {
  console.log('uncaughtException : ', err);
  console.log(err.stack);
});
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const static = require('serve-static');

const expressErrorHandler = require('express-error-handler');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);

const config = require('config/config');

const database = require('database');

const routeLoader = require('routes/route_loader');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || config.server_port);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
  store: new FileStore(),
  secret: 'QNpZxvhtpskitUg6dLDjQpPg',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const configPassport = require('config/passport');
configPassport(app, passport);

/* set naver clientID */

app.use((req, res, next) => {
  res.locals.naverClientID = config.naver.clientID;
  res.locals.user = req.user;
  next();
});

const router = express.Router();
routeLoader.init(app, router);

const userPassport = require('routes/user_passport');
userPassport(router);

const server = http.createServer(app);
const errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html',
    '500': './public/500.html',
  },
  server,
});

app.use(expressErrorHandler.httpError(404));

app.use((err, req, res, next) => {
  console.log(err, err.stack);
  res.send(err.stack);
});

app.use(errorHandler);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache', false);

server.listen(app.get('port'), () => {
  console.log('Server Start. port: ' + app.get('port'));

  database.init();
});



