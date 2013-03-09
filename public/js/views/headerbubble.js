define([
        'jquery',
        'backbone',
        'handlebars',
        'models/settings',
        'text!templates/headerbubble.html'
    ], function($, Backbone, Handlebars, Settings, tpl) {
    'use strict';
    var exp = Backbone.View.extend({
        tagName: 'div',
        className: 'bubble',

        template: Handlebars.compile(tpl),

        initialize: function() {

            this.target = $('#input-subreddit');
            this.showHandler = this.show.bind(this);
            this.hideHandler = this.hide.bind(this);
            this.target.on('focus', this.showHandler);
            this.target.on('blur', this.hideHandler);

            this.render();
        },

        render: function() {
            this.$el.hide();
            $('body').append(this.$el);

            this.place();
            this.update();
        },

        update: function() {
            this.$el.html(this.template({
                recommended: this.getRecommendedSubreddits(),
                recent: this.getRecentSubreddits()
            }));
        },

        place: function() {
            var tbound = this.target[0].getBoundingClientRect();
            var twidth = this.target.width();

            var tcenter = tbound.left + (twidth / 2);
            var bleft = tcenter - (this.$el.width() / 2);

            if(bleft < 0) bleft = 0;

            this.$el.css('left', bleft);

            this.$('.triangle').css(
                'left', tcenter - bleft);
        },

        show: function() {
            this.update();
            this.place();
            this.$el.stop().fadeIn('fast');
        },

        hide: function() {
            this.$el.stop().fadeOut('fast');
        },

        /** template getters **/

        getRecommendedSubreddits: function() {
            return Settings.get('recommended');
        },

        getRecentSubreddits: function() {
            return Settings.get('recent');
        }
    });

    return exp;
});