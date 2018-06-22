exports.index = (req, res) => {
  console.dir(req.user);

  if (!req.user) {
    res.render('index', {
      login_success: false,
      DO: '',
      SI: '',
    });
  } else {
    res.render('index', {
      login_success: true,
      DO: '',
      SI: '',
    });
  }
};
