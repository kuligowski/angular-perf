(function(window, document) {
'use strict';
	
	var tests = [],
		lab = $LAB.setOptions({AlwaysPreserveOrder:true});

	var test = function(name, options) {
		
		if (options.load) {
			for(var i = 0; i < options.load.length; i++)
				lab = lab.script(options.load[i]);
		}

		lab.wait(function() {
			var element = angular.element('<div id="'+name+'">'+((options.template) ? options.template : '') +'</div>');
			document.body.appendChild(element[0]);

			var app = angular.module(name, []);
			if (options.setup)
				options.setup(app);
			app.factory(name+'TestService', options.test);
			var injector = angular.bootstrap(element, [name]);
			tests.push({
				name: name, 
				fn: injector.get(name+'TestService')
			});
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
