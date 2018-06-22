exports.profile = (req, res) => {
  console.dir(req.user);

  if (!req.user) {
    res.redirect('/');
  } else {
    if (Array.isArray(req.user)) {
      res.render('profile', { user: req.user[0]._doc });
    } else {
      res.render('profile', { user: req.user });
    }
  }
};
