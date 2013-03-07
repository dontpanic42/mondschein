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

        initialize: function(options) {
            this.options = $.extend({
                border: 0
            }, options)

            this.loadHandler = this.render.bind(this);
            this.errorHandler = this.renderError.bind(this);

            this.image = $('<img />');
            this.image.hide();
            this.image.on('load', this.loadHandler);
            this.image.on('error', this.errorHandler);
            this.image.attr('src', this.options.image);
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
            var sw = this.$el.width();

            var iw = this.image.get(0).width;
            var ih = this.image.get(0).height;


            if(iw < si && ih < si) return;

            this.image.css({
                top: -((ih - si) / 2),
                left: -((iw - si) / 2)
            });

        },

        remove: function() {
            this.unbind();
            this.image.off('load', this.loadHandler);
            this.image.off('error', this.errorHandler);
            this.image.$el.unbind();
            this.image.unbind().remove();
            Backbone.View.prototype.remove.call(this);
        }
    });

    return exports;
});
