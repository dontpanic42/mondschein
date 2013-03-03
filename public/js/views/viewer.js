define(['jquery', 
        'underscore', 
        'backbone', 
        'handlebars', 
        'views/viewerimage',
        'text!templates/viewer.html'], 
        function($, _, Backbone, Handlebars, ViewerImage, tplViewer) {
    var Viewer = Backbone.View.extend({

        tagName: 'div',
        className: 'viewer',

        template : Handlebars.compile(tplViewer), 

        events: {
            'click .next': 'next',
            'touchstart .next': 'next',
            'click .prev': 'prev',
            'touchstart .prev': 'prev',
            'click .close': 'remove',
            'touchstart .close': 'remove',
            'click': 'remove',
            'touchstart': 'remove'
        },

        initialize: function(options) {
            this.touchScrollHandler = this.preventTouchScroll.bind(this),

            this.images = options.images;
            this.page = 0;
            this.views = [];

            this.render();
        },
        
        render: function() {
            this.$el.hide();

            this.$el.html(this.template(this));
            var t = this.$el.find('.stage');

            this.captureBody();

            var x;
            for(var i = 0; i < this.images.length; i++) {
                x = new ViewerImage({image: this.images[i]});
                t.append(x.$el);
                this.views.push(x);
            }


            this.alignButtons();


            //append the viewer
            $('body').append(this.$el);
            this.$el.fadeIn();
        },

        //disables scrolling on body
        captureBody: function() {
            //disable scrolling on body
            $('body').css({overflow: 'hidden'});

            //set the viewer's top to the current scroll offset
            this.$el.css({
                top: $('body').scrollTop()
            });

            //required to force mobile safari to not
            //allow scrolling...
            $('body').on('touchstart', this.touchScrollHandler);
        },

        preventTouchScroll: function(e) {
                e.stopPropagation();
                e.preventDefault();
        },

        alignButtons: function() {
            var h = $(window).height();
            var e = this.$el.find('.prevnext');

            //disable the previous & next buttons
            //when there is only one or less image
            if(this.images.length <= 1) {
                e.hide();
                return;
            }

            var self;
            e.each(function() {
                $(this).css({
                    top: (h - 30) / 2
                });
            });
        },

        remove: function() {
            this.$el.fadeOut(function() {
                $('body').off('touchstart', this.touchScrollHandler);
                $('body').css({overflow: 'scroll'});
                _.each(this.views, function(view) {
                    view.remove();
                });

                Backbone.View.prototype.remove.call(this);

                this.unbind();
            }.bind(this));
        },

        hasNext: function() {
            return (this.page < (this.images.length - 1));
        },

        next: function(e) {
            if(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if(!this.hasNext()) return;

            var c = this.views[this.page];
            this.page++;

            this.$el.find('.stage').css({
                left: '-=' + c.getWidth()
            });
        },

        hasPrev: function() {
            return (this.page > 0);
        },

        prev: function(e) {
            if(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if(!this.hasPrev()) return;

            var c = this.views[this.page];
            this.page--;

            this.$el.find('.stage').css({
                left: '+=' + c.getWidth()
            });
        }

    });

    return Viewer;
});