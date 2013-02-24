define(['backbone', 'models/album'], function(Backbone, Model) {
	"use strict";
	var exports = Backbone.Collection.extend({
		model: Model,

		initialize: function(options) {
			var id = 0;
			if(options && options.albumid)
				id = options.albumid;

			this.url = 'imgur/' + id;
		}
	});

	return exports;
});