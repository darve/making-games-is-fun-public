
/*
* BBH Directives
*/

(function (w, d, ng, ns, m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
        [ns + '.services'] /* module dependencies */);

    app.directive('bbhContent', ['$rootScope', '$timeout', function($rootScope, $timeout){
        return {
            restrict: 'A',
            template: function( element, attrs ) {
                // console.log('inside template function', element, attrs);
                return "<p></p>";
            },
            transclude: true,
            replace: true,
            link: function(scope, elem, attrs) {
                // elem.find(span).wrap('<h2>');
            }
        };
    }]);

    app.directive('carousel', ['$rootScope', '$timeout', function($rootScope, $timeout){
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                var photos = [],
                    $photos,
                    l,
                    i = 0,
                    loaded = 0,
                    interval,
                    next;
                
                function start() {
                    interval = setInterval(function() {
                        next = i < l ? i+1 : 0;
                        $photos.removeClass('on');
                        $photos.eq(next).addClass('on');
                        i = next;
                    }, 3000);

                    scope.$on('$destroy', function() {
                        clearInterval(interval);
                    });    
                }

                function imageLoaded() {
                    loaded++;
                    if ( loaded == l ) {
                        start();
                    }
                }

                $timeout(function() {
                    $photos = elem.find('.section');
                    l = $photos.length-1;

                    for ( var i = 0; i < l; i++ ) {
                        photos.push(new Image());
                        photos[i].onload = imageLoaded;
                        photos[i].src = $photos[i].getAttribute('data-photo');
                    }
                });


            }
        };
    }]);

    // app.directive('thumbnail', 
    //     ['$rootScope', '$timeout', '$modal', '$location', 
    //     function($rootScope, $timeout, $modal, $location){
    //     return {
    //         restrict: 'A',
    //         link: function(scope, elem, attrs) {

    //             elem.on('click', function(e){
    //                 var img = new Image();
    //                 img.src = attrs.full.replace('.jpg', '-full.jpg');
    //                 img.style.display = 'block';
    //                 img.style.width = '100%';
    //                 $modal.showImage(img);
    //                 $(img).on('click', $modal.hide);
    //             });

    //         }
    //     }
    // }]);

    // app.directive('directiveTemplate', ['$rootScope', '$timeout', function($rootScope, $timeout){
    //     return {
    //         restrict: 'E',
    //         link: function(scope, elem, attrs) {
    //         }
    //     };
    // }]);

})(window, document, window.angular, 'BBHApp', 'directives');