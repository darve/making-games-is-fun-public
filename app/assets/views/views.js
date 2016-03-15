angular.module("BBHApp").run(["$templateCache", function($templateCache) {$templateCache.put("404.html","\n<div id=\"home\" class=\"section fullscreen\" ng-controller=\"HomeController\">\n    <!-- <h1 class=\"f-gothic\">Making Games Is Fun</h1> -->\n    <h1 class=\"f-skippy-sharp\">Page not found :-(</h1>\n</div>");
$templateCache.put("about.html","<div ng-controller=\"AboutController\" class=\"static\">\n    <div class=\"content\">\n\n        <h1 class=\"f-orgovan\">About Us</h1>\n\n        <img src=\"/assets/img/lads.jpg\" class=\"photo\" />\n\n        <div class=\"columns\">\n\n            <div class=\"full-col\">\n                <p>Making Games Is Fun is an independently created, ongoing, online photodocumentary series looking at people who work in, or make their living around, the games industry. The images and words are made by photographer and word-man GaryDooton. These images and words are then brought to life and made available to you by the web development and coding prowess of David Woollard. Without David, it would be like writing words and printing photos without paper, which would be very stupid indeed.</p>\n            </div>\n\n            <div class=\"half-col\">\n\n                <h2 class=\"f-orgovan\">Gary</h2>\n                <p><a href=\"https://twitter.com/garydooton\">GaryDooton</a>, or Gareth Dutton as he\'s known to his mum and dad, is a freelance photo  grapher and word speller. He has nice hair. He sometimes writes for the videogame writing and podcasting people known as Midnight Resistance. His hobbies are all for children and are as follows:</p>\n                <ul>\n                    <li>Videogames</li>\n                    <li>Pro Wrestling</li>\n                    <li>Staring out of the window</li>\n                </ul>\n                <p>He photographs various human beings\' faces in different ways for different reasons in return for cash. Preposterously, he is a father to a human woman (girl).</p>\n            </div>\n            \n            <div class=\"half-col\">\n                <h2 class=\"f-orgovan\">Dave</h2>\n                <p>David Woollard is a frighteningly adept code serpent. It really is scary how good he is at telling computers what to do; I\'m talking dry throated, shallow-breath, wide-eyed terror. David is also a creature of the freelance world and he and Gary can be found colluding in dimly lit, slightly annoying trendy pubs like two scheming walruses.</p>\n                <p>David\'s hobbies are as follows:</p>\n                <ul>\n                    <li>Playing deadly guitar licks like some sort of slightly melted Josh Homme</li>\n                    <li>Getting drunk on boats</li>\n                    <li>Not going to bed at reasonable times</li>\n                </ul>\n            </div>\n\n            <div class=\"clear\"></div>\n            <hr/>\n\n            <div class=\"full-col\">\n                <p>By combining their powers, their brilliant quest is to create documentary material about the videogames industry and its surrounding culture in a way previously unseen, and to deliver it to you in a delightfully slick, dangerously pretty fashion.</p>\n                <p>I mean honestly, this stuff practically pushes itself into your ears, eyes and throat so you barely have to lift a muscle in your stupid, stupid faces.</p>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("chapter.html","<div id=\"page-wrapper\" ng-controller=\"UIController\">\n\n    <!-- \n        Used to wrap different pages of content, allowing for smooth transitions between pages.\n    -->\n     <div id=\"transition-wrapper\">\n         <div class=\"transition in\"></div>\n         <div class=\"transition out\"></div>\n     </div>\n\n    <div class=\"loader\" ng-class=\"{ show: loading }\"></div>\n\n    <!-- \n        Navigation \n    -->\n    <button class=\"navigator navigate-left left icon-arrow-left\" ng-click=\"navigateLeft()\" ng-class=\"{ hidden: (chapter === 1 && page === 1) }\"></button>\n    <button class=\"navigator navigate-right icon-arrow-right\" ng-click=\"navigateRight()\"></button>\n\n    <!-- <button class=\"navigator chapter-chooser icon-directions\" ng-click=\"showNavigatorMenu()\">Chapter Chooser</button> -->\n    \n</div>");
$templateCache.put("home.html","<div id=\"home\" class=\"section fullscreen\" ng-controller=\"HomeController\">\n\n    <div class=\"content\">\n        <img src=\"/assets/img/logo-600-trans.png\" class=\"mgif desktop-hidden\" />\n        <h1 class=\"f-orgovan mobile-hidden\"><span class=\"making\">Making</span><span class=\"games\">games is</span><span class=\"fun text on\">fun</span><span class=\"stressful text\">stressful</span><span class=\"exciting text\">exciting</span></h1>\n\n        <div class=\"intro\">\n            <p>A surprisingly honest and open look at a game dev studio, looking at the people who work there. The absolute first of its kind. A photo documentary taken from the inside.</p>\n\n            <p>No PR, no barriers, lots of silliness.</p>\n\n            <p>&nbsp;</p>\n\n            <a href=\"/#/chapter/1/1\" class=\"cta f-orgovan mobile-hidden\">Start reading...</a>\n\n            <p class=\"credit mobile-hidden\">Made by <a href=\"/#/about\">Gary &amp; Dave</a>.</p>\n        </div>\n    </div>\n\n    <div class=\"photo fun on\"></div>\n    <div class=\"photo stressful\"></div>\n    <div class=\"photo exciting\"></div>\n    \n    <!-- <a href=\"/#/chapter/1/1\" class=\"start-reading f-orgovan desktop-hidden\">Start reading</a> -->\n\n</div>\n");
$templateCache.put("login.html","");
$templateCache.put("modal-chapter-browser.html","<div class=\"modal-content\" id=\"chapter-chooser\">\n    <h2 class=\"f-orgovan\">Choose a chapter</h2>\n    <ul id=\"chapter-list\">\n        <li ng-repeat=\"chapter in data.chapters\">\n            <a ng-click=\"jump(chapter.number)\">\n                <img ng-src=\"{{ assetUrl }}chapter-chooser-{{chapter.number}}.jpg\" class=\"img\">\n                <span class=\"title f-orgovan\">{{ chapter.title }}</span>\n            </a>\n        </li>\n    </ul>\n</div>");
$templateCache.put("modal-menu.html","<div class=\"modal-content\">\n    <ul id=\"menu-list\" class=\"f-orgovan\">\n        <li><a ng-click=\"home()\">Home</a></li>\n        <li><a ng-click=\"showChapterChooser()\">Chapters</a></li>\n        <li><a ng-click=\"about()\">About Us</a></li>\n        <!-- <li><a ng-click=\"support()\">Support Us</a></li> -->\n    </ul>\n</div>");
$templateCache.put("modal.html","<div id=\"modal\">\n    <div id=\"modal-content\"></div>\n    <div id=\"modal-photo\"></div>\n    <div class=\"close-button-wrapper\">\n        <div id=\"modal-close\" class=\"close-button\">\n            <a ng-click=\"closeModal()\"><span class=\"icon-cross\"></span></a>\n        </div>\n    </div>\n</div>");
$templateCache.put("page-chapter-intro-horizontal.html","<div class=\"page-chapter-intro-horizontal page\" carousel>\n\n    <h3 class=\"chapter-title f-orgovan\">{{ title }}</h3>\n    <div class=\"section order-{{ $index+1 }}\" ng-repeat=\"photo in photos\" style=\"background: transparent url(\'{{ assetUrl + photo }}\') center center no-repeat; background-size: cover;\" ng-class=\"{ on: $index == 0 }\" data-photo=\"{{ assetUrl + photo }}\"></div>\n\n</div>\n\n");
$templateCache.put("page-chapter-intro-vertical.html","<div class=\"page-chapter-intro-vertical page\" carousel>\n\n    <h2 class=\"chapter-number f-orgovan\">{{ $scope.title }}</h2>\n    <h3 class=\"chapter-title f-orgovan\">{{ title }}</h3>\n    <div class=\"section order-{{ $index+1 }}\" ng-repeat=\"photo in photos\" style=\"background: transparent url(\'{{ assetUrl + photo }}\') center center no-repeat; background-size: cover;\" ng-class=\"{ on: $index == 0 }\" data-photo=\"{{ assetUrl + photo }}\"></div>\n\n</div>\n");
$templateCache.put("page-full.html","<div class=\"page-full page\" style=\"background: transparent url(\'{{ assetUrl + photos[0] }}\') center center no-repeat; background-size: cover;\"></div>");
$templateCache.put("page-split-five-horizontal.html","<div class=\"page-split-five-horizontal page\">\n    <a class=\"section order-{{ $index+1 }}\" ng-repeat=\"photo in photos\" href=\"/#/chapter/{{chapter}}/{{page}}/{{$index+1}}\" style=\"background: transparent url(\'{{ assetUrl + photo }}\') center center no-repeat; background-size: cover;\" data-full=\"{{ assetUrl + photo }}\" thumbnail></a>\n</div>");
$templateCache.put("page-split-five-vertical.html","<div class=\"page-split-five-horizontal page\">\n    <a class=\"section order-{{ $index+1 }}\" ng-repeat=\"photo in photos\" href=\"/#/chapter/{{chapter}}/{{page}}/{{$index+1}}\" style=\"background: transparent url(\'{{ assetUrl + photo }}\') center center no-repeat; background-size: cover;\" data-full=\"{{ assetUrl + photo }}\" thumbnail></a>\n</div>");
$templateCache.put("page-split-grid-four.html","<div class=\"page-split-grid-four page\">\n    <a class=\"section order-{{ $index+1 }}\" ng-repeat=\"photo in photos\" href=\"/#/chapter/{{chapter}}/{{page}}/{{$index+1}}\" style=\"background: transparent url(\'{{ assetUrl + photo }}\') center center no-repeat; background-size: cover;\" data-full=\"{{ assetUrl + photo }}\" thumbnail></a>\n</div>");
$templateCache.put("page-split-grid-twelve.html","<div class=\"page-split-grid-twelve page\">\n    <a class=\"section order-{{ $index+1 }}\" ng-repeat=\"photo in photos\" href=\"/#/chapter/{{chapter}}/{{page}}/{{$index+1}}\" style=\"background: transparent url(\'{{ assetUrl + photo }}\') center center no-repeat; background-size: cover;\" data-full=\"{{ assetUrl + photo }}\" thumbnail></a>\n</div>\n<div class=\"content\">\n    <div ng-repeat=\"item in content\">\n        <div ng-repeat=\"(key, value) in item.content\" bbh-content=\"{{ key }}\"><span>{{ value }}</span></div>\n    </div>\n</div>");
$templateCache.put("page-split-vertical.html","<div class=\"page-split-vertical page\">\n    <a class=\"section order-{{ $index+1 }}\" ng-repeat=\"photo in photos\" style=\"background: transparent url(\'{{ assetUrl + photo }}\') center center no-repeat; background-size: cover;\" data-full=\"{{ assetUrl + photo }}\"></a>\n</div>");
$templateCache.put("support-us.html","<div ng-controller=\"SupportController\" class=\"static\">\n    <div class=\"content\">\n        <h1 class=\"f-orgovan\">Support us.</h1>\n\n        <img src=\"/assets/img/lads.jpg\" class=\"photo\" />\n\n        <div class=\"columns\">\n            <p>Out of all the things Dave and I do in our ridiculous little lives, making our own stuff, on our own terms, by our own rules, is what we love doing the most. We get absolute creative freedom and get to make whatever we want, however we want; nobody to bully us or tell us they think what we\'re doing is total garbage and that our faces are ugly and huge.</p>\n\n            <p>What does that mean for the reader / picture looker / voice listener, also known as you? Well, it means that what I\'ve written, what I\'ve photographed and what I\'ve recorded is what I think and what I\'ve experienced. When it comes to documenting the games industry in various ways, that\'s a rare asset; There\'s no old school, Machiavellian PR git prodding and bullying me with his nasty little talons.</p>\n\n            <p>All this freedom comes with a price of course, or a lack of one; we have no payroll department. I\'ve tried billing the three year old but she only pays me in plastic coins from her toy cash register; so far I\'ve made \"five monies\". Unfortunately, she keeps making me use them to buy teddies (and sometimes her own snot), resulting in \"no monies left\". It\'s a thoroughly demoralising experience. </p>\n\n            <p>The best thing about what were making is it\'s available to everyone, no paywall means you can all enjoy it. The problem is, sometimes the money runs out, and I have to cut back ideas in terms of ambition and scope, content, whatever. </p>\n\n            <p>One thing I can assure you is that I\'ll forever be making these photodocumentaries, and I plan to increase the scale, scope and sophistication as I continue, provided the funds are available, so don\'t think of this as a \"this is free but I can\'t do any more unless you support me\" – I WILL continue to create these photodocs either way, and they will continue to be free.</p>\n\n            <p>What I\'m saying is, don\'t consider this a guilt trip, like something your mum would say (\"of course it\'s free, but if you LOVE me enough to give a MEASLY pound coin, then maybe you\'d be a great person\") because if you need your money, keep hold of it; don\'t give it to some idiot on The Internet.</p>\n\n            <p>Your support simply helps us to think bigger. I\'ll always find something related to gaming to document, regardless of budget. I\'m just happy that you\'re interested in my work in the first place, because that means it has value and was worth doing.</p>\n\n            <p>Heartfelt thanks to all of you. Keep this site bookmarked and follow us on twitter because I have more stuff in the pipeline which will show up here, all free.</p>\n\n            <p>Cheers humans,</p>\n\n            <p>Love from GaryDooton and Dave Hurricane</p>            \n        </div>\n\n    </div>\n\n</div>");}]);