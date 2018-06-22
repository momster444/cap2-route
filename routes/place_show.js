const database = require('database');

function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $&는 일치한 전체 문자열을 의미합니다.
}

exports.place = async (req, res) => {

  const { DO='', SI='', } = req.query;
  let { contenttypeid='' } = req.query;
  let { page } = req.query;
  const states = [];
  let places = [];

  page = parseInt(page);
  if (!Number.isInteger(page)) {
    page = 1;
  }

  if (contenttypeid == '' || typeof contenttypeid != 'string') {
    contenttypeid = {
      $exists: true,
    };
  }

  if (DO !== '') {
    states.push({ address: {$regex: new RegExp(`.*${escapeRegExp(DO)}.*`)}, contenttypeid, });
  }
  if (SI !== '') {
    states.push({ address: {$regex: new RegExp(`.*${escapeRegExp(SI)}.*`)}, contenttypeid, });
  }

  console.log(page);
  let total = 0;
  try {
    if (DO !== '' || SI !== '') {
      total = await database.PlaceModel
        .find({
          $and: states,
        })
        .count();

      places = await database.PlaceModel
        .find({
          $and: states,
        })
        .sort({ rank: -1 })
        .skip((page - 1) * 10)
        .limit(10)
    }
    res.render('show_place', { places, DO, SI, contenttypeid, total });
  } catch (e) {
    next(e);
  }
};
