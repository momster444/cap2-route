const axios = require('axios');
const config = require('config/config');

module.exports = ({ baseURL }) => {
  return axios.create({
    baseURL,
    headers: {
      'X-Naver-Client-Id': config.naver.clientID,
      'X-Naver-Client-Secret': config.naver.clientSecret,
    },
  });
};
