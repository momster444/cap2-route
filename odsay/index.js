const axios = require('axios');
const config = require('config/config');
const database = require('database');
const instance = axios.create({
  baseURL: config.odsay.baseURL,
  params: {
    apiKey: config.odsay.apiKey,
  },
});

exports.searchBusLaneDetail = async({ busID }) => {
  response = await instance.get('/busLaneDetail', {
    params: {
      busID,
    },
  });
  response = response.data;
  return response;
};

exports.searchBusLane = async({ busNo }) => {
  response = await instance.get('/searchBusLane', {
    params: {
      busNo,
    },
  });
  response = response.data;
  return response;
};

// start place objectId, end place objectId
exports.searchPubTransPath = async ({ sx, sy, ex, ey }) => {
  try {
    let response = await database.OdsayTransCacheModel.findOne({sx, sy, ex, ey });
    console.log('response', response);
    if (!response) {
      response = await instance.get('/searchPubTransPath', {
        params: {
          SX: sx,
          SY: sy,
          EX: ex,
          EY: ey,
        },
      });
      response = response.data;
    }

    await database.OdsayTransCacheModel.findOneAndUpdate({
      sx, sy, ex, ey,
    }, {
      $set: {
        result: response.result,
      },
    }, {
      upsert: true,
    });
    return response.result;
  } catch (err) {
    console.log(err, err.stack);
    throw err;
  }
};

exports.loadlane = async (mapObject) => {
  mapObject = '0:0@' + mapObject;
  try {
    let response = await database.OdsayLaneCacheModel.findOne({ mapObject });
    if (!response) {
      response = await instance.get('/loadLane', {
        params: { mapObject },
      });
      response = response.data;
    }
    await database.OdsayLaneCacheModel.findOneAndUpdate({
      mapObject,
    }, {
      $set: {
        result: response.result,
      },
    }, {
      upsert: true,
    });
    return response.result;
  } catch (e) {
    throw err;
  }
};
