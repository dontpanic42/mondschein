define(['jquery', 'underscore', 'backbone'],
    function($, _, Backbone) {
    'use strict';
    var exports = Backbone.View.extend({

        errorImages: [
            'img/notfound-blue.png',
            'img/notfound-green.png',
            'img/notfound-pink.png',
            'img/notfound-red.png'
        ],

        defaults: {
            border: 0
        },

        initialize: function(options) {
            this.options = $.extend(this.defaults, options)

            this.image = $('<img />')
            .hide()
            .on('load', this.render.bind(this))
            .on('error', this.renderError.bind(this))
            .on('click', this.onClick.bind(this))
            .attr('src', this.options.image);
        },

        render: function() {
            this.resize();
            this.$el.append(this.image);
            this.recenter();
            this.image.fadeIn();
        },

        renderError: function() {
            this.image.attr('src',
                this.errorImages[_.random(0, this.errorImages.length - 1)]);
        },

        resize: function() {
            var si = this.$el.height();

            si -= (this.options.border * 2);

            var iw = this.image.get(0).width;
            var ih = this.image.get(0).height;

            //if image is smaller than preview
            //do not touch the preview size
            if (iw < si && ih < si) return;

            var fac = (iw > ih) ?
                        si / ih  :
                        si / iw  ;

            this.image.get(0).width = iw * fac;
            this.image.get(0).height = ih * fac;

        },

        recenter: function() {
            var si = this.$el.height();

            var iw = this.image.get(0).width;
            var ih = this.image.get(0).height;


            if(iw < si && ih < si) return;

            this.image.css({
                top: -((ih - si) / 2),
                left: -((iw - si) / 2)
            });

        },

        onClick: function(e) {
            this.trigger('click:image', e);
        },

        remove: function() {
            this.unbind();
            this.image.off().remove();
            Backbone.View.prototype.remove.call(this);
        }
    });

    return exports;
});
