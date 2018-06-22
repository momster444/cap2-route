const config = require('config/config');
const passport = require('passport');
const database = require('database');
const { Strategy: FacebookStrategy } = require('passport-facebook');

module.exports = () => {
  return new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
  }, (accessToken, refreshToken, profile, done) => {
    const options = {
      criteria: { facebook_id: profile.id },
    };

    database.UserModel.load(options, (err, user) => {
      if (err) { return done(err); }

      if (!user) {
        const user = new database.UserModel({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'facebook',
          authToken: accessToken,
          facebook: profile._json,
        });

        user.save((err) => {
          if (err) { console.log(err); }
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  });
};
