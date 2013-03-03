var plugins = {
    'imgur': require('../linkres/imgur').plugin,
    'quickmeme': require('../linkres/quickmeme').plugin,
    'default': require('../linkres/default').plugin
};

exports.resolve = function(link, object) {
    for(var i in plugins) {
        if(plugins[i].isApplicable(link, object)) {
            return plugins[i].run(link, object);
        }
    }

    return void(0);
}
