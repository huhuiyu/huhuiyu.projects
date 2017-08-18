(function() {
    // 初始化应用程序
    function initApp($rootScope, $log) {
        $rootScope.AppTitle = "胡辉煜的网站";
        $rootScope.icp = AppConfig.icp;
        $log.info(AppConfig.appname, " init==>...");
        $log.debug("初始化配置：", AppConfig);
    }
    angular.element(document).ready(function() {
        // 初始化app
        var app = angular.module(AppConfig.appname);
        app.run([ "$rootScope", "$log", initApp ]);
        // 将app绑定给document元素
        angular.bootstrap(document.body, [ AppConfig.appname ]);
    });
})();