(function(window, document) {
'use strict';
	
	var tests = [],
		lab = $LAB.setOptions({AlwaysPreserveOrder:true});

	var createTestObj = function(name) {
		return {
			id: 'testCase'+tests.length,
			name: String(name).
				replace(/&/g, '&amp;').
				replace(/</g, '&lt;').
				replace(/>/g, '&gt;').
				replace(/"/g, '&quot;')
		}
	},

	test = function(name, options) {
		
		var testObj = createTestObj(name),
			id = testObj.id;

		if (options.load) {
			for(var i = 0; i < options.load.length; i++)
				lab = lab.script(options.load[i]);
		}

		lab.wait(function() {

			var appModule = angular.module(id, []),
				fn = options.fn, 
				fnFactory = function() { return fn; }			

			if (angular.isArray(fn)) {
				appModule.factory(id + 'TestService', fn);
				fnFactory = function(injector) { return injector.get(id + 'TestService'); }
			} else {
				if (angular.isFunction(fn)) {
					var returnedFunction = fn();
					if (angular.isFunction(returnedFunction))
						fnFactory = function() { return returnedFunction; }
				} else {
					throw new Exception("Wrong test function or factory parameter");
				}
			}

			if (options.setup)
				options.setup(appModule);

			var appTemplate = options.template ? options.template : '',
				appElement = angular.element('<div id="' + testObj.id + '">' + appTemplate + '</div>'),
				appInjector = angular.bootstrap(appElement, [id]);

			if (options.html)
				document.body.appendChild(appElement[0]);

			testObj.fn = fnFactory(appInjector);
			tests.push(testObj);
		});

		return angularperf;
	},

	run = function() {
		lab.wait(function() {
			var suite = new Benchmark.Suite;

			for(var i = 0; i < tests.length; i++) {
				var testItem = tests[i];
				suite.add(testItem.name, testItem.fn);
			}
				
			suite.on('cycle', function(event) {
				var element = angular.element('<div>'+String(event.target)+'</div>');
				document.body.appendChild(element[0]);
			})
			.on('complete', function() {
				var element = angular.element('<div>Fastest is ' + this.filter('fastest').pluck('name') + '</div>');
				document.body.appendChild(element[0]);
			})
			.run({ 'async': true });

		});
	};

	angularperf = window.angularperf || (window.angularperf = {});

	angularperf.test = test;
	angularperf.run = run;

})(window, document);
