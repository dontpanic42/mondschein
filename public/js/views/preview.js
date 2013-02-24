define(['backbone', 'handlebars', 'views/image', 'views/albumpreview', 'text!templates/preview.html'], function(Backbone, Handlebars, ImageView, ImageAlbumPreview, Template) {
	"use strict";
	var exports = Backbone.View.extend({
		tagName: 'div',
		className: 'list-image',

		template: Handlebars.compile(Template),

		initialize: function(options) {
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this));
			var self = this;

			if(this.model.get('isGallery')) {
				// var img = new ImageAlbumPreview({
				// 	model: self.model,
				// 	el: self.$('.image-container').get(0)
				// });
			} else {
				var img = new ImageView({
					image: self.model.get('thumb'),
					el: self.$('.image-container').get(0)
				});
			}

			// var t = this.$el.find('.image-info');
			// this.$el.hover(function() {
			// 	t.toggleClass('opacity-full');
			// }, function() {
			// 	t.toggleClass('opacity-full');
			// });
		},

		getImageTitle: function() {
			return this.model.get('title');
		},

		getImageLink: function() {
			return (this.model.get('isGallery'))?
				this.model.get('link') :
				this.model.get('image');
		}
	});

	return exports;
});