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

    require(['jquery', 
            'backbone', 
            'views/application', 
            'views/headerbubble',
            'models/settings', 
            'utils/event',
            'onoff'],
        function($, Backbone, App, HeaderBubble, Settings, Events, IgnoreMe) {
        var Main = Backbone.View.extend({
            el: $('body'),

            router: null,
            currentApp: null,

            events: {
                'click #input-subreddit-btn': 'onInputChangeSubreddit',
                'keyup #input-subreddit': 'onKeydownSubreddit',
                'focus #input-subreddit': 'onFocusSubreddit',
                'blur #input-subreddit': 'onBlurSubreddit'
            },

            initialize: function() {

                this.$('#stealth-mode')
                .onoff({init: (Settings.get('stealth'))? 'on' : 'off'})
                .on('on', function() { Settings.set('stealth', true); console.log('off')})
                .on('off', function() { Settings.set('stealth', false); console.log('on')});

                var self = this;
                $('body').on('keyup', function(e) {
                    if(e.keyCode == 76) { //'l'
                        $('#input-subreddit').focus();
                    }
                });

                this.listenTo(Events, 'change:subreddit', this.onChangeSubreddit, this);

                this.bubble = new HeaderBubble();

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

            onInputChangeSubreddit: function() {
                var inp = $('#input-subreddit');
                var sub = inp.val();
                sub = sub.replace(' ', '+');
                sub = sub.replace(',', '');

                sub = sub.replace('/r/', '');
                sub = sub.replace('r/', '');

                Events.trigger('change:subreddit', sub);
                inp.blur();
            },

            onChangeSubreddit: function(name) {
                
                if (this.currentApp) this.currentApp.remove();

                this.currentApp = new App({
                    subreddit: name
                });
        
                Settings.pushRecent(name);

                $('body').append(this.currentApp.$el);

                if(!Settings.get('stealth'))
                    this.router.navigate('sub/' + name);
            },

            onKeydownSubreddit: function(e) {
                if (e.keyCode == 13)
                    this.onInputChangeSubreddit();
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
