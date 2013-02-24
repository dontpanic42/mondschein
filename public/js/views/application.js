define(['jquery', 'underscore', 'backbone', 'collections/preview', 'views/preview'], function($, _, Backbone, Preview, PreviewView) {
	"use strict";
	var exports = Backbone.View.extend({

		tagName: 'div',
		className: 'wall',

		autoload: false,
		autoloadOffset: 600,

		initialize : function(options) {
			this.views = [];
			this.pages = [];
			this.autoLoadHandlerInstance = null,
			this.subreddit = options.subreddit;

			console.log('initializing', this.subreddit, this.pages.length);
			this.render();
			this.installAutoloadHandler();
		},

		createPage: function() {
			var self = this;

			this.autoload = false;
			var after = this.getLatestEntry();

			console.log('loading', this.subreddit);

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

		getLatestEntry: function() {
			if(this.pages.length) {
				var lastModel = _.last(this.pages).last();
				if(lastModel)
					var after = lastModel.get('postid');
			}

			return after;
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

			var url = (options.after)?
				'reddit/:subreddit/' + options.after : 
				'reddit/:subreddit';

			return url.replace(':subreddit', options.subreddit);
		},

		render : function() {
			this.createPage();
		},

		installAutoloadHandler: function() {
			this.autoLoadHandlerInstance = this.autoLoadHandler.bind(this);
			$(document).bind('scroll', this.autoLoadHandlerInstance);
		},

		autoLoadHandler: function() {
			var offset = $(document).scrollTop() - ($(document).height() - $(window).height());
			if(Math.abs(offset) < this.autoloadOffset && this.autoload) {
				this.createPage();
			}
		},

		remove: function() {
			$(document).unbind('scroll', this.autoLoadHandlerInstance);
			Backbone.View.prototype.remove.call(this);

			_.each(this.views, function(view) {
				view.remove();
			});
		}
	});

	return exports;
})