define(['jquery', 'underscore', 'backbone', 'collections/preview', 'views/preview'], function($, _, Backbone, Preview, PreviewView) {
	"use strict";
	var exports = Backbone.View.extend({

		el: $('body'),

		pages : [],

		views: [],

		subreddit: (window.location.hash)? 
						window.location.hash.substring(1) : 
						'pics',

		autoload: false,
		autoloadOffset: 600,

		initialize : function() {
			this.render();
			this.installAutoloadHandler();
		},

		createPage: function() {
			var self = this;

			this.autoload = false;
			if(this.pages.length)
				var after = _.last(this.pages).last().get('postid');

			console.log(this.subreddit);

			var url = this.getUrl({
				subreddit: self.subreddit,
				after: after
			});

			var page;
			this.pages.push(page = new Preview());
			page.fetch({
				url: url,
				success: self.createPageFinished.bind(self)
			});
		},

		createPageFinished: function() {
			var tmp, self = this;
			_.last(this.pages).each(function(image) {
				tmp = new PreviewView({
					model: image
				});
				self.$el.append(tmp.el);
				self.views.push(tmp);
			});

			this.autoload = true;
			//after loading trigger the autoload handler
			//in case the browserwindow is bigger than the
			//loaded set.
			this.autoLoadHandler();
		},

		getUrl : function(options) {
			options = $.extend({
				subreddit: 'pics',
				after: null
			}, options);

			console.log(options.after);

			var url = (options.after)?
				'reddit/:subreddit/' + options.after : 
				'reddit/:subreddit';

			return url.replace(':subreddit', options.subreddit);
		},

		render : function() {
			this.createPage();
		},

		installAutoloadHandler: function() {
			$(document).on('scroll', this.autoLoadHandler.bind(this));
		},

		autoLoadHandler: function() {
			var offset = $(document).scrollTop() - ($(document).height() - $(window).height());
			console.log(Math.abs(offset));
			if(Math.abs(offset) < this.autoloadOffset && this.autoload) {
				this.createPage();
			}
		}
	});

	return exports;
})