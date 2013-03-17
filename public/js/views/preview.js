define(['backbone',
    'handlebars',
    'views/image',
    'views/albumpreview',
    'text!templates/preview.html',
    'views/viewer'],
    function(Backbone, 
             Handlebars, 
             ImageView, 
             ImageAlbumPreview, 
             Template, 
             Viewer) {
    'use strict';

    var exports = Backbone.View.extend({
        tagName: 'div',
        className: 'list-image',

        template: Handlebars.compile(Template),

        initialize: function(options) {
            this.render();
        },

        render: function() {
            this.$el.html(this.template({
                imageLink: this.getImageLink(),
                hiddenClass: (this.model.get('gallery')) ?
                                '' : 'nodisplay'
            }));

            this.image = (this.model.get('gallery')) ?
                this.createAlbum() :
                this.createImage();
        },

        createAlbum: function() {
            return new ImageAlbumPreview({
                model: this.model,
                el: this.$('.image-container').get(0)
            });
        },

        createImage: function() {

            var img = new ImageView({
                image: this.model.get('thumb'),
                el: this.$('.image-container').get(0)
            });

            this.listenTo(img, 'click:image', this.onImageClick);

            return img;
        },

        onImageClick: function(e) {
            e.preventDefault();
            e.stopPropagation();

            new Viewer({
                images: [this.model.get('image')],
                comments: this.model.get('comments'),
                original: this.model.get('link')
            });
        },

        getImageLink: function() {
            return (this.model.get('isGallery')) ?
                this.model.get('link') :
                this.model.get('image');
        },

        remove: function() {
            this.image.remove();
            Backbone.View.prototype.remove.call(this);
        }

    });

    return exports;
});
