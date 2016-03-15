
/*
* BBH App
*/

(function(w,d,n,ng,ns) {

    'use strict';

    var app = ng.module(ns /* module name */,
                       [ns + '.controllers',
                        ns + '.services',
                        ns + '.filters',
                        'ngRoute'] /* module dependencies */);

    app.config(['$routeProvider', function( $routeProvider ){

        /*
        * Homepage
        */
        $routeProvider.when('/', {});

        /*
        * About
        */
        $routeProvider.when('/about', {});

        /*
        * Support us
        */
        $routeProvider.when('/support-us', {});

        /*
        * Login
        */
        $routeProvider.when('/login', {});

        /*
        * Specific chapter route
        */
        $routeProvider.when('/chapter/:chapter/:page', {});

        /*
        * Specific chapter route (fullscreen mode)
        */
        $routeProvider.when('/chapter/:chapter/:page/:photo', {});

        /*
        * Default root - goes back to the homepage
        */
        $routeProvider.otherwise({redirectTo: '/'});

    }]);

    app.run(['$timeout', '$rootScope', '$http', '$location', '$route', 'animLoop', 'windowResizer',
        function($timeout, $rootScope, $http, $location, $route, animLoop, windowResizer) {

        /*
        * Update the $location.path function to accept a second param representing whether the page refreshes or not.
        */
        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };

        // Scroll the window to the top
        setTimeout(function(){
           window.scrollTo(0, 1);
        }, 0);

        // Initialise our animLoop service, and add our TWEEN loop
        animLoop.setFPS(60);
        animLoop.add('tween', TWEEN.update);
        animLoop.start();
    }]);

})(window,document,navigator,window.angular,'BBHApp');