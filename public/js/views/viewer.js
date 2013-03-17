define(['jquery',
        'underscore',
        'backbone',
        'handlebars',
        'views/viewercontrols',
        'views/vieweroverlay',
        'text!templates/viewer.html'],
    function($, _, Backbone, Handlebars, ViewerControls, ViewerOverlay, tpl) {
    'use strict';
    var exp = Backbone.View.extend({

        tagName: 'div',
        className: 'mview',

        defaults: {
            images: [],
            target: 'body',
            startWith: 0,
            margin: 10,
            comments: 'reddit.com/r/comments',
            original: 'reddit.com/r/original',
            initWidth: 80,
            initHeight: 100
        },


        template: Handlebars.compile(tpl),

        initialize: function(options) {

            this.options = $.extend(this.defaults, options);
            this.urls = this.options.images;

            console.log(this.urls);

            this.target = $('body');

            this.images = [];
            this.current = 0;
            this.maxWidth = $(window).width();
            this.maxHeight = $(window).height();

            this.current = 0;

            this.render();
        },

        render: function() {
            this.$el.append(this.template({}));
            this.target.append(this.$el);

            this.elements = {};
            this.elements.container = this.$('.mview-container');

            this.border = this.elements.container.outerWidth() -
                          this.elements.container.width() +
                          (this.options.margin * 2);

            this.overlay = new ViewerOverlay();
            this.controls = new ViewerControls({
                el: this.el,
                comments: this.options.comments,
                original: this.options.original
            });

            this.listenTo(this.overlay, 'mview:close', this.onClose, this);
            this.listenTo(this.controls, 'mview:close', this.onClose, this);
            this.listenTo(this.controls, 'mview:next', this.next, this);
            this.listenTo(this.controls, 'mview:prev', this.prev, this);

            this.resizeHandler = this.onWindowResize.bind(this);
            $(window).on('resize', this.resizeHandler);

            this.resizeContainer(
                this.options.initWidth,
                this.options.initHeight);

            this.load(this.options.startWith);
        },

        onClose: function() {
            this.stopListening();
            _.each(this.images, function(img) {
                if (!img) return;
                img.off().remove();
            });

            this.resizeContainer(0, 0, this.destroy.bind(this));
        },

        destroy: function() {

            this.images = null;

            this.controls.destroy();
            this.overlay.destroy();

            $(window).off('resize', this.resizeHandler);
            this.$el.children().stop(true);
            this.$el.children().remove();

            this.unbind();
            this.remove();
        },

        next: function() {
            if (this.hasNext())
                this.load(++this.current);
        },

        prev: function() {
            if (this.hasPrev())
                this.load(--this.current);
        },

        hasNext: function() {
            return !(this.current >= this.urls.length - 1);
        },

        hasPrev: function() {
            return !(this.current <= 0);
        },

        load: function(num) {
            this.clearContainer();
            this.showSpinner(true);
            this.loadImage(
                this.current,
                this.urls[this.current],
                this.displayImage.bind(this));

            this.controls.update(this.current, this.urls.length - 1);
        },

        resizeContainer: function(width, height, callback) {
            var props = {
                width: width,
                height: height,
                top: (this.maxHeight - height) / 2,
                left: (this.maxWidth - width) / 2
            };

            if (callback) {
                this.elements.container
                .stop(true)
                .animate(props, 'fast', callback);
            //if no callback is supplied, assume no animation
            //is required (make transition instant).
            //Used on window resize event
            } else {
                this.elements.container
                .stop(true)
                .css(props);
            }
        },

        clearContainer: function() {
            this.elements.container.children().remove();
        },

        showSpinner: function(value) {
            var el = this.elements.container;
            if (value)
                el.addClass('mview-spinner');
            else
                el.removeClass('mview-spinner');
        },

        loadImage: function(num, url, callback) {
            if (num in this.images) {
                callback(num, url);
                return;
            }

            this.images[num] =
            $('<img />')
            .on('load', function() {
                callback(num, url);
            })
            .on('error', function() {
                console.log('Viewer', 'Image load failed', url);
            })
            .attr('src', url);
        },

        displayImage: function(num) {
            this.showSpinner(false);
            var img = this.images[num].hide();
            this.resizeImage(img[0]);
            this.resizeContainer(img[0].width, img[0].height, function() {
                this.elements.container.append(this.images[num]);
                img.fadeIn();
            }.bind(this));
        },

        resizeImage: function(img) {
            var facw = (this.maxWidth - this.border) / img.width;
            var fach = (this.maxHeight - this.border) / img.height;

            if (facw >= 1 && fach >= 1) return img;

            if (facw < fach) {
                img.width *= facw;
                img.height *= facw;
            } else {
                img.width *= fach;
                img.height *= fach;
            }

            return img;
        },

        onWindowResize: function() {
            this.maxHeight = $(window).height();
            this.maxWidth = $(window).width();

            var img = this.$('img').get(0);
            img = this.resizeImage(img);
            this.resizeContainer(img.width, img.height);
        }
    });

    return exp;
});
