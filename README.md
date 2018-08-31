# callbag-catch-error

Callbag operator to catch errors thrown by pullable or listenable sources.

- Handles errors when fetching data, working with promises, etc.
- Proves useful while consuming sources with [callbag-for-each](https://github.com/staltz/callbag-for-each) or [callbag-iterate](https://github.com/staltz/callbag-iterate) by André Staltz.
- Works well with [callbag-throw-error](https://github.com/Andarist/callbag-throw-error) by Mateusz Burzyński.

If you wonder what this is all about, you should definitely check out the awesome [Callbag standard](https://github.com/callbag/callbag) for reactive and iterable programming.

.

## Example 1: Pullable stream

```js
const { flatten, fromIter, fromPromise, map, pipe } = require('callbag-basics');
const iterate = require('callbag-iterate');
const fetch = require('isomorphic-unfetch');
const catchError = require('./');

pipe(
  fromIter([0, 1]),
  map(n => `https://swapi.co/api/people/${n}`),
  map(url =>
    fetch(url).then(resp => {
      if (!resp.ok) {
        throw new Error('404 Not Found');
      }

      return resp.json();
    })
  ),
  map(request => fromPromise(request)),
  flatten,
  catchError(err => console.log(err.message)),
  iterate(data => console.log(data.name))
);

/*

Logs the following:
- 404 Not Found

*/
```

.

## Example 2: Listenable stream

```js
const { flatten, forEach, fromPromise, interval, map, pipe, take } = require('callbag-basics');
const fetch = require('isomorphic-unfetch');
const catchError = require('callbag-catch-error');

pipe(
  interval(10000),
  take(2),
  map(n => `https://swapi.co/api/people/${n}`),
  map(url =>
    fetch(url).then(resp => {
      if (!resp.ok) {
        throw new Error('404 Not Found');
      }

      return resp.json();
    })
  ),
  map(request => fromPromise(request)),
  flatten,
  catchError(err => console.log(err.message)),
  forEach(data => console.log(data.name))
);

/*

Logs the following:
- 404 Not Found
- Luke Skywalker

*/
```
