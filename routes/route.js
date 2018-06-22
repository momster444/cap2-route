const database = require('database');
const _ = require('underscore');
const {
  mergeByProp,
  arrayToPropList,
  pickByProp,
} = require('config/utils');

exports.getRoute = async (req, res, next) => {
  if (!req.user) {
    return res.end();
  }
  try {
    const route = await database.RouteModel.findOne({
      _id: req.params.routeId,
    });
    if (!route) {
      return res.json({});
    }
    let placesDetail = await database.PlaceModel.find({ _id: { $in: route.places } }, { _id: 1, title: 1, map_x: 1, map_y: 1 });
    route.places = arrayToPropList(route.places, '_id');
    mergeByProp(route.places, placesDetail, '_id');

    res.json({
      places: route.places,
    });
  } catch (err) {
    next(err);
  }
};


