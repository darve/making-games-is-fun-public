exports.setup = function(app, mongoose, client, q) {

  var LolSchema = mongoose.Schema({ 
    hash: { type: String, default: null }, 
    title: { type: String, default: "Falcon Horse VI" }, 
    author: { type: String, default: "Douchebag" },
    email: { type: String, default: "email@address.com" },
    background: { type: String, default: "" },
    foreground: { type: String, default: "" }, 
  });
  var Lol = mongoose.model('Lol', LolSchema );

  var saveImageData = function( obj, filename ) {
    
    var deferred = new q.defer();

    if ( obj == undefined ) {
      deferred.resolve();
    } else {

      var buf = new Buffer(obj.replace(/^data:image\/\w+;base64,/, ""),'base64');

      var req = client.put('/lols/'+filename, {
         'Content-Length': buf.length,
         'Content-Type':'image/png',
         'x-amz-acl': 'public-read'
      });

      req.on('response', function(res){
        if ( res.statusCode === 200 ) {
          console.log(req.url);
          deferred.resolve(req.url);
        } else {
            console.log('error %d', req.statusCode)
        }
      });

      req.end(buf)
    }
    
    return deferred.promise;
  };

  app.get('/lols', function(req, res) {
    Lol.find({}, function(err, docs) {
      res.send(docs);
    });
  });

  app.get('/lols/:id', function(req, res) {
    Lol.findOne({_id: req.params.id}, function(err, data) {
      res.send(data);
    });
  });

  app.post('/lols/:id', function(req, res) {

    delete req.body._id;
    Lol.update({_id: req.params.id}, saveImageData(req.body, req.params.id), function(err, affected) {
      res.send({
        status: 200
      });
    });
  });

  app.post('/lols', function(req, res) {
  
    var obj = req.body;

    obj.hash = Math.floor(Math.random() * 10) + parseInt(new Date().getTime()).toString(36);

    saveImageData(obj.foreground, obj.hash + '_foreground.png').then(function(name){

      obj.foreground = name;
      
      saveImageData(obj.background, obj.hash + '_background.png').then(function(name){

        obj.background = name;

        Lol.create(obj, function(err, lol) {

          res.send('ok');

        });

      });

    });

  });

  app.del('/lols/:id', function(req, res) {
    Lol.remove({_id: req.params.id}, function(err) {
      res.send({
        status: 200
      });
    });
  });

}
