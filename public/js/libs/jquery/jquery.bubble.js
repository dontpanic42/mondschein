/** OnOff button plugin **/
/** Based on http://jqueryboilerplate.com **/

// events: hide, hidden

;(function ( $, window, document, undefined ) {
    var pluginName = "bubble",
        defaults = {
            //where in the dom to attach the bubble
            reParent: 'body',
            //close when clicked outside?
            transient: true,
            transientTrigger : 'click touchstart',
            //show on initialization
            show : true,
            //dimensions
            width: 350,
            height: 300,
            top: 10,
            left: 10,
            center: true,
            modal: true
        };

    function Plugin( element, options ) {
        this.element = element;
        this.$element = $(element);

        this.parent = null;

        this.$elementOuter = null;
        this.$elementInnter = null;

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            console.log('initializing ');
            this.parent = $(this.options.reParent);

            //Detach the content if necessary
            this.$element.detach().show();

            this.$elementInner = $('<div />').addClass('bubble-content')
            .append(this.$element);
            this.$elementOuter = $('<div />').addClass('bubble')
            .append(this.$elementInner);

            var self = this;
            this.$elementOuter.css({
                width: self.options.width,
                height: self.options.height,
                top : self.options.top,
                left : self.options.left
            }).hide();

            this.center();
            this.addModal();

            this.parent.append(this.$elementOuter);
            console.log('showing', this.options.show);
            if(this.options.show) this.show(true);

        },

        addModal: function() {
            if(!this.options.modal) return;
            this.$modal = $('<div />').addClass('bubble-modal');
            this.$modal.css({
                display: 'none'
            });
            $('body').append(this.$modal);
        },

        showModal: function() {
            if(!this.options.modal) return;
            this.$modal.css({
                display: 'block'
            });
            var self = this;
            setTimeout(function() {
                self.$modal.addClass('show');
            }, 0);
        },

        hideModal: function() {
            if(!this.options.modal) return;
            this.$modal.removeClass('show');
            this.$modal.css({
                display: 'none'
            });
        },

        center: function() {
            if(this.options.center) {
                pleft = ($(document).width() - this.$elementOuter.width()) / 2;
                ptop = ($(document).height() - this.$elementOuter.height()) / 2;
                this.$elementOuter.css({
                    left: pleft,
                    top: ptop
                });
                console.log(ptop, pleft);
            }
        },

        show : function(instant) {
            this.showModal();
            this.center();
            if(!instant) {
                this.$elementOuter.fadeIn('fast');
            } else {
                this.$elementOuter.show();
            }

            //attach click handlers to this element and body
            this.$elementOuter.on(this.options.transientTrigger, this._onClickInside.bind(this));
            //hide on outside click
            $('body').one(this.options.transientTrigger, this._onClickOutside.bind(this));
        },

        hide : function() {
            this.hideModal();
            this.$element.trigger('hide');
            var self = this;
            this.$elementOuter.fadeOut('fast', function() {
                self.$element.trigger('hidden');
            });
            //we don't need the body click-event when hidden
            $('body').off(this.transientTrigger, this._onClickOutside.bind(this));
        },

        _onClickOutside: function(e) {
            console.log('outside-click');
            //if this click had been an inside job
            //it wouldn't have been propagated...
            if(!this.options.transient) return;
            e.preventDefault();
            this.hide();
        },

        _onClickInside: function(e) {
            console.log('inside-click');
            //if click was inside stop propagation
            //so that _clickOutside isn't called
            e.stopPropagation();
        }
    };

    $.fn[pluginName] = function ( options ) {
        var instance;
        var args = Array.prototype.slice.call(arguments);
        return this.each(function () {
            instance = $.data(this, "plugin_" + pluginName);
            if (instance === undefined) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            } else {
                instance[args[0]].apply(instance, args.slice(1));
            }
        });
    };

})( jQuery, window, document );