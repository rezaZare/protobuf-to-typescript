var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// node_modules/detect-libc/lib/detect-libc.js
var require_detect_libc = __commonJS({
  "node_modules/detect-libc/lib/detect-libc.js"(exports2, module2) {
    "use strict";
    var platform = require("os").platform();
    var spawnSync = require("child_process").spawnSync;
    var readdirSync2 = require("fs").readdirSync;
    var GLIBC = "glibc";
    var MUSL = "musl";
    var spawnOptions = {
      encoding: "utf8",
      env: process.env
    };
    if (!spawnSync) {
      spawnSync = function() {
        return { status: 126, stdout: "", stderr: "" };
      };
    }
    function contains(needle) {
      return function(haystack) {
        return haystack.indexOf(needle) !== -1;
      };
    }
    function versionFromMuslLdd(out) {
      return out.split(/[\r\n]+/)[1].trim().split(/\s/)[1];
    }
    function safeReaddirSync(path5) {
      try {
        return readdirSync2(path5);
      } catch (e) {
      }
      return [];
    }
    var family = "";
    var version = "";
    var method = "";
    if (platform === "linux") {
      glibc = spawnSync("getconf", ["GNU_LIBC_VERSION"], spawnOptions);
      if (glibc.status === 0) {
        family = GLIBC;
        version = glibc.stdout.trim().split(" ")[1];
        method = "getconf";
      } else {
        ldd = spawnSync("ldd", ["--version"], spawnOptions);
        if (ldd.status === 0 && ldd.stdout.indexOf(MUSL) !== -1) {
          family = MUSL;
          version = versionFromMuslLdd(ldd.stdout);
          method = "ldd";
        } else if (ldd.status === 1 && ldd.stderr.indexOf(MUSL) !== -1) {
          family = MUSL;
          version = versionFromMuslLdd(ldd.stderr);
          method = "ldd";
        } else {
          lib = safeReaddirSync("/lib");
          if (lib.some(contains("-linux-gnu"))) {
            family = GLIBC;
            method = "filesystem";
          } else if (lib.some(contains("libc.musl-"))) {
            family = MUSL;
            method = "filesystem";
          } else if (lib.some(contains("ld-musl-"))) {
            family = MUSL;
            method = "filesystem";
          } else {
            usrSbin = safeReaddirSync("/usr/sbin");
            if (usrSbin.some(contains("glibc"))) {
              family = GLIBC;
              method = "filesystem";
            }
          }
        }
      }
    }
    var glibc;
    var ldd;
    var lib;
    var usrSbin;
    var isNonGlibcLinux = family !== "" && family !== GLIBC;
    module2.exports = {
      GLIBC,
      MUSL,
      family,
      version,
      method,
      isNonGlibcLinux
    };
  }
});

// node_modules/dprint-node/index.js
var require_dprint_node = __commonJS({
  "node_modules/dprint-node/index.js"(exports2, module2) {
    var parts = [process.platform, process.arch];
    if (process.platform === "linux") {
      const { MUSL, family } = require_detect_libc();
      if (family === MUSL) {
        parts.push("musl");
      } else if (process.arch === "arm") {
        parts.push("gnueabihf");
      } else {
        parts.push("gnu");
      }
    } else if (process.platform === "win32") {
      parts.push("msvc");
    }
    module2.exports = require(`./dprint-node.${parts.join("-")}.node`);
  }
});

// node_modules/strip-filename-increment/index.js
var require_strip_filename_increment = __commonJS({
  "node_modules/strip-filename-increment/index.js"(exports2, module2) {
    "use strict";
    var path5 = require("path");
    var isObject2 = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    var constants = {
      REGEX_DARWIN: /( copy( [0-9]+)?)+$/i,
      REGEX_DEFAULT: /(( copy)?( \([0-9]+\)|[0-9]+)?)+$/i,
      REGEX_WIN32: /( \([0-9]+\))+$/i,
      REGEX_NON_STANDARD: /( \.\(incomplete\)| \([0-9]+\)|[- ]+)+$/i,
      REGEX_LINUX: /( \(((another|[0-9]+(th|st|nd|rd)) )?copy\))+$/i,
      REGEX_RAW_NUMBERS: "| [0-9]+",
      REGEX_SOURCE: " \\((?:(another|[0-9]+(th|st|nd|rd)) )?copy\\)|copy( [0-9]+)?|\\.\\(incomplete\\)| \\([0-9]+\\)|[- ]+"
    };
    var strip = (file, options) => {
      if (!file)
        return file;
      if (isObject2(file) && file.path) {
        return strip.file(file, options);
      }
      let filepath = strip.increment(file, options);
      let extname = path5.extname(filepath);
      let dirname2 = strip.increment(path5.dirname(filepath), options);
      let stem = strip.increment(path5.basename(filepath, extname), options);
      return path5.join(dirname2, stem + extname);
    };
    strip.increment = (input, options = {}) => {
      if (typeof input === "string" && input !== "") {
        let suffix = options.removeRawNumbers === true ? constants.REGEX_RAW_NUMBERS : "";
        let source = constants.REGEX_SOURCE + suffix;
        return input.replace(new RegExp(`(${source})+$`, "i"), "");
      }
      return input;
    };
    strip.dirname = (filepath, options) => {
      return strip.increment(path5.dirname(filepath), options);
    };
    strip.stem = (filepath, options) => {
      return strip.increment(path5.basename(filepath, path5.extname(filepath)), options);
    };
    strip.basename = (filepath, options) => {
      let extname = path5.extname(filepath);
      let stem = path5.basename(filepath, extname);
      return strip.increment(stem, options) + extname;
    };
    strip.path = (filepath, options) => {
      let extname = path5.extname(filepath);
      let stem = strip.increment(path5.basename(filepath, extname), options);
      let dirname2 = strip.increment(path5.dirname(filepath), options);
      return path5.join(dirname2, stem + extname);
    };
    strip.file = (file, options = {}) => {
      if (!isObject2(file))
        return file;
      if (!file.path)
        return file;
      if (file.dirname && !file.dir)
        file.dir = file.dirname;
      if (file.basename && !file.base)
        file.base = file.basename;
      if (file.extname && !file.ext)
        file.ext = file.extname;
      if (file.stem && !file.name)
        file.name = file.stem;
      if (file.dir === void 0)
        file.dir = path5.dirname(file.path);
      if (file.ext === void 0)
        file.ext = path5.extname(file.path);
      if (file.base === void 0)
        file.base = path5.basename(file.path);
      if (file.name === void 0)
        file.name = path5.basename(file.path, file.ext);
      file.name = strip.increment(file.name, options);
      file.dir = strip.increment(file.dir, options);
      file.base = file.name + file.ext;
      file.path = path5.join(file.dir, file.base);
      return file;
    };
    module2.exports = strip;
  }
});

// node_modules/add-filename-increment/index.js
var require_add_filename_increment = __commonJS({
  "node_modules/add-filename-increment/index.js"(exports2, module2) {
    "use strict";
    var fs3 = require("fs");
    var path5 = require("path");
    var strip = require_strip_filename_increment();
    var ordinals = ["th", "st", "nd", "rd"];
    var ordinal = (n) => {
      if (isNaN(n)) {
        throw new TypeError("expected a number");
      }
      return ordinals[(n % 100 - 20) % 10] || ordinals[n % 100] || ordinals[0];
    };
    var toOrdinal = (number) => {
      return `${Number(number)}${ordinal(Math.abs(number))}`;
    };
    var format2 = {
      darwin(stem, n) {
        if (n === 1)
          return `${stem} copy`;
        if (n > 1)
          return `${stem} copy ${n}`;
        return stem;
      },
      default: (stem, n) => n > 1 ? `${stem} (${n})` : stem,
      win32: (stem, n) => n > 1 ? `${stem} (${n})` : stem,
      windows: (stem, n) => format2.win32(stem, n),
      linux(stem, n) {
        if (n === 0)
          return stem;
        if (n === 1)
          return `${stem} (copy)`;
        if (n === 2)
          return `${stem} (another copy)`;
        return `${stem} (${toOrdinal(n)} copy)`;
      }
    };
    var increment = (...args) => {
      return typeof args[0] === "string" ? increment.path(...args) : increment.file(...args);
    };
    increment.path = (filepath, options = {}) => {
      return path5.format(increment.file(path5.parse(filepath), options));
    };
    increment.file = (file, options = {}) => {
      if (typeof file === "string") {
        let temp = file;
        file = path5.parse(file);
        file.path = temp;
      }
      file = { ...file };
      if (file.path && Object.keys(file).length === 1) {
        let temp = file.path;
        file = path5.parse(file.path);
        file.path = temp;
      }
      if (file.dirname && !file.dir)
        file.dir = file.dirname;
      if (file.basename && !file.base)
        file.base = file.basename;
      if (file.extname && !file.ext)
        file.ext = file.extname;
      if (file.stem && !file.name)
        file.name = file.stem;
      let { start = 1, platform = process.platform } = options;
      let fn = options.increment || format2[platform] || format2.default;
      if (start === 1 && (platform === "win32" || platform === "windows")) {
        if (!options.increment) {
          start++;
        }
      }
      if (options.strip === true) {
        file.name = strip.increment(file.name, options);
        file.dir = strip.increment(file.dir, options);
        file.base = file.name + file.ext;
      }
      if (options.fs === true) {
        let name = file.name;
        let dest = path5.format(file);
        while (fs3.existsSync(dest)) {
          file.base = fn(name, start++) + file.ext;
          dest = path5.format(file);
        }
      } else {
        file.base = fn(file.name, start) + file.ext;
      }
      file.path = path5.join(file.dir, file.base);
      return file;
    };
    increment.ordinal = ordinal;
    increment.toOrdinal = toOrdinal;
    module2.exports = increment;
  }
});

// node_modules/write/index.js
var require_write = __commonJS({
  "node_modules/write/index.js"(exports2, module2) {
    "use strict";
    var fs3 = require("fs");
    var path5 = require("path");
    var increment = require_add_filename_increment();
    var write = (filepath, data, options, callback) => {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      const opts = { encoding: "utf8", ...options };
      const destpath = opts.increment ? incrementName(filepath, options) : filepath;
      const result = { path: destpath, data };
      if (opts.overwrite === false && exists(filepath, destpath)) {
        throw new Error("File already exists: " + destpath);
      }
      const promise = mkdir(path5.dirname(destpath), { recursive: true, ...options }).then(() => {
        return new Promise((resolve3, reject) => {
          fs3.createWriteStream(destpath, opts).on("error", (err) => reject(err)).on("close", resolve3).end(ensureNewline(data, opts));
        });
      });
      if (typeof callback === "function") {
        promise.then(() => callback(null, result)).catch(callback);
        return;
      }
      return promise.then(() => result);
    };
    write.sync = (filepath, data, options) => {
      if (typeof filepath !== "string") {
        throw new TypeError("expected filepath to be a string");
      }
      const opts = { encoding: "utf8", ...options };
      const destpath = opts.increment ? incrementName(filepath, options) : filepath;
      if (opts.overwrite === false && exists(filepath, destpath)) {
        throw new Error("File already exists: " + destpath);
      }
      mkdirSync(path5.dirname(destpath), { recursive: true, ...options });
      fs3.writeFileSync(destpath, ensureNewline(data, opts), opts);
      return { path: destpath, data };
    };
    write.stream = (filepath, options) => {
      if (typeof filepath !== "string") {
        throw new TypeError("expected filepath to be a string");
      }
      const opts = { encoding: "utf8", ...options };
      const destpath = opts.increment ? incrementName(filepath, options) : filepath;
      if (opts.overwrite === false && exists(filepath, destpath)) {
        throw new Error("File already exists: " + filepath);
      }
      mkdirSync(path5.dirname(destpath), { recursive: true, ...options });
      return fs3.createWriteStream(destpath, opts);
    };
    var incrementName = (destpath, options = {}) => {
      if (options.increment === true)
        options.increment = void 0;
      return increment(destpath, options);
    };
    var ensureNewline = (data, options) => {
      if (!options || options.newline !== true)
        return data;
      if (typeof data !== "string" && !isBuffer(data)) {
        return data;
      }
      if (String(data.slice(-1)) !== "\n") {
        if (typeof data === "string") {
          return data + "\n";
        }
        return data.concat(Buffer.from("\n"));
      }
      return data;
    };
    var exists = (filepath, destpath) => {
      return filepath === destpath && fs3.existsSync(filepath);
    };
    var mkdir = (dirname2, options) => {
      return new Promise((resolve3) => fs3.mkdir(dirname2, options, () => resolve3()));
    };
    var mkdirSync = (dirname2, options) => {
      try {
        fs3.mkdirSync(dirname2, options);
      } catch (err) {
      }
    };
    var isBuffer = (data) => {
      if (data.constructor && typeof data.constructor.isBuffer === "function") {
        return data.constructor.isBuffer(data);
      }
      return false;
    };
    module2.exports = write;
  }
});

// node_modules/@protobufjs/aspromise/index.js
var require_aspromise = __commonJS({
  "node_modules/@protobufjs/aspromise/index.js"(exports2, module2) {
    "use strict";
    module2.exports = asPromise;
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
      while (index < arguments.length)
        params[offset++] = arguments[index++];
      return new Promise(function executor(resolve3, reject) {
        params[offset] = function callback(err) {
          if (pending) {
            pending = false;
            if (err)
              reject(err);
            else {
              var params2 = new Array(arguments.length - 1), offset2 = 0;
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2];
              resolve3.apply(null, params2);
            }
          }
        };
        try {
          fn.apply(ctx || null, params);
        } catch (err) {
          if (pending) {
            pending = false;
            reject(err);
          }
        }
      });
    }
  }
});

// node_modules/@protobufjs/base64/index.js
var require_base64 = __commonJS({
  "node_modules/@protobufjs/base64/index.js"(exports2) {
    "use strict";
    var base64 = exports2;
    base64.length = function length(string) {
      var p = string.length;
      if (!p)
        return 0;
      var n = 0;
      while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
      return Math.ceil(string.length * 3) / 4 - n;
    };
    var b64 = new Array(64);
    var s64 = new Array(123);
    for (i = 0; i < 64; )
      s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
    var i;
    base64.encode = function encode(buffer, start, end) {
      var parts = null, chunk = [];
      var i2 = 0, j = 0, t;
      while (start < end) {
        var b = buffer[start++];
        switch (j) {
          case 0:
            chunk[i2++] = b64[b >> 2];
            t = (b & 3) << 4;
            j = 1;
            break;
          case 1:
            chunk[i2++] = b64[t | b >> 4];
            t = (b & 15) << 2;
            j = 2;
            break;
          case 2:
            chunk[i2++] = b64[t | b >> 6];
            chunk[i2++] = b64[b & 63];
            j = 0;
            break;
        }
        if (i2 > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i2 = 0;
        }
      }
      if (j) {
        chunk[i2++] = b64[t];
        chunk[i2++] = 61;
        if (j === 1)
          chunk[i2++] = 61;
      }
      if (parts) {
        if (i2)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i2));
    };
    var invalidEncoding = "invalid encoding";
    base64.decode = function decode(string, buffer, offset) {
      var start = offset;
      var j = 0, t;
      for (var i2 = 0; i2 < string.length; ) {
        var c = string.charCodeAt(i2++);
        if (c === 61 && j > 1)
          break;
        if ((c = s64[c]) === void 0)
          throw Error(invalidEncoding);
        switch (j) {
          case 0:
            t = c;
            j = 1;
            break;
          case 1:
            buffer[offset++] = t << 2 | (c & 48) >> 4;
            t = c;
            j = 2;
            break;
          case 2:
            buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
            t = c;
            j = 3;
            break;
          case 3:
            buffer[offset++] = (t & 3) << 6 | c;
            j = 0;
            break;
        }
      }
      if (j === 1)
        throw Error(invalidEncoding);
      return offset - start;
    };
    base64.test = function test(string) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
    };
  }
});

// node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = __commonJS({
  "node_modules/@protobufjs/eventemitter/index.js"(exports2, module2) {
    "use strict";
    module2.exports = EventEmitter;
    function EventEmitter() {
      this._listeners = {};
    }
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
      (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this
      });
      return this;
    };
    EventEmitter.prototype.off = function off(evt, fn) {
      if (evt === void 0)
        this._listeners = {};
      else {
        if (fn === void 0)
          this._listeners[evt] = [];
        else {
          var listeners = this._listeners[evt];
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn)
              listeners.splice(i, 1);
            else
              ++i;
        }
      }
      return this;
    };
    EventEmitter.prototype.emit = function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i = 1;
        for (; i < arguments.length; )
          args.push(arguments[i++]);
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args);
      }
      return this;
    };
  }
});

// node_modules/@protobufjs/float/index.js
var require_float = __commonJS({
  "node_modules/@protobufjs/float/index.js"(exports2, module2) {
    "use strict";
    module2.exports = factory(factory);
    function factory(exports3) {
      if (typeof Float32Array !== "undefined")
        (function() {
          var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
          function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
          }
          function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
          }
          exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
          exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
          function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
          }
          function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
          }
          exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
          exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
        })();
      else
        (function() {
          function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0)
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos);
            else if (isNaN(val))
              writeUint(2143289344, buf, pos);
            else if (val > 34028234663852886e22)
              writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 11754943508222875e-54)
              writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
            else {
              var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
              writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
          }
          exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
          exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
          function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
            return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
          }
          exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
          exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
        })();
      if (typeof Float64Array !== "undefined")
        (function() {
          var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
          function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
          }
          function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
          }
          exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
          exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
          function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
          }
          function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
          }
          exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
          exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
        })();
      else
        (function() {
          function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0) {
              writeUint(0, buf, pos + off0);
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos + off1);
            } else if (isNaN(val)) {
              writeUint(0, buf, pos + off0);
              writeUint(2146959360, buf, pos + off1);
            } else if (val > 17976931348623157e292) {
              writeUint(0, buf, pos + off0);
              writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
              var mantissa;
              if (val < 22250738585072014e-324) {
                mantissa = val / 5e-324;
                writeUint(mantissa >>> 0, buf, pos + off0);
                writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
              } else {
                var exponent = Math.floor(Math.log(val) / Math.LN2);
                if (exponent === 1024)
                  exponent = 1023;
                mantissa = val * Math.pow(2, -exponent);
                writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
              }
            }
          }
          exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
          exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
          function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
          }
          exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
          exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
        })();
      return exports3;
    }
    function writeUintLE(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    function writeUintBE(val, buf, pos) {
      buf[pos] = val >>> 24;
      buf[pos + 1] = val >>> 16 & 255;
      buf[pos + 2] = val >>> 8 & 255;
      buf[pos + 3] = val & 255;
    }
    function readUintLE(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
    }
    function readUintBE(buf, pos) {
      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
    }
  }
});

// node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS({
  "node_modules/@protobufjs/inquire/index.js"(exports, module) {
    "use strict";
    module.exports = inquire;
    function inquire(moduleName) {
      try {
        var mod = eval("quire".replace(/^/, "re"))(moduleName);
        if (mod && (mod.length || Object.keys(mod).length))
          return mod;
      } catch (e) {
      }
      return null;
    }
  }
});

// node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS({
  "node_modules/@protobufjs/utf8/index.js"(exports2) {
    "use strict";
    var utf8 = exports2;
    utf8.length = function utf8_length(string) {
      var len = 0, c = 0;
      for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    };
    utf8.read = function utf8_read(buffer, start, end) {
      var len = end - start;
      if (len < 1)
        return "";
      var parts = null, chunk = [], i = 0, t;
      while (start < end) {
        t = buffer[start++];
        if (t < 128)
          chunk[i++] = t;
        else if (t > 191 && t < 224)
          chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
          t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
          chunk[i++] = 55296 + (t >> 10);
          chunk[i++] = 56320 + (t & 1023);
        } else
          chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i = 0;
        }
      }
      if (parts) {
        if (i)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i));
    };
    utf8.write = function utf8_write(string, buffer, offset) {
      var start = offset, c1, c2;
      for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
          buffer[offset++] = c1;
        } else if (c1 < 2048) {
          buffer[offset++] = c1 >> 6 | 192;
          buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer[offset++] = c1 >> 18 | 240;
          buffer[offset++] = c1 >> 12 & 63 | 128;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        } else {
          buffer[offset++] = c1 >> 12 | 224;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    };
  }
});

// node_modules/@protobufjs/pool/index.js
var require_pool = __commonJS({
  "node_modules/@protobufjs/pool/index.js"(exports2, module2) {
    "use strict";
    module2.exports = pool;
    function pool(alloc, slice, size) {
      var SIZE = size || 8192;
      var MAX = SIZE >>> 1;
      var slab = null;
      var offset = SIZE;
      return function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX)
          return alloc(size2);
        if (offset + size2 > SIZE) {
          slab = alloc(SIZE);
          offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size2);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf;
      };
    }
  }
});

// node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  "node_modules/protobufjs/src/util/longbits.js"(exports2, module2) {
    "use strict";
    module2.exports = LongBits;
    var util = require_minimal();
    function LongBits(lo, hi) {
      this.lo = lo >>> 0;
      this.hi = hi >>> 0;
    }
    var zero = LongBits.zero = new LongBits(0, 0);
    zero.toNumber = function() {
      return 0;
    };
    zero.zzEncode = zero.zzDecode = function() {
      return this;
    };
    zero.length = function() {
      return 1;
    };
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
    LongBits.fromNumber = function fromNumber(value) {
      if (value === 0)
        return zero;
      var sign = value < 0;
      if (sign)
        value = -value;
      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
      if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295)
            hi = 0;
        }
      }
      return new LongBits(lo, hi);
    };
    LongBits.from = function from(value) {
      if (typeof value === "number")
        return LongBits.fromNumber(value);
      if (util.isString(value)) {
        if (util.Long)
          value = util.Long.fromString(value);
        else
          return LongBits.fromNumber(parseInt(value, 10));
      }
      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    };
    LongBits.prototype.toNumber = function toNumber(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo)
          hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    };
    LongBits.prototype.toLong = function toLong(unsigned) {
      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    };
    var charCodeAt = String.prototype.charCodeAt;
    LongBits.fromHash = function fromHash(hash) {
      if (hash === zeroHash)
        return zero;
      return new LongBits(
        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
      );
    };
    LongBits.prototype.toHash = function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        this.lo >>> 8 & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24,
        this.hi & 255,
        this.hi >>> 8 & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
      );
    };
    LongBits.prototype.zzEncode = function zzEncode() {
      var mask = this.hi >> 31;
      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      this.lo = (this.lo << 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.zzDecode = function zzDecode() {
      var mask = -(this.lo & 1);
      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.length = function length() {
      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    };
  }
});

// node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  "node_modules/protobufjs/src/util/minimal.js"(exports2) {
    "use strict";
    var util = exports2;
    util.asPromise = require_aspromise();
    util.base64 = require_base64();
    util.EventEmitter = require_eventemitter();
    util.float = require_float();
    util.inquire = require_inquire();
    util.utf8 = require_utf8();
    util.pool = require_pool();
    util.LongBits = require_longbits();
    util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
    util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
    util.emptyArray = Object.freeze ? Object.freeze([]) : (
      /* istanbul ignore next */
      []
    );
    util.emptyObject = Object.freeze ? Object.freeze({}) : (
      /* istanbul ignore next */
      {}
    );
    util.isInteger = Number.isInteger || /* istanbul ignore next */
    function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
    util.isString = function isString(value) {
      return typeof value === "string" || value instanceof String;
    };
    util.isObject = function isObject2(value) {
      return value && typeof value === "object";
    };
    util.isset = /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util.isSet = function isSet(obj, prop) {
      var value = obj[prop];
      if (value != null && obj.hasOwnProperty(prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    };
    util.Buffer = function() {
      try {
        var Buffer2 = util.inquire("buffer").Buffer;
        return Buffer2.prototype.utf8Write ? Buffer2 : (
          /* istanbul ignore next */
          null
        );
      } catch (e) {
        return null;
      }
    }();
    util._Buffer_from = null;
    util._Buffer_allocUnsafe = null;
    util.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    };
    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util.Long = /* istanbul ignore next */
    util.global.dcodeIO && /* istanbul ignore next */
    util.global.dcodeIO.Long || /* istanbul ignore next */
    util.global.Long || util.inquire("long");
    util.key2Re = /^true|false|0|1$/;
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util.longToHash = function longToHash(value) {
      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
    };
    util.longFromHash = function longFromHash(hash, unsigned) {
      var bits = util.LongBits.fromHash(hash);
      if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
      return bits.toNumber(Boolean(unsigned));
    };
    function merge(dst, src, ifNotSet) {
      for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === void 0 || !ifNotSet)
          dst[keys[i]] = src[keys[i]];
      return dst;
    }
    util.merge = merge;
    util.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
    function newError(name) {
      function CustomError(message, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message, properties);
        Object.defineProperty(this, "message", { get: function() {
          return message;
        } });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge(this, properties);
      }
      CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: CustomError,
          writable: true,
          enumerable: false,
          configurable: true
        },
        name: {
          get: function get() {
            return name;
          },
          set: void 0,
          enumerable: false,
          // configurable: false would accurately preserve the behavior of
          // the original, but I'm guessing that was not intentional.
          // For an actual error subclass, this property would
          // be configurable.
          configurable: true
        },
        toString: {
          value: function value() {
            return this.name + ": " + this.message;
          },
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      return CustomError;
    }
    util.newError = newError;
    util.ProtocolError = newError("ProtocolError");
    util.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;
      return function() {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
            return keys[i2];
      };
    };
    util.oneOfSetter = function setOneOf(fieldNames) {
      return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name)
            delete this[fieldNames[i]];
      };
    };
    util.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util._configure = function() {
      var Buffer2 = util.Buffer;
      if (!Buffer2) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
      }
      util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || /* istanbul ignore next */
      function Buffer_from(value, encoding) {
        return new Buffer2(value, encoding);
      };
      util._Buffer_allocUnsafe = Buffer2.allocUnsafe || /* istanbul ignore next */
      function Buffer_allocUnsafe(size) {
        return new Buffer2(size);
      };
    };
  }
});

// node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  "node_modules/protobufjs/src/writer.js"(exports2, module2) {
    "use strict";
    module2.exports = Writer;
    var util = require_minimal();
    var BufferWriter;
    var LongBits = util.LongBits;
    var base64 = util.base64;
    var utf8 = util.utf8;
    function Op(fn, len, val) {
      this.fn = fn;
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    function noop() {
    }
    function State(writer) {
      this.head = writer.head;
      this.tail = writer.tail;
      this.len = writer.len;
      this.next = writer.states;
    }
    function Writer() {
      this.len = 0;
      this.head = new Op(noop, 0, 0);
      this.tail = this.head;
      this.states = null;
    }
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
          return new BufferWriter();
        })();
      } : function create_array() {
        return new Writer();
      };
    };
    Writer.create = create();
    Writer.alloc = function alloc(size) {
      return new util.Array(size);
    };
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
    Writer.prototype._push = function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val);
      this.len += len;
      return this;
    };
    function writeByte(val, buf, pos) {
      buf[pos] = val & 255;
    }
    function writeVarint32(val, buf, pos) {
      while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf[pos] = val;
    }
    function VarintOp(len, val) {
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;
    Writer.prototype.uint32 = function write_uint32(value) {
      this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
        value
      )).len;
      return this;
    };
    Writer.prototype.int32 = function write_int32(value) {
      return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
    };
    Writer.prototype.sint32 = function write_sint32(value) {
      return this.uint32((value << 1 ^ value >> 31) >>> 0);
    };
    function writeVarint64(val, buf, pos) {
      while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
      }
      while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
      }
      buf[pos++] = val.lo;
    }
    Writer.prototype.uint64 = function write_uint64(value) {
      var bits = LongBits.from(value);
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.int64 = Writer.prototype.uint64;
    Writer.prototype.sint64 = function write_sint64(value) {
      var bits = LongBits.from(value).zzEncode();
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.bool = function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0);
    };
    function writeFixed32(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    Writer.prototype.fixed32 = function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0);
    };
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
    Writer.prototype.fixed64 = function write_fixed64(value) {
      var bits = LongBits.from(value);
      return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
    };
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
    Writer.prototype.float = function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value);
    };
    Writer.prototype.double = function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value);
    };
    var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
      buf.set(val, pos);
    } : function writeBytes_for(val, buf, pos) {
      for (var i = 0; i < val.length; ++i)
        buf[pos + i] = val[i];
    };
    Writer.prototype.bytes = function write_bytes(value) {
      var len = value.length >>> 0;
      if (!len)
        return this._push(writeByte, 1, 0);
      if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
      }
      return this.uint32(len)._push(writeBytes, len, value);
    };
    Writer.prototype.string = function write_string(value) {
      var len = utf8.length(value);
      return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
    };
    Writer.prototype.fork = function fork() {
      this.states = new State(this);
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
      return this;
    };
    Writer.prototype.reset = function reset() {
      if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
      } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
      }
      return this;
    };
    Writer.prototype.ldelim = function ldelim() {
      var head = this.head, tail = this.tail, len = this.len;
      this.reset().uint32(len);
      if (len) {
        this.tail.next = head.next;
        this.tail = tail;
        this.len += len;
      }
      return this;
    };
    Writer.prototype.finish = function finish() {
      var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
      while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
      }
      return buf;
    };
    Writer._configure = function(BufferWriter_) {
      BufferWriter = BufferWriter_;
      Writer.create = create();
      BufferWriter._configure();
    };
  }
});

// node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  "node_modules/protobufjs/src/writer_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferWriter;
    var Writer = require_writer();
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util = require_minimal();
    function BufferWriter() {
      Writer.call(this);
    }
    BufferWriter._configure = function() {
      BufferWriter.alloc = util._Buffer_allocUnsafe;
      BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos);
      } : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy)
          val.copy(buf, pos, 0, val.length);
        else
          for (var i = 0; i < val.length; )
            buf[pos++] = val[i++];
      };
    };
    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
      if (util.isString(value))
        value = util._Buffer_from(value, "base64");
      var len = value.length >>> 0;
      this.uint32(len);
      if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
      return this;
    };
    function writeStringBuffer(val, buf, pos) {
      if (val.length < 40)
        util.utf8.write(val, buf, pos);
      else if (buf.utf8Write)
        buf.utf8Write(val, pos);
      else
        buf.write(val, pos);
    }
    BufferWriter.prototype.string = function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value);
      this.uint32(len);
      if (len)
        this._push(writeStringBuffer, len, value);
      return this;
    };
    BufferWriter._configure();
  }
});

// node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  "node_modules/protobufjs/src/reader.js"(exports2, module2) {
    "use strict";
    module2.exports = Reader;
    var util = require_minimal();
    var BufferReader;
    var LongBits = util.LongBits;
    var utf8 = util.utf8;
    function indexOutOfRange(reader, writeLength) {
      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }
    function Reader(buffer) {
      this.buf = buffer;
      this.pos = 0;
      this.len = buffer.length;
    }
    var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
      if (buffer instanceof Uint8Array || Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    } : function create_array2(buffer) {
      if (Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    };
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer2) {
          return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
        })(buffer);
      } : create_array;
    };
    Reader.create = create();
    Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
    util.Array.prototype.slice;
    Reader.prototype.uint32 = function read_uint32_setup() {
      var value = 4294967295;
      return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
        if (this.buf[this.pos++] < 128)
          return value;
        if ((this.pos += 5) > this.len) {
          this.pos = this.len;
          throw indexOutOfRange(this, 10);
        }
        return value;
      };
    }();
    Reader.prototype.int32 = function read_int32() {
      return this.uint32() | 0;
    };
    Reader.prototype.sint32 = function read_sint32() {
      var value = this.uint32();
      return value >>> 1 ^ -(value & 1) | 0;
    };
    function readLongVarint() {
      var bits = new LongBits(0, 0);
      var i = 0;
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      }
      throw Error("invalid varint encoding");
    }
    Reader.prototype.bool = function read_bool() {
      return this.uint32() !== 0;
    };
    function readFixed32_end(buf, end) {
      return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
    }
    Reader.prototype.fixed32 = function read_fixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4);
    };
    Reader.prototype.sfixed32 = function read_sfixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4) | 0;
    };
    function readFixed64() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);
      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    Reader.prototype.float = function read_float() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readFloatLE(this.buf, this.pos);
      this.pos += 4;
      return value;
    };
    Reader.prototype.double = function read_double() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readDoubleLE(this.buf, this.pos);
      this.pos += 8;
      return value;
    };
    Reader.prototype.bytes = function read_bytes() {
      var length = this.uint32(), start = this.pos, end = this.pos + length;
      if (end > this.len)
        throw indexOutOfRange(this, length);
      this.pos += length;
      if (Array.isArray(this.buf))
        return this.buf.slice(start, end);
      return start === end ? new this.buf.constructor(0) : this._slice.call(this.buf, start, end);
    };
    Reader.prototype.string = function read_string() {
      var bytes = this.bytes();
      return utf8.read(bytes, 0, bytes.length);
    };
    Reader.prototype.skip = function skip(length) {
      if (typeof length === "number") {
        if (this.pos + length > this.len)
          throw indexOutOfRange(this, length);
        this.pos += length;
      } else {
        do {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
      }
      return this;
    };
    Reader.prototype.skipType = function(wireType) {
      switch (wireType) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while ((wireType = this.uint32() & 7) !== 4) {
            this.skipType(wireType);
          }
          break;
        case 5:
          this.skip(4);
          break;
        default:
          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
      }
      return this;
    };
    Reader._configure = function(BufferReader_) {
      BufferReader = BufferReader_;
      Reader.create = create();
      BufferReader._configure();
      var fn = util.Long ? "toLong" : (
        /* istanbul ignore next */
        "toNumber"
      );
      util.merge(Reader.prototype, {
        int64: function read_int64() {
          return readLongVarint.call(this)[fn](false);
        },
        uint64: function read_uint64() {
          return readLongVarint.call(this)[fn](true);
        },
        sint64: function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false);
        },
        fixed64: function read_fixed64() {
          return readFixed64.call(this)[fn](true);
        },
        sfixed64: function read_sfixed64() {
          return readFixed64.call(this)[fn](false);
        }
      });
    };
  }
});

// node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  "node_modules/protobufjs/src/reader_buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = BufferReader;
    var Reader = require_reader();
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util = require_minimal();
    function BufferReader(buffer) {
      Reader.call(this, buffer);
    }
    BufferReader._configure = function() {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
    };
    BufferReader.prototype.string = function read_string_buffer() {
      var len = this.uint32();
      return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
    };
    BufferReader._configure();
  }
});

// node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  "node_modules/protobufjs/src/rpc/service.js"(exports2, module2) {
    "use strict";
    module2.exports = Service3;
    var util = require_minimal();
    (Service3.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service3;
    function Service3(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");
      util.EventEmitter.call(this);
      this.rpcImpl = rpcImpl;
      this.requestDelimited = Boolean(requestDelimited);
      this.responseDelimited = Boolean(responseDelimited);
    }
    Service3.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
      if (!request)
        throw TypeError("request must be specified");
      var self2 = this;
      if (!callback)
        return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
      if (!self2.rpcImpl) {
        setTimeout(function() {
          callback(Error("already ended"));
        }, 0);
        return void 0;
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
          function rpcCallback(err, response) {
            if (err) {
              self2.emit("error", err, method);
              return callback(err);
            }
            if (response === null) {
              self2.end(
                /* endedByRPC */
                true
              );
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err2) {
                self2.emit("error", err2, method);
                return callback(err2);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          }
        );
      } catch (err) {
        self2.emit("error", err, method);
        setTimeout(function() {
          callback(err);
        }, 0);
        return void 0;
      }
    };
    Service3.prototype.end = function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC)
          this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
      }
      return this;
    };
  }
});

// node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  "node_modules/protobufjs/src/rpc.js"(exports2) {
    "use strict";
    var rpc = exports2;
    rpc.Service = require_service();
  }
});

// node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  "node_modules/protobufjs/src/roots.js"(exports2, module2) {
    "use strict";
    module2.exports = {};
  }
});

// node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  "node_modules/protobufjs/src/index-minimal.js"(exports2) {
    "use strict";
    var protobuf6 = exports2;
    protobuf6.build = "minimal";
    protobuf6.Writer = require_writer();
    protobuf6.BufferWriter = require_writer_buffer();
    protobuf6.Reader = require_reader();
    protobuf6.BufferReader = require_reader_buffer();
    protobuf6.util = require_minimal();
    protobuf6.rpc = require_rpc();
    protobuf6.roots = require_roots();
    protobuf6.configure = configure;
    function configure() {
      protobuf6.util._configure();
      protobuf6.Writer._configure(protobuf6.BufferWriter);
      protobuf6.Reader._configure(protobuf6.BufferReader);
    }
    configure();
  }
});

// node_modules/@protobufjs/codegen/index.js
var require_codegen = __commonJS({
  "node_modules/@protobufjs/codegen/index.js"(exports2, module2) {
    "use strict";
    module2.exports = codegen;
    function codegen(functionParams, functionName) {
      if (typeof functionParams === "string") {
        functionName = functionParams;
        functionParams = void 0;
      }
      var body = [];
      function Codegen(formatStringOrScope) {
        if (typeof formatStringOrScope !== "string") {
          var source = toString();
          if (codegen.verbose)
            console.log("codegen: " + source);
          source = "return " + source;
          if (formatStringOrScope) {
            var scopeKeys = Object.keys(formatStringOrScope), scopeParams = new Array(scopeKeys.length + 1), scopeValues = new Array(scopeKeys.length), scopeOffset = 0;
            while (scopeOffset < scopeKeys.length) {
              scopeParams[scopeOffset] = scopeKeys[scopeOffset];
              scopeValues[scopeOffset] = formatStringOrScope[scopeKeys[scopeOffset++]];
            }
            scopeParams[scopeOffset] = source;
            return Function.apply(null, scopeParams).apply(null, scopeValues);
          }
          return Function(source)();
        }
        var formatParams = new Array(arguments.length - 1), formatOffset = 0;
        while (formatOffset < formatParams.length)
          formatParams[formatOffset] = arguments[++formatOffset];
        formatOffset = 0;
        formatStringOrScope = formatStringOrScope.replace(/%([%dfijs])/g, function replace($0, $1) {
          var value = formatParams[formatOffset++];
          switch ($1) {
            case "d":
            case "f":
              return String(Number(value));
            case "i":
              return String(Math.floor(value));
            case "j":
              return JSON.stringify(value);
            case "s":
              return String(value);
          }
          return "%";
        });
        if (formatOffset !== formatParams.length)
          throw Error("parameter count mismatch");
        body.push(formatStringOrScope);
        return Codegen;
      }
      function toString(functionNameOverride) {
        return "function " + (functionNameOverride || functionName || "") + "(" + (functionParams && functionParams.join(",") || "") + "){\n  " + body.join("\n  ") + "\n}";
      }
      Codegen.toString = toString;
      return Codegen;
    }
    codegen.verbose = false;
  }
});

// node_modules/@protobufjs/fetch/index.js
var require_fetch = __commonJS({
  "node_modules/@protobufjs/fetch/index.js"(exports2, module2) {
    "use strict";
    module2.exports = fetch;
    var asPromise = require_aspromise();
    var inquire2 = require_inquire();
    var fs3 = inquire2("fs");
    function fetch(filename, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      } else if (!options)
        options = {};
      if (!callback)
        return asPromise(fetch, this, filename, options);
      if (!options.xhr && fs3 && fs3.readFile)
        return fs3.readFile(filename, function fetchReadFileCallback(err, contents) {
          return err && typeof XMLHttpRequest !== "undefined" ? fetch.xhr(filename, options, callback) : err ? callback(err) : callback(null, options.binary ? contents : contents.toString("utf8"));
        });
      return fetch.xhr(filename, options, callback);
    }
    fetch.xhr = function fetch_xhr(filename, options, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function fetchOnReadyStateChange() {
        if (xhr.readyState !== 4)
          return void 0;
        if (xhr.status !== 0 && xhr.status !== 200)
          return callback(Error("status " + xhr.status));
        if (options.binary) {
          var buffer = xhr.response;
          if (!buffer) {
            buffer = [];
            for (var i = 0; i < xhr.responseText.length; ++i)
              buffer.push(xhr.responseText.charCodeAt(i) & 255);
          }
          return callback(null, typeof Uint8Array !== "undefined" ? new Uint8Array(buffer) : buffer);
        }
        return callback(null, xhr.responseText);
      };
      if (options.binary) {
        if ("overrideMimeType" in xhr)
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        xhr.responseType = "arraybuffer";
      }
      xhr.open("GET", filename);
      xhr.send();
    };
  }
});

// node_modules/@protobufjs/path/index.js
var require_path = __commonJS({
  "node_modules/@protobufjs/path/index.js"(exports2) {
    "use strict";
    var path5 = exports2;
    var isAbsolute = (
      /**
       * Tests if the specified path is absolute.
       * @param {string} path Path to test
       * @returns {boolean} `true` if path is absolute
       */
      path5.isAbsolute = function isAbsolute2(path6) {
        return /^(?:\/|\w+:)/.test(path6);
      }
    );
    var normalize2 = (
      /**
       * Normalizes the specified path.
       * @param {string} path Path to normalize
       * @returns {string} Normalized path
       */
      path5.normalize = function normalize3(path6) {
        path6 = path6.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
        var parts = path6.split("/"), absolute = isAbsolute(path6), prefix = "";
        if (absolute)
          prefix = parts.shift() + "/";
        for (var i = 0; i < parts.length; ) {
          if (parts[i] === "..") {
            if (i > 0 && parts[i - 1] !== "..")
              parts.splice(--i, 2);
            else if (absolute)
              parts.splice(i, 1);
            else
              ++i;
          } else if (parts[i] === ".")
            parts.splice(i, 1);
          else
            ++i;
        }
        return prefix + parts.join("/");
      }
    );
    path5.resolve = function resolve3(originPath, includePath, alreadyNormalized) {
      if (!alreadyNormalized)
        includePath = normalize2(includePath);
      if (isAbsolute(includePath))
        return includePath;
      if (!alreadyNormalized)
        originPath = normalize2(originPath);
      return (originPath = originPath.replace(/(?:\/|^)[^/]+$/, "")).length ? normalize2(originPath + "/" + includePath) : includePath;
    };
  }
});

// node_modules/protobufjs/src/types.js
var require_types = __commonJS({
  "node_modules/protobufjs/src/types.js"(exports2) {
    "use strict";
    var types = exports2;
    var util = require_util();
    var s = [
      "double",
      // 0
      "float",
      // 1
      "int32",
      // 2
      "uint32",
      // 3
      "sint32",
      // 4
      "fixed32",
      // 5
      "sfixed32",
      // 6
      "int64",
      // 7
      "uint64",
      // 8
      "sint64",
      // 9
      "fixed64",
      // 10
      "sfixed64",
      // 11
      "bool",
      // 12
      "string",
      // 13
      "bytes"
      // 14
    ];
    function bake(values, offset) {
      var i = 0, o = {};
      offset |= 0;
      while (i < values.length)
        o[s[i + offset]] = values[i++];
      return o;
    }
    types.basic = bake([
      /* double   */
      1,
      /* float    */
      5,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0,
      /* string   */
      2,
      /* bytes    */
      2
    ]);
    types.defaults = bake([
      /* double   */
      0,
      /* float    */
      0,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      0,
      /* sfixed32 */
      0,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      0,
      /* sfixed64 */
      0,
      /* bool     */
      false,
      /* string   */
      "",
      /* bytes    */
      util.emptyArray,
      /* message  */
      null
    ]);
    types.long = bake([
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1
    ], 7);
    types.mapKey = bake([
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0,
      /* string   */
      2
    ], 2);
    types.packed = bake([
      /* double   */
      1,
      /* float    */
      5,
      /* int32    */
      0,
      /* uint32   */
      0,
      /* sint32   */
      0,
      /* fixed32  */
      5,
      /* sfixed32 */
      5,
      /* int64    */
      0,
      /* uint64   */
      0,
      /* sint64   */
      0,
      /* fixed64  */
      1,
      /* sfixed64 */
      1,
      /* bool     */
      0
    ]);
  }
});

// node_modules/protobufjs/src/field.js
var require_field = __commonJS({
  "node_modules/protobufjs/src/field.js"(exports2, module2) {
    "use strict";
    module2.exports = Field;
    var ReflectionObject = require_object();
    ((Field.prototype = Object.create(ReflectionObject.prototype)).constructor = Field).className = "Field";
    var Enum2 = require_enum();
    var types = require_types();
    var util = require_util();
    var Type2;
    var ruleRe = /^required|optional|repeated$/;
    Field.fromJSON = function fromJSON(name, json) {
      return new Field(name, json.id, json.type, json.rule, json.extend, json.options, json.comment);
    };
    function Field(name, id, type, rule, extend, options, comment) {
      if (util.isObject(rule)) {
        comment = extend;
        options = rule;
        rule = extend = void 0;
      } else if (util.isObject(extend)) {
        comment = options;
        options = extend;
        extend = void 0;
      }
      ReflectionObject.call(this, name, options);
      if (!util.isInteger(id) || id < 0)
        throw TypeError("id must be a non-negative integer");
      if (!util.isString(type))
        throw TypeError("type must be a string");
      if (rule !== void 0 && !ruleRe.test(rule = rule.toString().toLowerCase()))
        throw TypeError("rule must be a string rule");
      if (extend !== void 0 && !util.isString(extend))
        throw TypeError("extend must be a string");
      if (rule === "proto3_optional") {
        rule = "optional";
      }
      this.rule = rule && rule !== "optional" ? rule : void 0;
      this.type = type;
      this.id = id;
      this.extend = extend || void 0;
      this.required = rule === "required";
      this.optional = !this.required;
      this.repeated = rule === "repeated";
      this.map = false;
      this.message = null;
      this.partOf = null;
      this.typeDefault = null;
      this.defaultValue = null;
      this.long = util.Long ? types.long[type] !== void 0 : (
        /* istanbul ignore next */
        false
      );
      this.bytes = type === "bytes";
      this.resolvedType = null;
      this.extensionField = null;
      this.declaringField = null;
      this._packed = null;
      this.comment = comment;
    }
    Object.defineProperty(Field.prototype, "packed", {
      get: function() {
        if (this._packed === null)
          this._packed = this.getOption("packed") !== false;
        return this._packed;
      }
    });
    Field.prototype.setOption = function setOption(name, value, ifNotSet) {
      if (name === "packed")
        this._packed = null;
      return ReflectionObject.prototype.setOption.call(this, name, value, ifNotSet);
    };
    Field.prototype.toJSON = function toJSON(toJSONOptions) {
      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
      return util.toObject([
        "rule",
        this.rule !== "optional" && this.rule || void 0,
        "type",
        this.type,
        "id",
        this.id,
        "extend",
        this.extend,
        "options",
        this.options,
        "comment",
        keepComments ? this.comment : void 0
      ]);
    };
    Field.prototype.resolve = function resolve3() {
      if (this.resolved)
        return this;
      if ((this.typeDefault = types.defaults[this.type]) === void 0) {
        this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type);
        if (this.resolvedType instanceof Type2)
          this.typeDefault = null;
        else
          this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
      } else if (this.options && this.options.proto3_optional) {
        this.typeDefault = null;
      }
      if (this.options && this.options["default"] != null) {
        this.typeDefault = this.options["default"];
        if (this.resolvedType instanceof Enum2 && typeof this.typeDefault === "string")
          this.typeDefault = this.resolvedType.values[this.typeDefault];
      }
      if (this.options) {
        if (this.options.packed === true || this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof Enum2))
          delete this.options.packed;
        if (!Object.keys(this.options).length)
          this.options = void 0;
      }
      if (this.long) {
        this.typeDefault = util.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u");
        if (Object.freeze)
          Object.freeze(this.typeDefault);
      } else if (this.bytes && typeof this.typeDefault === "string") {
        var buf;
        if (util.base64.test(this.typeDefault))
          util.base64.decode(this.typeDefault, buf = util.newBuffer(util.base64.length(this.typeDefault)), 0);
        else
          util.utf8.write(this.typeDefault, buf = util.newBuffer(util.utf8.length(this.typeDefault)), 0);
        this.typeDefault = buf;
      }
      if (this.map)
        this.defaultValue = util.emptyObject;
      else if (this.repeated)
        this.defaultValue = util.emptyArray;
      else
        this.defaultValue = this.typeDefault;
      if (this.parent instanceof Type2)
        this.parent.ctor.prototype[this.name] = this.defaultValue;
      return ReflectionObject.prototype.resolve.call(this);
    };
    Field.d = function decorateField(fieldId, fieldType, fieldRule, defaultValue) {
      if (typeof fieldType === "function")
        fieldType = util.decorateType(fieldType).name;
      else if (fieldType && typeof fieldType === "object")
        fieldType = util.decorateEnum(fieldType).name;
      return function fieldDecorator(prototype, fieldName) {
        util.decorateType(prototype.constructor).add(new Field(fieldName, fieldId, fieldType, fieldRule, { "default": defaultValue }));
      };
    };
    Field._configure = function configure(Type_) {
      Type2 = Type_;
    };
  }
});

// node_modules/protobufjs/src/oneof.js
var require_oneof = __commonJS({
  "node_modules/protobufjs/src/oneof.js"(exports2, module2) {
    "use strict";
    module2.exports = OneOf;
    var ReflectionObject = require_object();
    ((OneOf.prototype = Object.create(ReflectionObject.prototype)).constructor = OneOf).className = "OneOf";
    var Field = require_field();
    var util = require_util();
    function OneOf(name, fieldNames, options, comment) {
      if (!Array.isArray(fieldNames)) {
        options = fieldNames;
        fieldNames = void 0;
      }
      ReflectionObject.call(this, name, options);
      if (!(fieldNames === void 0 || Array.isArray(fieldNames)))
        throw TypeError("fieldNames must be an Array");
      this.oneof = fieldNames || [];
      this.fieldsArray = [];
      this.comment = comment;
    }
    OneOf.fromJSON = function fromJSON(name, json) {
      return new OneOf(name, json.oneof, json.options, json.comment);
    };
    OneOf.prototype.toJSON = function toJSON(toJSONOptions) {
      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
      return util.toObject([
        "options",
        this.options,
        "oneof",
        this.oneof,
        "comment",
        keepComments ? this.comment : void 0
      ]);
    };
    function addFieldsToParent(oneof) {
      if (oneof.parent) {
        for (var i = 0; i < oneof.fieldsArray.length; ++i)
          if (!oneof.fieldsArray[i].parent)
            oneof.parent.add(oneof.fieldsArray[i]);
      }
    }
    OneOf.prototype.add = function add(field) {
      if (!(field instanceof Field))
        throw TypeError("field must be a Field");
      if (field.parent && field.parent !== this.parent)
        field.parent.remove(field);
      this.oneof.push(field.name);
      this.fieldsArray.push(field);
      field.partOf = this;
      addFieldsToParent(this);
      return this;
    };
    OneOf.prototype.remove = function remove(field) {
      if (!(field instanceof Field))
        throw TypeError("field must be a Field");
      var index = this.fieldsArray.indexOf(field);
      if (index < 0)
        throw Error(field + " is not a member of " + this);
      this.fieldsArray.splice(index, 1);
      index = this.oneof.indexOf(field.name);
      if (index > -1)
        this.oneof.splice(index, 1);
      field.partOf = null;
      return this;
    };
    OneOf.prototype.onAdd = function onAdd(parent) {
      ReflectionObject.prototype.onAdd.call(this, parent);
      var self2 = this;
      for (var i = 0; i < this.oneof.length; ++i) {
        var field = parent.get(this.oneof[i]);
        if (field && !field.partOf) {
          field.partOf = self2;
          self2.fieldsArray.push(field);
        }
      }
      addFieldsToParent(this);
    };
    OneOf.prototype.onRemove = function onRemove(parent) {
      for (var i = 0, field; i < this.fieldsArray.length; ++i)
        if ((field = this.fieldsArray[i]).parent)
          field.parent.remove(field);
      ReflectionObject.prototype.onRemove.call(this, parent);
    };
    OneOf.d = function decorateOneOf() {
      var fieldNames = new Array(arguments.length), index = 0;
      while (index < arguments.length)
        fieldNames[index] = arguments[index++];
      return function oneOfDecorator(prototype, oneofName) {
        util.decorateType(prototype.constructor).add(new OneOf(oneofName, fieldNames));
        Object.defineProperty(prototype, oneofName, {
          get: util.oneOfGetter(fieldNames),
          set: util.oneOfSetter(fieldNames)
        });
      };
    };
  }
});

// node_modules/protobufjs/src/namespace.js
var require_namespace = __commonJS({
  "node_modules/protobufjs/src/namespace.js"(exports2, module2) {
    "use strict";
    module2.exports = Namespace2;
    var ReflectionObject = require_object();
    ((Namespace2.prototype = Object.create(ReflectionObject.prototype)).constructor = Namespace2).className = "Namespace";
    var Field = require_field();
    var util = require_util();
    var OneOf = require_oneof();
    var Type2;
    var Service3;
    var Enum2;
    Namespace2.fromJSON = function fromJSON(name, json) {
      return new Namespace2(name, json.options).addJSON(json.nested);
    };
    function arrayToJSON(array, toJSONOptions) {
      if (!(array && array.length))
        return void 0;
      var obj = {};
      for (var i = 0; i < array.length; ++i)
        obj[array[i].name] = array[i].toJSON(toJSONOptions);
      return obj;
    }
    Namespace2.arrayToJSON = arrayToJSON;
    Namespace2.isReservedId = function isReservedId(reserved, id) {
      if (reserved) {
        for (var i = 0; i < reserved.length; ++i)
          if (typeof reserved[i] !== "string" && reserved[i][0] <= id && reserved[i][1] > id)
            return true;
      }
      return false;
    };
    Namespace2.isReservedName = function isReservedName(reserved, name) {
      if (reserved) {
        for (var i = 0; i < reserved.length; ++i)
          if (reserved[i] === name)
            return true;
      }
      return false;
    };
    function Namespace2(name, options) {
      ReflectionObject.call(this, name, options);
      this.nested = void 0;
      this._nestedArray = null;
    }
    function clearCache(namespace) {
      namespace._nestedArray = null;
      return namespace;
    }
    Object.defineProperty(Namespace2.prototype, "nestedArray", {
      get: function() {
        return this._nestedArray || (this._nestedArray = util.toArray(this.nested));
      }
    });
    Namespace2.prototype.toJSON = function toJSON(toJSONOptions) {
      return util.toObject([
        "options",
        this.options,
        "nested",
        arrayToJSON(this.nestedArray, toJSONOptions)
      ]);
    };
    Namespace2.prototype.addJSON = function addJSON(nestedJson) {
      var ns = this;
      if (nestedJson) {
        for (var names = Object.keys(nestedJson), i = 0, nested; i < names.length; ++i) {
          nested = nestedJson[names[i]];
          ns.add(
            // most to least likely
            (nested.fields !== void 0 ? Type2.fromJSON : nested.values !== void 0 ? Enum2.fromJSON : nested.methods !== void 0 ? Service3.fromJSON : nested.id !== void 0 ? Field.fromJSON : Namespace2.fromJSON)(names[i], nested)
          );
        }
      }
      return this;
    };
    Namespace2.prototype.get = function get(name) {
      return this.nested && this.nested[name] || null;
    };
    Namespace2.prototype.getEnum = function getEnum(name) {
      if (this.nested && this.nested[name] instanceof Enum2)
        return this.nested[name].values;
      throw Error("no such enum: " + name);
    };
    Namespace2.prototype.add = function add(object) {
      if (!(object instanceof Field && object.extend !== void 0 || object instanceof Type2 || object instanceof OneOf || object instanceof Enum2 || object instanceof Service3 || object instanceof Namespace2))
        throw TypeError("object must be a valid nested object");
      if (!this.nested)
        this.nested = {};
      else {
        var prev = this.get(object.name);
        if (prev) {
          if (prev instanceof Namespace2 && object instanceof Namespace2 && !(prev instanceof Type2 || prev instanceof Service3)) {
            var nested = prev.nestedArray;
            for (var i = 0; i < nested.length; ++i)
              object.add(nested[i]);
            this.remove(prev);
            if (!this.nested)
              this.nested = {};
            object.setOptions(prev.options, true);
          } else
            throw Error("duplicate name '" + object.name + "' in " + this);
        }
      }
      this.nested[object.name] = object;
      object.onAdd(this);
      return clearCache(this);
    };
    Namespace2.prototype.remove = function remove(object) {
      if (!(object instanceof ReflectionObject))
        throw TypeError("object must be a ReflectionObject");
      if (object.parent !== this)
        throw Error(object + " is not a member of " + this);
      delete this.nested[object.name];
      if (!Object.keys(this.nested).length)
        this.nested = void 0;
      object.onRemove(this);
      return clearCache(this);
    };
    Namespace2.prototype.define = function define(path5, json) {
      if (util.isString(path5))
        path5 = path5.split(".");
      else if (!Array.isArray(path5))
        throw TypeError("illegal path");
      if (path5 && path5.length && path5[0] === "")
        throw Error("path must be relative");
      var ptr = this;
      while (path5.length > 0) {
        var part = path5.shift();
        if (ptr.nested && ptr.nested[part]) {
          ptr = ptr.nested[part];
          if (!(ptr instanceof Namespace2))
            throw Error("path conflicts with non-namespace objects");
        } else
          ptr.add(ptr = new Namespace2(part));
      }
      if (json)
        ptr.addJSON(json);
      return ptr;
    };
    Namespace2.prototype.resolveAll = function resolveAll() {
      var nested = this.nestedArray, i = 0;
      while (i < nested.length)
        if (nested[i] instanceof Namespace2)
          nested[i++].resolveAll();
        else
          nested[i++].resolve();
      return this.resolve();
    };
    Namespace2.prototype.lookup = function lookup(path5, filterTypes, parentAlreadyChecked) {
      if (typeof filterTypes === "boolean") {
        parentAlreadyChecked = filterTypes;
        filterTypes = void 0;
      } else if (filterTypes && !Array.isArray(filterTypes))
        filterTypes = [filterTypes];
      if (util.isString(path5) && path5.length) {
        if (path5 === ".")
          return this.root;
        path5 = path5.split(".");
      } else if (!path5.length)
        return this;
      if (path5[0] === "")
        return this.root.lookup(path5.slice(1), filterTypes);
      var found = this.get(path5[0]);
      if (found) {
        if (path5.length === 1) {
          if (!filterTypes || filterTypes.indexOf(found.constructor) > -1)
            return found;
        } else if (found instanceof Namespace2 && (found = found.lookup(path5.slice(1), filterTypes, true)))
          return found;
      } else
        for (var i = 0; i < this.nestedArray.length; ++i)
          if (this._nestedArray[i] instanceof Namespace2 && (found = this._nestedArray[i].lookup(path5, filterTypes, true)))
            return found;
      if (this.parent === null || parentAlreadyChecked)
        return null;
      return this.parent.lookup(path5, filterTypes);
    };
    Namespace2.prototype.lookupType = function lookupType(path5) {
      var found = this.lookup(path5, [Type2]);
      if (!found)
        throw Error("no such type: " + path5);
      return found;
    };
    Namespace2.prototype.lookupEnum = function lookupEnum(path5) {
      var found = this.lookup(path5, [Enum2]);
      if (!found)
        throw Error("no such Enum '" + path5 + "' in " + this);
      return found;
    };
    Namespace2.prototype.lookupTypeOrEnum = function lookupTypeOrEnum(path5) {
      var found = this.lookup(path5, [Type2, Enum2]);
      if (!found)
        throw Error("no such Type or Enum '" + path5 + "' in " + this);
      return found;
    };
    Namespace2.prototype.lookupService = function lookupService(path5) {
      var found = this.lookup(path5, [Service3]);
      if (!found)
        throw Error("no such Service '" + path5 + "' in " + this);
      return found;
    };
    Namespace2._configure = function(Type_, Service_, Enum_) {
      Type2 = Type_;
      Service3 = Service_;
      Enum2 = Enum_;
    };
  }
});

// node_modules/protobufjs/src/mapfield.js
var require_mapfield = __commonJS({
  "node_modules/protobufjs/src/mapfield.js"(exports2, module2) {
    "use strict";
    module2.exports = MapField;
    var Field = require_field();
    ((MapField.prototype = Object.create(Field.prototype)).constructor = MapField).className = "MapField";
    var types = require_types();
    var util = require_util();
    function MapField(name, id, keyType, type, options, comment) {
      Field.call(this, name, id, type, void 0, void 0, options, comment);
      if (!util.isString(keyType))
        throw TypeError("keyType must be a string");
      this.keyType = keyType;
      this.resolvedKeyType = null;
      this.map = true;
    }
    MapField.fromJSON = function fromJSON(name, json) {
      return new MapField(name, json.id, json.keyType, json.type, json.options, json.comment);
    };
    MapField.prototype.toJSON = function toJSON(toJSONOptions) {
      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
      return util.toObject([
        "keyType",
        this.keyType,
        "type",
        this.type,
        "id",
        this.id,
        "extend",
        this.extend,
        "options",
        this.options,
        "comment",
        keepComments ? this.comment : void 0
      ]);
    };
    MapField.prototype.resolve = function resolve3() {
      if (this.resolved)
        return this;
      if (types.mapKey[this.keyType] === void 0)
        throw Error("invalid key type: " + this.keyType);
      return Field.prototype.resolve.call(this);
    };
    MapField.d = function decorateMapField(fieldId, fieldKeyType, fieldValueType) {
      if (typeof fieldValueType === "function")
        fieldValueType = util.decorateType(fieldValueType).name;
      else if (fieldValueType && typeof fieldValueType === "object")
        fieldValueType = util.decorateEnum(fieldValueType).name;
      return function mapFieldDecorator(prototype, fieldName) {
        util.decorateType(prototype.constructor).add(new MapField(fieldName, fieldId, fieldKeyType, fieldValueType));
      };
    };
  }
});

// node_modules/protobufjs/src/method.js
var require_method = __commonJS({
  "node_modules/protobufjs/src/method.js"(exports2, module2) {
    "use strict";
    module2.exports = Method3;
    var ReflectionObject = require_object();
    ((Method3.prototype = Object.create(ReflectionObject.prototype)).constructor = Method3).className = "Method";
    var util = require_util();
    function Method3(name, type, requestType, responseType, requestStream, responseStream, options, comment, parsedOptions) {
      if (util.isObject(requestStream)) {
        options = requestStream;
        requestStream = responseStream = void 0;
      } else if (util.isObject(responseStream)) {
        options = responseStream;
        responseStream = void 0;
      }
      if (!(type === void 0 || util.isString(type)))
        throw TypeError("type must be a string");
      if (!util.isString(requestType))
        throw TypeError("requestType must be a string");
      if (!util.isString(responseType))
        throw TypeError("responseType must be a string");
      ReflectionObject.call(this, name, options);
      this.type = type || "rpc";
      this.requestType = requestType;
      this.requestStream = requestStream ? true : void 0;
      this.responseType = responseType;
      this.responseStream = responseStream ? true : void 0;
      this.resolvedRequestType = null;
      this.resolvedResponseType = null;
      this.comment = comment;
      this.parsedOptions = parsedOptions;
    }
    Method3.fromJSON = function fromJSON(name, json) {
      return new Method3(name, json.type, json.requestType, json.responseType, json.requestStream, json.responseStream, json.options, json.comment, json.parsedOptions);
    };
    Method3.prototype.toJSON = function toJSON(toJSONOptions) {
      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
      return util.toObject([
        "type",
        this.type !== "rpc" && /* istanbul ignore next */
        this.type || void 0,
        "requestType",
        this.requestType,
        "requestStream",
        this.requestStream,
        "responseType",
        this.responseType,
        "responseStream",
        this.responseStream,
        "options",
        this.options,
        "comment",
        keepComments ? this.comment : void 0,
        "parsedOptions",
        this.parsedOptions
      ]);
    };
    Method3.prototype.resolve = function resolve3() {
      if (this.resolved)
        return this;
      this.resolvedRequestType = this.parent.lookupType(this.requestType);
      this.resolvedResponseType = this.parent.lookupType(this.responseType);
      return ReflectionObject.prototype.resolve.call(this);
    };
  }
});

// node_modules/protobufjs/src/service.js
var require_service2 = __commonJS({
  "node_modules/protobufjs/src/service.js"(exports2, module2) {
    "use strict";
    module2.exports = Service3;
    var Namespace2 = require_namespace();
    ((Service3.prototype = Object.create(Namespace2.prototype)).constructor = Service3).className = "Service";
    var Method3 = require_method();
    var util = require_util();
    var rpc = require_rpc();
    function Service3(name, options) {
      Namespace2.call(this, name, options);
      this.methods = {};
      this._methodsArray = null;
    }
    Service3.fromJSON = function fromJSON(name, json) {
      var service = new Service3(name, json.options);
      if (json.methods)
        for (var names = Object.keys(json.methods), i = 0; i < names.length; ++i)
          service.add(Method3.fromJSON(names[i], json.methods[names[i]]));
      if (json.nested)
        service.addJSON(json.nested);
      service.comment = json.comment;
      return service;
    };
    Service3.prototype.toJSON = function toJSON(toJSONOptions) {
      var inherited = Namespace2.prototype.toJSON.call(this, toJSONOptions);
      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
      return util.toObject([
        "options",
        inherited && inherited.options || void 0,
        "methods",
        Namespace2.arrayToJSON(this.methodsArray, toJSONOptions) || /* istanbul ignore next */
        {},
        "nested",
        inherited && inherited.nested || void 0,
        "comment",
        keepComments ? this.comment : void 0
      ]);
    };
    Object.defineProperty(Service3.prototype, "methodsArray", {
      get: function() {
        return this._methodsArray || (this._methodsArray = util.toArray(this.methods));
      }
    });
    function clearCache(service) {
      service._methodsArray = null;
      return service;
    }
    Service3.prototype.get = function get(name) {
      return this.methods[name] || Namespace2.prototype.get.call(this, name);
    };
    Service3.prototype.resolveAll = function resolveAll() {
      var methods = this.methodsArray;
      for (var i = 0; i < methods.length; ++i)
        methods[i].resolve();
      return Namespace2.prototype.resolve.call(this);
    };
    Service3.prototype.add = function add(object) {
      if (this.get(object.name))
        throw Error("duplicate name '" + object.name + "' in " + this);
      if (object instanceof Method3) {
        this.methods[object.name] = object;
        object.parent = this;
        return clearCache(this);
      }
      return Namespace2.prototype.add.call(this, object);
    };
    Service3.prototype.remove = function remove(object) {
      if (object instanceof Method3) {
        if (this.methods[object.name] !== object)
          throw Error(object + " is not a member of " + this);
        delete this.methods[object.name];
        object.parent = null;
        return clearCache(this);
      }
      return Namespace2.prototype.remove.call(this, object);
    };
    Service3.prototype.create = function create(rpcImpl, requestDelimited, responseDelimited) {
      var rpcService = new rpc.Service(rpcImpl, requestDelimited, responseDelimited);
      for (var i = 0, method; i < /* initializes */
      this.methodsArray.length; ++i) {
        var methodName = util.lcFirst((method = this._methodsArray[i]).resolve().name).replace(/[^$\w_]/g, "");
        rpcService[methodName] = util.codegen(["r", "c"], util.isReserved(methodName) ? methodName + "_" : methodName)("return this.rpcCall(m,q,s,r,c)")({
          m: method,
          q: method.resolvedRequestType.ctor,
          s: method.resolvedResponseType.ctor
        });
      }
      return rpcService;
    };
  }
});

// node_modules/protobufjs/src/message.js
var require_message = __commonJS({
  "node_modules/protobufjs/src/message.js"(exports2, module2) {
    "use strict";
    module2.exports = Message;
    var util = require_minimal();
    function Message(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          this[keys[i]] = properties[keys[i]];
    }
    Message.create = function create(properties) {
      return this.$type.create(properties);
    };
    Message.encode = function encode(message, writer) {
      return this.$type.encode(message, writer);
    };
    Message.encodeDelimited = function encodeDelimited(message, writer) {
      return this.$type.encodeDelimited(message, writer);
    };
    Message.decode = function decode(reader) {
      return this.$type.decode(reader);
    };
    Message.decodeDelimited = function decodeDelimited(reader) {
      return this.$type.decodeDelimited(reader);
    };
    Message.verify = function verify(message) {
      return this.$type.verify(message);
    };
    Message.fromObject = function fromObject(object) {
      return this.$type.fromObject(object);
    };
    Message.toObject = function toObject(message, options) {
      return this.$type.toObject(message, options);
    };
    Message.prototype.toJSON = function toJSON() {
      return this.$type.toObject(this, util.toJSONOptions);
    };
  }
});

// node_modules/protobufjs/src/decoder.js
var require_decoder = __commonJS({
  "node_modules/protobufjs/src/decoder.js"(exports2, module2) {
    "use strict";
    module2.exports = decoder;
    var Enum2 = require_enum();
    var types = require_types();
    var util = require_util();
    function missing(field) {
      return "missing required '" + field.name + "'";
    }
    function decoder(mtype) {
      var gen = util.codegen(["r", "l"], mtype.name + "$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor" + (mtype.fieldsArray.filter(function(field2) {
        return field2.map;
      }).length ? ",k,value" : ""))("while(r.pos<c){")("var t=r.uint32()");
      if (mtype.group)
        gen("if((t&7)===4)")("break");
      gen("switch(t>>>3){");
      var i = 0;
      for (; i < /* initializes */
      mtype.fieldsArray.length; ++i) {
        var field = mtype._fieldsArray[i].resolve(), type = field.resolvedType instanceof Enum2 ? "int32" : field.type, ref = "m" + util.safeProp(field.name);
        gen("case %i: {", field.id);
        if (field.map) {
          gen("if(%s===util.emptyObject)", ref)("%s={}", ref)("var c2 = r.uint32()+r.pos");
          if (types.defaults[field.keyType] !== void 0)
            gen("k=%j", types.defaults[field.keyType]);
          else
            gen("k=null");
          if (types.defaults[type] !== void 0)
            gen("value=%j", types.defaults[type]);
          else
            gen("value=null");
          gen("while(r.pos<c2){")("var tag2=r.uint32()")("switch(tag2>>>3){")("case 1: k=r.%s(); break", field.keyType)("case 2:");
          if (types.basic[type] === void 0)
            gen("value=types[%i].decode(r,r.uint32())", i);
          else
            gen("value=r.%s()", type);
          gen("break")("default:")("r.skipType(tag2&7)")("break")("}")("}");
          if (types.long[field.keyType] !== void 0)
            gen('%s[typeof k==="object"?util.longToHash(k):k]=value', ref);
          else
            gen("%s[k]=value", ref);
        } else if (field.repeated) {
          gen("if(!(%s&&%s.length))", ref, ref)("%s=[]", ref);
          if (types.packed[type] !== void 0)
            gen("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())", ref, type)("}else");
          if (types.basic[type] === void 0)
            gen(field.resolvedType.group ? "%s.push(types[%i].decode(r))" : "%s.push(types[%i].decode(r,r.uint32()))", ref, i);
          else
            gen("%s.push(r.%s())", ref, type);
        } else if (types.basic[type] === void 0)
          gen(field.resolvedType.group ? "%s=types[%i].decode(r)" : "%s=types[%i].decode(r,r.uint32())", ref, i);
        else
          gen("%s=r.%s()", ref, type);
        gen("break")("}");
      }
      gen("default:")("r.skipType(t&7)")("break")("}")("}");
      for (i = 0; i < mtype._fieldsArray.length; ++i) {
        var rfield = mtype._fieldsArray[i];
        if (rfield.required)
          gen("if(!m.hasOwnProperty(%j))", rfield.name)("throw util.ProtocolError(%j,{instance:m})", missing(rfield));
      }
      return gen("return m");
    }
  }
});

// node_modules/protobufjs/src/verifier.js
var require_verifier = __commonJS({
  "node_modules/protobufjs/src/verifier.js"(exports2, module2) {
    "use strict";
    module2.exports = verifier;
    var Enum2 = require_enum();
    var util = require_util();
    function invalid(field, expected) {
      return field.name + ": " + expected + (field.repeated && expected !== "array" ? "[]" : field.map && expected !== "object" ? "{k:" + field.keyType + "}" : "") + " expected";
    }
    function genVerifyValue(gen, field, fieldIndex, ref) {
      if (field.resolvedType) {
        if (field.resolvedType instanceof Enum2) {
          gen("switch(%s){", ref)("default:")("return%j", invalid(field, "enum value"));
          for (var keys = Object.keys(field.resolvedType.values), j = 0; j < keys.length; ++j)
            gen("case %i:", field.resolvedType.values[keys[j]]);
          gen("break")("}");
        } else {
          gen("{")("var e=types[%i].verify(%s);", fieldIndex, ref)("if(e)")("return%j+e", field.name + ".")("}");
        }
      } else {
        switch (field.type) {
          case "int32":
          case "uint32":
          case "sint32":
          case "fixed32":
          case "sfixed32":
            gen("if(!util.isInteger(%s))", ref)("return%j", invalid(field, "integer"));
            break;
          case "int64":
          case "uint64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))", ref, ref, ref, ref)("return%j", invalid(field, "integer|Long"));
            break;
          case "float":
          case "double":
            gen('if(typeof %s!=="number")', ref)("return%j", invalid(field, "number"));
            break;
          case "bool":
            gen('if(typeof %s!=="boolean")', ref)("return%j", invalid(field, "boolean"));
            break;
          case "string":
            gen("if(!util.isString(%s))", ref)("return%j", invalid(field, "string"));
            break;
          case "bytes":
            gen('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))', ref, ref, ref)("return%j", invalid(field, "buffer"));
            break;
        }
      }
      return gen;
    }
    function genVerifyKey(gen, field, ref) {
      switch (field.keyType) {
        case "int32":
        case "uint32":
        case "sint32":
        case "fixed32":
        case "sfixed32":
          gen("if(!util.key32Re.test(%s))", ref)("return%j", invalid(field, "integer key"));
          break;
        case "int64":
        case "uint64":
        case "sint64":
        case "fixed64":
        case "sfixed64":
          gen("if(!util.key64Re.test(%s))", ref)("return%j", invalid(field, "integer|Long key"));
          break;
        case "bool":
          gen("if(!util.key2Re.test(%s))", ref)("return%j", invalid(field, "boolean key"));
          break;
      }
      return gen;
    }
    function verifier(mtype) {
      var gen = util.codegen(["m"], mtype.name + "$verify")('if(typeof m!=="object"||m===null)')("return%j", "object expected");
      var oneofs = mtype.oneofsArray, seenFirstField = {};
      if (oneofs.length)
        gen("var p={}");
      for (var i = 0; i < /* initializes */
      mtype.fieldsArray.length; ++i) {
        var field = mtype._fieldsArray[i].resolve(), ref = "m" + util.safeProp(field.name);
        if (field.optional)
          gen("if(%s!=null&&m.hasOwnProperty(%j)){", ref, field.name);
        if (field.map) {
          gen("if(!util.isObject(%s))", ref)("return%j", invalid(field, "object"))("var k=Object.keys(%s)", ref)("for(var i=0;i<k.length;++i){");
          genVerifyKey(gen, field, "k[i]");
          genVerifyValue(gen, field, i, ref + "[k[i]]")("}");
        } else if (field.repeated) {
          gen("if(!Array.isArray(%s))", ref)("return%j", invalid(field, "array"))("for(var i=0;i<%s.length;++i){", ref);
          genVerifyValue(gen, field, i, ref + "[i]")("}");
        } else {
          if (field.partOf) {
            var oneofProp = util.safeProp(field.partOf.name);
            if (seenFirstField[field.partOf.name] === 1)
              gen("if(p%s===1)", oneofProp)("return%j", field.partOf.name + ": multiple values");
            seenFirstField[field.partOf.name] = 1;
            gen("p%s=1", oneofProp);
          }
          genVerifyValue(gen, field, i, ref);
        }
        if (field.optional)
          gen("}");
      }
      return gen("return null");
    }
  }
});

// node_modules/protobufjs/src/converter.js
var require_converter = __commonJS({
  "node_modules/protobufjs/src/converter.js"(exports2) {
    "use strict";
    var converter = exports2;
    var Enum2 = require_enum();
    var util = require_util();
    function genValuePartial_fromObject(gen, field, fieldIndex, prop) {
      var defaultAlreadyEmitted = false;
      if (field.resolvedType) {
        if (field.resolvedType instanceof Enum2) {
          gen("switch(d%s){", prop);
          for (var values = field.resolvedType.values, keys = Object.keys(values), i = 0; i < keys.length; ++i) {
            if (values[keys[i]] === field.typeDefault && !defaultAlreadyEmitted) {
              gen("default:")('if(typeof(d%s)==="number"){m%s=d%s;break}', prop, prop, prop);
              if (!field.repeated)
                gen("break");
              defaultAlreadyEmitted = true;
            }
            gen("case%j:", keys[i])("case %i:", values[keys[i]])("m%s=%j", prop, values[keys[i]])("break");
          }
          gen("}");
        } else
          gen('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s=types[%i].fromObject(d%s)", prop, fieldIndex, prop);
      } else {
        var isUnsigned = false;
        switch (field.type) {
          case "double":
          case "float":
            gen("m%s=Number(d%s)", prop, prop);
            break;
          case "uint32":
          case "fixed32":
            gen("m%s=d%s>>>0", prop, prop);
            break;
          case "int32":
          case "sint32":
          case "sfixed32":
            gen("m%s=d%s|0", prop, prop);
            break;
          case "uint64":
            isUnsigned = true;
          case "int64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j", prop, prop, isUnsigned)('else if(typeof d%s==="string")', prop)("m%s=parseInt(d%s,10)", prop, prop)('else if(typeof d%s==="number")', prop)("m%s=d%s", prop, prop)('else if(typeof d%s==="object")', prop)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)", prop, prop, prop, isUnsigned ? "true" : "");
            break;
          case "bytes":
            gen('if(typeof d%s==="string")', prop)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)", prop, prop, prop)("else if(d%s.length >= 0)", prop)("m%s=d%s", prop, prop);
            break;
          case "string":
            gen("m%s=String(d%s)", prop, prop);
            break;
          case "bool":
            gen("m%s=Boolean(d%s)", prop, prop);
            break;
        }
      }
      return gen;
    }
    converter.fromObject = function fromObject(mtype) {
      var fields = mtype.fieldsArray;
      var gen = util.codegen(["d"], mtype.name + "$fromObject")("if(d instanceof this.ctor)")("return d");
      if (!fields.length)
        return gen("return new this.ctor");
      gen("var m=new this.ctor");
      for (var i = 0; i < fields.length; ++i) {
        var field = fields[i].resolve(), prop = util.safeProp(field.name);
        if (field.map) {
          gen("if(d%s){", prop)('if(typeof d%s!=="object")', prop)("throw TypeError(%j)", field.fullName + ": object expected")("m%s={}", prop)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){", prop);
          genValuePartial_fromObject(
            gen,
            field,
            /* not sorted */
            i,
            prop + "[ks[i]]"
          )("}")("}");
        } else if (field.repeated) {
          gen("if(d%s){", prop)("if(!Array.isArray(d%s))", prop)("throw TypeError(%j)", field.fullName + ": array expected")("m%s=[]", prop)("for(var i=0;i<d%s.length;++i){", prop);
          genValuePartial_fromObject(
            gen,
            field,
            /* not sorted */
            i,
            prop + "[i]"
          )("}")("}");
        } else {
          if (!(field.resolvedType instanceof Enum2))
            gen("if(d%s!=null){", prop);
          genValuePartial_fromObject(
            gen,
            field,
            /* not sorted */
            i,
            prop
          );
          if (!(field.resolvedType instanceof Enum2))
            gen("}");
        }
      }
      return gen("return m");
    };
    function genValuePartial_toObject(gen, field, fieldIndex, prop) {
      if (field.resolvedType) {
        if (field.resolvedType instanceof Enum2)
          gen("d%s=o.enums===String?(types[%i].values[m%s]===undefined?m%s:types[%i].values[m%s]):m%s", prop, fieldIndex, prop, prop, fieldIndex, prop, prop);
        else
          gen("d%s=types[%i].toObject(m%s,o)", prop, fieldIndex, prop);
      } else {
        var isUnsigned = false;
        switch (field.type) {
          case "double":
          case "float":
            gen("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s", prop, prop, prop, prop);
            break;
          case "uint64":
            isUnsigned = true;
          case "int64":
          case "sint64":
          case "fixed64":
          case "sfixed64":
            gen('if(typeof m%s==="number")', prop)("d%s=o.longs===String?String(m%s):m%s", prop, prop, prop)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s", prop, prop, prop, prop, isUnsigned ? "true" : "", prop);
            break;
          case "bytes":
            gen("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s", prop, prop, prop, prop, prop);
            break;
          default:
            gen("d%s=m%s", prop, prop);
            break;
        }
      }
      return gen;
    }
    converter.toObject = function toObject(mtype) {
      var fields = mtype.fieldsArray.slice().sort(util.compareFieldsById);
      if (!fields.length)
        return util.codegen()("return {}");
      var gen = util.codegen(["m", "o"], mtype.name + "$toObject")("if(!o)")("o={}")("var d={}");
      var repeatedFields = [], mapFields = [], normalFields = [], i = 0;
      for (; i < fields.length; ++i)
        if (!fields[i].partOf)
          (fields[i].resolve().repeated ? repeatedFields : fields[i].map ? mapFields : normalFields).push(fields[i]);
      if (repeatedFields.length) {
        gen("if(o.arrays||o.defaults){");
        for (i = 0; i < repeatedFields.length; ++i)
          gen("d%s=[]", util.safeProp(repeatedFields[i].name));
        gen("}");
      }
      if (mapFields.length) {
        gen("if(o.objects||o.defaults){");
        for (i = 0; i < mapFields.length; ++i)
          gen("d%s={}", util.safeProp(mapFields[i].name));
        gen("}");
      }
      if (normalFields.length) {
        gen("if(o.defaults){");
        for (i = 0; i < normalFields.length; ++i) {
          var field = normalFields[i], prop = util.safeProp(field.name);
          if (field.resolvedType instanceof Enum2)
            gen("d%s=o.enums===String?%j:%j", prop, field.resolvedType.valuesById[field.typeDefault], field.typeDefault);
          else if (field.long)
            gen("if(util.Long){")("var n=new util.Long(%i,%i,%j)", field.typeDefault.low, field.typeDefault.high, field.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n", prop)("}else")("d%s=o.longs===String?%j:%i", prop, field.typeDefault.toString(), field.typeDefault.toNumber());
          else if (field.bytes) {
            var arrayDefault = "[" + Array.prototype.slice.call(field.typeDefault).join(",") + "]";
            gen("if(o.bytes===String)d%s=%j", prop, String.fromCharCode.apply(String, field.typeDefault))("else{")("d%s=%s", prop, arrayDefault)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)", prop, prop)("}");
          } else
            gen("d%s=%j", prop, field.typeDefault);
        }
        gen("}");
      }
      var hasKs2 = false;
      for (i = 0; i < fields.length; ++i) {
        var field = fields[i], index = mtype._fieldsArray.indexOf(field), prop = util.safeProp(field.name);
        if (field.map) {
          if (!hasKs2) {
            hasKs2 = true;
            gen("var ks2");
          }
          gen("if(m%s&&(ks2=Object.keys(m%s)).length){", prop, prop)("d%s={}", prop)("for(var j=0;j<ks2.length;++j){");
          genValuePartial_toObject(
            gen,
            field,
            /* sorted */
            index,
            prop + "[ks2[j]]"
          )("}");
        } else if (field.repeated) {
          gen("if(m%s&&m%s.length){", prop, prop)("d%s=[]", prop)("for(var j=0;j<m%s.length;++j){", prop);
          genValuePartial_toObject(
            gen,
            field,
            /* sorted */
            index,
            prop + "[j]"
          )("}");
        } else {
          gen("if(m%s!=null&&m.hasOwnProperty(%j)){", prop, field.name);
          genValuePartial_toObject(
            gen,
            field,
            /* sorted */
            index,
            prop
          );
          if (field.partOf)
            gen("if(o.oneofs)")("d%s=%j", util.safeProp(field.partOf.name), field.name);
        }
        gen("}");
      }
      return gen("return d");
    };
  }
});

// node_modules/protobufjs/src/wrappers.js
var require_wrappers = __commonJS({
  "node_modules/protobufjs/src/wrappers.js"(exports2) {
    "use strict";
    var wrappers = exports2;
    var Message = require_message();
    wrappers[".google.protobuf.Any"] = {
      fromObject: function(object) {
        if (object && object["@type"]) {
          var name = object["@type"].substring(object["@type"].lastIndexOf("/") + 1);
          var type = this.lookup(name);
          if (type) {
            var type_url = object["@type"].charAt(0) === "." ? object["@type"].slice(1) : object["@type"];
            if (type_url.indexOf("/") === -1) {
              type_url = "/" + type_url;
            }
            return this.create({
              type_url,
              value: type.encode(type.fromObject(object)).finish()
            });
          }
        }
        return this.fromObject(object);
      },
      toObject: function(message, options) {
        var googleApi = "type.googleapis.com/";
        var prefix = "";
        var name = "";
        if (options && options.json && message.type_url && message.value) {
          name = message.type_url.substring(message.type_url.lastIndexOf("/") + 1);
          prefix = message.type_url.substring(0, message.type_url.lastIndexOf("/") + 1);
          var type = this.lookup(name);
          if (type)
            message = type.decode(message.value);
        }
        if (!(message instanceof this.ctor) && message instanceof Message) {
          var object = message.$type.toObject(message, options);
          var messageName = message.$type.fullName[0] === "." ? message.$type.fullName.slice(1) : message.$type.fullName;
          if (prefix === "") {
            prefix = googleApi;
          }
          name = prefix + messageName;
          object["@type"] = name;
          return object;
        }
        return this.toObject(message, options);
      }
    };
  }
});

// node_modules/protobufjs/src/type.js
var require_type = __commonJS({
  "node_modules/protobufjs/src/type.js"(exports2, module2) {
    "use strict";
    module2.exports = Type2;
    var Namespace2 = require_namespace();
    ((Type2.prototype = Object.create(Namespace2.prototype)).constructor = Type2).className = "Type";
    var Enum2 = require_enum();
    var OneOf = require_oneof();
    var Field = require_field();
    var MapField = require_mapfield();
    var Service3 = require_service2();
    var Message = require_message();
    var Reader = require_reader();
    var Writer = require_writer();
    var util = require_util();
    var encoder = require_encoder();
    var decoder = require_decoder();
    var verifier = require_verifier();
    var converter = require_converter();
    var wrappers = require_wrappers();
    function Type2(name, options) {
      Namespace2.call(this, name, options);
      this.fields = {};
      this.oneofs = void 0;
      this.extensions = void 0;
      this.reserved = void 0;
      this.group = void 0;
      this._fieldsById = null;
      this._fieldsArray = null;
      this._oneofsArray = null;
      this._ctor = null;
    }
    Object.defineProperties(Type2.prototype, {
      /**
       * Message fields by id.
       * @name Type#fieldsById
       * @type {Object.<number,Field>}
       * @readonly
       */
      fieldsById: {
        get: function() {
          if (this._fieldsById)
            return this._fieldsById;
          this._fieldsById = {};
          for (var names = Object.keys(this.fields), i = 0; i < names.length; ++i) {
            var field = this.fields[names[i]], id = field.id;
            if (this._fieldsById[id])
              throw Error("duplicate id " + id + " in " + this);
            this._fieldsById[id] = field;
          }
          return this._fieldsById;
        }
      },
      /**
       * Fields of this message as an array for iteration.
       * @name Type#fieldsArray
       * @type {Field[]}
       * @readonly
       */
      fieldsArray: {
        get: function() {
          return this._fieldsArray || (this._fieldsArray = util.toArray(this.fields));
        }
      },
      /**
       * Oneofs of this message as an array for iteration.
       * @name Type#oneofsArray
       * @type {OneOf[]}
       * @readonly
       */
      oneofsArray: {
        get: function() {
          return this._oneofsArray || (this._oneofsArray = util.toArray(this.oneofs));
        }
      },
      /**
       * The registered constructor, if any registered, otherwise a generic constructor.
       * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
       * @name Type#ctor
       * @type {Constructor<{}>}
       */
      ctor: {
        get: function() {
          return this._ctor || (this.ctor = Type2.generateConstructor(this)());
        },
        set: function(ctor) {
          var prototype = ctor.prototype;
          if (!(prototype instanceof Message)) {
            (ctor.prototype = new Message()).constructor = ctor;
            util.merge(ctor.prototype, prototype);
          }
          ctor.$type = ctor.prototype.$type = this;
          util.merge(ctor, Message, true);
          this._ctor = ctor;
          var i = 0;
          for (; i < /* initializes */
          this.fieldsArray.length; ++i)
            this._fieldsArray[i].resolve();
          var ctorProperties = {};
          for (i = 0; i < /* initializes */
          this.oneofsArray.length; ++i)
            ctorProperties[this._oneofsArray[i].resolve().name] = {
              get: util.oneOfGetter(this._oneofsArray[i].oneof),
              set: util.oneOfSetter(this._oneofsArray[i].oneof)
            };
          if (i)
            Object.defineProperties(ctor.prototype, ctorProperties);
        }
      }
    });
    Type2.generateConstructor = function generateConstructor(mtype) {
      var gen = util.codegen(["p"], mtype.name);
      for (var i = 0, field; i < mtype.fieldsArray.length; ++i)
        if ((field = mtype._fieldsArray[i]).map)
          gen("this%s={}", util.safeProp(field.name));
        else if (field.repeated)
          gen("this%s=[]", util.safeProp(field.name));
      return gen("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]");
    };
    function clearCache(type) {
      type._fieldsById = type._fieldsArray = type._oneofsArray = null;
      delete type.encode;
      delete type.decode;
      delete type.verify;
      return type;
    }
    Type2.fromJSON = function fromJSON(name, json) {
      var type = new Type2(name, json.options);
      type.extensions = json.extensions;
      type.reserved = json.reserved;
      var names = Object.keys(json.fields), i = 0;
      for (; i < names.length; ++i)
        type.add(
          (typeof json.fields[names[i]].keyType !== "undefined" ? MapField.fromJSON : Field.fromJSON)(names[i], json.fields[names[i]])
        );
      if (json.oneofs)
        for (names = Object.keys(json.oneofs), i = 0; i < names.length; ++i)
          type.add(OneOf.fromJSON(names[i], json.oneofs[names[i]]));
      if (json.nested)
        for (names = Object.keys(json.nested), i = 0; i < names.length; ++i) {
          var nested = json.nested[names[i]];
          type.add(
            // most to least likely
            (nested.id !== void 0 ? Field.fromJSON : nested.fields !== void 0 ? Type2.fromJSON : nested.values !== void 0 ? Enum2.fromJSON : nested.methods !== void 0 ? Service3.fromJSON : Namespace2.fromJSON)(names[i], nested)
          );
        }
      if (json.extensions && json.extensions.length)
        type.extensions = json.extensions;
      if (json.reserved && json.reserved.length)
        type.reserved = json.reserved;
      if (json.group)
        type.group = true;
      if (json.comment)
        type.comment = json.comment;
      return type;
    };
    Type2.prototype.toJSON = function toJSON(toJSONOptions) {
      var inherited = Namespace2.prototype.toJSON.call(this, toJSONOptions);
      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
      return util.toObject([
        "options",
        inherited && inherited.options || void 0,
        "oneofs",
        Namespace2.arrayToJSON(this.oneofsArray, toJSONOptions),
        "fields",
        Namespace2.arrayToJSON(this.fieldsArray.filter(function(obj) {
          return !obj.declaringField;
        }), toJSONOptions) || {},
        "extensions",
        this.extensions && this.extensions.length ? this.extensions : void 0,
        "reserved",
        this.reserved && this.reserved.length ? this.reserved : void 0,
        "group",
        this.group || void 0,
        "nested",
        inherited && inherited.nested || void 0,
        "comment",
        keepComments ? this.comment : void 0
      ]);
    };
    Type2.prototype.resolveAll = function resolveAll() {
      var fields = this.fieldsArray, i = 0;
      while (i < fields.length)
        fields[i++].resolve();
      var oneofs = this.oneofsArray;
      i = 0;
      while (i < oneofs.length)
        oneofs[i++].resolve();
      return Namespace2.prototype.resolveAll.call(this);
    };
    Type2.prototype.get = function get(name) {
      return this.fields[name] || this.oneofs && this.oneofs[name] || this.nested && this.nested[name] || null;
    };
    Type2.prototype.add = function add(object) {
      if (this.get(object.name))
        throw Error("duplicate name '" + object.name + "' in " + this);
      if (object instanceof Field && object.extend === void 0) {
        if (this._fieldsById ? (
          /* istanbul ignore next */
          this._fieldsById[object.id]
        ) : this.fieldsById[object.id])
          throw Error("duplicate id " + object.id + " in " + this);
        if (this.isReservedId(object.id))
          throw Error("id " + object.id + " is reserved in " + this);
        if (this.isReservedName(object.name))
          throw Error("name '" + object.name + "' is reserved in " + this);
        if (object.parent)
          object.parent.remove(object);
        this.fields[object.name] = object;
        object.message = this;
        object.onAdd(this);
        return clearCache(this);
      }
      if (object instanceof OneOf) {
        if (!this.oneofs)
          this.oneofs = {};
        this.oneofs[object.name] = object;
        object.onAdd(this);
        return clearCache(this);
      }
      return Namespace2.prototype.add.call(this, object);
    };
    Type2.prototype.remove = function remove(object) {
      if (object instanceof Field && object.extend === void 0) {
        if (!this.fields || this.fields[object.name] !== object)
          throw Error(object + " is not a member of " + this);
        delete this.fields[object.name];
        object.parent = null;
        object.onRemove(this);
        return clearCache(this);
      }
      if (object instanceof OneOf) {
        if (!this.oneofs || this.oneofs[object.name] !== object)
          throw Error(object + " is not a member of " + this);
        delete this.oneofs[object.name];
        object.parent = null;
        object.onRemove(this);
        return clearCache(this);
      }
      return Namespace2.prototype.remove.call(this, object);
    };
    Type2.prototype.isReservedId = function isReservedId(id) {
      return Namespace2.isReservedId(this.reserved, id);
    };
    Type2.prototype.isReservedName = function isReservedName(name) {
      return Namespace2.isReservedName(this.reserved, name);
    };
    Type2.prototype.create = function create(properties) {
      return new this.ctor(properties);
    };
    Type2.prototype.setup = function setup() {
      var fullName = this.fullName, types = [];
      for (var i = 0; i < /* initializes */
      this.fieldsArray.length; ++i)
        types.push(this._fieldsArray[i].resolve().resolvedType);
      this.encode = encoder(this)({
        Writer,
        types,
        util
      });
      this.decode = decoder(this)({
        Reader,
        types,
        util
      });
      this.verify = verifier(this)({
        types,
        util
      });
      this.fromObject = converter.fromObject(this)({
        types,
        util
      });
      this.toObject = converter.toObject(this)({
        types,
        util
      });
      var wrapper = wrappers[fullName];
      if (wrapper) {
        var originalThis = Object.create(this);
        originalThis.fromObject = this.fromObject;
        this.fromObject = wrapper.fromObject.bind(originalThis);
        originalThis.toObject = this.toObject;
        this.toObject = wrapper.toObject.bind(originalThis);
      }
      return this;
    };
    Type2.prototype.encode = function encode_setup(message, writer) {
      return this.setup().encode(message, writer);
    };
    Type2.prototype.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
    };
    Type2.prototype.decode = function decode_setup(reader, length) {
      return this.setup().decode(reader, length);
    };
    Type2.prototype.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof Reader))
        reader = Reader.create(reader);
      return this.decode(reader, reader.uint32());
    };
    Type2.prototype.verify = function verify_setup(message) {
      return this.setup().verify(message);
    };
    Type2.prototype.fromObject = function fromObject(object) {
      return this.setup().fromObject(object);
    };
    Type2.prototype.toObject = function toObject(message, options) {
      return this.setup().toObject(message, options);
    };
    Type2.d = function decorateType(typeName) {
      return function typeDecorator(target) {
        util.decorateType(target, typeName);
      };
    };
  }
});

// node_modules/protobufjs/src/root.js
var require_root = __commonJS({
  "node_modules/protobufjs/src/root.js"(exports2, module2) {
    "use strict";
    module2.exports = Root2;
    var Namespace2 = require_namespace();
    ((Root2.prototype = Object.create(Namespace2.prototype)).constructor = Root2).className = "Root";
    var Field = require_field();
    var Enum2 = require_enum();
    var OneOf = require_oneof();
    var util = require_util();
    var Type2;
    var parse2;
    var common;
    function Root2(options) {
      Namespace2.call(this, "", options);
      this.deferred = [];
      this.files = [];
    }
    Root2.fromJSON = function fromJSON(json, root) {
      if (!root)
        root = new Root2();
      if (json.options)
        root.setOptions(json.options);
      return root.addJSON(json.nested);
    };
    Root2.prototype.resolvePath = util.path.resolve;
    Root2.prototype.fetch = util.fetch;
    function SYNC() {
    }
    Root2.prototype.load = function load(filename, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = void 0;
      }
      var self2 = this;
      if (!callback)
        return util.asPromise(load, self2, filename, options);
      var sync2 = callback === SYNC;
      function finish(err, root) {
        if (!callback)
          return;
        var cb = callback;
        callback = null;
        if (sync2)
          throw err;
        cb(err, root);
      }
      function getBundledFileName(filename2) {
        var idx = filename2.lastIndexOf("google/protobuf/");
        if (idx > -1) {
          var altname = filename2.substring(idx);
          if (altname in common)
            return altname;
        }
        return null;
      }
      function process2(filename2, source) {
        try {
          if (util.isString(source) && source.charAt(0) === "{")
            source = JSON.parse(source);
          if (!util.isString(source))
            self2.setOptions(source.options).addJSON(source.nested);
          else {
            parse2.filename = filename2;
            var parsed = parse2(source, self2, options), resolved2, i2 = 0;
            if (parsed.imports) {
              for (; i2 < parsed.imports.length; ++i2)
                if (resolved2 = getBundledFileName(parsed.imports[i2]) || self2.resolvePath(filename2, parsed.imports[i2]))
                  fetch(resolved2);
            }
            if (parsed.weakImports) {
              for (i2 = 0; i2 < parsed.weakImports.length; ++i2)
                if (resolved2 = getBundledFileName(parsed.weakImports[i2]) || self2.resolvePath(filename2, parsed.weakImports[i2]))
                  fetch(resolved2, true);
            }
          }
        } catch (err) {
          finish(err);
        }
        if (!sync2 && !queued)
          finish(null, self2);
      }
      function fetch(filename2, weak) {
        filename2 = getBundledFileName(filename2) || filename2;
        if (self2.files.indexOf(filename2) > -1)
          return;
        self2.files.push(filename2);
        if (filename2 in common) {
          if (sync2)
            process2(filename2, common[filename2]);
          else {
            ++queued;
            setTimeout(function() {
              --queued;
              process2(filename2, common[filename2]);
            });
          }
          return;
        }
        if (sync2) {
          var source;
          try {
            source = util.fs.readFileSync(filename2).toString("utf8");
          } catch (err) {
            if (!weak)
              finish(err);
            return;
          }
          process2(filename2, source);
        } else {
          ++queued;
          self2.fetch(filename2, function(err, source2) {
            --queued;
            if (!callback)
              return;
            if (err) {
              if (!weak)
                finish(err);
              else if (!queued)
                finish(null, self2);
              return;
            }
            process2(filename2, source2);
          });
        }
      }
      var queued = 0;
      if (util.isString(filename))
        filename = [filename];
      for (var i = 0, resolved; i < filename.length; ++i)
        if (resolved = self2.resolvePath("", filename[i]))
          fetch(resolved);
      if (sync2)
        return self2;
      if (!queued)
        finish(null, self2);
      return void 0;
    };
    Root2.prototype.loadSync = function loadSync2(filename, options) {
      if (!util.isNode)
        throw Error("not supported");
      return this.load(filename, options, SYNC);
    };
    Root2.prototype.resolveAll = function resolveAll() {
      if (this.deferred.length)
        throw Error("unresolvable extensions: " + this.deferred.map(function(field) {
          return "'extend " + field.extend + "' in " + field.parent.fullName;
        }).join(", "));
      return Namespace2.prototype.resolveAll.call(this);
    };
    var exposeRe = /^[A-Z]/;
    function tryHandleExtension(root, field) {
      var extendedType = field.parent.lookup(field.extend);
      if (extendedType) {
        var sisterField = new Field(field.fullName, field.id, field.type, field.rule, void 0, field.options);
        if (extendedType.get(sisterField.name)) {
          return true;
        }
        sisterField.declaringField = field;
        field.extensionField = sisterField;
        extendedType.add(sisterField);
        return true;
      }
      return false;
    }
    Root2.prototype._handleAdd = function _handleAdd(object) {
      if (object instanceof Field) {
        if (
          /* an extension field (implies not part of a oneof) */
          object.extend !== void 0 && /* not already handled */
          !object.extensionField
        ) {
          if (!tryHandleExtension(this, object))
            this.deferred.push(object);
        }
      } else if (object instanceof Enum2) {
        if (exposeRe.test(object.name))
          object.parent[object.name] = object.values;
      } else if (!(object instanceof OneOf)) {
        if (object instanceof Type2)
          for (var i = 0; i < this.deferred.length; )
            if (tryHandleExtension(this, this.deferred[i]))
              this.deferred.splice(i, 1);
            else
              ++i;
        for (var j = 0; j < /* initializes */
        object.nestedArray.length; ++j)
          this._handleAdd(object._nestedArray[j]);
        if (exposeRe.test(object.name))
          object.parent[object.name] = object;
      }
    };
    Root2.prototype._handleRemove = function _handleRemove(object) {
      if (object instanceof Field) {
        if (
          /* an extension field */
          object.extend !== void 0
        ) {
          if (
            /* already handled */
            object.extensionField
          ) {
            object.extensionField.parent.remove(object.extensionField);
            object.extensionField = null;
          } else {
            var index = this.deferred.indexOf(object);
            if (index > -1)
              this.deferred.splice(index, 1);
          }
        }
      } else if (object instanceof Enum2) {
        if (exposeRe.test(object.name))
          delete object.parent[object.name];
      } else if (object instanceof Namespace2) {
        for (var i = 0; i < /* initializes */
        object.nestedArray.length; ++i)
          this._handleRemove(object._nestedArray[i]);
        if (exposeRe.test(object.name))
          delete object.parent[object.name];
      }
    };
    Root2._configure = function(Type_, parse_, common_) {
      Type2 = Type_;
      parse2 = parse_;
      common = common_;
    };
  }
});

// node_modules/protobufjs/src/util.js
var require_util = __commonJS({
  "node_modules/protobufjs/src/util.js"(exports2, module2) {
    "use strict";
    var util = module2.exports = require_minimal();
    var roots = require_roots();
    var Type2;
    var Enum2;
    util.codegen = require_codegen();
    util.fetch = require_fetch();
    util.path = require_path();
    util.fs = util.inquire("fs");
    util.toArray = function toArray(object) {
      if (object) {
        var keys = Object.keys(object), array = new Array(keys.length), index = 0;
        while (index < keys.length)
          array[index] = object[keys[index++]];
        return array;
      }
      return [];
    };
    util.toObject = function toObject(array) {
      var object = {}, index = 0;
      while (index < array.length) {
        var key = array[index++], val = array[index++];
        if (val !== void 0)
          object[key] = val;
      }
      return object;
    };
    var safePropBackslashRe = /\\/g;
    var safePropQuoteRe = /"/g;
    util.isReserved = function isReserved(name) {
      return /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(name);
    };
    util.safeProp = function safeProp(prop) {
      if (!/^[$\w_]+$/.test(prop) || util.isReserved(prop))
        return '["' + prop.replace(safePropBackslashRe, "\\\\").replace(safePropQuoteRe, '\\"') + '"]';
      return "." + prop;
    };
    util.ucFirst = function ucFirst(str) {
      return str.charAt(0).toUpperCase() + str.substring(1);
    };
    var camelCaseRe = /_([a-z])/g;
    util.camelCase = function camelCase(str) {
      return str.substring(0, 1) + str.substring(1).replace(camelCaseRe, function($0, $1) {
        return $1.toUpperCase();
      });
    };
    util.compareFieldsById = function compareFieldsById(a, b) {
      return a.id - b.id;
    };
    util.decorateType = function decorateType(ctor, typeName) {
      if (ctor.$type) {
        if (typeName && ctor.$type.name !== typeName) {
          util.decorateRoot.remove(ctor.$type);
          ctor.$type.name = typeName;
          util.decorateRoot.add(ctor.$type);
        }
        return ctor.$type;
      }
      if (!Type2)
        Type2 = require_type();
      var type = new Type2(typeName || ctor.name);
      util.decorateRoot.add(type);
      type.ctor = ctor;
      Object.defineProperty(ctor, "$type", { value: type, enumerable: false });
      Object.defineProperty(ctor.prototype, "$type", { value: type, enumerable: false });
      return type;
    };
    var decorateEnumIndex = 0;
    util.decorateEnum = function decorateEnum(object) {
      if (object.$type)
        return object.$type;
      if (!Enum2)
        Enum2 = require_enum();
      var enm = new Enum2("Enum" + decorateEnumIndex++, object);
      util.decorateRoot.add(enm);
      Object.defineProperty(object, "$type", { value: enm, enumerable: false });
      return enm;
    };
    util.setProperty = function setProperty(dst, path5, value) {
      function setProp(dst2, path6, value2) {
        var part = path6.shift();
        if (part === "__proto__") {
          return dst2;
        }
        if (path6.length > 0) {
          dst2[part] = setProp(dst2[part] || {}, path6, value2);
        } else {
          var prevValue = dst2[part];
          if (prevValue)
            value2 = [].concat(prevValue).concat(value2);
          dst2[part] = value2;
        }
        return dst2;
      }
      if (typeof dst !== "object")
        throw TypeError("dst must be an object");
      if (!path5)
        throw TypeError("path must be specified");
      path5 = path5.split(".");
      return setProp(dst, path5, value);
    };
    Object.defineProperty(util, "decorateRoot", {
      get: function() {
        return roots["decorated"] || (roots["decorated"] = new (require_root())());
      }
    });
  }
});

// node_modules/protobufjs/src/object.js
var require_object = __commonJS({
  "node_modules/protobufjs/src/object.js"(exports2, module2) {
    "use strict";
    module2.exports = ReflectionObject;
    ReflectionObject.className = "ReflectionObject";
    var util = require_util();
    var Root2;
    function ReflectionObject(name, options) {
      if (!util.isString(name))
        throw TypeError("name must be a string");
      if (options && !util.isObject(options))
        throw TypeError("options must be an object");
      this.options = options;
      this.parsedOptions = null;
      this.name = name;
      this.parent = null;
      this.resolved = false;
      this.comment = null;
      this.filename = null;
    }
    Object.defineProperties(ReflectionObject.prototype, {
      /**
       * Reference to the root namespace.
       * @name ReflectionObject#root
       * @type {Root}
       * @readonly
       */
      root: {
        get: function() {
          var ptr = this;
          while (ptr.parent !== null)
            ptr = ptr.parent;
          return ptr;
        }
      },
      /**
       * Full name including leading dot.
       * @name ReflectionObject#fullName
       * @type {string}
       * @readonly
       */
      fullName: {
        get: function() {
          var path5 = [this.name], ptr = this.parent;
          while (ptr) {
            path5.unshift(ptr.name);
            ptr = ptr.parent;
          }
          return path5.join(".");
        }
      }
    });
    ReflectionObject.prototype.toJSON = /* istanbul ignore next */
    function toJSON() {
      throw Error();
    };
    ReflectionObject.prototype.onAdd = function onAdd(parent) {
      if (this.parent && this.parent !== parent)
        this.parent.remove(this);
      this.parent = parent;
      this.resolved = false;
      var root = parent.root;
      if (root instanceof Root2)
        root._handleAdd(this);
    };
    ReflectionObject.prototype.onRemove = function onRemove(parent) {
      var root = parent.root;
      if (root instanceof Root2)
        root._handleRemove(this);
      this.parent = null;
      this.resolved = false;
    };
    ReflectionObject.prototype.resolve = function resolve3() {
      if (this.resolved)
        return this;
      if (this.root instanceof Root2)
        this.resolved = true;
      return this;
    };
    ReflectionObject.prototype.getOption = function getOption(name) {
      if (this.options)
        return this.options[name];
      return void 0;
    };
    ReflectionObject.prototype.setOption = function setOption(name, value, ifNotSet) {
      if (!ifNotSet || !this.options || this.options[name] === void 0)
        (this.options || (this.options = {}))[name] = value;
      return this;
    };
    ReflectionObject.prototype.setParsedOption = function setParsedOption(name, value, propName) {
      if (!this.parsedOptions) {
        this.parsedOptions = [];
      }
      var parsedOptions = this.parsedOptions;
      if (propName) {
        var opt = parsedOptions.find(function(opt2) {
          return Object.prototype.hasOwnProperty.call(opt2, name);
        });
        if (opt) {
          var newValue = opt[name];
          util.setProperty(newValue, propName, value);
        } else {
          opt = {};
          opt[name] = util.setProperty({}, propName, value);
          parsedOptions.push(opt);
        }
      } else {
        var newOpt = {};
        newOpt[name] = value;
        parsedOptions.push(newOpt);
      }
      return this;
    };
    ReflectionObject.prototype.setOptions = function setOptions(options, ifNotSet) {
      if (options)
        for (var keys = Object.keys(options), i = 0; i < keys.length; ++i)
          this.setOption(keys[i], options[keys[i]], ifNotSet);
      return this;
    };
    ReflectionObject.prototype.toString = function toString() {
      var className = this.constructor.className, fullName = this.fullName;
      if (fullName.length)
        return className + " " + fullName;
      return className;
    };
    ReflectionObject._configure = function(Root_) {
      Root2 = Root_;
    };
  }
});

// node_modules/protobufjs/src/enum.js
var require_enum = __commonJS({
  "node_modules/protobufjs/src/enum.js"(exports2, module2) {
    "use strict";
    module2.exports = Enum2;
    var ReflectionObject = require_object();
    ((Enum2.prototype = Object.create(ReflectionObject.prototype)).constructor = Enum2).className = "Enum";
    var Namespace2 = require_namespace();
    var util = require_util();
    function Enum2(name, values, options, comment, comments, valuesOptions) {
      ReflectionObject.call(this, name, options);
      if (values && typeof values !== "object")
        throw TypeError("values must be an object");
      this.valuesById = {};
      this.values = Object.create(this.valuesById);
      this.comment = comment;
      this.comments = comments || {};
      this.valuesOptions = valuesOptions;
      this.reserved = void 0;
      if (values) {
        for (var keys = Object.keys(values), i = 0; i < keys.length; ++i)
          if (typeof values[keys[i]] === "number")
            this.valuesById[this.values[keys[i]] = values[keys[i]]] = keys[i];
      }
    }
    Enum2.fromJSON = function fromJSON(name, json) {
      var enm = new Enum2(name, json.values, json.options, json.comment, json.comments);
      enm.reserved = json.reserved;
      return enm;
    };
    Enum2.prototype.toJSON = function toJSON(toJSONOptions) {
      var keepComments = toJSONOptions ? Boolean(toJSONOptions.keepComments) : false;
      return util.toObject([
        "options",
        this.options,
        "valuesOptions",
        this.valuesOptions,
        "values",
        this.values,
        "reserved",
        this.reserved && this.reserved.length ? this.reserved : void 0,
        "comment",
        keepComments ? this.comment : void 0,
        "comments",
        keepComments ? this.comments : void 0
      ]);
    };
    Enum2.prototype.add = function add(name, id, comment, options) {
      if (!util.isString(name))
        throw TypeError("name must be a string");
      if (!util.isInteger(id))
        throw TypeError("id must be an integer");
      if (this.values[name] !== void 0)
        throw Error("duplicate name '" + name + "' in " + this);
      if (this.isReservedId(id))
        throw Error("id " + id + " is reserved in " + this);
      if (this.isReservedName(name))
        throw Error("name '" + name + "' is reserved in " + this);
      if (this.valuesById[id] !== void 0) {
        if (!(this.options && this.options.allow_alias))
          throw Error("duplicate id " + id + " in " + this);
        this.values[name] = id;
      } else
        this.valuesById[this.values[name] = id] = name;
      if (options) {
        if (this.valuesOptions === void 0)
          this.valuesOptions = {};
        this.valuesOptions[name] = options || null;
      }
      this.comments[name] = comment || null;
      return this;
    };
    Enum2.prototype.remove = function remove(name) {
      if (!util.isString(name))
        throw TypeError("name must be a string");
      var val = this.values[name];
      if (val == null)
        throw Error("name '" + name + "' does not exist in " + this);
      delete this.valuesById[val];
      delete this.values[name];
      delete this.comments[name];
      if (this.valuesOptions)
        delete this.valuesOptions[name];
      return this;
    };
    Enum2.prototype.isReservedId = function isReservedId(id) {
      return Namespace2.isReservedId(this.reserved, id);
    };
    Enum2.prototype.isReservedName = function isReservedName(name) {
      return Namespace2.isReservedName(this.reserved, name);
    };
  }
});

// node_modules/protobufjs/src/encoder.js
var require_encoder = __commonJS({
  "node_modules/protobufjs/src/encoder.js"(exports2, module2) {
    "use strict";
    module2.exports = encoder;
    var Enum2 = require_enum();
    var types = require_types();
    var util = require_util();
    function genTypePartial(gen, field, fieldIndex, ref) {
      return field.resolvedType.group ? gen("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", fieldIndex, ref, (field.id << 3 | 3) >>> 0, (field.id << 3 | 4) >>> 0) : gen("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", fieldIndex, ref, (field.id << 3 | 2) >>> 0);
    }
    function encoder(mtype) {
      var gen = util.codegen(["m", "w"], mtype.name + "$encode")("if(!w)")("w=Writer.create()");
      var i, ref;
      var fields = (
        /* initializes */
        mtype.fieldsArray.slice().sort(util.compareFieldsById)
      );
      for (var i = 0; i < fields.length; ++i) {
        var field = fields[i].resolve(), index = mtype._fieldsArray.indexOf(field), type = field.resolvedType instanceof Enum2 ? "int32" : field.type, wireType = types.basic[type];
        ref = "m" + util.safeProp(field.name);
        if (field.map) {
          gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", ref, field.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", ref)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (field.id << 3 | 2) >>> 0, 8 | types.mapKey[field.keyType], field.keyType);
          if (wireType === void 0)
            gen("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", index, ref);
          else
            gen(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | wireType, type, ref);
          gen("}")("}");
        } else if (field.repeated) {
          gen("if(%s!=null&&%s.length){", ref, ref);
          if (field.packed && types.packed[type] !== void 0) {
            gen("w.uint32(%i).fork()", (field.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", ref)("w.%s(%s[i])", type, ref)("w.ldelim()");
          } else {
            gen("for(var i=0;i<%s.length;++i)", ref);
            if (wireType === void 0)
              genTypePartial(gen, field, index, ref + "[i]");
            else
              gen("w.uint32(%i).%s(%s[i])", (field.id << 3 | wireType) >>> 0, type, ref);
          }
          gen("}");
        } else {
          if (field.optional)
            gen("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", ref, field.name);
          if (wireType === void 0)
            genTypePartial(gen, field, index, ref);
          else
            gen("w.uint32(%i).%s(%s)", (field.id << 3 | wireType) >>> 0, type, ref);
        }
      }
      return gen("return w");
    }
  }
});

// node_modules/protobufjs/src/index-light.js
var require_index_light = __commonJS({
  "node_modules/protobufjs/src/index-light.js"(exports2, module2) {
    "use strict";
    var protobuf6 = module2.exports = require_index_minimal();
    protobuf6.build = "light";
    function load(filename, root, callback) {
      if (typeof root === "function") {
        callback = root;
        root = new protobuf6.Root();
      } else if (!root)
        root = new protobuf6.Root();
      return root.load(filename, callback);
    }
    protobuf6.load = load;
    function loadSync2(filename, root) {
      if (!root)
        root = new protobuf6.Root();
      return root.loadSync(filename);
    }
    protobuf6.loadSync = loadSync2;
    protobuf6.encoder = require_encoder();
    protobuf6.decoder = require_decoder();
    protobuf6.verifier = require_verifier();
    protobuf6.converter = require_converter();
    protobuf6.ReflectionObject = require_object();
    protobuf6.Namespace = require_namespace();
    protobuf6.Root = require_root();
    protobuf6.Enum = require_enum();
    protobuf6.Type = require_type();
    protobuf6.Field = require_field();
    protobuf6.OneOf = require_oneof();
    protobuf6.MapField = require_mapfield();
    protobuf6.Service = require_service2();
    protobuf6.Method = require_method();
    protobuf6.Message = require_message();
    protobuf6.wrappers = require_wrappers();
    protobuf6.types = require_types();
    protobuf6.util = require_util();
    protobuf6.ReflectionObject._configure(protobuf6.Root);
    protobuf6.Namespace._configure(protobuf6.Type, protobuf6.Service, protobuf6.Enum);
    protobuf6.Root._configure(protobuf6.Type);
    protobuf6.Field._configure(protobuf6.Type);
  }
});

// node_modules/protobufjs/src/tokenize.js
var require_tokenize = __commonJS({
  "node_modules/protobufjs/src/tokenize.js"(exports2, module2) {
    "use strict";
    module2.exports = tokenize;
    var delimRe = /[\s{}=;:[\],'"()<>]/g;
    var stringDoubleRe = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g;
    var stringSingleRe = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g;
    var setCommentRe = /^ *[*/]+ */;
    var setCommentAltRe = /^\s*\*?\/*/;
    var setCommentSplitRe = /\n/g;
    var whitespaceRe = /\s/;
    var unescapeRe = /\\(.?)/g;
    var unescapeMap = {
      "0": "\0",
      "r": "\r",
      "n": "\n",
      "t": "	"
    };
    function unescape(str) {
      return str.replace(unescapeRe, function($0, $1) {
        switch ($1) {
          case "\\":
          case "":
            return $1;
          default:
            return unescapeMap[$1] || "";
        }
      });
    }
    tokenize.unescape = unescape;
    function tokenize(source, alternateCommentMode) {
      source = source.toString();
      var offset = 0, length = source.length, line = 1, lastCommentLine = 0, comments = {};
      var stack = [];
      var stringDelim = null;
      function illegal(subject) {
        return Error("illegal " + subject + " (line " + line + ")");
      }
      function readString() {
        var re = stringDelim === "'" ? stringSingleRe : stringDoubleRe;
        re.lastIndex = offset - 1;
        var match = re.exec(source);
        if (!match)
          throw illegal("string");
        offset = re.lastIndex;
        push(stringDelim);
        stringDelim = null;
        return unescape(match[1]);
      }
      function charAt(pos) {
        return source.charAt(pos);
      }
      function setComment(start, end, isLeading) {
        var comment = {
          type: source.charAt(start++),
          lineEmpty: false,
          leading: isLeading
        };
        var lookback;
        if (alternateCommentMode) {
          lookback = 2;
        } else {
          lookback = 3;
        }
        var commentOffset = start - lookback, c;
        do {
          if (--commentOffset < 0 || (c = source.charAt(commentOffset)) === "\n") {
            comment.lineEmpty = true;
            break;
          }
        } while (c === " " || c === "	");
        var lines = source.substring(start, end).split(setCommentSplitRe);
        for (var i = 0; i < lines.length; ++i)
          lines[i] = lines[i].replace(alternateCommentMode ? setCommentAltRe : setCommentRe, "").trim();
        comment.text = lines.join("\n").trim();
        comments[line] = comment;
        lastCommentLine = line;
      }
      function isDoubleSlashCommentLine(startOffset) {
        var endOffset = findEndOfLine(startOffset);
        var lineText = source.substring(startOffset, endOffset);
        var isComment = /^\s*\/{1,2}/.test(lineText);
        return isComment;
      }
      function findEndOfLine(cursor) {
        var endOffset = cursor;
        while (endOffset < length && charAt(endOffset) !== "\n") {
          endOffset++;
        }
        return endOffset;
      }
      function next() {
        if (stack.length > 0)
          return stack.shift();
        if (stringDelim)
          return readString();
        var repeat, prev, curr, start, isDoc, isLeadingComment = offset === 0;
        do {
          if (offset === length)
            return null;
          repeat = false;
          while (whitespaceRe.test(curr = charAt(offset))) {
            if (curr === "\n") {
              isLeadingComment = true;
              ++line;
            }
            if (++offset === length)
              return null;
          }
          if (charAt(offset) === "/") {
            if (++offset === length) {
              throw illegal("comment");
            }
            if (charAt(offset) === "/") {
              if (!alternateCommentMode) {
                isDoc = charAt(start = offset + 1) === "/";
                while (charAt(++offset) !== "\n") {
                  if (offset === length) {
                    return null;
                  }
                }
                ++offset;
                if (isDoc) {
                  setComment(start, offset - 1, isLeadingComment);
                  isLeadingComment = true;
                }
                ++line;
                repeat = true;
              } else {
                start = offset;
                isDoc = false;
                if (isDoubleSlashCommentLine(offset)) {
                  isDoc = true;
                  do {
                    offset = findEndOfLine(offset);
                    if (offset === length) {
                      break;
                    }
                    offset++;
                    if (!isLeadingComment) {
                      break;
                    }
                  } while (isDoubleSlashCommentLine(offset));
                } else {
                  offset = Math.min(length, findEndOfLine(offset) + 1);
                }
                if (isDoc) {
                  setComment(start, offset, isLeadingComment);
                  isLeadingComment = true;
                }
                line++;
                repeat = true;
              }
            } else if ((curr = charAt(offset)) === "*") {
              start = offset + 1;
              isDoc = alternateCommentMode || charAt(start) === "*";
              do {
                if (curr === "\n") {
                  ++line;
                }
                if (++offset === length) {
                  throw illegal("comment");
                }
                prev = curr;
                curr = charAt(offset);
              } while (prev !== "*" || curr !== "/");
              ++offset;
              if (isDoc) {
                setComment(start, offset - 2, isLeadingComment);
                isLeadingComment = true;
              }
              repeat = true;
            } else {
              return "/";
            }
          }
        } while (repeat);
        var end = offset;
        delimRe.lastIndex = 0;
        var delim = delimRe.test(charAt(end++));
        if (!delim)
          while (end < length && !delimRe.test(charAt(end)))
            ++end;
        var token = source.substring(offset, offset = end);
        if (token === '"' || token === "'")
          stringDelim = token;
        return token;
      }
      function push(token) {
        stack.push(token);
      }
      function peek() {
        if (!stack.length) {
          var token = next();
          if (token === null)
            return null;
          push(token);
        }
        return stack[0];
      }
      function skip(expected, optional) {
        var actual = peek(), equals = actual === expected;
        if (equals) {
          next();
          return true;
        }
        if (!optional)
          throw illegal("token '" + actual + "', '" + expected + "' expected");
        return false;
      }
      function cmnt(trailingLine) {
        var ret = null;
        var comment;
        if (trailingLine === void 0) {
          comment = comments[line - 1];
          delete comments[line - 1];
          if (comment && (alternateCommentMode || comment.type === "*" || comment.lineEmpty)) {
            ret = comment.leading ? comment.text : null;
          }
        } else {
          if (lastCommentLine < trailingLine) {
            peek();
          }
          comment = comments[trailingLine];
          delete comments[trailingLine];
          if (comment && !comment.lineEmpty && (alternateCommentMode || comment.type === "/")) {
            ret = comment.leading ? null : comment.text;
          }
        }
        return ret;
      }
      return Object.defineProperty({
        next,
        peek,
        push,
        skip,
        cmnt
      }, "line", {
        get: function() {
          return line;
        }
      });
    }
  }
});

// node_modules/protobufjs/src/parse.js
var require_parse = __commonJS({
  "node_modules/protobufjs/src/parse.js"(exports2, module2) {
    "use strict";
    module2.exports = parse2;
    parse2.filename = null;
    parse2.defaults = { keepCase: false };
    var tokenize = require_tokenize();
    var Root2 = require_root();
    var Type2 = require_type();
    var Field = require_field();
    var MapField = require_mapfield();
    var OneOf = require_oneof();
    var Enum2 = require_enum();
    var Service3 = require_service2();
    var Method3 = require_method();
    var types = require_types();
    var util = require_util();
    var base10Re = /^[1-9][0-9]*$/;
    var base10NegRe = /^-?[1-9][0-9]*$/;
    var base16Re = /^0[x][0-9a-fA-F]+$/;
    var base16NegRe = /^-?0[x][0-9a-fA-F]+$/;
    var base8Re = /^0[0-7]+$/;
    var base8NegRe = /^-?0[0-7]+$/;
    var numberRe = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/;
    var nameRe = /^[a-zA-Z_][a-zA-Z_0-9]*$/;
    var typeRefRe = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;
    var fqTypeRefRe = /^(?:\.[a-zA-Z_][a-zA-Z_0-9]*)+$/;
    function parse2(source, root, options) {
      if (!(root instanceof Root2)) {
        options = root;
        root = new Root2();
      }
      if (!options)
        options = parse2.defaults;
      var preferTrailingComment = options.preferTrailingComment || false;
      var tn = tokenize(source, options.alternateCommentMode || false), next = tn.next, push = tn.push, peek = tn.peek, skip = tn.skip, cmnt = tn.cmnt;
      var head = true, pkg, imports, weakImports, syntax, isProto3 = false;
      var ptr = root;
      var applyCase = options.keepCase ? function(name) {
        return name;
      } : util.camelCase;
      function illegal(token2, name, insideTryCatch) {
        var filename = parse2.filename;
        if (!insideTryCatch)
          parse2.filename = null;
        return Error("illegal " + (name || "token") + " '" + token2 + "' (" + (filename ? filename + ", " : "") + "line " + tn.line + ")");
      }
      function readString() {
        var values = [], token2;
        do {
          if ((token2 = next()) !== '"' && token2 !== "'")
            throw illegal(token2);
          values.push(next());
          skip(token2);
          token2 = peek();
        } while (token2 === '"' || token2 === "'");
        return values.join("");
      }
      function readValue(acceptTypeRef) {
        var token2 = next();
        switch (token2) {
          case "'":
          case '"':
            push(token2);
            return readString();
          case "true":
          case "TRUE":
            return true;
          case "false":
          case "FALSE":
            return false;
        }
        try {
          return parseNumber(
            token2,
            /* insideTryCatch */
            true
          );
        } catch (e) {
          if (acceptTypeRef && typeRefRe.test(token2))
            return token2;
          throw illegal(token2, "value");
        }
      }
      function readRanges(target, acceptStrings) {
        var token2, start;
        do {
          if (acceptStrings && ((token2 = peek()) === '"' || token2 === "'"))
            target.push(readString());
          else
            target.push([start = parseId(next()), skip("to", true) ? parseId(next()) : start]);
        } while (skip(",", true));
        skip(";");
      }
      function parseNumber(token2, insideTryCatch) {
        var sign = 1;
        if (token2.charAt(0) === "-") {
          sign = -1;
          token2 = token2.substring(1);
        }
        switch (token2) {
          case "inf":
          case "INF":
          case "Inf":
            return sign * Infinity;
          case "nan":
          case "NAN":
          case "Nan":
          case "NaN":
            return NaN;
          case "0":
            return 0;
        }
        if (base10Re.test(token2))
          return sign * parseInt(token2, 10);
        if (base16Re.test(token2))
          return sign * parseInt(token2, 16);
        if (base8Re.test(token2))
          return sign * parseInt(token2, 8);
        if (numberRe.test(token2))
          return sign * parseFloat(token2);
        throw illegal(token2, "number", insideTryCatch);
      }
      function parseId(token2, acceptNegative) {
        switch (token2) {
          case "max":
          case "MAX":
          case "Max":
            return 536870911;
          case "0":
            return 0;
        }
        if (!acceptNegative && token2.charAt(0) === "-")
          throw illegal(token2, "id");
        if (base10NegRe.test(token2))
          return parseInt(token2, 10);
        if (base16NegRe.test(token2))
          return parseInt(token2, 16);
        if (base8NegRe.test(token2))
          return parseInt(token2, 8);
        throw illegal(token2, "id");
      }
      function parsePackage() {
        if (pkg !== void 0)
          throw illegal("package");
        pkg = next();
        if (!typeRefRe.test(pkg))
          throw illegal(pkg, "name");
        ptr = ptr.define(pkg);
        skip(";");
      }
      function parseImport() {
        var token2 = peek();
        var whichImports;
        switch (token2) {
          case "weak":
            whichImports = weakImports || (weakImports = []);
            next();
            break;
          case "public":
            next();
          default:
            whichImports = imports || (imports = []);
            break;
        }
        token2 = readString();
        skip(";");
        whichImports.push(token2);
      }
      function parseSyntax() {
        skip("=");
        syntax = readString();
        isProto3 = syntax === "proto3";
        if (!isProto3 && syntax !== "proto2")
          throw illegal(syntax, "syntax");
        skip(";");
      }
      function parseCommon(parent, token2) {
        switch (token2) {
          case "option":
            parseOption(parent, token2);
            skip(";");
            return true;
          case "message":
            parseType(parent, token2);
            return true;
          case "enum":
            parseEnum(parent, token2);
            return true;
          case "service":
            parseService(parent, token2);
            return true;
          case "extend":
            parseExtension(parent, token2);
            return true;
        }
        return false;
      }
      function ifBlock(obj, fnIf, fnElse) {
        var trailingLine = tn.line;
        if (obj) {
          if (typeof obj.comment !== "string") {
            obj.comment = cmnt();
          }
          obj.filename = parse2.filename;
        }
        if (skip("{", true)) {
          var token2;
          while ((token2 = next()) !== "}")
            fnIf(token2);
          skip(";", true);
        } else {
          if (fnElse)
            fnElse();
          skip(";");
          if (obj && (typeof obj.comment !== "string" || preferTrailingComment))
            obj.comment = cmnt(trailingLine) || obj.comment;
        }
      }
      function parseType(parent, token2) {
        if (!nameRe.test(token2 = next()))
          throw illegal(token2, "type name");
        var type = new Type2(token2);
        ifBlock(type, function parseType_block(token3) {
          if (parseCommon(type, token3))
            return;
          switch (token3) {
            case "map":
              parseMapField(type, token3);
              break;
            case "required":
            case "repeated":
              parseField(type, token3);
              break;
            case "optional":
              if (isProto3) {
                parseField(type, "proto3_optional");
              } else {
                parseField(type, "optional");
              }
              break;
            case "oneof":
              parseOneOf(type, token3);
              break;
            case "extensions":
              readRanges(type.extensions || (type.extensions = []));
              break;
            case "reserved":
              readRanges(type.reserved || (type.reserved = []), true);
              break;
            default:
              if (!isProto3 || !typeRefRe.test(token3))
                throw illegal(token3);
              push(token3);
              parseField(type, "optional");
              break;
          }
        });
        parent.add(type);
      }
      function parseField(parent, rule, extend) {
        var type = next();
        if (type === "group") {
          parseGroup(parent, rule);
          return;
        }
        if (!typeRefRe.test(type))
          throw illegal(type, "type");
        var name = next();
        if (!nameRe.test(name))
          throw illegal(name, "name");
        name = applyCase(name);
        skip("=");
        var field = new Field(name, parseId(next()), type, rule, extend);
        ifBlock(field, function parseField_block(token2) {
          if (token2 === "option") {
            parseOption(field, token2);
            skip(";");
          } else
            throw illegal(token2);
        }, function parseField_line() {
          parseInlineOptions(field);
        });
        if (rule === "proto3_optional") {
          var oneof = new OneOf("_" + name);
          field.setOption("proto3_optional", true);
          oneof.add(field);
          parent.add(oneof);
        } else {
          parent.add(field);
        }
        if (!isProto3 && field.repeated && (types.packed[type] !== void 0 || types.basic[type] === void 0))
          field.setOption(
            "packed",
            false,
            /* ifNotSet */
            true
          );
      }
      function parseGroup(parent, rule) {
        var name = next();
        if (!nameRe.test(name))
          throw illegal(name, "name");
        var fieldName = util.lcFirst(name);
        if (name === fieldName)
          name = util.ucFirst(name);
        skip("=");
        var id = parseId(next());
        var type = new Type2(name);
        type.group = true;
        var field = new Field(fieldName, id, name, rule);
        field.filename = parse2.filename;
        ifBlock(type, function parseGroup_block(token2) {
          switch (token2) {
            case "option":
              parseOption(type, token2);
              skip(";");
              break;
            case "required":
            case "repeated":
              parseField(type, token2);
              break;
            case "optional":
              if (isProto3) {
                parseField(type, "proto3_optional");
              } else {
                parseField(type, "optional");
              }
              break;
            case "message":
              parseType(type, token2);
              break;
            case "enum":
              parseEnum(type, token2);
              break;
            default:
              throw illegal(token2);
          }
        });
        parent.add(type).add(field);
      }
      function parseMapField(parent) {
        skip("<");
        var keyType = next();
        if (types.mapKey[keyType] === void 0)
          throw illegal(keyType, "type");
        skip(",");
        var valueType = next();
        if (!typeRefRe.test(valueType))
          throw illegal(valueType, "type");
        skip(">");
        var name = next();
        if (!nameRe.test(name))
          throw illegal(name, "name");
        skip("=");
        var field = new MapField(applyCase(name), parseId(next()), keyType, valueType);
        ifBlock(field, function parseMapField_block(token2) {
          if (token2 === "option") {
            parseOption(field, token2);
            skip(";");
          } else
            throw illegal(token2);
        }, function parseMapField_line() {
          parseInlineOptions(field);
        });
        parent.add(field);
      }
      function parseOneOf(parent, token2) {
        if (!nameRe.test(token2 = next()))
          throw illegal(token2, "name");
        var oneof = new OneOf(applyCase(token2));
        ifBlock(oneof, function parseOneOf_block(token3) {
          if (token3 === "option") {
            parseOption(oneof, token3);
            skip(";");
          } else {
            push(token3);
            parseField(oneof, "optional");
          }
        });
        parent.add(oneof);
      }
      function parseEnum(parent, token2) {
        if (!nameRe.test(token2 = next()))
          throw illegal(token2, "name");
        var enm = new Enum2(token2);
        ifBlock(enm, function parseEnum_block(token3) {
          switch (token3) {
            case "option":
              parseOption(enm, token3);
              skip(";");
              break;
            case "reserved":
              readRanges(enm.reserved || (enm.reserved = []), true);
              break;
            default:
              parseEnumValue(enm, token3);
          }
        });
        parent.add(enm);
      }
      function parseEnumValue(parent, token2) {
        if (!nameRe.test(token2))
          throw illegal(token2, "name");
        skip("=");
        var value = parseId(next(), true), dummy = {
          options: void 0
        };
        dummy.setOption = function(name, value2) {
          if (this.options === void 0)
            this.options = {};
          this.options[name] = value2;
        };
        ifBlock(dummy, function parseEnumValue_block(token3) {
          if (token3 === "option") {
            parseOption(dummy, token3);
            skip(";");
          } else
            throw illegal(token3);
        }, function parseEnumValue_line() {
          parseInlineOptions(dummy);
        });
        parent.add(token2, value, dummy.comment, dummy.options);
      }
      function parseOption(parent, token2) {
        var isCustom = skip("(", true);
        if (!typeRefRe.test(token2 = next()))
          throw illegal(token2, "name");
        var name = token2;
        var option = name;
        var propName;
        if (isCustom) {
          skip(")");
          name = "(" + name + ")";
          option = name;
          token2 = peek();
          if (fqTypeRefRe.test(token2)) {
            propName = token2.slice(1);
            name += token2;
            next();
          }
        }
        skip("=");
        var optionValue = parseOptionValue(parent, name);
        setParsedOption(parent, option, optionValue, propName);
      }
      function parseOptionValue(parent, name) {
        if (skip("{", true)) {
          var objectResult = {};
          while (!skip("}", true)) {
            if (!nameRe.test(token = next())) {
              throw illegal(token, "name");
            }
            var value;
            var propName = token;
            skip(":", true);
            if (peek() === "{")
              value = parseOptionValue(parent, name + "." + token);
            else if (peek() === "[") {
              value = [];
              var lastValue;
              if (skip("[", true)) {
                do {
                  lastValue = readValue(true);
                  value.push(lastValue);
                } while (skip(",", true));
                skip("]");
                if (typeof lastValue !== "undefined") {
                  setOption(parent, name + "." + token, lastValue);
                }
              }
            } else {
              value = readValue(true);
              setOption(parent, name + "." + token, value);
            }
            var prevValue = objectResult[propName];
            if (prevValue)
              value = [].concat(prevValue).concat(value);
            objectResult[propName] = value;
            skip(",", true);
            skip(";", true);
          }
          return objectResult;
        }
        var simpleValue = readValue(true);
        setOption(parent, name, simpleValue);
        return simpleValue;
      }
      function setOption(parent, name, value) {
        if (parent.setOption)
          parent.setOption(name, value);
      }
      function setParsedOption(parent, name, value, propName) {
        if (parent.setParsedOption)
          parent.setParsedOption(name, value, propName);
      }
      function parseInlineOptions(parent) {
        if (skip("[", true)) {
          do {
            parseOption(parent, "option");
          } while (skip(",", true));
          skip("]");
        }
        return parent;
      }
      function parseService(parent, token2) {
        if (!nameRe.test(token2 = next()))
          throw illegal(token2, "service name");
        var service = new Service3(token2);
        ifBlock(service, function parseService_block(token3) {
          if (parseCommon(service, token3))
            return;
          if (token3 === "rpc")
            parseMethod(service, token3);
          else
            throw illegal(token3);
        });
        parent.add(service);
      }
      function parseMethod(parent, token2) {
        var commentText = cmnt();
        var type = token2;
        if (!nameRe.test(token2 = next()))
          throw illegal(token2, "name");
        var name = token2, requestType, requestStream, responseType, responseStream;
        skip("(");
        if (skip("stream", true))
          requestStream = true;
        if (!typeRefRe.test(token2 = next()))
          throw illegal(token2);
        requestType = token2;
        skip(")");
        skip("returns");
        skip("(");
        if (skip("stream", true))
          responseStream = true;
        if (!typeRefRe.test(token2 = next()))
          throw illegal(token2);
        responseType = token2;
        skip(")");
        var method = new Method3(name, type, requestType, responseType, requestStream, responseStream);
        method.comment = commentText;
        ifBlock(method, function parseMethod_block(token3) {
          if (token3 === "option") {
            parseOption(method, token3);
            skip(";");
          } else
            throw illegal(token3);
        });
        parent.add(method);
      }
      function parseExtension(parent, token2) {
        if (!typeRefRe.test(token2 = next()))
          throw illegal(token2, "reference");
        var reference = token2;
        ifBlock(null, function parseExtension_block(token3) {
          switch (token3) {
            case "required":
            case "repeated":
              parseField(parent, token3, reference);
              break;
            case "optional":
              if (isProto3) {
                parseField(parent, "proto3_optional", reference);
              } else {
                parseField(parent, "optional", reference);
              }
              break;
            default:
              if (!isProto3 || !typeRefRe.test(token3))
                throw illegal(token3);
              push(token3);
              parseField(parent, "optional", reference);
              break;
          }
        });
      }
      var token;
      while ((token = next()) !== null) {
        switch (token) {
          case "package":
            if (!head)
              throw illegal(token);
            parsePackage();
            break;
          case "import":
            if (!head)
              throw illegal(token);
            parseImport();
            break;
          case "syntax":
            if (!head)
              throw illegal(token);
            parseSyntax();
            break;
          case "option":
            parseOption(ptr, token);
            skip(";");
            break;
          default:
            if (parseCommon(ptr, token)) {
              head = false;
              continue;
            }
            throw illegal(token);
        }
      }
      parse2.filename = null;
      return {
        "package": pkg,
        "imports": imports,
        weakImports,
        syntax,
        root
      };
    }
  }
});

// node_modules/protobufjs/src/common.js
var require_common = __commonJS({
  "node_modules/protobufjs/src/common.js"(exports2, module2) {
    "use strict";
    module2.exports = common;
    var commonRe = /\/|\./;
    function common(name, json) {
      if (!commonRe.test(name)) {
        name = "google/protobuf/" + name + ".proto";
        json = { nested: { google: { nested: { protobuf: { nested: json } } } } };
      }
      common[name] = json;
    }
    common("any", {
      /**
       * Properties of a google.protobuf.Any message.
       * @interface IAny
       * @type {Object}
       * @property {string} [typeUrl]
       * @property {Uint8Array} [bytes]
       * @memberof common
       */
      Any: {
        fields: {
          type_url: {
            type: "string",
            id: 1
          },
          value: {
            type: "bytes",
            id: 2
          }
        }
      }
    });
    var timeType;
    common("duration", {
      /**
       * Properties of a google.protobuf.Duration message.
       * @interface IDuration
       * @type {Object}
       * @property {number|Long} [seconds]
       * @property {number} [nanos]
       * @memberof common
       */
      Duration: timeType = {
        fields: {
          seconds: {
            type: "int64",
            id: 1
          },
          nanos: {
            type: "int32",
            id: 2
          }
        }
      }
    });
    common("timestamp", {
      /**
       * Properties of a google.protobuf.Timestamp message.
       * @interface ITimestamp
       * @type {Object}
       * @property {number|Long} [seconds]
       * @property {number} [nanos]
       * @memberof common
       */
      Timestamp: timeType
    });
    common("empty", {
      /**
       * Properties of a google.protobuf.Empty message.
       * @interface IEmpty
       * @memberof common
       */
      Empty: {
        fields: {}
      }
    });
    common("struct", {
      /**
       * Properties of a google.protobuf.Struct message.
       * @interface IStruct
       * @type {Object}
       * @property {Object.<string,IValue>} [fields]
       * @memberof common
       */
      Struct: {
        fields: {
          fields: {
            keyType: "string",
            type: "Value",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.Value message.
       * @interface IValue
       * @type {Object}
       * @property {string} [kind]
       * @property {0} [nullValue]
       * @property {number} [numberValue]
       * @property {string} [stringValue]
       * @property {boolean} [boolValue]
       * @property {IStruct} [structValue]
       * @property {IListValue} [listValue]
       * @memberof common
       */
      Value: {
        oneofs: {
          kind: {
            oneof: [
              "nullValue",
              "numberValue",
              "stringValue",
              "boolValue",
              "structValue",
              "listValue"
            ]
          }
        },
        fields: {
          nullValue: {
            type: "NullValue",
            id: 1
          },
          numberValue: {
            type: "double",
            id: 2
          },
          stringValue: {
            type: "string",
            id: 3
          },
          boolValue: {
            type: "bool",
            id: 4
          },
          structValue: {
            type: "Struct",
            id: 5
          },
          listValue: {
            type: "ListValue",
            id: 6
          }
        }
      },
      NullValue: {
        values: {
          NULL_VALUE: 0
        }
      },
      /**
       * Properties of a google.protobuf.ListValue message.
       * @interface IListValue
       * @type {Object}
       * @property {Array.<IValue>} [values]
       * @memberof common
       */
      ListValue: {
        fields: {
          values: {
            rule: "repeated",
            type: "Value",
            id: 1
          }
        }
      }
    });
    common("wrappers", {
      /**
       * Properties of a google.protobuf.DoubleValue message.
       * @interface IDoubleValue
       * @type {Object}
       * @property {number} [value]
       * @memberof common
       */
      DoubleValue: {
        fields: {
          value: {
            type: "double",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.FloatValue message.
       * @interface IFloatValue
       * @type {Object}
       * @property {number} [value]
       * @memberof common
       */
      FloatValue: {
        fields: {
          value: {
            type: "float",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.Int64Value message.
       * @interface IInt64Value
       * @type {Object}
       * @property {number|Long} [value]
       * @memberof common
       */
      Int64Value: {
        fields: {
          value: {
            type: "int64",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.UInt64Value message.
       * @interface IUInt64Value
       * @type {Object}
       * @property {number|Long} [value]
       * @memberof common
       */
      UInt64Value: {
        fields: {
          value: {
            type: "uint64",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.Int32Value message.
       * @interface IInt32Value
       * @type {Object}
       * @property {number} [value]
       * @memberof common
       */
      Int32Value: {
        fields: {
          value: {
            type: "int32",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.UInt32Value message.
       * @interface IUInt32Value
       * @type {Object}
       * @property {number} [value]
       * @memberof common
       */
      UInt32Value: {
        fields: {
          value: {
            type: "uint32",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.BoolValue message.
       * @interface IBoolValue
       * @type {Object}
       * @property {boolean} [value]
       * @memberof common
       */
      BoolValue: {
        fields: {
          value: {
            type: "bool",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.StringValue message.
       * @interface IStringValue
       * @type {Object}
       * @property {string} [value]
       * @memberof common
       */
      StringValue: {
        fields: {
          value: {
            type: "string",
            id: 1
          }
        }
      },
      /**
       * Properties of a google.protobuf.BytesValue message.
       * @interface IBytesValue
       * @type {Object}
       * @property {Uint8Array} [value]
       * @memberof common
       */
      BytesValue: {
        fields: {
          value: {
            type: "bytes",
            id: 1
          }
        }
      }
    });
    common("field_mask", {
      /**
       * Properties of a google.protobuf.FieldMask message.
       * @interface IDoubleValue
       * @type {Object}
       * @property {number} [value]
       * @memberof common
       */
      FieldMask: {
        fields: {
          paths: {
            rule: "repeated",
            type: "string",
            id: 1
          }
        }
      }
    });
    common.get = function get(file) {
      return common[file] || null;
    };
  }
});

// node_modules/protobufjs/src/index.js
var require_src = __commonJS({
  "node_modules/protobufjs/src/index.js"(exports2, module2) {
    "use strict";
    var protobuf6 = module2.exports = require_index_light();
    protobuf6.build = "full";
    protobuf6.tokenize = require_tokenize();
    protobuf6.parse = require_parse();
    protobuf6.common = require_common();
    protobuf6.Root._configure(protobuf6.Type, protobuf6.parse, protobuf6.common);
  }
});

// node_modules/protobufjs/index.js
var require_protobufjs = __commonJS({
  "node_modules/protobufjs/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_src();
  }
});

// out/index.js
var out_exports = {};
__export(out_exports, {
  protoToTs: () => protoToTs
});
module.exports = __toCommonJS(out_exports);

// out/ts-poet/Import.js
var path = __toESM(require("path"));

// out/ts-poet/Node.js
var Node = class {
};

// out/ts-poet/utils.js
function groupBy(list, fn, valueFn) {
  const result = {};
  list.forEach((o) => {
    var _a;
    const group = fn(o);
    (_a = result[group]) !== null && _a !== void 0 ? _a : result[group] = [];
    result[group].push(valueFn ? valueFn(o) : o);
  });
  return result;
}
function last(list) {
  return list[list.length - 1];
}

// out/ts-poet/Import.js
var typeImportMarker = "(?:t:)?";
var fileNamePattern = "(?:[a-zA-Z0-9._-]+)";
var modulePattern = `@?(?:(?:${fileNamePattern}(?:/${fileNamePattern})*))`;
var identPattern = `(?:(?:[a-zA-Z][_a-zA-Z0-9.]*)|(?:[_a-zA-Z][_a-zA-Z0-9.]+))`;
var importType = "[*@+=]";
var importPattern = `^(${typeImportMarker}${identPattern})?(${importType})(${modulePattern})(?:#(${identPattern}))?`;
var sourceIdentPattern = `(?:(?:${identPattern}:)?)`;
var sourceImportPattern = `^(${typeImportMarker}${sourceIdentPattern}${identPattern})?(@)(${modulePattern})(?:#(${identPattern}))?`;
var Import = class extends Node {
  /**
   * Parses a symbol reference pattern to create a symbol. The pattern
   * allows the simple definition of all symbol types including any possible
   * import variation. If the spec to parse does not follow the proper format
   * an implicit symbol is created from the unparsed spec.
   *
   * Pattern: `symbolName? importType modulePath (#<augmentedSymbolName>)?`
   *
   * Where:
   *
   * - `symbolName` is any legal JS/TS symbol. If none, we use the last part of the module path as a guess.
   * - `importType` is one of `@` or `*` or `+`, where:
   *    - `@` is a named import
   *       - `Foo@bar` becomes `import { Foo } from 'bar'`
   *    - `*` is a star import,
   *       - `*Foo` becomes `import * as Foo from 'Foo'`
   *       - `Foo*foo` becomes `import * as Foo from 'foo'`
   *    - `+` is an implicit import
   *       - E.g. `Foo+foo` becomes `import 'foo'`
   * - `modulePath` is a path
   *    - E.g. `<filename>(/<filename)*`
   * - augmentedSymbolName = `[a-zA-Z0-9_]+`
   *
   *        Any valid symbol name that represents the symbol that is being augmented. For example,
   *        the import `rxjs/add/observable/from` attaches the `from` method to the `Observable` class.
   *        To import it correctly the spec should be `+rxjs/add/observable/from#Observable`. Adding this
   *        parameter to augmented imports ensures they are output only when the symbol being augmented
   *        is actually used.
   *
   *
   * @param spec Symbol spec to parse.
   * @return Parsed symbol specification
   */
  static from(spec) {
    let matched = spec.match(importPattern);
    if (matched === null) {
      matched = spec.match(sourceImportPattern);
    }
    if (matched != null) {
      const modulePath = matched[3];
      const kind = matched[2] || "@";
      const symbolName = matched[1] || last(modulePath.split("/")) || "";
      const targetName = matched[4];
      switch (kind) {
        case "*":
          return Import.importsAll(symbolName, modulePath);
        case "@":
          const isTypeImport = symbolName.startsWith("t:");
          let exportedNames;
          if (isTypeImport) {
            exportedNames = symbolName.substring(2).split(":");
          } else {
            exportedNames = symbolName.split(":");
          }
          const exportedName = exportedNames.pop();
          const sourceExportedName = exportedNames[0];
          return Import.importsName(exportedName, modulePath, isTypeImport, sourceExportedName);
        case "=":
          return Import.importsDefault(symbolName, modulePath);
        case "+":
          return targetName ? Import.augmented(symbolName, modulePath, targetName) : Import.sideEffect(symbolName, modulePath);
        default:
          throw new Error("Invalid import kind character");
      }
    }
    return Import.implicit(spec);
  }
  static fromMaybeString(spec) {
    return typeof spec === "string" ? Import.from(spec) : spec;
  }
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }
  toCodeString() {
    return this.symbol;
  }
  get childNodes() {
    return [];
  }
  /**
   * Creates an import of all the modules exported symbols as a single
   * local named symbol
   *
   * e.g. `import * as Engine from 'templates';`
   *
   * @param localName The local name of the imported symbols
   * @param from The module to import the symbols from
   */
  static importsAll(localName, from) {
    return new ImportsAll(localName, from);
  }
  /**
   * Creates an import of a single named symbol from the module's exported
   * symbols.
   *
   * e.g. `import { Engine } from 'templates';`
   *
   * @param exportedName The symbol that is both exported and imported
   * @param from The module the symbol is exported from
   * @param typeImport whether this is an `import type` import
   */
  static importsName(exportedName, from, typeImport, sourceExportedName) {
    return new ImportsName(exportedName, from, sourceExportedName, typeImport);
  }
  /**
   * Creates a symbol that is brought in by a whole module import
   * that "augments" an existing symbol.
   *
   * e.g. `import 'rxjs/add/operator/flatMap'`
   *
   * @param symbolName The augmented symbol to be imported
   * @param from The entire import that does the augmentation
   * @param target The symbol that is augmented
   */
  static augmented(symbolName, from, target) {
    return new Augmented(symbolName, from, target);
  }
  /**
   * Creates a symbol that is brought in as a side effect of
   * an import.
   *
   * e.g. `import 'mocha'`
   *
   * @param symbolName The symbol to be imported
   * @param from The entire import that does the augmentation
   */
  static sideEffect(symbolName, from) {
    return new SideEffect(symbolName, from);
  }
  /**
   * An implied symbol that does no tracking of imports
   *
   * @param name The implicit symbol name
   */
  static implicit(name) {
    return new Implicit(name);
  }
  /**
   * Creates an import of a single named symbol from the module's exported
   * default.
   *
   * e.g. `import Engine from 'engine';`
   *
   * @param exportedName The symbol that is both exported and imported
   * @param from The module the symbol is exported from
   */
  static importsDefault(exportedName, from) {
    return new ImportsDefault(exportedName, from);
  }
};
var Implicit = class extends Import {
  constructor(symbol) {
    super(symbol);
    this.source = void 0;
  }
};
var Imported = class extends Import {
  /** The symbol is the imported symbol, i.e. `BarClass`, and source is the path it comes from. */
  constructor(symbol, source) {
    super(source);
    this.symbol = symbol;
    this.source = source;
  }
};
var ImportsName = class extends Imported {
  /**
   * @param symbol
   * @param source
   * @param sourceSymbol is the optional original symbol, i.e if we're renaming the symbol it is `Engine`
   * @param typeImport whether this is an `import type` import
   */
  constructor(symbol, source, sourceSymbol, typeImport) {
    super(symbol, source);
    this.sourceSymbol = sourceSymbol;
    this.typeImport = typeImport;
  }
  toImportPiece() {
    return this.sourceSymbol ? `${this.sourceSymbol} as ${this.symbol}` : this.symbol;
  }
};
var ImportsDefault = class extends Imported {
  constructor(symbol, source) {
    super(symbol, source);
  }
};
var ImportsAll = class extends Imported {
  constructor(symbol, source) {
    super(symbol, source);
  }
};
var Augmented = class extends Imported {
  constructor(symbol, source, augmented) {
    super(symbol, source);
    this.augmented = augmented;
  }
};
var SideEffect = class extends Imported {
  constructor(symbol, source) {
    super(symbol, source);
  }
};
function emitImports(imports, ourModulePath, importMappings) {
  if (imports.length == 0) {
    return "";
  }
  let result = "";
  const augmentImports = groupBy(filterInstances(imports, Augmented), (a) => a.augmented);
  const importsByModule = groupBy(imports.filter((it) => it.source !== void 0 && // Ignore imports that are in our own file
  !(it instanceof ImportsName && it.definedIn && sameModule(it.definedIn, ourModulePath))), (it) => it.source);
  Object.entries(importsByModule).forEach(([modulePath, imports2]) => {
    if (sameModule(ourModulePath, modulePath)) {
      return;
    }
    if (modulePath in importMappings) {
      modulePath = importMappings[modulePath];
    }
    const importPath = maybeRelativePath(ourModulePath, modulePath);
    unique(filterInstances(imports2, ImportsAll).map((i) => i.symbol)).forEach((symbol) => {
      result += `import * as ${symbol} from '${importPath}';
`;
      const augments = augmentImports[symbol];
      if (augments) {
        augments.forEach((augment) => result += `import '${augment.source}';
`);
      }
    });
    const allNames = filterInstances(imports2, ImportsName);
    const names = unique(allNames.filter((i) => !i.typeImport).map((it) => it.toImportPiece()));
    const def = unique(filterInstances(imports2, ImportsDefault).map((it) => it.symbol));
    if (names.length > 0 || def.length > 0) {
      const namesPart = names.length > 0 ? [`{ ${names.join(", ")} }`] : [];
      const defPart = def.length > 0 ? [def[0]] : [];
      result += `import ${[...defPart, ...namesPart].join(", ")} from '${importPath}';
`;
      [...names, ...def].forEach((name) => {
        const augments = augmentImports[name];
        if (augments) {
          augments.forEach((augment) => result += `import '${augment.source}';
`);
        }
      });
    }
    const typeImports = unique(allNames.filter((i) => i.typeImport).map((it) => it.toImportPiece()).filter((p) => !names.includes(p)));
    if (typeImports.length > 0) {
      result += `import type { ${typeImports.join(", ")} } from '${importPath}';
`;
    }
  });
  const sideEffectImports = groupBy(filterInstances(imports, SideEffect), (a) => a.source);
  Object.keys(sideEffectImports).forEach((it) => result += `import '${it}';
`);
  return result;
}
function filterInstances(list, t) {
  return list.filter((e) => e instanceof t);
}
function unique(list) {
  return [...new Set(list)];
}
function maybeRelativePath(outputPath, importPath) {
  if (!importPath.startsWith("./")) {
    return importPath;
  }
  importPath = path.normalize(importPath);
  outputPath = path.normalize(outputPath);
  const outputPathDir = path.dirname(outputPath);
  let relativePath = path.relative(outputPathDir, importPath).split(path.sep).join(path.posix.sep);
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }
  return relativePath;
}
function sameModule(path1, path22) {
  const [basePath1, basePath2] = [path1, path22].map((p) => p.replace(/\.[tj]sx?/, ""));
  return basePath1 === basePath2 || path.resolve(basePath1) === path.resolve(basePath2);
}

// out/ts-poet/is-plain-object.js
function isPlainObject(o) {
  if (o === null || o === void 0)
    return false;
  if (!isObject(o))
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  if (!isObject(ctor.prototype))
    return false;
  if (!ctor.prototype.hasOwnProperty("isPrototypeOf"))
    return false;
  return true;
}
function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}

// out/ts-poet/ConditionalOutput.js
var ConditionalOutput = class extends Node {
  // A given ConditionalOutput const could be used in multiple code
  // parents, and so we don't want to use instance state to store
  // "should I be output or not", b/c it depends on the containing tree.
  constructor(usageSiteName, declarationSiteCode) {
    super();
    this.usageSiteName = usageSiteName;
    this.declarationSiteCode = declarationSiteCode;
  }
  /** Returns the declaration code, typically to be included near the bottom of your output as top-level scope. */
  get ifUsed() {
    return new MaybeOutput(this, this.declarationSiteCode);
  }
  get childNodes() {
    return [this.declarationSiteCode];
  }
  toCodeString() {
    return this.usageSiteName;
  }
};
var MaybeOutput = class {
  constructor(parent, code2) {
    this.parent = parent;
    this.code = code2;
  }
};

// out/ts-poet/Code.js
var dprint = __toESM(require_dprint_node());
var Code = class extends Node {
  constructor(literals, placeholders) {
    super();
    this.literals = literals;
    this.placeholders = placeholders;
    this.trim = false;
    this.oneline = false;
  }
  /** Returns the formatted code, with imports. */
  toString(opts = {}) {
    var _a;
    (_a = this.codeWithImports) !== null && _a !== void 0 ? _a : this.codeWithImports = this.generateCodeWithImports(opts);
    return opts.format === false ? this.codeWithImports : maybePretty(this.codeWithImports, opts.dprintOptions);
  }
  asOneline() {
    this.oneline = true;
    return this;
  }
  get childNodes() {
    return this.placeholders;
  }
  /**
   * Returns the unformatted, import-less code.
   *
   * This is an internal API, see `toString` for the public API.
   */
  toCodeString(used) {
    var _a;
    return (_a = this.code) !== null && _a !== void 0 ? _a : this.code = this.generateCode(used);
  }
  deepFindAll() {
    const used = [];
    const imports = [];
    const defs = [];
    const todo = [this];
    let i = 0;
    while (i < todo.length) {
      const placeholder = todo[i++];
      if (placeholder instanceof Node) {
        todo.push(...placeholder.childNodes);
      } else if (Array.isArray(placeholder)) {
        todo.push(...placeholder);
      }
      if (placeholder instanceof ConditionalOutput) {
        used.push(placeholder);
        todo.push(...placeholder.declarationSiteCode.childNodes);
      } else if (placeholder instanceof Import) {
        imports.push(placeholder);
      } else if (placeholder instanceof Def) {
        defs.push(placeholder);
      } else if (placeholder instanceof MaybeOutput) {
        if (used.includes(placeholder.parent)) {
          todo.push(placeholder.code);
        }
      }
    }
    return [used, imports, defs];
  }
  deepReplaceNamedImports(forceDefaultImport, forceModuleImport) {
    const assignedNames = {};
    function getName(source) {
      let name = assignedNames[source];
      if (!name) {
        name = `_m${Object.values(assignedNames).length}`;
        assignedNames[source] = name;
      }
      return name;
    }
    const todo = [this];
    let i = 0;
    while (i < todo.length) {
      const placeholder = todo[i++];
      if (placeholder instanceof Node) {
        const array = placeholder.childNodes;
        for (let j = 0; j < array.length; j++) {
          const maybeImp = array[j];
          if (maybeImp instanceof ImportsName && forceDefaultImport.includes(maybeImp.source)) {
            const name = getName(maybeImp.source);
            array[j] = code`${new ImportsDefault(name, maybeImp.source)}.${maybeImp.sourceSymbol || maybeImp.symbol}`;
          } else if (maybeImp instanceof ImportsName && forceModuleImport.includes(maybeImp.source)) {
            const name = getName(maybeImp.source);
            array[j] = code`${new ImportsAll(name, maybeImp.source)}.${maybeImp.sourceSymbol || maybeImp.symbol}`;
          } else if (maybeImp instanceof ImportsDefault && forceModuleImport.includes(maybeImp.source)) {
            array[j] = new ImportsAll(maybeImp.symbol, maybeImp.source);
          }
        }
        todo.push(...placeholder.childNodes);
      } else if (Array.isArray(placeholder)) {
        todo.push(...placeholder);
      }
    }
  }
  generateCode(used) {
    const { literals, placeholders } = this;
    let result = "";
    for (let i = 0; i < placeholders.length; i++) {
      result += literals[i] + deepGenerate(used, placeholders[i]);
    }
    result += literals[literals.length - 1];
    if (this.trim) {
      result = result.trim();
    }
    if (this.oneline) {
      result = result.replace(/\n/g, "");
    }
    return result;
  }
  generateCodeWithImports(opts) {
    const { path: path5 = "", forceDefaultImport, forceModuleImport, prefix, importMappings = {} } = opts || {};
    const ourModulePath = path5.replace(/\.[tj]sx?/, "");
    if (forceDefaultImport || forceModuleImport) {
      this.deepReplaceNamedImports(forceDefaultImport || [], forceModuleImport || []);
    }
    const [used, imports, defs] = this.deepFindAll();
    assignAliasesIfNeeded(defs, imports, ourModulePath);
    const importPart = emitImports(imports, ourModulePath, importMappings);
    const bodyPart = this.generateCode(used);
    const maybePrefix = prefix ? `${prefix}
` : "";
    return maybePrefix + importPart + "\n" + bodyPart;
  }
};
function deepGenerate(used, object) {
  let result = "";
  let todo = [object];
  let i = 0;
  while (i < todo.length) {
    const current = todo[i++];
    if (Array.isArray(current)) {
      todo.push(...current);
    } else if (current instanceof Node) {
      result += current.toCodeString(used);
    } else if (current instanceof MaybeOutput) {
      if (used.includes(current.parent)) {
        result += current.code.toCodeString(used);
      }
    } else if (current === null) {
      result += "null";
    } else if (current !== void 0) {
      if (isPlainObject(current)) {
        result += JSON.stringify(current);
      } else {
        result += current.toString();
      }
    } else {
      result += "undefined";
    }
  }
  return result;
}
function assignAliasesIfNeeded(defs, imports, ourModulePath) {
  const usedSymbols = /* @__PURE__ */ new Set();
  defs.forEach((def) => usedSymbols.add(def.symbol));
  const assignedAliases = {};
  let j = 1;
  imports.forEach((i) => {
    if (i instanceof ImportsName && // Don't both aliasing imports from our own module
    !(sameModule(i.source, ourModulePath) || i.definedIn && sameModule(i.definedIn, ourModulePath))) {
      const key = `${i.symbol}@${i.source}`;
      if (usedSymbols.has(i.symbol)) {
        let alias = assignedAliases[key];
        if (!alias) {
          alias = `${i.symbol}${j++}`;
          assignedAliases[key] = alias;
        }
        if (alias !== i.symbol) {
          i.sourceSymbol = i.symbol;
        }
        i.symbol = alias;
      } else {
        usedSymbols.add(i.symbol);
        assignedAliases[key] = i.symbol;
      }
    }
  });
}
var baseOptions = {
  useTabs: false,
  useBraces: "always",
  singleBodyPosition: "nextLine",
  "arrowFunction.useParentheses": "force",
  // dprint-node uses `node: true`, which we want to undo
  "module.sortImportDeclarations": "caseSensitive",
  lineWidth: 120,
  // For some reason dprint seems to wrap lines "before it should" w/o this set (?)
  preferSingleLine: true
};
function maybePretty(input, options) {
  try {
    return dprint.format("file.ts", input.trim(), Object.assign(Object.assign({}, baseOptions), options));
  } catch (e) {
    return input;
  }
}
var Def = class extends Node {
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }
  toCodeString() {
    return this.symbol;
  }
  /** Any potentially string/SymbolSpec/Code nested nodes within us. */
  get childNodes() {
    return [];
  }
};

// out/ts-poet/Literal.js
var Literal = class extends Node {
  constructor(object) {
    super();
    this.tokens = flatten(object);
  }
  get childNodes() {
    return this.tokens;
  }
  toCodeString(used) {
    return this.tokens.map((node) => {
      if (typeof node === "string")
        return node;
      if (node instanceof Node)
        return node.toCodeString(used);
      return "";
    }).join(" ");
  }
};
function flatten(o) {
  if (typeof o === "undefined") {
    return ["undefined"];
  }
  if (typeof o === "object" && o != null) {
    if (o instanceof Node || o instanceof MaybeOutput) {
      return [o];
    } else if (Array.isArray(o)) {
      const nodes = ["["];
      for (let i = 0; i < o.length; i++) {
        if (i !== 0)
          nodes.push(",");
        nodes.push(...flatten(o[i]));
      }
      nodes.push("]");
      return nodes;
    } else if (isPlainObject(o)) {
      const nodes = ["{"];
      const entries = Object.entries(o);
      for (let i = 0; i < entries.length; i++) {
        if (i !== 0)
          nodes.push(",");
        const [key, value] = entries[i];
        nodes.push(JSON.stringify(key), ":", ...flatten(value));
      }
      nodes.push("}");
      return nodes;
    }
  }
  return [JSON.stringify(o)];
}

// out/ts-poet/index.js
function code(literals, ...placeholders) {
  return new Code(literals, placeholders.map((p) => {
    if (isPlainObject(p)) {
      return literalOf(p);
    } else {
      return p;
    }
  }));
}
function literalOf(object) {
  return new Literal(object);
}
function joinCode(chunks, opts = {}) {
  const { on = "", trim = true } = opts;
  const literals = [""];
  for (let i = 0; i < chunks.length - 1; i++) {
    literals.push(on);
  }
  literals.push("");
  if (trim) {
    chunks.forEach((c) => c.trim = true);
  }
  return new Code(literals, chunks);
}
function imp(spec, opts = {}) {
  const sym = Import.from(spec);
  if (opts && opts.definedIn) {
    sym.definedIn = opts.definedIn;
  }
  return sym;
}

// out/utils/fileUtil.js
var fs = __toESM(require("fs"));
var writeUtil = __toESM(require_write());

// out/generate/model.js
var BlockType;
(function(BlockType2) {
  BlockType2[BlockType2["NAMESPACE"] = 1] = "NAMESPACE";
  BlockType2[BlockType2["TYPE"] = 2] = "TYPE";
  BlockType2[BlockType2["ENUM"] = 3] = "ENUM";
  BlockType2[BlockType2["METHOD"] = 4] = "METHOD";
})(BlockType || (BlockType = {}));

// out/generate/types/generateEnum.js
function generateEnum(element) {
  let enumBlock = {
    blockType: BlockType.ENUM,
    name: element.name,
    fields: []
  };
  for (const [key, value] of Object.entries(element.values)) {
    enumBlock.fields.push({
      name: key.toUpperCase(),
      value: value.toString(),
      typeValid: true
    });
  }
  return enumBlock;
}
function generateEnumCode(blocks) {
  const codes = [];
  codes.push(code`export enum ${blocks.name} {`);
  for (let field of blocks.fields) {
    codes.push(code`${field.name}= ${field.value},`);
  }
  codes.push(code`}`);
  return codes;
}

// out/utils/fileUtil.js
var FileUtil = class {
  async read(path5) {
    const data = await fs.readFileSync(path5, "utf8");
    return data;
  }
  async write(files) {
    var _a, _b, _c;
    if ((files === null || files === void 0 ? void 0 : files.length) > 0) {
      for (let file of files) {
        if (file.isDirectory) {
          this.write(file.nested);
        } else {
          let _codes = [];
          if (((_b = (_a = file.importFiles) === null || _a === void 0 ? void 0 : _a.imports) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            const imported = generateImport((_c = file.importFiles) === null || _c === void 0 ? void 0 : _c.imports);
            _codes.push(...imported);
          }
          _codes.push(...getCode(file.codeBlock, file));
          if (file === null || file === void 0 ? void 0 : file.Service) {
            let serviceTypeCode = file.Service.generate(file.importedType);
            if (serviceTypeCode) {
              _codes.push(serviceTypeCode);
            }
          }
          let codes = joinCode(_codes, { on: "\n" }).toString();
          if (codes) {
            await writeUtil.sync(file.path.outPath + "/" + file.path.tsName, codes, {
              newline: true,
              overwrite: true
            });
          }
        }
      }
    }
  }
  async writeGlobalFiles(model, path5) {
    if (model.apiPathCode) {
      await writeUtil.sync(path5 + "/apiPath.ts", model.apiPathCode.toString(), {
        newline: true,
        overwrite: true
      });
    }
    if (model.responseModel) {
      await writeUtil.sync(path5 + "/responseModel.ts", model.responseModel.toString(), {
        newline: true,
        overwrite: true
      });
    }
    if (model.enabledDevMode) {
      await writeUtil.sync(path5 + "/enableDevMode.ts", model.enabledDevMode.toString(), {
        newline: true,
        overwrite: true
      });
    }
    if (model.metadata) {
      await writeUtil.sync(path5 + "/metadata.ts", model.metadata.toString(), {
        newline: true,
        overwrite: true
      });
    }
    if (model.toProto) {
      await writeUtil.sync(path5 + "/toProto.ts", model.toProto.toString(), {
        newline: true,
        overwrite: true
      });
    }
    await writeUtil.sync(path5 + "/index.ts", `
    export { srvPath } from "./apiPath";
    export { enabledDevMode } from "./enableDevMode";
    export { mergeMetaData } from "./metadata";
    export type { MetaData } from "./metadata";
    export { toProto } from "./toProto";
    export { default as ResponseModel } from "./responseModel";
    `, {
      newline: true,
      overwrite: true
    });
  }
};
function getCode(blocks, fileInfo) {
  let codes = [];
  if (blocks.length > 0) {
    blocks.forEach((block) => {
      var _a;
      if (block.blockType == BlockType.NAMESPACE) {
        codes.push(code`export namespace ${block.name} {`);
        codes.push(...getCode(block.blocks, fileInfo));
        codes.push(code`}`);
      } else if (block.blockType == BlockType.TYPE) {
        codes.push(...gernerateTypeCode(block, fileInfo));
        if (((_a = block.blocks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
          debugger;
          codes.push(...getCode(block.blocks, fileInfo));
        }
      } else if (block.blockType == BlockType.ENUM) {
        codes.push(...generateEnumCode(block));
      }
    });
  }
  return codes;
}
function gernerateTypeCode(block, fileInfo) {
  let codes = [];
  codes.push(code`export type ${block.name} = {`);
  for (let field of block.fields) {
    let _type = "";
    if (field.typeValid) {
      _type = field.type;
    } else {
      _type = field.type;
    }
    if (field.isMap) {
      codes.push(code`${field.name}${field.isoptional ? "?" : ""}: Array<[${field.keyType},${field.type}]>;`);
    } else {
      codes.push(code`${field.name}${field.isRepeated ? "List" : ""}${field.isoptional ? "?" : ""}: ${field.isRepeated ? "Array<" + _type + ">" : _type};`);
    }
  }
  codes.push(code`}`);
  return codes;
}
function generateImport(importedType) {
  let codes = [];
  for (let _import of importedType) {
    codes.push(code`${_import.importStr}`);
  }
  return codes;
}

// out/generate/types/typeUtil.js
function getTypeListByTypes(blocks) {
  let types = [];
  for (let block of blocks) {
    if (block.isNamespace) {
      let name = block.name;
      types.push(...getTypeListByTypes(block.nested).map((x) => name + "." + x));
    } else {
      types.push(block.name);
    }
  }
  return types;
}
function getBlockTypes(blocks) {
  let types = [];
  for (let block of blocks) {
    if (block.blockType == BlockType.NAMESPACE) {
      let name = block.name;
      types.push(...getBlockTypes(block.blocks).map((x) => name + "." + x));
    } else if (block.blockType == BlockType.TYPE || block.blockType == BlockType.ENUM) {
      types.push(block.name);
    }
  }
  return types;
}

// out/generate/types/validationType.js
function typeCheckAndFix(fileBlocks) {
  fileBlocks = internalType(fileBlocks);
  fileBlocks = externalType(fileBlocks);
  return fileBlocks;
}
function internalType(fileBlocks) {
  fileBlocks.forEach((fileBlock) => {
    var _a, _b;
    if (((_a = fileBlock.codeBlock) === null || _a === void 0 ? void 0 : _a.length) > 0) {
      fileBlock.codeBlock = fixType(fileBlock.codeBlock, [], getBlockTypes(fileBlock.codeBlock));
    } else if (((_b = fileBlock.nested) === null || _b === void 0 ? void 0 : _b.length) > 0) {
      fileBlock.nested = internalType(fileBlock.nested);
    }
  });
  return fileBlocks;
}
function fixType(codeBlock, typeOfList, alltype) {
  if (codeBlock.length <= 0)
    return [];
  codeBlock.forEach((block) => {
    if (block.blockType === BlockType.NAMESPACE) {
      let listOfType = getBlockTypes(block.blocks);
      block.blocks = fixType(block.blocks, listOfType, alltype);
    } else if (block.blockType === BlockType.TYPE) {
      block.fields.forEach((field) => {
        if (!field.typeValid) {
          let typeSpl = field.type.split(".");
          let type = typeSpl[typeSpl.length - 1];
          if (typeOfList === null || typeOfList === void 0 ? void 0 : typeOfList.includes(field.type)) {
            field.typeValid = true;
            field.isoptional = checkOptionalField(field);
          } else if (typeOfList === null || typeOfList === void 0 ? void 0 : typeOfList.includes(field.type + "." + type)) {
            field.type = field.type + "." + field.type;
            field.typeValid = true;
            field.isoptional = checkOptionalField(field);
          } else if (alltype.includes(field.type)) {
            field.typeValid = true;
            field.isoptional = checkOptionalField(field);
          }
          if (alltype.includes(field.type + "." + type)) {
            field.type = field.type + "." + field.type;
            field.typeValid = true;
            field.isoptional = checkOptionalField(field);
          }
          if (field.isMap) {
            if (typeOfList === null || typeOfList === void 0 ? void 0 : typeOfList.includes(field.keyType + "." + type)) {
              field.keyType = field.keyType + "." + field.keyType;
            } else if (alltype.includes(field.keyType + "." + type)) {
              field.type = field.keyType + "." + field.keyType;
            }
          }
        }
      });
    }
  });
  return codeBlock;
}
function externalType(fileBlocks) {
  fileBlocks.forEach((fileBlock) => {
    var _a, _b, _c, _d;
    if (((_a = fileBlock.codeBlock) === null || _a === void 0 ? void 0 : _a.length) > 0) {
      let types = (_b = fileBlock.importFiles) === null || _b === void 0 ? void 0 : _b.imports.filter((x) => x.name !== "google");
      if ((types === null || types === void 0 ? void 0 : types.length) > 0) {
        for (let importedFile of types) {
          if (((_c = importedFile.types) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            let tyleList = getTypeListByTypes2(importedFile.types);
            fileBlock.codeBlock = fixExternalType(fileBlock.codeBlock, tyleList);
          } else {
            debugger;
          }
        }
      } else {
      }
    } else if (((_d = fileBlock.nested) === null || _d === void 0 ? void 0 : _d.length) > 0) {
      fileBlock.nested = externalType(fileBlock.nested);
    }
  });
  return fileBlocks;
}
function getTypeListByTypes2(blocks) {
  let types = /* @__PURE__ */ new Map();
  for (let block of blocks) {
    if (block.isNamespace) {
      let name = block.name;
      let mapBlockTypes = getTypeListByTypes2(block.nested);
      mapBlockTypes.forEach((value, key) => {
        types.set(name + "." + key, value);
      });
    } else {
      types.set(block.name, block);
    }
  }
  return types;
}
function fixExternalType(codeBlock, typeList) {
  if (codeBlock.length <= 0)
    return [];
  codeBlock.forEach((block) => {
    if (block.blockType === BlockType.NAMESPACE) {
      block.blocks = fixExternalType(block.blocks, typeList);
    } else if (block.blockType === BlockType.TYPE) {
      block.fields.forEach((field) => {
        if (!field.typeValid) {
          let _type = field.type;
          let prefix = "";
          if (field.type.includes(".")) {
            let typeSpl = field.type.split(".");
            _type = typeSpl.splice(typeSpl.length - 1, 1)[0];
            prefix = typeSpl.join(".");
          }
          if (typeList === null || typeList === void 0 ? void 0 : typeList.get(_type)) {
            field.typeValid = true;
            field.importedFiledType = typeList === null || typeList === void 0 ? void 0 : typeList.get(_type);
            field.isoptional = checkOptionalField(field);
          } else if (typeList === null || typeList === void 0 ? void 0 : typeList.get(_type + "." + _type)) {
            field.type = `${prefix ? prefix + "." : ""}${_type}.${_type}`;
            field.typeValid = true;
            field.importedFiledType = typeList === null || typeList === void 0 ? void 0 : typeList.get(_type + "." + _type);
            field.isoptional = checkOptionalField(field);
          }
        }
      });
    }
  });
  return codeBlock;
}
function checkOptionalField(field) {
  if (field.isoptional)
    return true;
  if (field.isRepeated)
    return field.isoptional;
  if (!field.isSystemType) {
    return true;
  }
  return field.isoptional;
}

// out/generate/file/fileInfo.js
var fs2 = __toESM(require("fs"));
var path4 = __toESM(require("path"));
var protobuf5 = __toESM(require_protobufjs());

// out/generate/imports/generateImportCode.js
function generateImportCode(elements) {
  const chunks = [];
  if (elements.length > 0) {
    for (let path5 of elements) {
      if (path5.startsWith("google")) {
        if (!chunks.find((x) => x.symbol == "google")) {
          let splList = path5.split("/");
          let name = splList.join(".");
          chunks.push(imp(`google*.${name}`));
        }
      } else {
        let splList = path5.split("/");
        let file = splList.splice(splList.length - 1, 1);
        if (splList.length > 0) {
          let prePath = "";
          for (let pre of splList) {
            prePath += "../";
          }
          chunks.push(imp(`${splList.join("_")}*${prePath}${splList.join("/")}/${file[0].replace(".proto", "")} `));
        } else {
          chunks.push(imp(`${splList.join("_")}*./${file[0].replace(".proto", "")} `));
        }
      }
    }
  }
  return chunks;
}

// out/generate/types/generateTypes.js
var import_protobufjs2 = __toESM(require_protobufjs());

// out/generate/types/toType.js
var protobuf2 = __toESM(require_protobufjs());

// out/generate/types/getFieldType.js
var import_protobufjs = __toESM(require_protobufjs());
function getFieldType(field) {
  var _a;
  if (!field)
    return void 0;
  let json = field.toJSON();
  let isOptinal = false;
  if (field.type.toLowerCase().includes("google.protobuf.struct")) {
    return {
      isSystemType: true,
      type: "google.protobuf.Struct",
      isOptinal: true
    };
  }
  if (field.type.toLowerCase().includes("timestamp")) {
    return {
      isSystemType: true,
      type: field.type,
      isOptinal: true
    };
  }
  if (field instanceof import_protobufjs.default.MapField) {
    return {
      isSystemType: false,
      type: field.type,
      keyType: getBasicType(field.keyType),
      isOptinal,
      isMap: true
    };
  }
  if (json.options) {
    isOptinal = json.options["proto3_optional"];
  }
  switch (field.type) {
    case "string":
      return {
        isSystemType: true,
        type: "string",
        isOptinal
      };
    case "bytes":
      return {
        isSystemType: true,
        type: " Uint8Array | string",
        isOptinal
      };
    case "int":
    case "int32":
    case "int64":
    case "uint32":
    case "uint64":
    case "double":
    case "float":
      return {
        isSystemType: true,
        type: "number",
        isOptinal
      };
    case "bool":
      return {
        isSystemType: true,
        type: "boolean",
        isOptinal
      };
    default:
      return {
        isSystemType: false,
        type: field.type,
        needImport: ((_a = field.type) === null || _a === void 0 ? void 0 : _a.split(".").length) > 1,
        isOptinal
      };
  }
}
function getBasicType(type) {
  switch (type) {
    case "string":
      return "string";
    case "int":
    case "int32":
    case "int64":
    case "uint32":
    case "uint64":
    case "double":
    case "float":
      return "number";
    case "bool":
      return "boolean";
    default:
      return type;
  }
}

// out/utils/case.js
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0)
      return "";
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// out/generate/types/toType.js
function toType(element) {
  const codeBlocks = [];
  let namespaceBlock;
  if (element.nested) {
    namespaceBlock = {
      blockType: BlockType.NAMESPACE,
      name: element.name,
      blocks: []
    };
    for (const [key, value] of Object.entries(element.nested)) {
      if (value instanceof protobuf2.Type) {
        let _type = toType(value);
        namespaceBlock.blocks.push(..._type);
      } else if (value instanceof protobuf2.Enum) {
        let _enum = generateEnum(value);
        namespaceBlock.blocks.push(_enum);
      } else {
        debugger;
      }
    }
  }
  if (element.fields) {
    const typeBlock = {
      blockType: BlockType.TYPE,
      name: element.name,
      fields: []
    };
    for (const [key, value] of Object.entries(element.fields)) {
      let type = getFieldType(value);
      let fieldName = key;
      if (type.isMap) {
        fieldName = fieldName + "Map";
      }
      if (fieldName.includes("wanted")) {
        fieldName = fieldName.replace(/_/g, "");
      }
      typeBlock.fields.push({
        name: checkValidName(camelize(fieldName)),
        type: type.type,
        isRepeated: value.repeated,
        isSystemType: type.isSystemType,
        needImport: type.needImport,
        typeValid: type.isSystemType ? true : false,
        isoptional: type.isOptinal,
        isMap: type.isMap,
        keyType: type.keyType
      });
    }
    if (namespaceBlock) {
      namespaceBlock.blocks.push(typeBlock);
      codeBlocks.push(namespaceBlock);
    } else {
      codeBlocks.push(typeBlock);
    }
  } else {
    debugger;
  }
  return codeBlocks;
}
function checkValidName(name) {
  if (name == "public")
    return "pb_public";
  if (name == "long")
    return "pb_long";
  return name;
}

// out/generate/types/generateTypes.js
function generateTypes(element) {
  const typeBlock = [];
  if (element instanceof import_protobufjs2.default.Root) {
    if (element.nested) {
      let _codes = generateTypes(element.nested);
      typeBlock.push(..._codes);
    }
  } else {
    if (typeof element == "object") {
      for (const [key, value] of Object.entries(element)) {
        if (value instanceof import_protobufjs2.default.Service) {
        } else if (value instanceof import_protobufjs2.default.Type) {
          let _type = toType(value);
          typeBlock.push(..._type);
        } else if (value instanceof import_protobufjs2.default.Enum) {
          let _enum = generateEnum(value);
          typeBlock.push(_enum);
        } else if (value instanceof import_protobufjs2.default.Namespace) {
          if (value.nested) {
            let _codes = generateTypes(value.nested);
            typeBlock.push(..._codes);
          }
        } else if (value instanceof import_protobufjs2.default.MapField) {
          debugger;
        } else {
          debugger;
        }
      }
    }
  }
  return typeBlock;
}

// out/generate/service/service.js
var import_path = __toESM(require("path"));
var protobuf4 = __toESM(require_protobufjs());

// out/utils/extension.js
function getFileName(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

// out/generate/types/typeReview.js
var TypeReview = class {
  serviceRequestType(typeName, internalTypes, importedTypes) {
    if (typeName.includes(".")) {
    } else {
      return typeName;
    }
    return typeName;
  }
  serviceResponseType(typeName, internalTypes, importedTypes) {
    if (!typeName.includes(".")) {
      if (internalTypes.includes(typeName)) {
        return typeName;
      } else if (internalTypes.includes(typeName + "." + typeName)) {
        return typeName + "." + typeName;
      }
    } else {
      if (typeName == "google.protobuf.Empty") {
        return "google.protobuf.Empty";
      } else {
      }
    }
    return typeName;
  }
};

// out/generate/service/method.js
var Method = class {
  constructor(service, pbName) {
    this.name = service.name;
    this.requestType = service.requestType;
    this.responseType = service.responseType;
    this.pbName = pbName;
    if (service.requestType.includes(".")) {
      let spl = service.requestType.split(".");
      spl[0] = spl[0] + "_pb";
      this.pbRequestType = spl.join(".");
    } else {
      this.pbRequestType = pbName + "." + service.requestType;
    }
  }
  generateCode() {
    this.code = this.generateMethodCode();
  }
  generateMethodCode() {
    let haveRequestModel = true;
    if (this.requestType == "google.protobuf.Empty" || this.requestType.toLocaleLowerCase().includes("empty")) {
      haveRequestModel = false;
    }
    return code`
        async ${this.name} (${haveRequestModel ? "model:" + this.requestType + " ," : ""} metaData: global.MetaData):Promise<global.ResponseModel<${getResponseModel(this.responseType)}>> {
          try {
             ${haveRequestModel ? `const reqModel = global.toProto(${this.pbRequestType},model)` : ""}
              
              let response = new Promise<
                  global.ResponseModel<${getResponseModel(this.responseType)}>
              >((resolve) => {
                  this.client().${camelize(this.name)}(
                    ${haveRequestModel ? "reqModel" : "new google.protobuf.empty()"} 
                  ,global.mergeMetaData(metaData),
                  (err, response) => {
                      resolve(
                      global.ResponseModel.ToResponModel(err, response?.toObject())
                      );
                  }
                  );
              });
  
              return await response;
          } catch (exp) {
              return global.ResponseModel.Error(exp);
          }
      }`;
  }
};
function getResponseModel(responseType) {
  if (responseType === "google.protobuf.Empty") {
    return "{}";
  }
  return responseType;
}

// out/generate/service/service.js
var Service2 = class {
  constructor(element, filepath) {
    this.filepath = filepath;
    this.service = this.getService(element);
    let pbName = getFileName(this.filepath.grpcPb);
    if (this.service) {
      this.methods = [];
      for (const [key, value] of Object.entries(this.service.methods)) {
        if (value instanceof protobuf4.Method) {
          this.methods.push(new Method(value, pbName));
        }
      }
    }
  }
  generate(importedType) {
    let serviceRelativePath = import_path.default.relative(this.filepath.outPath, this.filepath.grpcPath);
    let globalRelativePath = import_path.default.relative(this.filepath.outPath, this.filepath.globalpath);
    let pbName = getFileName(this.filepath.grpcPb);
    let pbServiceName = getFileName(this.filepath.grpcServicePb);
    let pbImport = `import * as ${pbName} from '${serviceRelativePath}/${pbName}';`;
    let pbServiceImport = `import * as ${pbServiceName} from '${serviceRelativePath}/${capitalizeFirstLetter(pbServiceName)}';`;
    let globalImport = `import * as global from '${globalRelativePath}'`;
    for (let importType2 of importedType) {
      if (!importType2.filePath || !importType2.filePath.outPath)
        continue;
      let importedGrpcPath = import_path.default.relative(importType2.filePath.outPath, importType2.filePath.grpcPath);
      pbImport += `
\rimport * as ${importType2.name}_pb from '${importedGrpcPath}/${getFileName(importType2.filePath.grpcPb)}';`;
    }
    if (this.service) {
      let _code = this.generateCode(this.service.name, pbServiceName, pbImport, pbServiceImport, globalImport);
      return _code;
    }
    return void 0;
  }
  getService(element) {
    if (element instanceof protobuf4.Root) {
      if (element.nested) {
        return this.getService(element.nested);
      }
    } else {
      if (typeof element == "object") {
        for (const [key, value] of Object.entries(element)) {
          if (value instanceof protobuf4.Service) {
            return value;
          } else if (value instanceof protobuf4.Namespace) {
            return this.getService(value["nested"]);
          }
        }
      }
    }
  }
  generateCode(apiName, pbServiceName, pbImport, pbServiceImport, globalImport) {
    return code`
  //---------------------------------------------------------------
  // -----                  Service Section                   -----
  //---------------------------------------------------------------
    ${pbImport}
    ${pbServiceImport}
    ${globalImport}
    
    export class Services {
              //import section
              ${this.generateClientCode(apiName, pbServiceName)}
              ${this.getAllMethodCode()}
          }`;
  }
  getAllMethodCode() {
    if (this.methods.length > 0) {
      return joinCode(this.methods.filter((x) => x.code !== void 0).map((x) => x.code), { on: "\n" }).toString();
    }
    return "";
  }
  generateClientCode(apiName, pbServiceName) {
    return code`client = (): ${pbServiceName}.${apiName}Client => {
          const _client = new ${pbServiceName}.${apiName}Client(
            global.srvPath(),
            {}
          );
          global.enabledDevMode(_client);
          return _client;
        };`;
  }
  typeReview(internalTypes, importedTypes) {
    var _a;
    let typeReview = new TypeReview();
    if (((_a = this.methods) === null || _a === void 0 ? void 0 : _a.length) > 0) {
      this.methods.forEach((method) => {
        method.requestType = typeReview.serviceResponseType(method.requestType, internalTypes, importedTypes);
        method.responseType = typeReview.serviceResponseType(method.responseType, internalTypes, importedTypes);
        method.generateCode();
      });
    }
  }
};
function reviewServiceType(fileBlocks) {
  fileBlocks.forEach((fileBlock) => {
    var _a, _b;
    if (((_b = (_a = fileBlock.Service) === null || _a === void 0 ? void 0 : _a.methods) === null || _b === void 0 ? void 0 : _b.length) > 0) {
      let _internalTypes = getTypeListByTypes(fileBlock.typeList);
      fileBlock.Service.typeReview(_internalTypes, fileBlock.importedType);
    } else {
      fileBlock.nested = reviewServiceType(fileBlock.nested);
    }
  });
  return fileBlocks;
}

// out/generate/imports/import.js
var import_path2 = __toESM(require("path"));
var ImportFiles = class {
  constructor(elements, pbPath) {
    this.imports = [];
    if (elements.length > 0) {
      for (let pathStr of elements) {
        pathStr = pathStr.replace(".proto", "");
        if (pathStr.startsWith("google")) {
          if (!this.imports.find((x) => x.name == "google")) {
            let name = pathStr.replace(/\//gi, ".");
            this.imports.push({
              name: "google",
              fileName: void 0,
              importStr: `import * as google from 'google-protobuf';`
            });
          }
        } else {
          if (pathStr.includes("timestamp")) {
            debugger;
          }
          let currentPath = pbPath.path;
          let splPath = pathStr.split("/");
          let importedName = splPath.splice(splPath.length - 1, 1);
          if (splPath.length <= 0) {
            this.imports.push({
              name: importedName[0],
              fileName: `${importedName[0]}.proto`,
              importStr: `import * as ${importedName[0]} from './${importedName[0]}';`,
              relativePath: "./" + importedName[0]
            });
          } else {
            let importedPathSpl = currentPath.split("/");
            let currentSectionCount = importedPathSpl.length - 1;
            for (let pathSection of splPath) {
              importedPathSpl[currentSectionCount] = pathSection;
              currentSectionCount--;
            }
            let relativePath = import_path2.default.relative(currentPath, importedPathSpl.join("/"));
            let fileName = splPath.join("_");
            this.imports.push({
              name: fileName,
              fileName: `${importedName[0]}.proto`,
              importStr: `import * as ${fileName} from '${relativePath}';`,
              relativePath
            });
          }
        }
      }
    }
  }
};

// out/generate/file/fileInfo.js
var FileInfo = class {
  async load(root, grpcPath, outPath, globalpath) {
    let ignoreList = await this.getProtoIgnoreList();
    this.files = await this.loadInfo(root, grpcPath, outPath, globalpath, ignoreList);
    this.allType = this.getAllType(this.files);
    debugger;
    this.files = this.getImportedTypes(this.files, this.allType);
  }
  async loadInfo(root, grpcPath, outPath, globalpath, ignoreList) {
    var _a;
    let result = [];
    let directorys = await fs2.readdirSync(root, { withFileTypes: true });
    for (let dirent of directorys) {
      const isDirectory = dirent.isDirectory();
      let nestedDirectory = [];
      let typeBlocks = [];
      let service;
      let imports = [];
      let importFiles;
      let pathResolved = "";
      let fileName = getFileName(dirent.name);
      let pathInfo = {
        outPath,
        pbName: dirent.name,
        grpcPb: fileName + "_pb.js",
        grpcServicePb: fileName + "ServiceClientPb.ts",
        path: root,
        tsName: fileName + ".ts",
        grpcPath,
        pathResolved,
        globalpath,
        fileName
      };
      if (isDirectory) {
        nestedDirectory = await this.loadInfo(root + "/" + dirent.name, grpcPath + "/" + dirent.name, outPath + "/" + dirent.name, globalpath, ignoreList);
      } else {
        if (!this.isValidFile(root + "/" + dirent.name, ignoreList))
          continue;
        pathResolved = path4.resolve(root + "/" + dirent.name);
        let protobufStr = await new FileUtil().read(pathResolved);
        if (protobufStr) {
          let parsed = protobuf5.parse(protobufStr);
          if (((_a = parsed.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            imports = generateImportCode(parsed.imports);
            importFiles = new ImportFiles(parsed.imports, pathInfo);
          }
        }
        let protoBuf = await this.loadProtoBuf(pathResolved);
        if (protoBuf) {
          typeBlocks = generateTypes(protoBuf);
          service = new Service2(protoBuf, pathInfo);
        }
      }
      result.push({
        path: pathInfo,
        name: getFileName(dirent.name),
        isDirectory,
        nested: nestedDirectory,
        imports,
        codeBlock: typeBlocks,
        Service: service,
        typeList: this.getFileTypes(typeBlocks),
        importedType: [],
        importFiles
      });
    }
    return result;
  }
  async loadProtoBuf(filePath) {
    return await protobuf5.loadSync(filePath);
  }
  getFileTypes(blocks) {
    let types = [];
    if (blocks.length > 0) {
      blocks.forEach((block) => {
        if (block.blockType == BlockType.TYPE || block.blockType == BlockType.ENUM) {
          types.push({
            name: block.name,
            isNamespace: false,
            nested: void 0,
            fields: block.fields,
            type: block.blockType
          });
        } else if (block.blockType == BlockType.NAMESPACE) {
          let nestedTypes = this.getFileTypes(block.blocks);
          types.push({
            name: block.name,
            isNamespace: true,
            nested: nestedTypes
          });
        }
      });
    }
    return types;
  }
  getAllType(files) {
    var _a;
    let typeList = [];
    for (let file of files) {
      if (file.isDirectory) {
        typeList.push(...this.getAllType(file.nested));
      } else {
        if (((_a = file.typeList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
          typeList.push({
            fileName: file.name,
            name: "",
            types: file.typeList,
            fieldType: [],
            importStr: "",
            filePath: file.path
          });
        }
      }
    }
    return typeList;
  }
  getImportedTypes(files, allTypes) {
    files.forEach((file) => {
      var _a, _b;
      if (file.isDirectory) {
        file.nested = this.getImportedTypes(file.nested, allTypes);
      } else {
        file.importedType = [];
        (_b = (_a = file.importFiles) === null || _a === void 0 ? void 0 : _a.imports) === null || _b === void 0 ? void 0 : _b.forEach((imp2) => {
          if (imp2.name == "google") {
            return;
          }
          let types = allTypes.find((x) => x.fileName == imp2.name);
          if (types) {
            imp2.types = types.types;
            imp2.paths = types.filePath;
            imp2.name = types.name;
          } else {
            debugger;
          }
        });
      }
    });
    return files;
  }
  async getProtoIgnoreList() {
    let pathResolved = path4.resolve("./.protoIgnore");
    if (fs2.existsSync(pathResolved)) {
      let data = await new FileUtil().read(pathResolved);
      if (data) {
        return data.split(/\r?\n/);
      }
    }
    return [];
  }
  isValidFile(fileName, ignoreList) {
    if (!fileName.endsWith(".proto"))
      return false;
    if (ignoreList.includes(fileName)) {
      debugger;
      return false;
    }
    return true;
  }
};

// out/generate/global/generateApiPath.js
function generateApiPathCode() {
  return code`
    const developModel = location.hostname === "localhost";
    export function srvPath(): string {
        const hostName = !developModel
            ? location.origin + "/api"
            : "https://vodteam.com/api";
        return hostName;
    }
    `;
}

// out/generate/global/generateEnabledDevMode.js
function generateEnabledDevMode() {
  return code`
     export function enabledDevMode<T>(client: T): void {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    if (window) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const enableDevTools = window["__GRPCWEB_DEVTOOLS__"] || (() => {});
      enableDevTools([client]);
    }
  }
`;
}

// out/generate/global/generateToProto.js
function generateToProto() {
  return code`
    
import * as jspb from 'google-protobuf';

const isEmptyObject = (obj) =>
  typeof obj === 'object' && Object.keys(obj).length === 0 && obj.constructor === Object;

const createProxy = (msg) => {
  if (!msg || typeof msg !== 'object') {
    return msg;
  }
  if (Array.isArray(msg)) {
    return msg.map(createProxy);
  }
  return new Proxy(msg, {
    get: function (target, prop) {
      const fieldUpper = typeof prop == 'string' ? prop.replace(/get/g, '') : '';
      const fieldName = \` $\{fieldUpper[0].toLowerCase()}$\{fieldUpper.substring(1)}\`
      const value = target[fieldName];
      return () => (value === null || isEmptyObject(value) ? null : createProxy(value));
    },
  });
};

// export const protoMsgFromJson = (protoObject, ProtoClass) =>
//   protoMsgFromObject(JSON.parse(protoObject), ProtoClass);

/**
 * Serialize protobuf message fromObject
 *
 * @param {any} protoObject
 * @param {typeof require('google-protobuf').Message} ProtoClass
 * @see https://github.com/sglim/protobuf-js-from-object for inspiration
 * @returns {typeof require('google-protobuf').Message} ProtoClass instance
 */
export const toProto = (ProtoClass, protoObject) => {
  debugger;
  if (jspb === undefined) {
    throw new Error('Please include google-protobuf.js');
  }
  const writer = new jspb.BinaryWriter();
  let x = createProxy(protoObject);

  ProtoClass.serializeBinaryToWriter(x, writer);
  return ProtoClass.deserializeBinary(writer.getResultBuffer());
};

`;
}

// out/generate/global/metadata.js
function generateMetadata() {
  return code`
    export type MetaData = { [key: string]: string } | {};
// /**
//  * Merge global metaData with the EUD(End user developer) ones
//  */

export function mergeMetaData(metaData: MetaData): MetaData {
  const authorization = localStorage.getItem("token");
  if (authorization && authorization?.length > 0) {
    console.log("token", { ...metaData, authorization });
    return { ...metaData, authorization };
  }
  return metaData;
}
    `;
}

// out/generate/global/responseModel.js
function generateResponseModel() {
  return code`
  import * as grpcWeb from "grpc-web";
  class ResponseModel<T> {
    constructor(
      _status: boolean,
      _data?: T,
      _errorMessage?: string,
      _code?: number,
      _error?: ErrorModel
    ) {
      this.status = _status;
      if (_status) {
        this.data = _data;
      } else {
        this.errorMessage = _errorMessage;
      }
      if (_error) {
        this.error = _error;
      }
      this.code = _code;
      if (_code != undefined && _code == 16) {
        window.location.href = "/login";
      }
    }
    public data?: T;
    public status: boolean;
    public errorMessage?: string;
    public code?: number;
    public status_code: number;
    public error: ErrorModel;
    public static Data<T>(data: T): ResponseModel<T> {
      return new ResponseModel(true, data);
    }
    public static Error<T>(exp: grpcWeb.RpcError): ResponseModel<T> {
      return new ResponseModel<T>(false, undefined, exp.message, exp.code);
    }
    public static InvalidRequestModel<T>(): ResponseModel<T> {
      return new ResponseModel<T>(
        false,
        undefined,
        "داده‌های ارسالی صحیح نمی‌باشد"
      );
    }
    public static ToResponModel<T>(
      error: grpcWeb.RpcError,
      data: T
    ): ResponseModel<T> {
      if (error) {
        return new ResponseModel<T>(false, undefined, error.message, error.code, {
          code: error.code,
          message: error.message,
          details: {
            code: error.code,
            errorStack: error.stack,
            message: error.message,
            type: "",
          },
        });
      } else {
        return new ResponseModel<T>(true, data);
      }
    }
  }
  export interface ErrorDetail {
    type: string;
    code: number;
    message: string;
    errorStack?: string;
  }
  export interface ErrorModel {
    code: number;
    message: string;
    details: ErrorDetail;
  }
  export default ResponseModel;  
`;
}

// out/generate/global/GenerateGlobalFiles.js
function GenerateGlobalFiles() {
  return {
    apiPathCode: generateApiPathCode(),
    enabledDevMode: generateEnabledDevMode(),
    metadata: generateMetadata(),
    responseModel: generateResponseModel(),
    toProto: generateToProto()
  };
}

// out/generate/protoToTs.js
async function protoToTs(model) {
  let files = await new FileInfo();
  await files.load(model.protobufPath, model.generatedTypescriptPath, model.outPath, model.globalFilePath);
  debugger;
  files.files = typeCheckAndFix(files.files);
  files.files = reviewServiceType(files.files);
  if (files.files.length > 0) {
    let fileUtil = new FileUtil();
    fileUtil.writeGlobalFiles(GenerateGlobalFiles(), model.globalFilePath);
    fileUtil.write(files.files);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  protoToTs
});
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
/*! Bundled license information:

strip-filename-increment/index.js:
  (*!
   * file-name <https://github.com/jonschlinkert/file-name>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Licensed under the MIT License.
   *)
*/
