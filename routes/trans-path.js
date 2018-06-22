const odsay = require('odsay');
const database = require('database');
const { pickByProp } = require('config/utils');

exports.buslaneDetail = async (req, res, next) => {
  const { busID } = req.query;
  const ret = await odsay.searchBusLaneDetail({ busID });
  res.json(ret);
};

exports.buslane = async (req, res, next) => {
  const { busNo } = req.query;
  const ret = await odsay.searchBusLane({ busNo });
  res.json(ret);
};

exports.loadlane = async (req, res, next) => {
  const ret = await odsay.loadlane(req.query.mapObject);
  res.json(ret);
};
exports.searchPubTransPath = async (req, res, next) => {

  try {
    const { start, end } = req.query;
    const places = await database.PlaceModel.find({
      _id: { $in: [start, end] },
    });

    if (places.length != 2) {
      return res.json({
        error: true,
        msg: 'start or end place does not exist',
      });
    }

    console.log(places);
    const startPlace = pickByProp(places, '_id', start);
    const endPlace = pickByProp(places, '_id', end);

    const result = await odsay.searchPubTransPath({
      sx: startPlace.map_x,
      sy: startPlace.map_y,
      ex: endPlace.map_x,
      ey: endPlace.map_y,
    });

    res.json({
      result,
    });
  } catch (err) {
    console.log(err, err.stack);
    next(err);
  }
};
