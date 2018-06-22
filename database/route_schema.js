const mongoose = require('mongoose');
const Schema = { };

Schema.createSchema = () => {
  const RouteSchema = mongoose.Schema({
    places: [{
      type: mongoose.Schema.ObjectId,
      ref: 'place',
    }],
    is_shared: {
    	type: Boolean
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'user6',
    },
    created_at: {
      type: Date,
      index: {
        unique: false,
      },
      default: Date.now,
    },
  });

  return RouteSchema;
};

module.exports = Schema;
