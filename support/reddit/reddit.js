var RequestOptions = require('./redditrequestoptions').RequestOptions;
var Request = require('./redditrequest').Request;
var resolver = require('../linkres/linkres')

function RedditImageRequest(subreddit, after, size) {
    size = (size)? size : this.defaultSize;
    this.options = new RequestOptions(subreddit, {
        after: after,
        params: {
            limit: size
        }
    });
}

RedditImageRequest.prototype = {
    defaultSize: 40,

    //error types: 
    // E_RESPONSE (catches 404s, 500s etc)
    // E_CONNECTION (catches connection errors)
    // E_PARSE (catches json parsing errors)
    // E_EMPTY (catches empty responses)
    // E_NO_IMAGES (if response wasn't empty but did not contain displayable images)
    get: function(success, error) {
        var request = new Request(this.options);
        var self = this;
        request.get(
            function(list) {
                self._onRequestComplete(list, success, error);
            }, error);
    },

    _onRequestComplete: function(list, success, error) {
        var last = list[list.length - 1].id;
        list = this._filterImageLinks(list);
        if(!list.length) {
            error({
                status: 200,
                type: 'E_NO_IMAGES',
                object: last
            })
            return;
        }

        success(list);
    },

    _filterImageLinks: function(list) {
        var tmp, obj;
        var result = [];
        for(var i = 0; i < list.length; i++) {
            tmp = list[i];
            obj = resolver.resolve(tmp.url, {
                link: tmp.url,
                thumb: tmp.url,
                gallery: false,
                comments: tmp.permalink,
                title: tmp.title,
                id: tmp.name
            });

            if(obj) result.push(obj);
        }

        return result;
    }
};

exports.Request = RedditImageRequest;

// exports.test = function() {

//     var request = new RedditImageRequest('pics');
//     request.get(function(d) {
//         console.log('success!', d, 'length: ', d.length);
//     }, function(d) {
//         console.log('error!', d);
//     });
// }