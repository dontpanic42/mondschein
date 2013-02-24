define(['backbone', 'handlebars', 'views/image', 'views/albumpreview', 'text!templates/preview.html'], function(Backbone, Handlebars, ImageView, ImageAlbumPreview, Template) {
	"use strict";
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

			if(this.model.get('isGallery')) {
				// var img = new ImageAlbumPreview({
				// 	model: self.model,
				// 	el: self.$('.image-container').get(0)
				// });
			} else {
				this.image = new ImageView({
					image: self.model.get('thumb'),
					el: self.$('.image-container').get(0)
				});
			}
		},

		getImageTitle: function() {
			return this.model.get('title');
		},

		getImageLink: function() {
			return (this.model.get('isGallery'))?
				this.model.get('link') :
				this.model.get('image');
		},

		remove: function() {
			if(this.image) this.image.remove();
			Backbone.View.prototype.remove.call(this);
		}

	});

	return exports;
});