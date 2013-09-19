#angular-perf

Benchmark.js wrapper to test AngularJS performance.

##Usage

```js
angularperf.

test('angular#lowercase', {
	fn: ['$filter', function($filter) {
		var lowercaseFilter = $filter('lowercase');
		return function() {
			lowercaseFilter('aBcDfFg');
		}
	}]
}).

test('js#lowercase', {
	fn: function() {
		'aBcDfFg'.toLowerCase();
	}
}).

run();
```

```text
angular#lowercase x 14,024,885 ops/sec ±1.74% (82 runs sampled)
js#lowercase x 18,152,332 ops/sec ±1.84% (84 runs sampled)
Fastest is js#lowercase
```
