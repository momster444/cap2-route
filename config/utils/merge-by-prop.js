const _ = require('underscore');
module.exports = (arr1, arr2, prop) => {
  _.each(arr2, function(arr2obj) {
    var arr1obj = _.find(arr1, function(arr1obj) {
      let key1 = arr1obj[prop];
      let key2 = arr2obj[prop];
      if (key1.toString) {
        key1 = key1.toString();
      }
      if (key2.toString) {
        key2 = key2.toString();
      }
      return key1 === key2;
    });

    //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
    arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
  });
}
