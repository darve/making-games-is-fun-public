
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