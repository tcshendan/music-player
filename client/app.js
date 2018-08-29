;
(function(angular) {
    // 定义一个NG模块管理应用程序，第二个参数必须要传递，否则变为获取已经有的模块

    //创建模块
    var app = angular.module('musicApp', ['ui.router']);

    //路由配置
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home',
                controller: 'HomeController'
            })
            .state('list', {
                url: '/list',
                templateUrl: 'list',
                controller: 'ListController'
            })
            .state('item', {
                url: '/item/:id', //：id定义参数；定义方式三种 1./page1/：id/：name 2./page1/{id}/{name}/ 3./page1?id&name 在跳转页面用$stateParams接收
                templateUrl: 'item',
                controller: 'ItemController'
            });
    }]);

    //首页Controller
    app.controller('HomeController', ['$scope', function($scope) {

    }]);

    //列表页Controller
    app.controller('ListController', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        //数据初始化（计算、ajax）操作（$http）
        $scope.data = {};

        //数据初始化（计算、ajax）操作（$http）
        $http.jsonp('http://localhost:2080/api/music?callback=JSON_CALLBACK')
            .then(res => {
                console.log(res);
                $scope.data.list = res.data;
                $rootScope.total = res.data.length;
            });

        //行为操作初始化
        $scope.action = {};
    }]);

    //详情页Controller
    app.controller('ItemController', ['$rootScope', '$scope', '$http', '$state', '$stateParams', function($rootScope, $scope, $http, $state, $stateParams) {
        window.audio && window.audio.pause()
        window.audio = new Audio()

        $scope.item = {};
        $scope.duration = 0;
        $scope.current = 0;
        $scope.playing = false;

        $http.jsonp('http://localhost:2080/api/music/' + $stateParams.id + '?callback=JSON_CALLBACK')
            .then(res => {
                console.log(res);

                $scope.item = res.data;

                audio.src = $scope.item.music;
                audio.autoplay = true;

                audio.addEventListener('loadedmetadata', () => {
                    $scope.duration = audio.duration;
                    $scope.$apply();
                });

                audio.addEventListener('timeupdate', () => {
                    $scope.current = audio.currentTime;
                    $scope.$apply();
                });

                audio.addEventListener('playing', () => {
                    $scope.playing = true;
                    $scope.$apply();
                });

            });

        $scope.action = {};

        $scope.action.progress = function() {
            audio.currentTime = $scope.current;
        }

        $scope.action.play = function() {
            $scope.playing ? audio.pause() : audio.play();
            $scope.playing = !$scope.playing;
        }

        $scope.action.prev = function() {
            let id = parseInt($stateParams.id) - 1;

            if (id < 1) {
                id = $rootScope.total;
            }

            $state.go('item', {
                id: id
            });
        }

        $scope.action.next = function() {
            let id = parseInt($stateParams.id) + 1;

            if (id > $rootScope.total) {
                id = 1;
            }

            $state.go('item', {
                id: id
            });
        }
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
