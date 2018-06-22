const mongoose = require('mongoose');
const Schema = { };

Schema.createSchema = () => {
  const OdsayTransCacheSchema = mongoose.Schema({
    sx: {
      type: Number,
    },
    sy: {
      type: Number,
    },
    ex: {
      type: Number,
    },
    ey: {
      type: Number,
    },
    result: {
      type: Object,
    },
  });

  return OdsayTransCacheSchema;
};

module.exports = Schema;
    
