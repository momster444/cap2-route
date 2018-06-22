const instance = require('naver/instance');
const config = require('config/config');

const nInstance = instance({ baseURL: config.naver.search.baseURL });
exports.local = async ({ query='', page=1, limit=10 }) => {

  page = parseInt(page);
  if (!Number.isInteger(page)) {
    page = 1;
  }

  let response = { data: { items: [] } };
  if (query !== '') {
    response = await nInstance.get('/local.json', {
      params: {
        query,
        display: limit,
        start: (page - 1) * limit + 1,
      }
    });
  }
  return response;
};
