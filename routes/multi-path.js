const database = require('database');

exports.optimalPath = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  if (!(/^[0-9A-Fa-f]+$/i.test(req.params.routeId))) {
    return res.render('notfound');
  }
  const route = await database.RouteModel.findOne({
    _id: req.params.routeId,
  });

  if (route) {
    res.render('multi_path_personal', {
      routeId: req.params.routeId,
    });
  } else {
    res.render('notfound');
  }
};

exports.multiPath = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('multi_path');
};

exports.insertRoute = async (req, res, next) => {
  if (!req.user) {
    return res.end();
  }

  const route = await database.RouteModel.findOneAndUpdate({
    places: req.body['places[]'],
  }, {
  }, {
    new: true,
    upsert: true,
  });

  const user = await database.UserModel.findOneAndUpdate({
    _id: req.user._id,
  }, {
    $addToSet: {
      routes: route._id,
    },
  });
  // claer basket
  await database.BasketModel.findOneAndDelete({
    user_id: req.user._id,
  });
  res.end();
};
    

