define(['backbone'], function(Backbone) {
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
                {name: 'r/gonewild', url: '/sub/gonewild'}
            ],
        },

        recentSize: 5,

        pushRecent: function(subreddit) {
            if(this.get('stealth')) return;
            var item = {
                name: 'r/' + subreddit,
                url: '/sub/' + subreddit
            };

            var item = [item].concat(this.get('recent'));


            if(item.length > this.recentSize)
                item.pop();

            this.set('recent', item);
        }
    });

    return new SettingsModel();
});