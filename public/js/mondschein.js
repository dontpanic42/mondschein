define([], function() {
	require.config({
		baseUrl : './js/',
		paths: {
			jquery : 'libs/jquery/jquery',
			handlebars : 'libs/handlebars/handlebars',
			underscore : 'libs/underscore/underscore',
			backbone : 'libs/backbone/backbone',
			text : 'libs/require/text'
		},

		shim : {
			'underscore' : {
				exports: '_'
			},

			'backbone' : {
				deps : ['jquery', 'underscore'],
				exports : 'Backbone'
			},

			'handlebars' : {
				exports : 'Handlebars'
			}
		}
	});

	require(['backbone', 'views/application'], function(Backbone, App) {
		var main_view = new App();
	});
});