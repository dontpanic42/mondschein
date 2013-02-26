/** OnOff button plugin **/
/** Based on http://jqueryboilerplate.com **/

// events: on, off

;(function ( $, window, document, undefined ) {
    var pluginName = "onoff",
        defaults = {
            textOn : 'On',
            textOff : 'Off',
            trigger : 'touchstart click',
            init : 'on'
        };

    function Plugin( element, options ) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        this._ontextElement = $('<div>').addClass('btn-onoff-text-on');
        this._offtextElement = $('<div>').addClass('btn-onoff-text-off');
        this._sliderElement = $('<div>').addClass('btn-onoff-slider');

        this._state = true;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this._ontextElement.text(this.options.textOn);
            this._offtextElement.text(this.options.textOff);

            this.$element
            .addClass('btn-onoff')
            .append(this._sliderElement)
            .append(this._offtextElement)
            .append(this._ontextElement)
            .on(this.options.trigger, this._onToggle.bind(this));

            if(this.options.init == 'off') 
                this.off();
        },

        on: function(el, options) {
            if(this.$element.hasClass('btn-onoff-off'))
                this.$element.removeClass('btn-onoff-off');
            this._state = true;
        },

        off: function(el, options) {
            if(!this.$element.hasClass('btn-onoff-off'))
                this.$element.addClass('btn-onoff-off');
            this._state = false;
        },

        toggle : function(el, options) {
            this._state = !this._state;
            this.$element
            .toggleClass('btn-onoff-off')
            .trigger((this._state)? 'on' : 'off');
        },

        _onToggle : function(e) {
            e.preventDefault();
            this.toggle();
        },

        isOn : function(el, options) {
            return this._state;
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