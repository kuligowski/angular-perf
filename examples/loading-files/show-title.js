angular.module('showTitle', ['config']).

directive('showTitle', ['config', function(config) {
	return {
		restrict: 'A',
		$scope: true,
		template: '<div>{{title}}</div>',
		link: function($scope, $element) {
			$scope.title = config.title;
		}
	}
}]);