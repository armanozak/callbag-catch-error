const catchError = fn => source => (start, sink) => {
  if (start !== 0) return;

  source(0, (type, data) => {
    type === 2 && typeof data !== 'undefined' ? fn(data) : sink(type, data);
  });
};

module.exports = catchError;
