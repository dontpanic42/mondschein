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

	require(['jquery', 'backbone', 'views/application'], function($, Backbone, App) {
		// var main_view = new App();
		var Main = Backbone.View.extend({
			el : $('body'),

			router: null,
			currentApp: null,

			events: {
				'click #input-subreddit-btn': 'onChangeSubreddit'
			},

			initialize: function() {
				this.initializeRouting();
			},

			initializeRouting: function() {
				var self = this;

				var AppRouter = Backbone.Router.extend({
					routes: {
						'sub/:subreddit(/)' : 'subredditRoute',
						'*actions': 'defaultRoute',
					},

					defaultRoute : function() {
						if(self.currentApp) self.currentApp.remove();

						self.currentApp = new App({
							subreddit: 'pics'
						});

						$('body').append(self.currentApp.$el);
					},

					subredditRoute: function(subreddit) {
						if(self.currentApp) self.currentApp.remove();

						self.currentApp = new App({
							subreddit: subreddit
						});
						
						$('body').append(self.currentApp.$el);
					}

				});

				this.router = new AppRouter();

				Backbone.history.start();
			},

			onChangeSubreddit: function() {
				var sub = $('#input-subreddit').val();
				sub = sub.replace(' ', '+');
				sub = sub.replace(',', '');
				
				sub = sub.replace('/r/', '');
				sub = sub.replace('r/', '');

				this.router.subredditRoute(sub);
			}
		});

		var main = new Main();
	});
});