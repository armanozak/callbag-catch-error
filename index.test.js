const throwError = require('callbag-throw-error');
const request = require('./request');
const catchError = require('./');
const { flatten, forEach, fromIter, fromPromise, interval, map, pipe, skip, take } = require('callbag-basics');

jest.mock('./request');

test('data from pullable sources w/o errors are passed to sinks', done => {
  addHeroesPullable([1, 2, 3, 4, 5, 6, 7, 8, 9], check);

  function check(emitted) {
    expect(emitted).toEqual([
      '1 is Anakin',
      '2 is Obi-Wan',
      '3 is Yoda',
      '4 is Luke',
      '5 is Leia',
      '6 is Han',
      '7 is Chewbacca',
      '8 is C-3PO',
      '9 is R2-D2'
    ]);
    done();
  }
});

test('data from listenable sources w/o errors are passed to sinks', done => {
  addHeroesListenable(1, 9, check);

  function check(emitted) {
    expect(emitted).toEqual([
      '1 is Anakin',
      '2 is Obi-Wan',
      '3 is Yoda',
      '4 is Luke',
      '5 is Leia',
      '6 is Han',
      '7 is Chewbacca',
      '8 is C-3PO',
      '9 is R2-D2'
    ]);
    done();
  }
});

test('errors thrown by pullable sources get caught', done => {
  addHeroesPullable([0], check);

  function check(emitted) {
    expect(emitted).toEqual(['Error: 404']);
    done();
  }
});

test('errors thrown by listenable sources get caught', done => {
  addHeroesListenable(0, 1, check);

  function check(emitted) {
    expect(emitted).toEqual(['Error: 404']);
    done();
  }
});

test('pullable sources stop emitting on error', done => {
  addHeroesPullable([1, 2, 0, 3, 4], check);

  function check(emitted) {
    expect(emitted).toEqual(['1 is Anakin', '2 is Obi-Wan', 'Error: 404']);
    done();
  }
});

test('listenable sources continue emitting after error', done => {
  addHeroesListenable(0, 5, check);

  function check(emitted) {
    expect(emitted).toEqual(['Error: 404', '1 is Anakin', '2 is Obi-Wan', '3 is Yoda', '4 is Luke']);
    done();
  }
});

test('errors thrown by callbag-throw-error get caught', done => {
  pipe(
    throwError('Error'),
    catchError(err => {
      expect(err).toBe('Error');
      done();
    }),
    forEach(() => {})
  );
});

function addHeroesPullable(ids, cb) {
  const emitted = [];

  // To see if anything is emitted after an error
  setTimeout(() => cb(emitted), 0);

  pipe(
    fromIter(ids),
    map(id => fromPromise(request(`/sw/${id}`).then(({ name }) => ({ id, name })))),
    flatten,
    catchError(({ statusCode }) => emitted.push(`Error: ${statusCode}`)),
    forEach(({ id, name }) => emitted.push(`${id} is ${name}`))
  );
}

function addHeroesListenable(s, t, cb, i = 50) {
  const emitted = [];

  // To see if anything is emitted after an error
  setTimeout(() => cb(emitted), t * i * 2);

  pipe(
    interval(i),
    skip(s),
    take(t),
    map(id => fromPromise(request(`/sw/${id}`).then(({ name }) => ({ id, name })))),
    flatten,
    catchError(({ statusCode }) => emitted.push(`Error: ${statusCode}`)),
    forEach(({ id, name }) => emitted.push(`${id} is ${name}`))
  );
}
