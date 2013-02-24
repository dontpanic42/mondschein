define(['jquery', 'backbone', 'collections/album', 'models/preview', 'views/image'], function($, Backbone, Album, ImageModel, ImageView) {
	"use strict";
	var exports = Backbone.View.extend({

		album : null,

		initialize: function() {
			
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
			console.log(link);
			var img = new Image({
				image: link,
				el: self.el
			});
		}
	});

	return exports;
});