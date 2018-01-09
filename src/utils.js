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
export function slice(args, start) {
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
export function apply(fn, context, args) {
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
export function inherits(subClass, superClass) {
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
