const local_login = require('./passport/local_login');
const local_signup = require('./passport/local_signup');
const facebook = require('./passport/facebook');
const passport = require('passport');
const database = require('database');

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (userId, done) => {
    const user = await database.UserModel.findOne({
      _id: userId,
    });
    done(null, user);
  });

  passport.use('local-login', local_login);
  passport.use('local-signup', local_signup);
  passport.use('facebook', facebook());

};
