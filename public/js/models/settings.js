define(['backbone'], function(Backbone) {
    var SettingsModel = Backbone.Model.extend({
        defaults: {
            stealth: false
        }
    });

    return new SettingsModel();
});