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
            .when('/list', {
                controller: 'ListController',
                templateUrl: 'list'
            })
            .otherwise({
                redirectTo: '/home'
            })
    }]);

    //首页Controller
    app.controller('HomeController', ['$scope', function($scope) {

    }]);

    //列表页Controller
    app.controller('ListController', ['$scope', '$http', function($scope, $http) {
        //数据初始化（计算、ajax）操作（$http）
        $scope.data = {};

        //数据初始化（计算、ajax）操作（$http）
        $http.jsonp('http://localhost:2080/api/music?callback=JSON_CALLBACK')
            .then(res => {
                console.log(res);
                $scope.data.list = res.data;

            });

        //行为操作初始化
        $scope.action = {};
    }]);

    app.service('padService', function() {
        this.pad = function(num, n) {
            return (Array(n).join(0) + num).slice(-n);
        }
    });

    app.filter('covertNum', ['padService', function(padService) {
        return function(num, n) {
            return padService.pad(num, n);
        }
    }]);

    app.filter('convertDuration', ['padService', function(padService) {
        return function(duration) {
            var h = Math.floor(duration / 3600);
            var m = Math.floor(duration % 3600 / 60);
            var s = Math.floor(duration % 60);
            return h ? padService.pad(h, 2) + ':' + padService.pad(m, 2) + ':' + padService.pad(s, 2) : padService.pad(m, 2) + ':' + padService.pad(s, 2);
        }
    }]);

})(angular)
