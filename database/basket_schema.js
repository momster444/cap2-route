const mongoose = require('mongoose');
const Schema = { };

Schema.createSchema = () => {
  const BascketSchema = mongoose.Schema({
    start: {
      type: mongoose.Schema.ObjectId,
      ref: 'place',
    },
    end: {
      type: mongoose.Schema.ObjectId,
      ref: 'place',
    },
    places: [{
      type: mongoose.Schema.ObjectId,
      ref: 'place',
    }],
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'user6',
    },
  });
  return BascketSchema;
};

module.exports = Schema;
