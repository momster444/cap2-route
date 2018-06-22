const database = require('database');
exports.mypage = async (req, res) => {

  if (!req.user) {
    return res.redirect('signup');
  }
  console.log(req.user);
  res.render('mypage', {
    routes: req.user.routes,
  });

};
