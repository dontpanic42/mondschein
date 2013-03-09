define(['jquery', 
        'backbone', 
        'utils/event', 
        'models/settings',
        'views/headerbubble',
        'onoff'], 
    function($, Backbone, Event, Settings, HeaderBubble, IgnoreMe) {
    'use strict';

    var exp = Backbone.View.extend({

        events: {
            'click #input-subreddit-btn': 'onSubredditChange',
            'keyup #input-subreddit': 'onSubredditKeyup',
            'focus #input-subreddit': 'onInputFocus',
            'blur #input-subreddit': 'onInputBlur',
            'on #stealth-mode': 'onEnableStealth',
            'off #stealth-mode': 'onDisableStealth'
        },

        initialize: function() {
            $('body').on('keyup', this.onBodyKeyup.bind(this));
            this.input = $('#input-subreddit');
            this.current = '';
            this.listenTo(Event, 'change:subreddit', this.onSubredditChanged);

            this.render();
        },

        render: function() {
            this.$('#stealth-mode')
            .onoff({init: (Settings.get('stealth'))? 'on' : 'off'});

            this.bubble = new HeaderBubble();
        },

        setSubredditInput: function(value) {
            this.input.val(value);
        },

        getSubredditInput: function() {
            return this.input.val()
            .replace(' ', '+')
            .replace(',', '')
            .replace('/r/', '')
            .replace('r/', '');
        },

        requestSubredditChange: function(name) {
            Event.trigger('change:subreddit', name);
        },

        onSubredditChanged: function(name) {
            this.setSubredditInput(name);
            this.current = name;
        },

        //fired when user clicks 'Go!'
        onSubredditChange: function(e) {
            this.requestSubredditChange(this.getSubredditInput());
        },

        onSubredditKeyup: function(e) {
            switch(e.keyCode) {
                case 13:
                    this.requestSubredditChange(this.getSubredditInput());
                    this.input.blur();
                    break;
                case 27:
                    this.input.blur();
                    break;
                default:
                    break;
            }
        },

        onInputFocus: function(e) {
            this.setSubredditInput('');
        },

        onInputBlur: function(e) {
            this.setSubredditInput(this.current);
        },

        onBodyKeyup: function(e) {
            if(e.keyCode != 76) return;
            if(this.input.is(':focus')) return;
            this.input.focus();
        },

        onEnableStealth: function() {
            Settings.set('stealth', true);
        },

        onDisableStealth: function() {
            Settings.set('stealth', false);
        }

    });

    return exp;
});