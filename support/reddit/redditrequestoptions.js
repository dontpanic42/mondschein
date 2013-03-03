var cutil = require('../linkres/util');
var query = require('querystring');

/** 
 Example usage:
 var req = new RequestOptions('gonewild', {
    mode: 'top',
    last: 'xyz'
 });
 Optional: a 'params' object in options. Gets
 appended to the query string.   
**/
function RequestOptions(subreddit, options) {
    this.subreddit = subreddit;
    options || (options = {});
    options = cutil.extend(this.defaults, options);
    this.options = options;

    if(this.options.last)
        this.options.params.last = this.options.last;
}

RequestOptions.prototype = {

    host: 'www.reddit.com',
    uri:  '/r/:subreddit/:mode.json',

    defaults: {
        mode: 'hot',
        last: null,
        params: {}
    },

    toString: function() {
        return this.host + this._getRequestUri(
            this.subreddit, this.options);
    },

    toJSON: function() {
        var jsn = {};
        jsn.host = this.host;
        jsn.port = 80;
        jsn.path = this._getRequestUri(
            this.subreddit, this.options);
        jsn.method = 'GET';

        return jsn;
    },

    _getRequestUri: function(subreddit, options) {
        var uri = this.uri
            .replace(':subreddit', subreddit)
            .replace(':mode', options.mode);

        if(options.params)
            uri += '?' + query.stringify(
                options.params, '&', '=');

        return uri;
    }

};

module.exports.RequestOptions = RequestOptions;