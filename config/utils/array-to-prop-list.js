// [1, 2] => [{ key: 1 }, { key: 2 }]
module.exports = (arr, prop) => {
  return arr.map((elem) => {
    return { [prop]: elem };
  });
};

