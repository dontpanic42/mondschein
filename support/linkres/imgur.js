var cutil = require('./util');

var THUMB_QUALITY = 'm';
var DEFAULT_FILE_EXTENSION = 'jpg';

function Plugin() {}

Plugin.prototype = {
    isApplicable: function(link, object) {
        return (link
                .toLowerCase()
                .indexOf('imgur.com') == -1)?
                    false:
                    true;
    },

    run: function(link, object) {
        if(cutil.isSupportedImage(link))
            return this._processDirectLink(link, object);

        return this._processIndirectLink(link, object);
    },

    _processDirectLink: function(link, object) {
        //image
        object.image = link;
        object.thumb = link; //fallback

        //thumbnail
        var i = link.lastIndexOf('.');
        if(i == -1) return object;

        var thumb = link.substring(0, i) + 
                    THUMB_QUALITY + 
                    "." + cutil.getFileExtension(link);

        object.thumb = thumb;

        return object;
    },

    _processIndirectLink: function(link, object) {
        //link is direct link without file extension
        if(link.indexOf('imgur.com/a/') == -1)
            return this._processDirectLink(link + "." + DEFAULT_FILE_EXTENSION, object);

        //not much (synchronous) work to do here...
        object.gallery = true;
        object.image = link;
        object.albumid = this._getAlbumId(link);

        return object;
    },

    _getAlbumId: function(link) {
        var regex = /[^\/]+(?=\/$|$)/;
        return link.match(regex)[0];
    }
};

module.exports.plugin = new Plugin();