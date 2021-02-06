/**
 * Implements global window.helpers object that contains various helper
 * methods used by Fluxus. It is like 2.0 of utils.js
 */

(function ($, window, $window) {
  var helpers = {};

  /**
   * Binds an debounced and namespaced resize event to window.
   * Returns event name to allow unbinding.
   */
  helpers.onWindowResize = function (callback, triggerInstantly, namespace) {
      var namespacedEvent;
      namespace = namespace || '';

      if (namespace) {
          namespacedEvent = 'resize.' + namespace + '.fluxus';
      } else {
          namespacedEvent = 'resize.fluxus';
      }

      $window.on(namespacedEvent, _.debounce(callback));

      if (triggerInstantly) {
        callback();
      }

      return namespacedEvent;
  };

  helpers.runIfFound = function ($el, callback) {
    if ($el.length) {
      callback.call($el, $el);
    }
  };

  helpers.imageLoaded = function (url, callback) {
    var image = new Image();
    $(image).load(function () {
      callback.call(this, image);
    });
    image.src = url;
  };

  window.helpers = helpers;

})(jQuery, window, jQuery(window));

}
/*
     FILE ARCHIVED ON 07:44:11 Aug 14, 2018 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 04:24:19 Feb 05, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 92.936
  exclusion.robots: 0.165
  exclusion.robots.policy: 0.152
  RedisCDXSource: 2.689
  esindex: 0.009
  LoadShardBlock: 60.789 (3)
  PetaboxLoader3.datanode: 83.968 (5)
  CDXLines.iter: 25.514 (3)
  load_resource: 198.221 (2)
  PetaboxLoader3.resolve: 82.963 (2)
*/