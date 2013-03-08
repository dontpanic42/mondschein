define(['backbone', 'jquery', 'cookie'], function(Backbone, $, Cookie) {
    var cookieMagic = 'mondschein';
    var maxRecent = 5;

    var SettingsModel = Backbone.Model.extend({
        defaults: {
            stealth: false,

            recommended: [
                {name: 'r/Pics', url: '/sub/pics'},
                {name: 'r/Funny', url: '/sub/funny'},
                {name: 'r/AdviceAnimals', url: '/sub/adviceanimals'},
                {name: 'r/ITookAPicture', url: '/sub/itookapicture'}
            ],

            recent: [
            ],
        },

        initialize: function() {
            this.sync('read', this, {});
            this.listenTo(this, 'change', this.onChange, this);
        },

        pushRecent: function(subreddit) {
            if(this.get('stealth')) return;

            var item = {
                name: 'r/' + subreddit,
                url: '/sub/' + subreddit
            };

            var list = this.get('recent');

            //make sure the two first list entries
            //are not identical (due to refreshing etc.)...
            if(list.length) {
                var first = list.shift();
                list = [first].concat(list);
                if(first.name.toLowerCase() == item.name.toLowerCase())
                    return;
            }


            var item = [item].concat(list);


            if(item.length > maxRecent)
                item.pop();

            this.set('recent', item);
        },

        onChange: function() {
            this.sync('update', this, {});
        },

        sync: function(method, model, options) {
            var self = this;
            switch(method) {
                case "read": {
                    var val = $.cookie(cookieMagic);
                    if(val) {
                        try {
                            var obj = JSON.parse(val);
                            model.parse(obj, model, options);
                        } catch(e) {}
                    } 
                    break;
                }
                case "create":
                case "update": {
                    var val = JSON.stringify(model.toJSON());
                    $.cookie(cookieMagic, val, {
                        expires: 365
                    });
                    break;
                }
                case "delete": {
                    Cookie.unset(cookieMagic);
                    break;
                }
                default:
                    break;
            }
        },

        parse: function(obj, model) {
            console.log('rebuild start', obj);
            if(!obj) return;
            for(var i in obj) {
                model.set(i, obj[i], {silent: true});
                console.log('rebuild', i, obj[i]);
            }
        }
    });

    return new SettingsModel();
});