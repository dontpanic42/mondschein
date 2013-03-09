define([], function() {
    'use strict';
    require.config({
        baseUrl: './js/',
        paths: {
            jquery: 'libs/jquery/jquery',
            onoff: 'libs/jquery/jquery.onoff',
            animate: 'libs/jquery/jquery.animate-enhanced.min',
            handlebars: 'libs/handlebars/handlebars',
            underscore: 'libs/underscore/underscore',
            backbone: 'libs/backbone/backbone',
            text: 'libs/require/text',
            cookie: 'libs/jquery/jquery.cookie'
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

            'cookie': {
                deps: ['jquery'],
                exports: '$.cookie'
            }
        }
    });

    require(['jquery', 
            'backbone', 
            'views/application', 
            'views/headerbubble',
            'models/settings', 
            'utils/event',
            'views/header',
            'onoff'],
        function($, Backbone, App, HeaderBubble, Settings, Events, Header, IgnoreMe) {
        var Main = Backbone.View.extend({
            el: $('body'),

            router: null,
            currentApp: null,

            initialize: function() {
                this.listenTo(Events, 'change:subreddit', this.onChangeSubreddit, this);
                this.header = new Header({el: $('#header')});
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
                        Events.trigger('change:subreddit', subreddit);
                    }

                });

                this.router = new AppRouter();

                Backbone.history.start();
            },

            onChangeSubreddit: function(name) {
                
                if (this.currentApp) this.currentApp.remove();

                this.currentApp = new App({
                    subreddit: name
                });
        
                Settings.pushRecent(name);

                $('body').append(this.currentApp.$el);

                $('#input-subreddit').val(name);
                if(!Settings.get('stealth'))
                    this.router.navigate('sub/' + name);
            }
        });

        var main = new Main();
    });
});
