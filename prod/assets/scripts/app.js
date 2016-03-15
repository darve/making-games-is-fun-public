
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

/*
* BBH Filters
*/

(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
                        [] /* module dependencies */);

    app.filter('slugify', function() {
        return function(input) {
            return input.toLowerCase().split('é').join('e').replace(/[^\w\s-]/g, "").replace(/[-\s]+/g, "-");
        };
    });

    app.filter('capitalize', function() {
        return function(input) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        };
    });

    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

})(window,document,window.angular,'BBHApp','filters');

/*
* BBH Services
*/

(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
                       [] /* module dependencies */);

    /*
    * Strip any errant characters from a template
    */
    app.factory('$sanitize', [function() {
        return function(input) {
            return input.replace('\n', '').replace('\t', '').replace('\r', '').replace(/^\s+/g, '');
        };
    }]);

    /*
    * Controls the logic for displaying individual photos
    */
    app.factory('$photo', 
        ['$rootScope', '$timeout', 'windowSize',
        function ($rootScope, $timeout, windowSize) {
        
        var photo,
            temp = d.createElement('img');

        function show(src) {

            // Inform the UI that we need to display a photo
            $rootScope.$broadcast('photo event', {
                loading: true, 
                showing: true,
                photo: ''
            });

            // The photo is loaded - send the appropriate style string to the UI
            temp.onload = function() {
                temp.onload = undefined;
                temp.src = '';
                photo = 'background: transparent url(' + src + ') center center no-repeat; background-size: cover;';

                $rootScope.$broadcast('photo event', {
                    loading: false, 
                    showing: true,
                    photo: photo
                });
            };
            temp.src = src;
        }

        function update() {
            
        }

        return {
            show: show,
            update: update
        };

    }]);

    /*
    * Service used for creating modal pop-ups
    */
    app.factory('$modal', 
        ['$rootScope', '$compile', '$timeout', '$sanitize', '$templateCache', 'windowSize',
        function ($rootScope, $compile, $timeout, $sanitize, $templateCache, windowSize) {

        var $el,
            $content,
            $close,
            $body,
            template,
            compiledTemplate,
            showing = false;

        $body = $('body');
        $el = ng.element($templateCache.get('modal.html'));
        $content = $el.find('#modal-content');
        $close = $el.find('#modal-close');
        $body.append($el[0]);

        /**
        * Bind our event listeners
        */
        $close.bind('click', hide);

        /*
        * Show the modal ( assuming it has a compiled view inside it )
        */
        function show() {
            $el.addClass('show');
            showing = true;
            $body.addClass('modal-showing');
        }

        function hide( broadcast ) {
            showing = false;
            $el.removeClass('show').removeAttr('style');
            $content.html('');
            if ( broadcast !== false ) {
                $rootScope.$broadcast('modal closed');
            }
            $body.removeClass('modal-showing');
        }

        function toggle() {
            $el.toggleClass('show');
        }

        /*
        * Load the modal template and show it ( optional )
        * url: the name of the template in the template cache
        * show: bool, defines whether it is show when straight after loading
        * scope: the scope of the controller that has called the modal to load is passed in
        * obj: any data that is needed in the modal is passed in
        * opts: any additional options that are required
        */
        function load(url, show, scope, obj, opts) {

            template = $templateCache.get(url);
            scope = ( obj !== undefined ) ? ng.extend( scope.$new(), { data: ng.extend({}, obj) } ) : scope;
            compiledTemplate = $compile($sanitize(template))(scope);
            $content.html('').append(compiledTemplate);
            
            if (show === true) {
                $el.addClass('show');
                $content.addClass('show');
                $body.addClass('modal-showing');
            }

            showing = true;
        }

        /*
        * Expose the methods to the service
        */
        return {
            showing: showing,
            show: show,
            hide: hide,
            toggle: toggle,
            load: load
        };
    }]);

    /*
    * Methods for interacting with the Chapter web service
    */
    app.factory('ChapterService', 
        ['$rootScope', '$q', '$http', '$templateCache', '$compile', '$sanitize', '$routeParams', '$location',
        function ($rootScope, $q, $http, $templateCache, $compile, $sanitize, $routeParams, $location) {            

        /*
        * Cache object for chapters downloaded from the web service
        */
        var Chapters = {};

        /*
        * Get a list of chapters for the Navigator
        */
        function getChapters() {
            var deferred = new $q.defer();

            $http({ url: '/assets/data/chapters.json', type: 'GET'}).then(function(response){
                deferred.resolve(response.data);
            }, function(response){
                deferred.reject('error retrieving the chapter map');
            });

            return deferred.promise;
        }

        /*
        * Returns a promise, which if resolved returns a JSON representation of a chapter
        */
        function getChapter(num) {
            var deferred = $q.defer();

            if ( Chapters[num] ) {
                deferred.resolve(Chapters[num]);
            } else {
                $http({ url: '/assets/data/chapters/' + num + '.json', type: 'GET' }).then(function(response){
                    Chapters[num] = response.data;
                    $rootScope.$broadcast('chapter loaded', response.data);
                    deferred.resolve(response.data);
                }, function(response){
                    $rootScope.$broadcast('error', 'this chapter does not exist');
                    deferred.reject('this chapter does not exist');
                });
            }

            return deferred.promise;
        }

        function getPhoto( chapter, page, photo ) {
            if ( Chapters[chapter] ) {
                if ( Chapters[chapter].pages[page-1].content[photo] && Chapters[chapter].pages[page-1].content[photo].type !== null ) {
                    buildNarrative( Chapters[chapter].pages[page-1].content[photo].content );
                }                
                return Chapters[chapter].pages[page-1].photos[photo-1].replace('.jpg', '-full.jpg');
            }
        }

        function getPhotos( chapter, page, photo ) {
            
            var chap = Chapters[chapter].pages[page-1].photos;
            ng.forEach(chap, function(val, i) {
                chap[i] = chap[i].replace('.jpg', '-full.jpg');
            });

            return {
                current: parseInt(photo-1),
                photos: chap
            };
        }

        function getPage(chapter, page, scope) {
            // console.log('getpage called', chapter, page);
            var deferred = new $q.defer();

            if ( chapter === 1 && page === 0 ) {
                deferred.reject('go to homepage');
            } else {

                /**
                 * Valid chapter returned
                 */
                getChapter(chapter).then(function(chap){
                    var length = chap.pages.length;

                    // First page
                    if ( page === 0 ) {

                        getChapter(parseInt(chapter)-1).then(function(chap) {
                            var length = chap.pages.length;
                            deferred.resolve({
                                template: buildPage(chap, length, scope),
                                chapter: parseInt(chapter)-1,
                                page: length
                            });

                        }, deferred.reject);

                    // Last page
                    } else if ( page > length ) {
                        
                        getChapter(parseInt(chapter)+1).then(function(chap) {

                            deferred.resolve({
                                template: buildPage(chap, 1, scope),
                                chapter: parseInt(chapter)+1,
                                page: 1
                            });

                        }, deferred.reject);

                    } else {
                        deferred.resolve({
                            template: buildPage(chap, page, scope),
                            chapter: chapter,
                            page: page
                        });

                    }

                }, function(msg) {
                    /**
                     * Do logic to direct them to the first and last pages of the entire book / app
                     */
                    deferred.reject();
                });

            }

            return deferred.promise;
        }


        /**
         * Edge cases:
         * start of book
         * end of book
         */
        function validateChapter(chapter, page, scope, deferred) {
            // console.log('validating page', chapter, page);
            if ( page === 0 ) {
                deferred.reject('start of chapter');
            } else if ( page >= Chapters[chapter].pages.length ) {
                deferred.reject('end of chapter');
            } else if ( Chapters[chapter].pages[page-1] ) {
                deferred.resolve({
                    template: buildPage(chapter, page, scope),
                    page: page
                });
            }
        }

        function buildPage(chapter, page, scope) {

            var template,
                scp;

            $rootScope.$broadcast('title changed', chapter.title);
            $rootScope.$broadcast('page type changed', chapter.pages[page-1].type);
            $rootScope.$broadcast('number of photos changed', chapter.pages[page-1].photos.length);

            if ( chapter.pages[page-1].content.length && chapter.pages[page-1].content[0].type !== null ) {
                buildNarrative( chapter.pages[page-1].content[0].content );
            } else {
                $rootScope.$broadcast('narrative hidden');
            }
                
            template = $templateCache.get('page-' + chapter.pages[page-1].type + '.html');
            scp = ng.extend(scope.$new(), chapter.pages[page-1]);
            return $compile($sanitize(template))(scp);
        }

        function buildNarrative( data ) {

            var narrative = d.createElement('div');

            ng.forEach(data, function(val){
                
                var el;

                switch (val.type) {
                    case 'heading': 
                        el = d.createElement('h2');
                        $rootScope.$broadcast('photo title', val.value);
                        break;
                    case 'subheading':
                        el = d.createElement('h3');
                        break;
                    case 'paragraph':
                        el = d.createElement('p');
                        break;
                }

                el.innerHTML = val.value;
                narrative.appendChild(el);
            });

            $rootScope.$broadcast('narrative updated', narrative);                
        }

        function getNarrative(chapter, page, photo) {
            if ( Chapters[chapter].pages[page-1].content.length && Chapters[chapter].pages[page-1].content[photo].type !== null ) {
                buildNarrative( Chapters[chapter].pages[page-1].content[photo].content );
            }
        }

        function preloadPages(chapter, page, scope) {
            try {

                var pictures = [],
                    preload = [],
                    loaded = 0,
                    numphotos = 0;

                // Current page
                if ( Chapters[chapter].pages[page-1] ) {
                    pictures = pictures.concat(Chapters[chapter].pages[page-1].photos);
                }

                // Next page
                if ( Chapters[chapter].pages[page] ) {
                    pictures = pictures.concat(Chapters[chapter].pages[page].photos);
                }

                // Previous page
                if ( Chapters[chapter].pages[page-2] ) {
                    pictures = pictures.concat(Chapters[chapter].pages[page-2].photos);
                }

                for ( var i in pictures ) {
                    preload.push( new Image() );
                    preload[i].onload = function() {
                        loaded++;

                        if ( loaded === pictures.length ) {
                            $rootScope.$broadcast('preload complete');
                        }
                    };
                    preload[i].src = $rootScope.assetUrl + pictures[i];
                }

            } catch (e) {
                console.log('could not preload the images');
            }
        }

        /*
        * Expose the methods to the service
        */
        return {
            getChapter: getChapter,
            getChapters: getChapters,
            getPhoto: getPhoto,
            getPhotos: getPhotos,
            getNarrative: getNarrative,
            getPage: getPage,
            preloadPages: preloadPages
        };
    }]);

    /*
    * Rendering pipeline
    */
    app.factory('animLoop', function () {

        var rafLast = 0;

        var requestAnimFrame = (function () {
            return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - rafLast));
                    var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    rafLast = currTime + timeToCall;
                    return id;
                };
        })();

        var cancelAnimFrame = (function () {
            return  window.cancelAnimationFrame ||
                window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                function (id) {
                    clearTimeout(id);
                };
        })();

        var FramePipeline = function () {
            var _t = this;
            _t.pipeline = {};
            _t.then = new Date().getTime();
            _t.now = undefined;
            _t.raf = undefined;
            _t.delta = undefined;
            _t.interval = 1000 / 60;
            _t.running = false;
        };

        FramePipeline.prototype = {
            add: function (name, fn) {
                this.pipeline[name] = fn;
            },
            remove: function (name) {
                delete this.pipeline[name];
            },
            start: function () {
                if (!this.running) {
                    this._tick();
                    this.running = true;
                }
            },
            pause: function () {
                if (this.running) {
                    cancelAnimFrame.call(window, this.raf);
                    this.running = false;
                }
            },
            setFPS: function (fps) {
                this.interval = 1000 / fps;
            },
            _tick: function tick() {
                var _t = this;
                _t.raf = requestAnimFrame.call(window, tick.bind(_t));
                _t.now = new Date().getTime();
                _t.delta = _t.now - _t.then;
                if (_t.delta > _t.interval) {
                    for (var n in _t.pipeline) {
                        _t.pipeline[n]();
                    }
                    _t.then = _t.now - (_t.delta % _t.interval);
                }
            }
        };

        var pipeline = new FramePipeline();

        Function.prototype.bind = Function.prototype.bind || function () {
            return function (context) {
                var fn = this,
                    args = Array.prototype.slice.call(arguments, 1);

                if (args.length) {
                    return function () {
                        return arguments.length ? fn.apply(context, args.concat(Array.prototype.slice.call(arguments))) : fn.apply(context, args);
                    };
                }
                return function () {
                    return arguments.length ? fn.apply(context, arguments) : fn.apply(context);
                };
            };
        };

        return pipeline;
    });

    app.factory('windowScroll', [function(){

        var b = (d.querySelector('.lte9') === null ) ? d.body : d.documentElement;

        var getOffset = function(target){

            var docElem, box = {
                top: 0,
                left: 0
            },

            elem = target,
            doc = elem && elem.ownerDocument;
            docElem = doc.documentElement;

            if (typeof elem.getBoundingClientRect !== undefined ) {
                box = elem.getBoundingClientRect();
            }
            
            return {
                top: box.top + (w.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (w.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };

        };

        var scrollTo = function(target){
            
            var tween = new TWEEN.Tween( { y: b.scrollTop } )
                .to( { y: target}, 600 )
                .easing( TWEEN.Easing.Cubic.Out )
                .onUpdate( function () {
                    b.scrollTop = this.y;
                })
                .start();
        };

        return {
            scrollTo: scrollTo
        };
    }]);

    app.factory('windowSize', ['$timeout', function($timeout){
    
        var ww = (function() {
            if (typeof w.innerWidth !== 'undefined') {
                return function() {
                    return w.innerWidth;
                };
            } else {
                var b = ('clientWidth' in d.documentElement) ? d.documentElement : d.body;
                return function() {
                    return b.clientWidth;
                };
            }
        })();

        var wh = (function() {
            if (typeof w.innerHeight !== 'undefined') {
                return function() {
                    return w.innerHeight;
                };
            } else {
                var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
                return function() {
                    return b.clientHeight;
                };
            }
        })();

        return {
            ww: ww,
            width: ww,
            wh: wh,
            height: wh
        };
    }]);

    app.factory('windowResizer', ['$timeout', '$rootScope', 'windowSize', 'animLoop', function($timeout, $rootScope, windowSize, animLoop) {

        var wW = windowSize.ww(),
            wH = windowSize.wh();

        function resize(){
            $timeout( function() {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast('window resized', wW, wH);
                });
            });

            animLoop.remove('windowResize');
        };

        w.onresize = function() {
            wW = windowSize.ww();
            wH = windowSize.wh();
            animLoop.add('windowResize', resize);
        };

        return this;
    }]);


})(window,document,window.angular,'BBHApp','services');

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