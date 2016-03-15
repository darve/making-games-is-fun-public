var path     = require('path'),
    express  = require('express'),
    app      = express();

app.use(express.limit('10mb'));
app.use(express.cookieParser('daveiscool'));
app.use(express.cookieSession());
app.use(express.bodyParser());

app.use("/assets/", express.compress());
app.use("/assets/", express.static(path.resolve(__dirname, "app/assets")));
app.use("/assets/", function(req, res, next) { res.send(404); });
app.use(express.logger());

app.get('/', function(req, res) {
  res.sendfile('index.html', { root: "app" });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server listening on port ' + port);