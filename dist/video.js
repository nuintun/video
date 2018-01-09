/**
 * @module video
 * @author nuintun
 * @license MIT
 * @version 0.0.1
 * @description A HTML5 video player.
 * @see https://github.com/nuintun/video#readme
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('video', factory) :
  (global.Video = factory());
}(this, (function () { 'use strict';

  /**
   * @module utils
   * @license MIT
   * @version 2018/01/09
   */

  /**
   * @function slice
   * @description Faster slice arguments
   * @param {Array|arguments} args
   * @param {number} start
   * @returns {Array}
   * @see https://github.com/teambition/then.js
   */
  function slice(args, start) {
    start = start >>> 0;

    var length = args.length;

    if (start >= length) {
      return [];
    }

    var rest = new Array(length - start);

    while (length-- > start) {
      rest[length - start] = args[length];
    }

    return rest;
  }

  /**
   * @function apply
   * @description Faster apply, call is faster than apply, optimize less than 6 args
   * @param  {Function} fn
   * @param  {any} context
   * @param  {Array} args
   * @see https://github.com/micro-js/apply
   * @see http://blog.csdn.net/zhengyinhui100/article/details/7837127
   */
  function apply(fn, context, args) {
    switch (args.length) {
      // Faster
      case 0:
        return fn.call(context);
      case 1:
        return fn.call(context, args[0]);
      case 2:
        return fn.call(context, args[0], args[1]);
      case 3:
        return fn.call(context, args[0], args[1], args[2]);
      default:
        // Slower
        return fn.apply(context, args);
    }
  }

  // 为了节省内存，使用一个共享的构造器
  function TClass() {
    // 空白中转类，可以减少内存占用
  }

  // Object setPrototypeOf
  var setPrototypeOf = typeof Object.setPrototypeOf === 'function';
  // Object create
  var objectCreate = typeof Object.create === 'function';

  /**
   * @function inherits
   * @description 继承
   * @param {Class} subClass
   * @param {Class} superClass
   * @returns {subClass}
   */
  function inherits(subClass, superClass) {
    var superPrototype = superClass.prototype;

    if (setPrototypeOf) {
      setPrototypeOf(subClass.prototype, superPrototype);
    } else if (objectCreate) {
      subClass.prototype = objectCreate(superPrototype);
    } else {
      // 原型属性继承
      TClass.prototype = superPrototype;
      // 初始化实例
      subClass.prototype = new TClass();
      // 不要保持一个 superClass 的杂散引用
      TClass.prototype = null;
    }

    // 设置构造函数
    subClass.prototype.constructor = subClass;

    return subClass;
  }

  /**
   * @module events
   * @license MIT
   * @version 2018/01/09
   */

  /**
   * @class Events
   * @constructor
   */
  function Events() {
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

  /**
   * @module video
   * @license MIT
   * @version 2018/01/09
   */

  function Video(video) {
    this.video = video;
  }

  inherits(Video, Events);

  return Video;

})));
