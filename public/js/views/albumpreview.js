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
            var self = this;
            var link = this.album.first().get('thumb');
            var img = new ImageView({
                image: link,
                el: self.el
            });

            img.$el.on('click', function(e) {
                e.preventDefault();

                var list = [];
                this.album.each(function(image) {
                    list.push(image.get('link'));
                });

                var self = this;
                var viewer = new Viewer({
                    images: list,
                    comments: self.model.get('comments'),
                    original: self.model.get('link')                   
                });

            }.bind(this));
        }
    });

    return exports;
});
