const mongoose = require('mongoose');
const Schema = { };

Schema.createSchema = () => {
  const PlaceSchema = mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    map_x: {
      type: Number,
      required: true,
    },
    map_y: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    categories: {
      type: [String],
      required: false,
    },
    contentid: {
      type: String,
      required: true,
      unique: true,
    },
    contenttypename: {
      type: String,
      get: function(value) {
        if (value) {
          return value;
        } else {
          switch (this.contenttypeid) {
            case '12':
              return '관광지';
            case '14':
              return '문화시설';
            case '15':
              return '축제';
            case '28':
              return '레포츠';
            case '32':
              return '숙박';
            case '38':
              return '쇼핑';
            case '39':
              return '음식점';
            default:
              return '';
          }
        }
      },
    },
    contenttypeid: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    map_x: {
      type: Number,
      required: true,
    },
    map_y: {
      type: Number,
      required: true,
    },
    tel: {
      type: String,
      required: false,
    },
    zipcode: {
      type: String,
      required: false,
    },
  });

  return PlaceSchema;
};

module.exports = Schema;
