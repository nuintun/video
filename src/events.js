/**
 * @module events
 * @license MIT
 * @version 2018/01/09
 */

import { slice, apply } from './utils';

/**
 * @class Events
 * @constructor
 */
export default function Events() {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

Events.prototype = {
  /**
   * @method on
   * @param {string} name
   * @param {Function} callback
   */
  on: function(name, callback) {
    var self = this;
    var events = self['<events>'] || (self['<events>'] = {});

    (events[name] || (events[name] = [])).push(callback);

    return self;
  },
  /**
   * @method once
   * @param {string} name
   * @param {Function} callback
   */
  once: function(name, callback) {
    var self = this;

    function feedback() {
      self.off(name, feedback);
      apply(callback, this, arguments);
    }

    return self.on(name, feedback);
  },
  /**
   * @method emit
   * @param {string} name
   */
  emit: function(name) {
    var callback;
    var self = this;
    var data = slice(arguments, 1);
    var events = self['<events>'] || (self['<events>'] = {});
    var callbacks = events[name] || [];

    // Emit events
    for (var i = 0, length = callbacks.length; i < length; i++) {
      callback = callbacks[i];

      apply(callback, self, data);
    }

    return self;
  },
  /**
   * @method off
   * @param {string} name
   * @param {Function} callback
   */
  off: function(name, callback) {
    var self = this;
    var events = self['<events>'] || (self['<events>'] = {});

    switch (arguments.length) {
      case 0:
        self['<events>'] = {};
        break;
      case 1:
        delete events[name];
        break;
      default:
        if (typeof callback === 'function') {
          var callbacks = events[name];

          if (callbacks) {
            var handler;

            for (var i = 0, length = callbacks.length; i < length; i++) {
              handler = callbacks[i];

              if (handler === callback) {
                callbacks.splice(i, 1);
                break;
              }
            }

            // Remove event from queue to prevent memory leak
            // Suggested by https://github.com/lazd
            // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910
            if (!callbacks.length) {
              delete events[name];
            }
          }
        }
        break;
    }

    return self;
  }
};
