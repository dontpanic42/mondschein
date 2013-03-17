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
            this.model.set('album', (this.album = new Album({
                albumid: this.model.get('albumid')
            })));

            this.listenTo(this.album, 'reset', this.render);
            this.album.fetch();
        },

        render: function() {
            //if the request failed (i.e. the album is empty)
            //do not render anything...
            if(!this.album.length) return;

            var link = this.album.first().get('thumb');
            this.image = new ImageView({
                image: link,
                el: this.el
            });

            this.listenTo(this.image, 'click:image', this.onImageClick);
        },

        onImageClick: function(e) {
            e.preventDefault();

            new Viewer({
                images: this.album.pluck('image'),
                comments: this.model.get('comments'),
                original: this.model.get('link')                   
            });
        },

        remove: function() {
            this.image && this.image.remove();
            Backbone.View.prototype.remove.call(this);
        }
    });

    return exports;
});
