define(['jquery', 'backbone'], function($, Backbone) {
    var exp = Backbone.View.extend({
        tagName: 'div',
        className: 'banner',

        defaults: {
            type: 'default',
            message: 'Some message',
            type: null,
            closable: true
        },

        events: {
            'click .close': 'onClose'
        },

        initialize: function(options) {
            this.options = $.extend(this.defaults, options);
            this.render();
        },

        render: function() {
            if(typeof this.options.message == 'object')
                this.$el.append(this.options.message);
            else
                this.$el.text(this.options.message);

            if(this.options.closable)
                this.$el.append(
                    $('<div />')
                    .addClass('close')
                    .addClass('hidden'));

            $('body').append(this.$el);

            if(this.options.type)
                this.$el.addClass(this.options.type);
            
            this.$el.removeClass('hidden');
        },

        onClose: function() {
            this.$el.addClass('hidden');
        },

        remove: function() {
            Backbone.View.prototype.remove.call(this);
            this.unbind();
        }
    });

    return exp;
});