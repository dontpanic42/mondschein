define(['jquery', 
        'backbone', 
        'handlebars', 
        'text!templates/viewercontrols.html'],
    function($, Backbone, Handlebars, tpl) {
    'use strict';
    var exp = Backbone.View.extend({

        template: Handlebars.compile(tpl),

        events: {
            'click .mview-next': 'onNext',
            'click .mview-prev': 'onPrev',
            'click .mview-close': 'onClose'
        },

        initialize: function(options) {

            this.options = options;

            this.target = $('body');
            this.$window = $(window);

            this.resizeHandler = this.onWindowResize.bind(this);
            this.keypressHandler = this.onKeyPress.bind(this);

            this.$window.on('resize', this.resizeHandler);
            this.target.on('keyup', this.keypressHandler);

            this.render();
        },

        render: function() {
            this.$el.append(this.template({}));
            this.buttons = this.$('.mview-button');

            if (!this.isTouchDevice()) {
                this.fader = null;
                this.fadeInHandler = this.onFadeIn.bind(this);
                this.fadeOutHandler = this.onFadeOut.bind(this);
                this.fadeable = 
                    this.$('.mview-button, .mview-buttonbar, .mview-close');
                this.target.on('mousemove', this.fadeInHandler);
            }

            this.onWindowResize();

            this.$('.comments').attr('href', this.options.comments);
            this.$('.original').attr('href', this.options.original);
        },

        destroy: function() {
            if (!this.isTouchDevice())
                this.target.off('mousemove', this.fadeInHandler);
            if (this.fader)
                clearTimeout(this.fader);

            this.$window.off('resize', this.resizeHandler);
            this.target.off('keyup', this.keypressHandler);
        },

        isTouchDevice: function() {
            return ('ontouchstart' in document.documentElement);
        },

        vcenterButtons: function() {
            var top = (this.$window.height() - 
                        this.buttons.first().outerHeight()) / 2;
            this.buttons.css('top', top);
        },

        update: function(cur, max) {
            //check button status
            var n = this.$('.mview-next');
            var p = this.$('.mview-prev');

            if (cur >= max && !n.hasClass('mview-hidden'))
                n.addClass('mview-hidden');
            else if (cur < max && n.hasClass('mview-hidden'))
                n.removeClass('mview-hidden');

            if (cur <= 0 && !p.hasClass('mview-hidden'))
                p.addClass('mview-hidden');
            else if (cur > 0 && p.hasClass('mview-hidden'))
                p.removeClass('mview-hidden');

            //update image number
            this.$('span').text('Image ' + (cur + 1) + ' of ' + (max + 1));
        },

        /** event handlers **/

        onMouseMove: function() {
            this.onFadeIn();
        },

        onFadeOut: function() {
            if (!this.fadeable.hasClass('mview-fadeout'))
                this.fadeable.addClass('mview-fadeout');
        },

        onFadeIn: function() {
            if (this.fader)
                clearTimeout(this.fader);

            if (this.fadeable.hasClass('mview-fadeout'))
                this.fadeable.removeClass('mview-fadeout');

            this.fader = setTimeout(this.fadeOutHandler, 2000);
        },

        onKeyPress: function(e) {
            switch (e.keyCode) {
                case 37: this.onPrev(); e.preventDefault(); break;
                case 39: this.onNext(); e.preventDefault(); break;
                case 27: this.onClose(); e.preventDefault(); break;
                default: break;
            }
        },

        onWindowResize: function() {
            this.vcenterButtons();
        },

        onNext: function() {
            this.trigger('mview:next');
        },

        onPrev: function() {
            this.trigger('mview:prev');
        },

        onClose: function() {
            this.trigger('mview:close');
            this.destroy();
        }
    });

    return exp;
});
