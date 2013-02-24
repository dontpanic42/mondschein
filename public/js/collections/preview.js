define(['jquery', 'backbone', 'models/preview'], function($, Backbone, Model) {
	"use strict";
	var exports = Backbone.Collection.extend({
		model: Model,


		url: function() {
			var url = 'reddit/:subreddit';
			url = url.replace(':subreddit', 'gonewild');
			return url;
		}
	});

	return exports;
});