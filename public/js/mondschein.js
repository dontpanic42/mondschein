define([], function() {
    'use strict';
    require.config({
        baseUrl: './js/',
        paths: {
            jquery: 'libs/jquery/jquery',
            onoff: 'libs/jquery/jquery.onoff',
            mview: 'libs/jquery/jquery.mview',
            handlebars: 'libs/handlebars/handlebars',
            underscore: 'libs/underscore/underscore',
            backbone: 'libs/backbone/backbone',
            text: 'libs/require/text'
        },

        shim: {
            'underscore' : {
                exports: '_'
            },

            'backbone' : {
                deps: ['jquery', 'underscore'],
                exports: 'Backbone'
            },

            'handlebars' : {
                exports: 'Handlebars'
            },

            'onoff': {
                deps: ['jquery'],
                exports: '$.fn.onoff'
            },

            'mview': {
                deps: ['jquery'],
                exports: '$.fn.mview'
            }
        }
    });

    require(['jquery', 'backbone', 'views/application', 'models/settings', 'onoff'],
        function($, Backbone, App, Settings, IgnoreMe) {
        var Main = Backbone.View.extend({
            el: $('body'),

            router: null,
            currentApp: null,

            events: {
                'click #input-subreddit-btn': 'onChangeSubreddit',
                'keyup #input-subreddit': 'onKeydownSubreddit',
                'focus #input-subreddit': 'onFocusSubreddit',
                'blur #input-subreddit': 'onBlurSubreddit'
            },

            initialize: function() {

                this.$('#stealth-mode')
                .onoff({init: (Settings.get('stealth'))? 'on' : 'off'})
                .on('on', function() { Settings.set('stealth', true); console.log('off')})
                .on('off', function() { Settings.set('stealth', false); console.log('on')});

                this.initializeRouting();
            },

            initializeRouting: function() {
                var self = this;

                var AppRouter = Backbone.Router.extend({
                    routes: {
                        'sub/:subreddit(/)' : 'subredditRoute',
                        '*actions': 'defaultRoute'
                    },

                    defaultRoute: function() {
                        this.subredditRoute('pics');
                    },

                    subredditRoute: function(subreddit) {
                        if (self.currentApp) self.currentApp.remove();

                        self.currentApp = new App({
                            subreddit: subreddit
                        });

                        $('body').append(self.currentApp.$el);

                        if(!Settings.get('stealth'))
                            this.navigate('sub/' + subreddit);
                    }

                });

                this.router = new AppRouter();

                Backbone.history.start();
            },

            onChangeSubreddit: function() {
                var sub = $('#input-subreddit').val();
                sub = sub.replace(' ', '+');
                sub = sub.replace(',', '');

                sub = sub.replace('/r/', '');
                sub = sub.replace('r/', '');

                this.router.subredditRoute(sub);
            },

            onKeydownSubreddit: function(e) {
                if (e.keyCode == 13)
                    this.onChangeSubreddit();
            },

            onFocusSubreddit: function(e) {
                $('#input-subreddit').val('');
            },

            onBlurSubreddit: function(e) {
                $('#input-subreddit').val(this.currentApp.subreddit);
            }
        });

        var main = new Main();
    });
});
