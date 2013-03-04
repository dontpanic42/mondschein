var express = require('express')
,	util	= require('util')
,	imgur	= require('./routes/imgur')
,	reddit  = require('./routes/reddit');

var app = express();

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'cassa123'}));
	app.use(app.router);
	// app.use(function(error, req, res, next) {
	//     res.send({
	//         status: 500,
	//         type: 'E_INTERNAL',
	//         message: error.message
	//     });

	//     console.log("Error: ", error);
	// });
	app.use(express.static(__dirname + '/public'));
});

app.get('/reddit/:reddits/:after', function(req, res, next) {
	console.log('Starting request', req.params);
	// reddit.getSubredditImages(req.params.reddits, function(body) {
	// 	res.send(body);
	// }, req.params.after);
	reddit.find(req, res, next);
});

app.get('/reddit/:reddits', function(req, res, next) {
	// reddit.getSubredditImages(req.params.reddits, function(body) {
	// 	res.send(body);
	// });
	console.log('Starting request', req.params);
	reddit.find(req, res, next);
});

app.get('/imgur/:albumid', function(req, res, next) {
	try{
	imgur.getAlbumImages(req.params.albumid, function(result) {
		res.send(result);
	});
	} catch(e) {
		res.send({
			status: 404,
			type: 'E_NO_IMAGES',
			e: null
		});
	}
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
        console.log("Listening on " + port);
});
