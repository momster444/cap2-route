const _ = require('underscore');
module.exports = (arr, prop, value) => {

  let res = _.find(arr, (elem) => {
    if (elem.toJSON) {
      elem = elem.toJSON();
    }
    val = elem[prop];
    if (val && val.toString) {
      val = val.toString();
    }
    if (value && value.toString) {
      value = value.toString();
    }
    return val == value;
  });
  return res;
};
