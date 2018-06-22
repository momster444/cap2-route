require('app-module-path').addPath(__dirname + '/../../');
const graph = require('pagerank.js');
const database = require('database');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const fs = Promise.promisifyAll(require('fs'));

const pagerank = (alpha, epsilon) => {
  const nodes = [];
  let total = 0;
  return new Promise((resolve, reject) => {
    graph.rank(alpha, epsilon, (node, rank) => {
      console.log(node, rank, graph.count);
      nodes.push({ node, rank });
      total += 1;
      if (total === graph.count) {
        nodes.sort((a, b) => {
          return b.rank - a.rank;
        });
        resolve(nodes);
      }
    });
  });
};

database.init()
  .then(async () => {
    const routes = await database.RouteModel.find();

    for (let i = 0; i < routes.length; i++) {
      const places = routes[i].places;
      for (let j = 0; j < places.length - 1; j++) {
        graph.link(places[j], places[j+1], places.length - j);
      }
    }

    const nodes = await pagerank(0.85, 0.000001);

    return Promise.resolve()
      .then(() => {
        return Promise.each(nodes, (node) => {
          console.log(node.rank);
          return database.PlaceModel
            .update({ _id: mongoose.Types.ObjectId(node.node) }, {
              $set: {
                rank: node.rank,
              },
            });
        });
      });
  })
  .then(() => {
    console.log('done');
    process.exit(0);
  })
  .catch((err) => {
    console.err(err, err.stack);
  });

