const naver = require('naver');

exports.search = async (req, res, next) => {

  const { query } = req.query;
  let { page } = req.query;
  const limit = 10;

  try {
    const response = await naver.search.local({ query, page, limit });
    const items = response.data.items;
    res.render('map_search', { items, query });
  } catch (e) {
    next(e);
  }
};
