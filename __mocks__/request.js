const sw = {
  1: { name: 'Anakin' },
  2: { name: 'Obi-Wan' },
  3: { name: 'Yoda' },
  4: { name: 'Luke' },
  5: { name: 'Leia' },
  6: { name: 'Han' },
  7: { name: 'Chewbacca' },
  8: { name: 'C-3PO' },
  9: { name: 'R2-D2' }
};

const request = function(url) {
  return new Promise((resolve, reject) => {
    const id = parseInt(url.substr('/sw/'.length), 10);
    process.nextTick(() => (sw[id] ? resolve(sw[id]) : reject({ statusCode: 404 })));
  });
};

module.exports = request;
