var cutil = require('./util');

var DEFAULT_FILE_EXTENSION = "jpg";
var THUMB_URL = "http://t.qkme.me/";
var IMAGE_URL = "http://i.qkme.me/";

function Plugin() { }

Plugin.prototype = {
    isApplicable: function(link, object) {
        return (link.indexOf('qkme.me') != -1 ||
                link.indexOf('quickmeme.com') != -1);
    },

    run: function(link, object) {
        if(cutil.isSupportedImage(link))
            return this._processDirectLink(link, object);

        return this._processIndirectLink(link, object);
    },

    _processDirectLink: function(link, object) {
        //expected link form:
        //http://i.qkme.me/3t791q.jpg
        //get thumbnail:
        //http://t.qkme.me/3t791q.jpg
        var thumb = link.replace('i.qkme', 't.qkme');

        object.link = link;
        object.image = link;
        object.thub = thumb;

        return object;
    },

    _processIndirectLink: function(link, object) {
        var id = this._getMemeId(link);
        if(!id || !id.length) return object;

        object.image = IMAGE_URL + id + "." + DEFAULT_FILE_EXTENSION;
        object.link = link;
        object.thumb = THUMB_URL + id + "." + DEFAULT_FILE_EXTENSION;

        return object;
    },

    _getMemeId: function(link) {
        var regex = /[^\/]+(?=\/$|$)/;
        return link.match(regex)[0];
    }
};

module.exports.plugin = new Plugin();