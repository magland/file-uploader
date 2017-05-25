var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

//jfm ///////////////////////////////////////
function usage() {
	console.log('Usage: nodejs file-uploader.js [listen_port] [uploads_path]');
}
var args=process.argv.slice(2);
var listen_port=args[0]||3000;
var uploads_path=args[1]||'';
if (!uploads_path) {
	usage();
	return;
}
/////////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the uploads directory
  form.uploadDir = path.join(uploads_path);

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(listen_port, function(){
  console.log('Server listening on port '+listen_port+'. Uploads go to: '+uploads_path);
});
