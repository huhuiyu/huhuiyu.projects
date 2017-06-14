(function() {
	var routeCtrollers = angular.module("routeCtrollers");
	routeCtrollers.controller("RouteCtrl", [ "$scope", "$log", "$routeParams",
			RouteCtrl ]);
	var key = "u/";
	var templatePath = "templates/";
	var templateExt = ".html";
	function RouteCtrl($scope, $log, $routeParams) {
		$log.info("RouteCtrl $routeParams:", $routeParams.path);

		$scope.init = function() {
			var page = $routeParams.path.replace(key, "");
			$log.info("RouteCtrl init...", page);
			$scope.template = templatePath + page + templateExt;
			$log.debug("RouteCtrl template:", $scope.template);
		};

		$scope.init();

		// 处理scope销毁
		$scope.$on("$destroy", function() {
			$log.info("RouteCtrl destroy...");
		});

	}
})();
