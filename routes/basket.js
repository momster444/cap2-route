const database = require('database');
const _ = require('underscore');
const {
  mergeByProp,
  arrayToPropList,
  pickByProp,
} = require('config/utils');

exports.deletePlace = async (req, res, next) => {

  try {
    let basket = await database.BasketModel.findOne({ user_id: req.user._id }) || { places: [], start: null, end: null };
    const placeId = req.params.placeId;

    const update = { $set: { } };
    
    if (basket.start == placeId) {
      update.$set.start = null;
    }
    if (basket.end == placeId) {
      update.$set.end = null;
    }

    update.$pull = { places: placeId };

    basket = await database.BasketModel.findOneAndUpdate({
      user_id: req.user._id,
    }, update, {
      new: true,
      upsert: true,
    });

    let placesDetail = await database.PlaceModel.find({ _id: { $in: basket.places } }, { _id: 1, title: 1, map_x: 1, map_y: 1 });
    basket.places = arrayToPropList(basket.places, '_id');
    mergeByProp(basket.places, placesDetail, '_id');
    basket.start = pickByProp(basket.places, '_id', basket.start);
    basket.end = pickByProp(basket.places, '_id', basket.end);

    // attributes project
    const {
      start,
      end,
      places,
    } = basket;
    res.json({
      start,
      end,
      places,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBasket = async (req, res, next) => {

  if (!req.user) {
    return res.end();
  }
  try {
    const basket = await database.BasketModel.findOne({ user_id: req.user._id }) || { places: [], start: null, end: null };

    let placesDetail = await database.PlaceModel.find({ _id: { $in: basket.places } }, { _id: 1, title: 1, map_x: 1, map_y: 1 });
    basket.places = arrayToPropList(basket.places, '_id');
    mergeByProp(basket.places, placesDetail, '_id');

    basket.start = pickByProp(basket.places, '_id', basket.start);
    basket.end = pickByProp(basket.places, '_id', basket.end);
    const {
      start,
      end,
      places,
    } = basket;
    res.json({
      start,
      end,
      places,
    });
  } catch (err) {
    next(err);
  }
};

/*
 * @params {ObjectId || null} req.body.place
 * @params {ObjectId || null} req.body.start
 * @params {ObjectId || null} req.body.end
 */
exports.updateBasket = async (req, res, next) => {
  if (!req.user) {
    res.json({'error' : true});
    return res.end();
  }
  try {
    const update = { };
    let basket = await database.BasketModel
      .findOne({
        user_id: req.user._id,
      }) || { places: [] };
    // check place is exists
    const place = await database.PlaceModel
      .findOne({
        _id: req.body.place,
      });

    if (!place) {
      req.body.place = null;
    }
    // concat array except null
    let placesForCheck = _.compact([...basket.places, req.body.place]);
    placesForCheck = _.map(basket.places, (place) => {
      return String(place);
    });
    

    // check start is in places
    if (placesForCheck.indexOf(req.body.start) == -1) {
      req.body.start = null;
    }
    // check end is in places
    if (placesForCheck.indexOf(req.body.end) == -1) {
      req.body.end = null;
    }
    // define elem for insert
    if (req.body.place) {
      update.$addToSet = { places: req.body.place };
    }

    update.$set = { };

    // 시작점이 없으면 현재 추가할 장소를 시작점으로
    if (!basket.start) {
      update.$set.start = req.body.place;
    }
    // 시작점이 있고 도착점이 없으면 현재 추가할 장소를 도착점으로
    if (basket.start && !basket.end) {
      update.$set.end = req.body.place;
    }
    if (req.body.start) {
      update.$set.start = req.body.start;
      if (String(basket.end) === req.body.start) {
        update.$set.end = null;
      }
    }
    if (req.body.end) {
      update.$set.end = req.body.end;
      if (String(basket.start) === req.body.end) {
        update.$set.start = null;
      }
    }

    basket = await database.BasketModel
      .findOneAndUpdate({
        user_id: req.user._id,
      }, update, {
        new: true,
        upsert: true,
      });

    let placesDetail = await database.PlaceModel.find({ _id: { $in: basket.places } }, { _id: 1, title: 1, map_x: 1, map_y: 1 });
    basket.places = arrayToPropList(basket.places, '_id');
    mergeByProp(basket.places, placesDetail, '_id');
    basket.start = pickByProp(basket.places, '_id', basket.start);
    basket.end = pickByProp(basket.places, '_id', basket.end);
    // attributes project
    const {
      start,
      end,
      places,
    } = basket;
    res.json({
      start,
      end,
      places,
    });
  } catch (err) {
    next(err);
  }
};

exports.clearBasket = async (req, res, next) => {
  if (!req.user) {
    return res.end();
  }

  try {
    let basket = await database.BasketModel
      .findOneAndUpdate({
        user_id: req.user._id,
      }, {
        $set: {
          places: [],
          start: null,
          end: null,
        },
      }, {
        new: true,
        upsert: true,
      });

    const {
      start,
      end,
      places,
    } = basket;
    res.json({
      start,
      end,
      places,
    });
  } catch (err) {
    next(err);
  }
};
