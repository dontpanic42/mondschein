define(['jquery', 'backbone'], function($, Backbone) {
    var exp = Backbone.View.extend({
        tagName: 'div',
        className: 'mview-overlay',

        events: {
            'click': 'onClose'
        },

        initialize: function() {
            this.target = $('body');
            this.render();
        },

        render: function() {
            this.$el.hide();
            this.target.append(this.$el);
            this.$el.fadeIn();
        },

        destroy: function() {
            this.$el.fadeOut('fast', function() {
                this.unbind();
                this.remove();
            }.bind(this));
        },

        onClose: function() {
            this.trigger('mview:close');
        }
    });

    return exp;
});
