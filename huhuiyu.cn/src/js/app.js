(function() {
	// 定义应用程序和依赖模块
	var app = angular.module(AppConfig.appname, [ "ngRoute", "ngAnimate", "routeCtrollers" ]);
	// 初始化控制器
	angular.module("routeCtrollers", []);
	// 日志配置
	app.config([ "$logProvider", function($logProvider) {
		$logProvider.debugEnabled(AppConfig.debugEnabled);
	} ]);
	// 处理ajax请求
	app.config([ "$httpProvider", function($httpProvider) {
		/* post提交可以使用json数据 */
		$httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
		var parseParams = function(params) { // 参数处理
			var query = "", name, value, fullSubName, subName, subValue, innerObj, i;
			for (name in params) {
				value = params[name];
				if (value instanceof Array) {
					for (i = 0; i < value.length; i++) {
						subValue = value[i];
						fullSubName = name + "[" + i + "]";
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += parseParams(innerObj) + "&";
					}
				} else if (value instanceof Object) {
					for (subName in value) {
						subValue = value[subName];
						fullSubName = name + "[" + subName + "]";
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += parseParams(innerObj) + "&";
					}
				} else if (value !== undefined && value !== null) {
					query += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
				}
			}
			var querydata = query.length ? query.substr(0, query.length - 1) : query;
			return querydata;

		};

		$httpProvider.defaults.transformRequest = [ function(data) {
			return angular.isObject(data) && String(data) !== "[object File]" ? parseParams(data) : data;
		} ];

		/* 请求错误统一跳转到错误页面 */
		$httpProvider.interceptors.push([ "$q", "$log", "$location", function($q, $log, $location) {
			return {
				"responseError" : function(rejection) {
					$log.debug("$httpProvider===>responseError");
					$location.path("/error404");
					return $q.reject(rejection);
				}
			};
		} ]);
	} ]);

	// 配置路由
	app.config([ "$routeProvider", function($routeProvider) {
		$routeProvider.when("", {
			redirectTo : "/route/u/index"
		}).when("/", {
			redirectTo : "/route/u/index"
		}).when("/index", {
			redirectTo : "/route/u/index"
		}).when("/route/:path*", {
			templateUrl : "route.html"
		}).when("/error404", {
			templateUrl : "templates/error/404.html"
		}).otherwise({
			templateUrl : "templates/error/404.html"
		});
	} ]);
})();
