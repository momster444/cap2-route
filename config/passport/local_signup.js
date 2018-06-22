const { Strategy: LocalStrategy }  = require('passport-local');
const database = require('database');

module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  const paramName = req.body.name || req.query.name;

  database.UserModel.findOne({ email }, (err, user) => {
    if (err) { return done(err); }

    if (user) {
      return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다'));
    } else {
      const user = new database.UserModel({ email, password, name: paramName });
      user.save((err) => {
        if (err) { return done(err); }
        return done(null, user);
      });
    }
  });
});
