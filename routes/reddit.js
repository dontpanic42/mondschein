var RedditRequest = require('../support/reddit/reddit').Request;

var errorStrings = {
	E_RESPONSE: 'Reddit returned an error.',
    E_CONNECTION: 'Server could not connect to reddit.',
    E_PARSE: 'Reddit\'s response was malformed.',
    E_EMPTY: 'Ther doesn\'t seem to be anything (more).',
    E_NO_IMAGES: 'The reddit does not seem to contain any displayable content.',

    E_INTERNAL: 'An internal error occured.'
};

var errorCodes = {
	E_RESPONSE: 501,
    E_CONNECTION: 503,
    E_PARSE: 422,
    E_EMPTY: 404,
    E_NO_IMAGES: 444,

    E_INTERNAL: 500
};

exports.find = function(req, res, next) {
	var req = new RedditRequest(
		req.params.reddits, 
		req.params.after);

	req.get(function(d) {
		res.send(d);
	}, function(d) {
		var name = d.type;
		var code = errorCodes[name];
		var mesg = errorStrings[name];

		res.send(code, {
			status: code,
			type: name,
			message: mesg
		});
	});
}