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
            border: 10,
            startWith: 0,
            margin: 10,
            text: 'Image {n} of {N}',
            comments: 'reddit.com/r/comments',
            original: 'reddit.com/r/original',
            initWidth: 80,
            initHeight: 100
        },


        template: Handlebars.compile(tpl),

        initialize: function(options) {

            this.options = $.extend(this.defaults, options);
            this.urls = this.options.images;
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

            var self = this;
            this.overlay = new ViewerOverlay();
            this.controls = new ViewerControls({
                el: self.$el,
                comments: self.options.comments,
                original: self.options.original
            });

            this.listenTo(this.overlay, 'mview:close', this.destroy, this);
            this.listenTo(this.controls, 'mview:close', this.destroy, this);
            this.listenTo(this.controls, 'mview:next', this.next, this);
            this.listenTo(this.controls, 'mview:prev', this.prev, this);

            this.resizeHandler = this.onWindowResize.bind(this);
            $(window).on('resize', this.resizeHandler);

            this.resizeContainer(
                this.options.initWidth, 
                this.options.initHeight);

            this.load(this.options.startWith);
        },

        destroy: function() {
            _.each(this.images, function(img) {
                if(!img) return;
                img.src = 
                img.onload = 
                img.onerror = null;
            });

            this.images = null;

            this.controls.destroy();
            this.overlay.destroy();

            $(window).off('resize', this.resizeHandler);

            this.unbind();
            this.remove();
        },

        next: function() {
            if(this.hasNext())
                this.load(++this.current);
        },

        prev: function() {
            if(this.hasPrev())
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

            if(callback) {
                this.elements.container
                .stop()
                .animate(props, 'fast', callback);
            //if no callback is supplied, assume no animation
            //is required (make transition instant).
            } else {
                this.elements.container
                .stop()
                .css(props);
            }
        },        

        clearContainer: function() {
            this.elements.container.children().remove();
        },

        showSpinner: function(value) {
            var el = this.elements.container;
            if(value)
                el.addClass('mview-spinner');
            else
                el.removeClass('mview-spinner');
        },

        loadImage: function(num, url, callback) {
            if(num in this.images) {
                callback(num, url);
                return;
            }

            this.images[num] = new Image();
            this.images[num].onload = function() {
                callback(num, url);
            };

            this.images[num].onerror = function() {
                console.log('Viewer', 'Image load failed', url);
            };

            this.images[num].src = url;
        },

        displayImage: function(num) {
            this.showSpinner(false);
            var img = this.resizeImage(this.images[num]);
            var $img = $(img);
            $img.hide();
            this.resizeContainer(img.width, img.height, function() {
                this.elements.container.append(this.images[num]);
                $img.fadeIn();
                $img = null;
                //this is to force redraw after finish.
                //It prevents chrome from displaying some
                //animation garbage...
                var scroll = this.target.scrollTop();
                this.target.scrollTop(scroll - 1);
                this.target.scrollTop(scroll);
            }.bind(this));
        },

        resizeImage: function(img) {
            var facw = (this.maxWidth - this.border) / img.width;
            var fach = (this.maxHeight - this.border) / img.height;

            if(facw >= 1 && fach >= 1) return img;

            if(facw < fach) {
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