define(['jquery',
        'underscore',
        'backbone',
        'collections/preview',
        'views/preview',
        'views/bodymessage',
        'utils/event'],
    function($, _, Backbone, Preview, PreviewView, Message, Event) {
    'use strict';
    var exports = Backbone.View.extend({

        tagName: 'div',
        className: 'wall',

        autoload: false,
        autoloadOffset: 600,

        //How many images until 'show more'.
        //400 is the border after which my
        //ipad startet small signs of lag.
        maxImages: 350,

        errorMessages: {
            501: 'The subreddit could not be found.',
            503: 'Could not connect to reddit - perhaps it\'s down?',
            422: 'Reddits response could not be handled.',
            404: 'There is no (more) content to show.',
            444: 'There is no (more) displayable content.',
            500: 'An unknown error occured.'
        },

        initialize: function(options) {
            this.message = null;
            this.views = [];    //contains the individual previews
            this.pages = [];    //contains collection
            this.subreddit = options.subreddit;
            this.$document = $(document);
            this.$window = $(window);

            this.render((options.after) ? options.after : null);
        },

        createPage: function(startWith) {
            this.disableAutoload();

            var after = startWith || this.getLatestEntry();

            //check if the maximal amount of images displayed
            //is reached.
            if (this.views.length > this.maxImages)
                return this.showMoreMessage(after);

            var url = this.getUrl({
                subreddit: this.subreddit,
                after: after
            });

            Event.trigger('loading:start', 'page');

            console.log('loading', this.subreddit, this.views.length);

            var page;
            this.pages.push(page = new Preview());
            page.fetch({
                url: url,
                success: this.createPageFinished.bind(this),
                error: this.createPageFailed.bind(this)
            });
        },

        showMoreMessage: function(after) {
            var url = '#/sub/' + this.subreddit + '/' + after;
            var htm = $('<a>Show more...</a>')
            .attr('href', url);

            htm.one('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                Event.trigger('change:subreddit', this.subreddit, after);

                htm.off().remove();
            }.bind(this));

            console.log(htm.html());
            this.message = new Message({
                message: htm,
                type: 'success'
            });
        },

        getLatestEntry: function() {
            if (this.pages.length) {
                var lastModel = _.last(this.pages).last();
                if (lastModel)
                    var after = lastModel.get('id');
            }

            return after;
        },

        createPageFinished: function() {
            var tmp, self = this;
            var frag = document.createDocumentFragment();
            _.last(this.pages).each(function(image) {
                tmp = new PreviewView({
                    model: image
                });
                $(frag).append(tmp.el);
                self.views.push(tmp);
            });

            this.$el.append(frag);

            Event.trigger('loading:stop', 'page');
            this.enableAutoload();
            //after loading trigger the autoload handler
            //in case the browserwindow is bigger than the
            //loaded set.
            this.autoLoadHandler();
        },

        createPageFailed: function(collection, xhr) {
            console.log('Error loading page', arguments);
            Event.trigger('loading:stop', 'page');
            var msg = (xhr.status in this.errorMessages) ?
                        this.errorMessages[xhr.status] :
                        this.errorMessages[500] + '(' + xhr.status + ')';

            this.message = new Message({
                message: msg
            });
        },

        getUrl: function(options) {
            options = $.extend({
                subreddit: 'pics',
                after: null
            }, options);

            var url = (options.after) ?
                'reddit/:subreddit/' + options.after :
                'reddit/:subreddit';

            return url.replace(':subreddit', options.subreddit);
        },

        render: function(after) {
            this.createPage(after);
        },

        enableAutoload: function() {
            this.autoload = true;

            if (!this.autoLoadHandlerInstance) {
                this.autoLoadHandlerInstance = this.autoLoadHandler.bind(this);
                $(document).on('scroll', this.autoLoadHandlerInstance);
            }
        },

        disableAutoload: function() {
            this.autoload = false;
        },

        autoLoadHandler: function() {
            if (!this.autoload) return;

            var offset = this.$document.scrollTop() -
                        (this.$document.height() - this.$window.height());
            if (Math.abs(offset) < this.autoloadOffset) {
                this.createPage();
            }
        },

        remove: function() {

            this.message && this.message.remove();

            $(document).off('scroll', this.autoLoadHandlerInstance);
            Backbone.View.prototype.remove.call(this);

            _.invoke(this.views, 'remove');
            this.views = null;

            this.pages = null;
        }
    });

    return exports;
});
