module.exports = {
  server_port: 3000,
  db_url: 'mongodb://localhost:27017/local',
  db_schemas: [
    { file: './user_schema', collection: 'user6', schemaName: 'UserSchema', modelName: 'UserModel' },
    { file: './place_schema', collection: 'place', schemaName: 'PlaceSchema', modelName: 'PlaceModel' },
    { file: './route_schema', collection: 'route', schemaName: 'RouteSchema', modelName: 'RouteModel' },
    { file: './basket_schema', collection: 'basket', schemaName: 'BasketSchema', modelName: 'BasketModel' },
    { file: './odsay_trans_cache_schema', collection: 'odsay_trans_cache', schemaName: 'OdsayTransCacheSchema', modelName: 'OdsayTransCacheModel' },
    { file: './odsay_lane_cache_schema', collection: 'odsay_lane_cache', schemaName: 'OdsayLaneCacheSchema', modelName: 'OdsayLaneCacheModel' },
  ],
  route_info: [
    // { file: 파일 위치, path: url 주소, method: require 한 파일의 호출 함수, type: http request method
    { file: './index', path: '/', method: 'index', type: 'get' },
    { file: './profile', path: '/profile', method: 'profile', type: 'get' },
    { file: './map_search', path: '/search', method: 'search', type: 'get' },
    { file: './place_show', path: '/place', method: 'place', type: 'get' },
    { file: './mypage', path: '/mypage', method: 'mypage', type: 'get' },
    { file: './basket', path: '/basket', method: 'getBasket', type: 'get' },
    { file: './basket', path: '/basket', method: 'updateBasket', type: 'put' },
    { file: './basket', path: '/basket', method: 'clearBasket', type: 'delete' },
    { file: './basket', path: '/basket/places/:placeId([a-fA-F0-9]+)', method: 'deletePlace', type: 'delete' },
    { file: './trans-path', path: '/api/path', method: 'searchPubTransPath', type: 'get' },
    { file: './trans-path', path: '/api/loadlane', method: 'loadlane', type: 'get' },
    { file: './trans-path', path: '/api/buslane', method: 'buslane', type: 'get' },
    { file: './trans-path', path: '/api/buslane/detail', method: 'buslaneDetail', type: 'get' },
    { file: './multi-path', path: '/multipath', method: 'multiPath', type: 'get' },
    { file: './multi-path', path: '/multipath', method: 'insertRoute', type: 'put' }, 
    { file: './multi-path', path: '/multipath/:routeId', method: 'optimalPath', type: 'get' },
    { file: './route', path: '/route/:routeId', method: 'getRoute', type: 'get' },
  ],
  facebook: {   // passport facebook
    clientID: '1324546257646655',
    clientSecret: '590bc628b1b74e34884efc0d900b7446',
    callbackURL: 'http://163.239.76.223:3000/auth/facebook/callback'
  },
  naver: {
    clientID: 'gJi6K6gxMoZR0afjll8I',
    clientSecret: '3hRh53g9Mq',
    search: {
      baseURL: 'https://openapi.naver.com/v1/search',
    },
  },
  odsay: {
    apiKey: 'TcwVYaSDsWVrQzaBoYuaiF/M4M0j8lA35OT5Dbp1Mn0',
    baseURL: 'https://api.odsay.com/v1/api',
  },
};
