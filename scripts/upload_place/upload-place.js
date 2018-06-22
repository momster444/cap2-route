require('app-module-path').addPath(__dirname + '/../../');
const database = require('database');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const ROOT = path.join(__dirname, 'data');
const res = fs.readdirSync(ROOT);

const places = [];
// wait for mongoose connection
let total = 0;
database.init()
  .then(() => {
    res.forEach((filename) => {
      const text = require(path.join(ROOT, filename));
      total += text.response.body.items.item.length;
      text.response.body.items.item.forEach((item) => {
        const categories = [];
        if (item.cat1) {
          categories.push(item.cat1);
        }
        if (item.cat2) {
          categories.push(item.cat2);
        }
        if (item.cat3) {
          categories.push(item.cat3);
        }
        if (item.mapx && item.mapy) {
          const place = {
            title: item.title,
            contentid: item.contentid,
            categories,
            contenttypeid: item.contenttypeid,
            thumbnail: item.firstimage || '',
            address: (`${item.addr1 || ''} ${item.addr2 || ''}`).trim(),
            map_x: item.mapx,
            map_y: item.mapy,
            tel: item.tel,
            zipcode: item.zipcode,
          };
          places.push(place);
        }
      });
    });
    // remove duplicated place
    const places_id = places.map((place) => {
      return place.contentid;
    });
    const unique_places = places.filter((place, index) => {
      return places_id.indexOf(place.contentid) === index;
    });
    database.PlaceModel.insertMany(unique_places, (err) => {
      if (err) {
        console.log(err, err.stack);
      }
      console.log('done');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.log(err, err.stack);
  });

