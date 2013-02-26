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
                mode: 'overscan',
                border: 0
            }, options)

            this.image = $('<img />');
            this.image.hide();
            console.log('start loading', this.options.image);
            this.image.on('load', this.render.bind(this));
            this.image.on('error', this.renderError.bind(this));
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
            var sw = (this.options.mode == 'fit-window')?
                        $(window).width() : 
                        si;

            si -= (this.options.border * 2);
            sw -= (this.options.border * 2);

            var iw = this.image.get(0).width;
            var ih = this.image.get(0).height;
            console.log(iw, ih);

            //if image is smaller than preview
            //do not touch the preview size
            if (iw < sw && ih < si) return;

            if(this.options.mode == 'fit-window') {
                var fac = Math.min(sw / iw, si / ih);
            } else {
                var fac = (iw > ih) ?
                            si / ih  :
                            si / iw  ;
            }

            this.image.get(0).width = iw * fac;
            this.image.get(0).height = ih * fac;

        },

        recenter: function() {
            var si = this.$el.height();
            var sw = this.$el.width();

            var iw = this.image.get(0).width;
            var ih = this.image.get(0).height;

            if(this.options.mode == 'fit-window') {
                si = $(window).height();
                sw = $(window).width();

                if (ih < si) {
                    var top = (si - ih) / 2;
                    this.image.css({
                        top: top
                    });
                }

            } else { 
                if(iw < si && ih < si) return;

                this.image.css({
                    top: -((ih - si) / 2),
                    left: -((iw - si) / 2)
                });
            }

        }
    });

    return exports;
});
