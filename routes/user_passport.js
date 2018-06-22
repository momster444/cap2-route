const passport = require('passport');

module.exports = (router) => {

  router.route('/login')
    .get((req, res) => {
      console.log(req.user);
      if( !req.user ) {
        res.render('login', { message: req.flash('loginMessage') }); 
      } else {
        res.redirect('/');
      }
      
    })
    .post(passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    }));

  router.route('/signup')
    .get((req, res) => {
      res.render('signup', { message: req.flash('signupMessage') });
    })
    .post(passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true,
    }));


  router.route('/logout')
    .get((req, res) => {
      req.session.destroy(function (err) {
        res.redirect('/');
      });
    });

  router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/',
    }));
};
