const http = require('http');

const request = function(url) {
  return new Promise(resolve => {
    http.get({ path: url }, resp => {
      let data = '';
      resp.on('data', _data => (data += _data));
      resp.on('end', () => resolve(data));
    });
  });
};

module.exports = request;
