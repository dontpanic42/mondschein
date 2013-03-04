
;(function ( $, window, document, undefined ) {

    var pluginName = "mview",
        defaults = {
            images: [],
            target: 'body',
            border: 10,
            startWith: 0,
            margin: 10,
            text: 'Image {n} of {N}',
            comments: 'reddit.com/r/comments',
            original: 'reddit.com/r/original'
        };

    function Plugin( element, options ) {
        this.element = element;
        this.$element = $(element);

        this.images = [];
        this.current = 0;
        this.maxWidth = $(window).width();
        this.maxHeight = $(window).height();

        this.overlay = null;

        this.elements = [
            $('<div class="mview-container" />'),
            $('<div class="mview-button mview-next">next</div>'),
            $('<div class="mview-button mview-prev">prev</div>'),
            $('<div class="mview-buttonbar">' +
                '<a href="#" class="comments" target="_blank" />' +
                '<a href="#" class="original" target="_blank" />' +
                '<span>Image 888 of 888</span>' +
                '</div>'),
            $('<div class="mview-close"></div>')
        ];

        this.options = $.extend( {}, defaults, options );

        this.images = [];
        this.target = $(this.options.target);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this._createOverlay();

            this.urls = this.options.images;

            this.$element.addClass('mview');
            this.$element.append(this.elements);
            this.target.append(this.$element);

            this._installButtons();

            this._centerContainer();
            this._showSpinner(true);

            this._vcenterButtons();

            //save the containers padding/margin
            //to fit the image...
            this.border = this.elements[0].outerWidth() - 
                            this.elements[0].width() +
                            (this.options.margin * 2);

            window.next = this.next.bind(this);
            window.prev = this.prev.bind(this);
            window.d = this._destroy.bind(this);

            this.load(this.options.startWith);
        },

        next: function() {
            if(!this._hasNext()) return;

            this.load(++this.current);
        },

        prev: function() {
            if(!this._hasPrev()) return;

            this.load(--this.current);
        },

        load: function(num) {
            this._clearContainer();
            this._showSpinner(true);
            this._loadImage(
                this.current,
                this.urls[this.current],
                this._displayImage.bind(this));

            this._checkButtonActivation();
        },

        _hasNext: function() {
            return !(this.current >= this.urls.length - 1);
        },

        _hasPrev: function() {
            return !(this.current <= 0);
        },

        _createOverlay: function() {
            this.overlay = $('<div />')
                .addClass('mview-overlay')
                .addClass('mview-hidden');

            this.target.append(this.overlay);

            //timeout trick to make css transitions work
            setTimeout(function() {
                this.overlay.removeClass('mview-hidden');
            }.bind(this), 0);

            this._resizeContainer(100, 100, null);
        },

        _centerContainer: function() {
            var cw = this.elements[0].outerWidth();
            var ch = this.elements[0].outerHeight();

            var self = this;
            this.elements[0].css({
                top:  (ch < self.maxHeight)?
                        (self.maxHeight - ch) / 2 : 0,
                left: (cw < self.maxWidth)?
                        (self.maxWidth - cw) / 2 : 0
            });
        },

        _resizeContainer: function(width, height, callback) {
            var el = this.elements[0];
            var self = this;

            el.stop().animate({
                width: width,
                height: height
            }, {
                step: self._centerContainer.bind(self),
                complete: callback
            });
        },

        _clearContainer: function() {
            var c = this.elements[0];
            if(c.children().length)
                c.children().detach();
        },

        _showSpinner: function(value) {
            var el = this.elements[0];
            if(value)
                el.addClass('mview-spinner');
            else
                el.removeClass('mview-spinner');
        },

        _loadImage: function(num, url, callback) {
            if(num in this.images) {
                this._loadImageComplete(num, url, callback);
                return;
            }

            this.images[num] = new Image();
            this.images[num].onload = function() {
                this._loadImageComplete(num, url, callback);
            }.bind(this);

            this.images[num].onerror = function() {
                this._loadImageFailed(num, url, callback);
            }.bind(this);

            this.images[num].src = url;
        },

        _loadImageComplete: function(num, url, callback) {
            callback(num, url);
        },

        _loadImageFailed: function(num, url, callback) {
            console.error('mview', 'image load fail', url);
        },

        _displayImage: function(num) {
            this._showSpinner(false);
            var img = this._resizeImage(this.images[num]);
            var $img = $(img);
            $img.hide();
            this._resizeContainer(img.width, img.height, function() {
                this.elements[0].append(this.images[num]);
                $img.fadeIn();
                //this is to force redraw after finish.
                //It prevents chrome from displaying some
                //animation garbage...
                var scroll = this.target.scrollTop();
                this.target.scrollTop(scroll - 1);
                this.target.scrollTop(scroll);
            }.bind(this));
        },

        _resizeImage: function(img) {
            var facw = (this.maxWidth - this.border) / img.width;
            var fach = (this.maxHeight - this.border) / img.height;

            if(facw >= 1 && fach >= 1) return img;

            if(facw < fach) {
                img.width *= facw;
                img.height *= facw;
            } else {
                img.width *= fach;
                img.height *= fach;
            }

            return img;
        },

        _vcenterButtons: function() {
            var n = this.$element.find('.mview-button');

            var top = (this.maxHeight - n.first().outerHeight()) / 2;

            n.css({
                top: top
            });

        },

        _installFadingHandler: function(objects) {
            this.fader = null;
            this.faderCallback = null;
            var self = this;

            //no fading out for touch devices...
            if(this._isTouchDevice()) return;

            this.faderCallback = function() {
                if(self.fader)
                    clearTimeout(self.fader);

                if(objects.hasClass('mview-fadeout'))
                   objects.removeClass('mview-fadeout');

                self.fader = setTimeout(function() {
                    if(!objects.hasClass('mview-fadeout'))
                        objects.addClass('mview-fadeout');
                }, 3000);

            }; 

            this.target.on('mousemove', this.faderCallback);
        },

        _isTouchDevice: function() {
            return ('ontouchstart' in document.documentElement);
        },

        _installButtons: function() {
            var n = this.elements[1];
            var p = this.elements[2];

            this.elements[3].find('.comments').attr('href', this.options.comments);
            this.elements[3].find('.original').attr('href', this.options.original);
            this.elements[4].on('click', this._destroy.bind(this));

            this._installFadingHandler(this.$element.find('.mview-button, .mview-buttonbar, .mview-close'));
            this.keyHandler = this._keyDownHandler.bind(this);
            this.target.on('keyup', this.keyHandler);

            if(this.urls.length <= 1) {
                n.hide();
                p.hide();
                return;
            }
                
            n.on('click', this.next.bind(this));
            p.on('click', this.prev.bind(this));

        },

        _keyDownHandler: function(e) {
            switch(e.keyCode) {
                case 37: this.prev(); e.preventDefault(); break;
                case 39: this.next(); e.preventDefault(); break;
                case 27: this._destroy(); e.preventDefault(); break;
                default: break;
            }
        },

        _checkButtonActivation: function() {

            this.$element.find('.mview-buttonbar span').text(
                    this.options.text
                    .replace('{n}', this.current + 1)
                    .replace('{N}', this.urls.length)
                );

            var n = this.elements[1];
            var p = this.elements[2];

            if(!this._hasNext() && !n.hasClass('mview-hidden'))
                n.addClass('mview-hidden');
            else if(this._hasNext() && n.hasClass('mview-hidden'))
                n.removeClass('mview-hidden');

            if(!this._hasPrev() && !p.hasClass('mview-hidden'))
                p.addClass('mview-hidden');
            else if(this._hasPrev() && p.hasClass('mview-hidden'))
                p.removeClass('mview-hidden');
        },

        _destroy: function() {
            if(self.fader) clearTimeout(self.fader);

            $(this.element).removeData(pluginName);

            this.target.off('mousemove', this.faderCallback);
            this.target.off('keyup', this.keyHandler);

            this.$element.children().unbind();
            this.$element.children().remove();

            this.$element.unbind().remove();
            this.overlay.unbind().remove();

            for(var i in this.images) {
                this.images[i] = null;
                delete this.images[i];
            }
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );