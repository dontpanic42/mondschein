define(['backbone'], function(Backbone) {
	"use strict";
	var exports = Backbone.Model.extend({

		initialize: function(options) {

		},

		defaults: {
		  	"link": "www.example.com/link_to_image",
		    "author": "author_name",
		    "nsfw": true,
		    "post": "reddit_link_to_post",
		    "title": "post_tile",
		    "image": "img/unknown.jpg",
		    "thumb": "img/unknown.jpg",
		    "isGallery": false,
		    "albumid": 0,
		    "postid": 0
		}
	});

	return exports;
});