var cutil = require('./util');

function Plugin() { }

Plugin.prototype = {
    isApplicable: function(link, object) {
        return cutil.isSupportedImage(link);
    },

    run: function(link, object) {
        return cutil.extend(object, {
            link: link,
            thumb: link,
            image: link
        });
    }
};

module.exports.plugin = new Plugin();
