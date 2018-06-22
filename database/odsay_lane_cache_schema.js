const mongoose = require('mongoose');
const Schema = { };

Schema.createSchema = () => {
  const OdsayLaneCacheSchema = mongoose.Schema({
    mapObject: {
      type: String,
    },
    result: {
      type: Object,
    }
  });

  return OdsayLaneCacheSchema;
};

module.exports = Schema;
