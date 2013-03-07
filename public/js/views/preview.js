define(['backbone',
    'handlebars',
    'views/image',
    'views/albumpreview',
    'text!templates/preview.html',
    'views/viewer'],
    function(Backbone, Handlebars, ImageView, ImageAlbumPreview, Template, Viewer) {
    'use strict';

    var exports = Backbone.View.extend({
        tagName: 'div',
        className: 'list-image',

        template: Handlebars.compile(Template),

        initialize: function(options) {
            this.image = null;
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this));
            var self = this;

            if (this.model.get('gallery')) {
                this.createAlbum();
            } else {
                this.createImage();
            }
        },

        createAlbum: function() {      
            var self = this;          
            var img = new ImageAlbumPreview({
                model: self.model,
                el: self.$('.image-container').get(0)
            });

            //this.$el.find('.image-icon').removeClass('hidden');
        },

        createImage: function() {
            var self = this;
            this.image = new ImageView({
                image: self.model.get('thumb'),
                el: self.$('.image-container').get(0)
            });

            this.image.$el.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var viewer = new Viewer({
                    images: [self.model.get('image')],
                    comments: self.model.get('comments'),
                    original: self.model.get('link')
                });
            })
        },

        getImageTitle: function() {
            return this.model.get('title');
        },

        getImageLink: function() {
            return (this.model.get('isGallery')) ?
                this.model.get('link') :
                this.model.get('image');
        },

        remove: function() {
            if (this.image)
                this.image.remove();
            Backbone.View.prototype.remove.call(this);
        }

    });

    return exports;
});
