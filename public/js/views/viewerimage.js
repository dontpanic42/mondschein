define(['jquery', 'backbone', 'handlebars', 'views/image'], function($, Backbone, Handlebars, ImageView) {
    var ViewerImage = Backbone.View.extend({

        tagName: 'div',
        className: 'container',

        template: Handlebars.compile('<img class="image" src="{{getImage}}">'),

        initialize: function(options) {
            this.image = options.image;
            this.render();
        },

        render: function() {
            //this.$el.html(this.template(this));
            var self = this;
            this.view = new ImageView({
                el: self.el,
                image: self.image,
                mode: 'fit-window',
                border: 20
            });

            this.setDimensions();
        },

        setDimensions: function() {
            var w = this.width = $(window).width();
            var h = this.height = $(window).height();

            this.$el.width(w);
            this.$el.height(h);

            // this.$el.find('.image').css({
            //     maxWidth: w,
            //     maxHeight: h
            // });
        },

        remove: function() {
            this.view.remove();
            Backbone.View.prototype.remove.call(this);
            this.unbind();
        },

        getWidth: function() {
            return this.width;
        },

        getImage: function() {
            return this.image;
        }
    });

    return ViewerImage;
});