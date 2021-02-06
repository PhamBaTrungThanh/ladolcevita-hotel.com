;(function ($, window, document) {

  "use strict";

  var pluginName = 'burger-menu',
      defaults = {
        slideTime: 500,
        backgroundImage: '',
        items: []
      },
      on = function ($el, eventName, callback) {
        $el.on(eventName + '.burger-menu', callback);
      },
      off = function ($el, eventName) {
        $el.off(eventName + '.burger-menu');
      };

  var BurgerMenu = function (options) {
    var that = this;

    this.options      = _.defaults(options || {}, defaults);
    this.$el          = this._buildMarkup();
    this.$menu        = this.$el.find('.burger-menu-items');
    this.$dim         = $('<div class="burger-menu-dim"></div>');
    this.$toggle      = this.$el.children('.burger-menu-toggle');
    this.$toggleInner = this.$menu.children('.burger-menu-toggle');

    $('body').append(this.$el, this.$dim);

    this.$toggle.add(this.$toggleInner).on('click.burger-menu', function (e) {
      e && e.preventDefault();
      that[that.$el.is('.expanded') ? 'collapse' : 'expand'].call(that);
    });
    this.$toggleInner.hide();

    this.$el.find('.burger-menu-children-toggle').on('click.burger-menu', function (e) {
      e && e.preventDefault();
      var $parent = $(this).parent(),
          $subMenu = $parent.children('ul'),
          expanded = $parent.is('.burger-menu-item-expanded');

      $parent.toggleClass('burger-menu-item-expanded', !expanded);
      if (expanded) {
        $subMenu.slideUp(400);
      } else {
        $subMenu.slideDown(400);
      }
    });

    this.$el.find('.burger-menu-link').on('click.burger-menu', function () {
      $(this).addClass('burger-menu-link-clicked');
    });

    this._enabled       = false;
    this._lastAnimation = 'collapse';
  };

  BurgerMenu.prototype = {

    expand: function () {
      var that = this;

      this._lastAnimation = 'expand';
      $('html').addClass('burger-menu-visible');

      /**
       * .burger-menu-visible will cause a page reflow.
       * .expanded animates some elements, so we need to make
       * sure reflow has finished, thus we call width()
       */
      this.$el.width();
      this.$el.addClass('expanded');

      // Dim content
      this.$dim.css('opacity', 0).show().stop().transition({ opacity: 0.6 }, this.options.slideTime, 'in-out');

      // Slide out drawer
      this.$menu.show().stop().transition({ right: 0 }, this.options.slideTime, 'in-out', function () {
        if (that._lastAnimation == 'expand') {
          that.$toggle.hide();
          that.$toggleInner.show();

        }
      });
    },

    collapse: function () {
      var that = this;

      this._lastAnimation = 'collapse';
      this.$toggle.show();
      this.$toggleInner.hide();

      this.$el.removeClass('expanded');
      this.$dim.stop().transition({ opacity: 0 }, this.options.slideTime, function () { that.$dim.hide() });
      this.$menu.stop().transition({ right: -320 }, this.options.slideTime, 'in-out', function () {
        if (that._lastAnimation == 'collapse') {
          $('html').removeClass('burger-menu-visible');
        }
      });
    },

    enable: function () {
      if (!this._enabled) {
        this._enabled = true;
        this.$toggle.css('x', 50);
        this.$el.show();
        this.$toggle.transition({ x: 0 }, 700, 'in-out');
      }
    },

    disable: function () {
      var that = this;

      if (this._enabled) {
        this._enabled = false;
        this.$el.is('.expanded') && this.collapse();
        this.$toggle.transition({ x: 50 }, 700, 'in-out', function () {
          that.$el.hide().removeClass('active');
        });
      }
    },

    _disableDocumentTouchScroll: function () {
      var $menu = this.$menu;

      $(document).on('touchmove.burger-menu', function (e) {
        e.preventDefault();
      });

      $menu.on('touchmove.burger-menu', function (e) {
        e.stopPropagation();
        if ($menu.get(0).scrollHeight <= $menu.innerHeight()) {
          e.preventDefault();
        }
      });
    },

    _enableDocumentTouchScroll: function () {
      $(document).off('touchmove.burger-menu');
      this.$menu.off('touchmove.burger-menu');
    },

    _menuWalker: function (items, level) {
      var that = this,
          html = '';

      _.each(items, function (item) {
        var el = '<li class="%activeItemClass"><a class="burger-menu-link %activeItemClass" href="%href">%content</a>%childrenToggle%children</li>',
            children = '',
            activeItemClass = item.active ? 'burger-menu-item-active' : '',
            childrenToggle = '';

        if (item.children) {
          children = that._menuWalker.call(that, item.children, level + 1);
          childrenToggle = '<a href="#" class="burger-menu-children-toggle"></a>';
        }

        html += el.replace('%href', item.href)
                  .replace('%childrenToggle', childrenToggle)
                  .replace('%content', item.content)
                  .replace('%children', children)
                  .replace(new RegExp('%activeItemClass', 'g'), activeItemClass);
      });

      return '<ul class="burger-menu-level-' + level + '">' + html + '</ul>';
    },

    _buildMarkup: function () {
      var markup = '<div class="burger-menu">' +
                     '<a class="burger-menu-toggle" href="#"><span></span></a>' +
                     '<div class="burger-menu-items">' +
                       '<a class="burger-menu-toggle inner" href="#"><span></span></a>' +
                       this._menuWalker(this.options.items, 0) +
                     '</div>' +
                   '</div>',
          $el = $(markup);

      $el.find('.burger-menu-item-active').parents('li').each(function () {
        $(this)
          .addClass('burger-menu-item-active burger-menu-item-expanded')
          .children('.burger-menu-link').addClass('burger-menu-item-active');
      });

      if (this.options.backgroundImage) {
        var $bg = $('<div class="bg" />').css('background-image', 'url("' + this.options.backgroundImage + '")');
        $el.find('.burger-menu-items').prepend($bg);
      }

      return $el;
    },

  };

  window.BurgerMenu = BurgerMenu;

})(jQuery, window, document);