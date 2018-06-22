const database = require('database');
const { Strategy: LocalStrategy } = require('passport-local');

module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  
  database.UserModel.findOne({ email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다'));
    }

    const authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
    if (!authenticated) {
      return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다'));
    }

    return done(null, user);

  });
});

