const config = require('config/config');

const routerLoader = { };

routerLoader.init = (app, router) => {
  return initRoutes(app, router);
};

function initRoutes(app, router) {
  config.route_info.forEach((curItem) => {
    const curModule = require(curItem.file);
    if (curItem.type === 'get') {
      router.route(curItem.path).get(curModule[curItem.method]);
    } else if (curItem.type === 'post') {
      router.route(curItem.path).post(curModule[curItem.method]);
    } else if (curItem.type === 'put') {
      router.route(curItem.path).put(curModule[curItem.method]);
    } else if (curItem.type === 'delete') {
      router.route(curItem.path).delete(curModule[curItem.method]);
    }

    console.log('route module %s', curItem.method);
  });

  app.use('/', router);

}

module.exports = routerLoader;
