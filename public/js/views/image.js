define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	"use strict";
	var exports = Backbone.View.extend({

		errorImages: [
			'img/notfound-blue.png',
			'img/notfound-green.png',
			'img/notfound-pink.png',
			'img/notfound-red.png'
		],

		initialize: function(options) {
			this.image = $('<img />');
			this.image.hide();
			this.image.on('load', this.render.bind(this));
			this.image.on('error', this.renderError.bind(this));
			this.image.attr('src', this.options.image);
		},

		render: function() {
			this.resize();
			this.$el.append(this.image);
			this.recenter();
			this.image.fadeIn();
		},

		renderError: function() {
			this.image.attr('src', 
				this.errorImages[_.random(0, this.errorImages.length - 1)]);
		},

		resize: function() {
			var si = this.$el.height();

			var iw = this.image.get(0).width;
			var ih = this.image.get(0).height;

			//if image is smaller than preview
			//do not touch the preview size
			if(iw < si && ih < si) return;

			var fac = (iw > ih)?
						si / ih :
						si / iw ;

			this.image.get(0).width = iw * fac;
			this.image.get(0).height = ih * fac;

		},

		recenter: function() {
			var si = this.$el.height();

			var iw = this.image.get(0).width;
			var ih = this.image.get(0).height;

			//if image is smaller than preview
			//do not touch the preview size
			if(iw < si && ih < si) return;

			this.image.css({
				top:  -( (ih - si) / 2),
				left: -( (iw - si) / 2)
			});

		}
	});

	return exports;
});