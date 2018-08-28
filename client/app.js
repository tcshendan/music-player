;
(function(angular) {
    // 定义一个NG模块管理应用程序，第二个参数必须要传递，否则变为获取已经有的模块

    //创建模块
    var app = angular.module('musicApp', ['ngRoute']);

    //路由配置
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/home', {
                controller: 'HomeController',
                templateUrl: 'home'
            })
            .otherwise({
                redirectTo: '/home'
            })
    }]);

    //首页Controller
    app.controller('HomeController', ['$scope', function($scope) {

    }]);
})(angular)
