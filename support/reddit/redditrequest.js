var http = require('http');

function Request(requestOptions) {
    this.options = requestOptions.toJSON();
}

Request.prototype = {
    encoding: 'utf8',

    //error types: 
    // E_RESPONSE (catches 404s, 500s etc)
    // E_CONNECTION (catches connection errors)
    // E_PARSE (catches json parsing errors)
    // E_EMPTY (catches empty responses)
    get: function(successcb, errorcb) {
        var self = this;
        var request = http.get(this.options, function(response) {
            if(response.statusCode != 200) {
                errorcb({
                    status: response.statusCode,
                    type: 'E_RESPONSE',
                    object: response
                });

                return;
            }

            response.setEncoding(this.encoding);

            var responseData = '';

            response.on('data', function(chunk) {
                responseData += chunk;
            });

            response.on('end', function() {
                self._processData(responseData, successcb, errorcb);
            });

            response.on('error', function(e) {
                errorcb({
                    status: response.statusCode,
                    type: 'E_CONNECTION',
                    object: e
                });
            }) 
        });

        request.on('error', function(e) {
            errorcb({
                status: 404,
                type: 'E_CONNECTION',
                object: e
            });
        })
    },

    _processData: function(raw, cb, ecb) {
        var data;
        try {
            data = JSON.parse(raw);
        } catch(e) {
            data = null;
        }

        //if data could not be parsed...
        if(!data) {
            ecb({
                status: 200,
                type: 'E_PARSE',
                object: raw
            });
            return;
        }

        //if the response is vailid but the
        //content list is empty...
        var list;
        if( !data.data ||
            !data.data.children ||
            !data.data.children.length ||
            !( (list = this._prefilterContentList(data.data.children)).length )) {
            ecb({
                status: 200,
                type: 'E_EMPTY',
                object: data
            });
            return;
        }

        cb(list);
    },

    _prefilterContentList: function(list) {
        var result = [];
        var tmp;
        for(var i = 0; i < list.length; i++) {
            tmp = list[i];
            if(!tmp.data) continue;
            result.push(tmp.data);
        }

        return result;
    }
};

module.exports.Request = Request;