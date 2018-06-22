require('app-module-path').addPath(__dirname + '/../../');
const database = require('database');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const mongoose = require('mongoose');
mongoose.Promise = Promise;

require('require.async')(require);
const requireAsync = require.async;
require.async = (path) => new Promise(resolve => {
  requireAsync(path, info => resolve(info));
});

const ROOT = path.join(__dirname, 'route');


const routes = [];

database.init()
  .then(() => {
  return Promise
    .each(fs.readdirAsync(ROOT), async (filename) => {
      const content = await require.async(path.join(ROOT, filename));
      const items = content.response.body.items.item;
      if (!Array.isArray(items)) {
        return Promise.resolve();
      }
      return Promise
        .map(items, async (place) => {
          const contentid = place.subcontentid;
          place = await database.PlaceModel.findOne({ contentid });
          return place && place._id;
        })
        .then((places) => {
          console.log('35', places);
          return Promise.filter(places, (place) => {
            return place;
          });
        })
        .then((placeIds) => {
          console.log('41',placeIds);
          return database.RouteModel.create({ places: placeIds });
        });
    })
    .then(() => {
      console.log('done');
      process.exit(0);
    })
    .catch((err) => {
      console.log(err, err.stack);
      throw err;
    });
  });
