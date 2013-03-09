define(['jquery',
        'backbone',
        'collections/album',
        'models/preview',
        'views/image',
        'views/viewer'],
    function($, Backbone, Album, ImageModel, ImageView, Viewer) {
    'use strict';

    var exports = Backbone.View.extend({

        initialize: function() {
            this.album = null;

            var self = this, album;
            this.model.set('album', (this.album = album = new Album({
                albumid: self.model.get('albumid')
            })));

            this.listenTo(album, 'reset', this.render);
            album.fetch();
        },

        render: function() {
            var link = this.album.first().get('thumb');
            this.image = new ImageView({
                image: link,
                el: this.el
            });

            this.listenTo(this.image, 'click:image', this.onImageClick);
        },

        onImageClick: function(e) {
            e.preventDefault();

            var list = [];
            this.album.each(function(image) {
                list.push(image.get('link'));
            });

            var viewer = new Viewer({
                images: list,
                comments: this.model.get('comments'),
                original: this.model.get('link')                   
            });
        },

        remove: function() {
            this.image.remove();
            Backbone.View.prototype.remove.call(this);
        }
    });

    return exports;
});
