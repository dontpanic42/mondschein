var util = require('util');
var http = require('http');
var image = require('./images');

var url = 'www.reddit.com';

var subredditUri = '/r/:subreddits/:mode.json?count=60';

function redditRequest(uri, callback) {
	var options = {
		host: url,
		path: uri
	};

	http.get(options, function(response) {
		var data = '';
		response.on('data', function(chunk) {
	 		data += chunk;
	 	});

	 	response.on('end', function() {
	 		// console.log('-> http end');
	 		try {
	 			// console.log('calling try');
	 			callback(response.statusCode, response.headers, JSON.parse(data));
	 		} catch(e) {
	 			console.log(e);
	 			callback(response.statusCode, response.headers, {});
	 		}
	 	})
	});
}

function getSubredditJson(subreddits, callback, after, mode) {
	mode || (mode = 'hot');
	var uri = subredditUri
	.replace(':subreddits', subreddits)
	.replace(':mode', mode);
	if(after) {
		uri += '&after=' + after;
	}

	// console.log(uri);

	redditRequest(uri, function(status, headers, body) {
		// console.log('reddit status', status);
		if(status !== 200) body = {};
		callback(body);
	});
};

exports.getSubredditImages = function(subreddits, callback, after, mode) {
	getSubredditJson(subreddits, function(response) {
		if(!response 
		|| !response.data 
		|| !response.data.children
		|| !response.data.children.length) {
			callback([]);
			return;
		}

		response = response.data.children;
		var info, result = [], post;
		for(var i = 0; i < response.length; i++) {
			post = response[i].data;
			info = image.appendPreviewInfo({
				link : post.url,
				author : post.author,
				nsfw : post.over_18,
				post : url + post.permalink,
				title : post.title,
				postid : post.name
			});

			result.push(info);
		}

		callback(result);

	}, after, mode);
}