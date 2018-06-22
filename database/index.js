const mongoose = require('mongoose');
const config = require('config/config');

const database = { };

database.init = () => {
  return connect();
};

function connect() {

  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database.db = mongoose.connection;

    database.db.on('error', (err) => {
      console.error.bind(console, 'mongoose connection error.', err);
      reject(err);
    });
    database.db.on('open', () => {
      console.log('Database Connected. :', config.db_url);
      createSchema();
      resolve();
    });
    database.db.on('disconnected', connect);
  });
}

function createSchema() {

  config.db_schemas.forEach((curItem) => {
    const curSchema = require(curItem.file).createSchema();
    console.log('load %s. define schema.', curItem.file);

    const curModel = mongoose.model(curItem.collection, curSchema);
    console.log('define model for %s collection', curItem.collection);

    database[curItem.schemaName] = curSchema;
    database[curItem.modelName] = curModel;
  });
}

module.exports = database;
