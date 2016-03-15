
/*
* BBH Controllers
*/

(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
                       [ns + '.services',
                        ns + '.directives'] /* module dependencies */);
    /*
    * Main Controller
    */
    app.controller('AppController', 
        ['$scope', '$rootScope', '$timeout', '$location', '$templateCache', '$compile', '$modal', 'ChapterService', 'windowScroll', 'windowSize', '$routeParams',
        function($scope, $rootScope, $timeout, $location, $templateCache, $compile, $modal, ChapterService, windowScroll, windowSize, $routeParams) {

        /*
        * Define a base url for all photo assets
        */
        $rootScope.assetUrl = 'http://darve-bbh.s3.amazonaws.com/';

        var $body = $('body');

        /*
        * Show the Navigator Menu
        */
        $scope.showChapterChooser = function() {
            ChapterService.getChapters().then(function (response) {
                $modal.load('modal-chapter-browser.html', true, $scope, response);
            });
        };

        $scope.scrollToNarrative = function() { 
            windowScroll.scrollTo( windowSize.wh() );
        };

        $scope.showMenu = function() {
            $modal.load('modal-menu.html', true, $scope);
        };

        $scope.home = function() {
            $location.path('/');
            $timeout(function() {
                $location.path('/', true);
                $modal.hide(false);
            });
        };

        $scope.about = function() {
            $location.path('/');
            $timeout(function() {
                $location.path('/about', true);
                $modal.hide(false);
            });
        };

        $scope.support = function() {
            $location.path('/');
            $timeout(function() {
                $location.path('/support-us', true);
                $modal.hide(false);
            });
        };

        $scope.jump = function(chapter) {
            // $location.path('/chapter/' + chapter + '/1', true);
            $rootScope.$broadcast('navigate', chapter);
            $modal.hide();
        };

        // This will be used purely for hiding and showing the different site sections
        $rootScope.$on('$locationChangeSuccess', getRoute);

        function getRoute() {
            var p = $location.path(),
                t;
            
            // console.log(p, $routeParams);

            if ( p.indexOf('chapter') !== -1 ) {
                t = 'chapter';
                $body.addClass('story');
                $body.css('padding-top', windowSize.wh() + 'px');
            } else {
                $body.css('padding-top', '0');
                $body.removeClass('story');
            }

            switch (p) {
                case '/':
                    t = 'home';
                    windowScroll.scrollTo(0);
                    break;

                case '/about':
                    t = 'about';
                    windowScroll.scrollTo(0);
                    $body.removeClass('story');
                    break;

                case '/support-us':
                    t = 'support-us';
                    windowScroll.scrollTo(0);
                    $body.removeClass('story');
                    break;
            }

            window.ga('send', 'pageview');
            $rootScope.route = t;
        }

        getRoute();
    }]);

    /*
    * Homepage
    */
    app.controller('HomeController', 
        ['$scope', '$interval', '$timeout', '$modal',
        function($scope, $interval, $timeout, $modal){

        var $body = $('body'),
            $photos = $('#home .photo'),
            $text = $('#home .text'),
            o = ['fun', 'stressful', 'exciting'],
            i = 0;

        $modal.hide();
        $body.removeClass('narrative-showing');

        var interval = setInterval(function() {
            var next = i < 2 ? i+1 : 0;
            $photos.filter('.' + o[next]).addClass('on');
            $photos.filter('.' + o[i]).removeClass('on');
            $text.filter('.' + o[next]).addClass('on');
            $text.filter('.' + o[i]).removeClass('on');
            i = next;
        }, 3000);

        $scope.$on('$destroy', function() {
            // console.log('home controller destroyed');
            clearInterval(interval);
        });

    }]);

    /*
    * Main page viewer
    */
    app.controller('UIController', 
        ['$rootScope', '$scope', '$routeParams', 'ChapterService', '$templateCache', '$compile', '$sanitize', '$location', '$modal', '$timeout', '$photo', 'windowSize', 'windowResizer',
        function($rootScope, $scope, $routeParams, ChapterService, $templateCache, $compile, $sanitize, $location, $modal, $timeout, $photo, windowSize, windowResizer){

        $scope.chapter = parseInt($routeParams.chapter);
        $scope.page = parseInt($routeParams.page);
        $scope.photo = parseInt($routeParams.photo) || undefined;
        $scope.numphotos = undefined;
        $scope.type = undefined;
        $scope.title = undefined;
        $scope.loading = false;
        $scope.data = {};
        $scope.init = false;
        $scope.width = windowSize.ww();
        $scope.height = windowSize.wh();

        /*
        * Cache the page wrapper element
        */
        var $wrapper = $('#page-wrapper'),
            $body = $('body');

        $scope.$on('window resized', function(e, w, h, widthChanged, heightchanged) {
            
            if ( $rootScope.route === 'chapter' && w !== $scope.width ) {
                $body.css('padding-top', h + 'px');
            }

            $scope.width = w;
            $scope.height = h;
        });

        $scope.showMenu = function() {
            $modal.load('modal-menu.html', true, $scope);
        };

        $rootScope.$on('$locationChangeSuccess', function (ev) {
            $('body').scrollTop(0);
            if ( $location.path().indexOf('chapter') !== -1 ) {
                var url = $location.path().split('/');
                url.shift();
                $timeout(function() {
                    $scope.$apply(function() {
                        $scope.chapter = parseInt(url[1]);
                        $scope.page = parseInt(url[2]);
                        $scope.photo = parseInt(url[3]) || undefined;                    
                    });
                });

                // $modal.hide();
            } else {
                // console.log('not a chapter url?', $location.path() );
                // $modal.hide(false);
            }
        });

        $scope.$watch('photo', function(nv, ov) {
            if ( nv !== undefined && nv !== ov ) {
                if ( ChapterService.getPhoto($scope.chapter, $scope.page, nv) !== undefined ) {
                    var src = $rootScope.assetUrl + ChapterService.getPhoto($scope.chapter, $scope.page, nv);
                    $photo.show(src, $scope.chapter, $scope.page);
                }
            }
        });

        /*
        * Broadcast a navigate left event
        */
        $scope.navigateLeft = function() {
            $rootScope.$broadcast('navigate left');
        };

        $scope.navigateRight = function() {
            $rootScope.$broadcast('navigate right');
        };

        /*
        * Jump to a specific chapter
        */
        $scope.jump = function(chapter) {
            // $rootScope.$broadcast('navigate', chapter);
        };

        /*
        * Populate a template and add it to the chapter wrapper
        */
        $scope.transition = function(response) {
            ChapterService.preloadPages( $scope.chapter, response.page.order, $scope );
        };

        $scope.$on('preload complete', function() {
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.loading = false;        
                });
            });
        });

        $scope.$on('navigate', function(e, chapter) {
            $scope.navigate(parseInt(chapter), 1);
        });

        $scope.$on('navigate left', function(e){
            $scope.navigate(parseInt($scope.chapter), parseInt($scope.page)-1);
        });
        
        $scope.$on('navigate right', function(e){
            $scope.navigate(parseInt($scope.chapter), parseInt($scope.page)+1);
        });

        $scope.$on('modal closed', function(e){
            // console.log('modal closed', $location.path());
            // $scope.navigate(parseInt($scope.chapter), parseInt($scope.page));    
        });

        $scope.$on('photo event', function(e, data){
            if ( 'showing' in data && data.showing === true ) {
                $wrapper.addClass('hide');
                $body.addClass('photo-showing');
            } else if ( 'showing' in data && data.showing === false ) {
                $wrapper.removeClass('hide');
                $body.removeClass('photo-showing');
                $scope.navigate(parseInt($scope.chapter), parseInt($scope.page));
            }
        });

        $scope.$on('number of photos changed', function(e, num) {
            $timeout(function(){
                $scope.$apply(function() {
                    $scope.numphotos = num;
                });
            });
        });

        $scope.$on('title changed', function (e, title) {
            $timeout(function(){
                $scope.$apply(function() {
                    $scope.title = title;
                });
            });
        });

        /**
         * Navigate called - lets try and get the chapter content and feed it to the transition function
         */
        $scope.navigate = function (chapter, page, photo, silent) {
            // console.log('navigate actually called', chapter, page, photo);
            $scope.loading = true;

            ChapterService.getPage( chapter, page, $scope ).then(function(response, opts) {

                ChapterService.preloadPages( chapter, page, $scope );

                var transIn = $wrapper.find('.transition.in'),
                    transOut = $wrapper.find('.transition.out').html('').append(response.template);
                
                $scope.chapter = response.chapter;
                $scope.page = response.page;

                if ( !silent ) {
                    if ( photo === undefined ) {
                        $location.path('/chapter/' + response.chapter + '/' + response.page, false);
                    } else {
                        var src = $rootScope.assetUrl + ChapterService.getPhoto( $scope.chapter, $scope.page, photo );
                        $photo.show(src);
                        $location.path('/chapter/' + response.chapter + '/' + response.page + '/' + photo, false);
                    }    
                }
                
                transIn.removeClass('in').addClass('out');
                transOut.removeClass('out').addClass('in');

                $timeout(function(){
                    $scope.$apply(function() {
                        $scope.chapter = response.chapter;
                        $scope.page = response.page;
                    });
                });

                window.ga('send', 'pageview');

                if ( typeof callback === "function" ) {
                    callback();
                }        

                // console.log($scope.chapter, $scope.page);

            }, function(error) {
                // console.log(error);
                $location.path('/', false);
            });
        };

        $(d).on('keydown', function(e){

            if ( e.keyCode === 37 || e.keyCode === 39 ) {
                e.preventDefault();
                $modal.hide();
                $rootScope.$broadcast( e.keyCode === 37 ? 'navigate left' : 'navigate right');
            } else if ( e.keyCode === 27 ) {
                e.preventDefault();
                $modal.hide();
            }
        });

        $scope.$on('$destroy', function() {
            $(d).off('keydown');
            $body.removeClass('story');
        });

        $timeout(function() {
            if ( $rootScope.route === 'chapter' ) {
                $scope.navigate($routeParams.chapter, $routeParams.page, $routeParams.photo);

            } else {
                $scope.navigate(1, 1, $scope.photo, true);
            }
        });
        
    }]);

    /*
     * There are only three possible states of the Photo controller
     * 1. A photo is not showing
     * 2. A photo has been chosen but is loading
     * 3. A photo has been chosen and has loaded
     */
    app.controller('PhotoController',
        ['$rootScope', '$scope', '$timeout', 'windowSize', 'windowScroll', '$photo',
        function($rootScope, $scope, $timeout, windowSize, windowScroll, $photo){

        var $wrapper = $('#photo-wrapper');

        $scope.loading = true;
        $scope.showing = false;
        $scope.photo = '';
        $scope.title = '';

        $scope.$on('photo event', function(e, data) {
            $timeout(function() {
                $scope.$apply(function() {
                    ng.extend($scope, data);
                });
            });
        });

        $scope.$on('photo title', function(e, title) {
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.title = title;
                });
            });
        });

        // The photo 'modal' has been closed, inform the UI
        $scope.close = function() {
            $rootScope.$broadcast('photo event', {
                loading: true,
                showing: false,
                photo: ''
            });
        };

    }]);

    /*
     * Story controller
     */
    app.controller('NarrativeController', 
        ['$rootScope', '$scope', '$timeout', 'windowSize', 'windowScroll', '$location',
        function($rootScope, $scope, $timeout, windowSize, windowScroll, $location){

        // Cache the wrapper element
        var $narrative = $('#narrative-wrapper'),
            $content = $('#narrative-content'),
            $story = $('#story-indicator'),
            $body = $('body');

        $scope.showing = false;

        // This only applies to mobile
        $scope.narrativeVisible = false;
        // $scope.type;

        function pageTypeChanged(e, type) {
            $scope.type = type;
        }

        function toggleNarrative() {
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.narrativeVisible = !$scope.narrativeVisible;
                });
            });
        }

        function buildNarrative(event, data) {
            $body.addClass('narrative-showing');
            $content.find('div').remove();
            $content.append(data);
            $narrative.addClass('show');
            $story.addClass('flash');
        }

        function showNarrative() {
            $narrative.addClass('show');
        }

        function hideNarrative() {
            $body.removeClass('narrative-showing');
            $narrative.removeClass('show');
            $story.removeClass('flash');
            $content.find('div').remove();
        }

        $scope.close = function() {
            windowScroll.scrollTo(0);
        };

        $scope.getPageType = function () {
            var visible = $scope.narrativeVisible === true ? ' visible' : '';
            return $scope.type + visible;
        };

        /**
         * Listen to broadcasted messages
         */
        $scope.$on('narrative updated', buildNarrative);
        $scope.$on('narrative shown', showNarrative);
        $scope.$on('narrative hidden', hideNarrative);
        $scope.$on('toggle narrative', toggleNarrative);
        $scope.$on('page type changed', pageTypeChanged);

    }]);

})(window,document,window.angular,'BBHApp','controllers');