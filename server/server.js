/*
* 
*/

var path     = require('path'),
    express  = require('express'),
    // knox     = require('knox');
    app      = express();
    // q        = require('q'),
    // mongoose = require('mongoose'),
    // shortid  = require('mongoose-shortid'),
    // users    = require('./controllers/lols');

/*
* 
*/
// mongoose.connect('mongodb://darve:jodokast@ds035037.mongolab.com:35037/bbh');

// var client = knox.createClient({
// 	key: 'AKIAJYUNWRJXDVNUKNNA',
// 	secret: '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',
// 	bucket: 'interlolz'
// });

/*
* 
*/
// var csrfValue = function(req) {
//   var token = (req.body && req.body._csrf)
//     || (req.query && req.query._csrf)
//     || (req.headers['x-csrf-token'])
//     || (req.headers['x-xsrf-token']);
//   return token;
// };

/*
* 
*/
app.use(express.limit('10mb'));
app.use(express.cookieParser('daveiscool'));
app.use(express.cookieSession());
// app.use(express.csrf({value: csrfValue}));
app.use(express.bodyParser());

/*
* 
*/
// app.use(function(req, res, next) {
//   res.cookie('XSRF-TOKEN', req.session._csrf);
//   next();
// });

/*
* 
*/
app.use("/assets/", express.compress());
app.use("/assets/", express.static(path.resolve(__dirname, "../app/assets")));
app.use("/assets/", function(req, res, next) { res.send(404); });
app.use(express.logger());

/*
* 
*/
// users.setup(app, mongoose, client, q);

/*
* 
*/
app.get('/', function(req, res) {
  res.sendfile('index.html', { root: "../app" });
});

/*
* Route for getting a single chapter
*/
app.get('/api/chapters/:num', function(req, res) {

});

/*
* Route for logging in.
* Returns user credentials and sets a HTTP cookie.
*/
app.post('/login', function(req, res) {

});

/*
* 
*/
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server listening on port ' + port);