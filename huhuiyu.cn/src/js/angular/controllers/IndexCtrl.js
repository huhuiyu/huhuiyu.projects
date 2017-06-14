(function() {
	var routeCtrollers = angular.module("routeCtrollers");
	routeCtrollers.controller("IndexCtrl", [ "$scope", "$log", IndexCtrl ]);

	function IndexCtrl($scope, $log) {
		$log.info("IndexCtrl init...");

		$scope.welcome = "胡辉煜网站";
		// 处理scope销毁
		$scope.$on("$destroy", function() {
			$log.info("IndexCtrl destroy...");
		});

	}
})();
