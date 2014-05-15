// Generated by CoffeeScript 1.7.1
(function() {
  var $_, ControlCollection, Factory, changedEvent, controlValidations, each, elClear, elValid, elValue, every, extend, filter, invalidEvent, isFunction, map, p, slice, validEvent,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  if (Element && !Element.prototype.matches) {
    p = Element.prototype;
    p.matches = p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector;
  }

  map = Function.prototype.call.bind(Array.prototype.map);

  each = Function.prototype.call.bind(Array.prototype.forEach);

  slice = Function.prototype.call.bind(Array.prototype.slice);

  every = Function.prototype.call.bind(Array.prototype.every);

  filter = Function.prototype.call.bind(Array.prototype.filter);

  extend = function(out) {
    var i, key, _ref;
    out || (out = {});
    i = 1;
    while (i < arguments.length) {
      if (!arguments[i]) {
        continue;
      }
      _ref = arguments[i];
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        out[key] = arguments[i][key];
      }
      i++;
    }
    return out;
  };

  $_ = function(selector, context) {
    if (context == null) {
      context = document;
    }
    if (typeof context === "string") {
      context = document.querySelector(context);
    }
    if (!(context instanceof Node)) {
      throw new TypeError("Can't select with that context.");
    }
    return slice(context.querySelectorAll(selector));
  };

  isFunction = function(obj) {
    return obj && obj instanceof Function;
  };

  controlValidations = (function() {
    var v;
    v = {
      notEmpty: function(el) {
        return !!el.value;
      },
      notEmptyTrim: function(el) {
        return !!el.value.trim();
      },
      numeric: function(el) {
        return /^\d+$/.test(el.value);
      },
      alphanumeric: function(el) {
        return /^[a-z0-9]+$/i.test(el.value);
      },
      letters: function(el) {
        return /^[a-z]+$/i.test(el.value);
      },
      isValue: function(value, el) {
        return String(el.value) === String(value);
      },
      phone: function(el) {
        return v.allowed("1234567890()-+ ", el);
      },
      email: function(el) {
        var i;
        i = document.createElement("input");
        i.type = "email";
        i.value = el.value;
        return !!el.value && i.validity.valid;
      },
      list: function(el) {
        var listValues, _ref;
        listValues = map(el.list.options || [], function(option) {
          return option.value || option.innerHTML;
        });
        return _ref = el.value, __indexOf.call(listValues, _ref) >= 0;
      },
      radio: function(el) {
        var name;
        if ((name = el.name)) {
          return $_("input[type='radio'][name='" + name + "']").some(function(input) {
            return input.checked;
          });
        } else {
          return false;
        }
      },
      checkbox: function(minChecked, maxChecked, el) {
        var len, name;
        if (minChecked == null) {
          minChecked = 0;
        }
        if (maxChecked == null) {
          maxChecked = 50;
        }
        if ((name = el.name)) {
          len = $_("input[type='checkbox'][name='" + name + "']").filter(function(input) {
            return input.checked;
          }).length;
          return (minChecked <= len && len <= maxChecked);
        } else {
          return true;
        }
      },
      select: function(min, max, el) {
        var selected, _ref;
        if (min == null) {
          min = 1;
        }
        if (max == null) {
          max = 1;
        }
        selected = filter(el, function(opt) {
          return opt.selected && !opt.disabled;
        });
        if ((min <= (_ref = selected.length) && _ref <= max)) {
          return true;
        } else {
          return false;
        }
      },
      allowed: function(allowedChars, el) {
        var char, str, _i, _len;
        allowedChars = allowedChars.split("");
        str = el.value.split("");
        for (_i = 0, _len = str.length; _i < _len; _i++) {
          char = str[_i];
          if (__indexOf.call(allowedChars, char) < 0) {
            return false;
          }
        }
        return true;
      },
      notAllowed: function(notAllowedChars, el) {
        var char, str, _i, _len;
        notAllowedChars = notAllowedChars.split("");
        str = el.value.split("");
        for (_i = 0, _len = notAllowedChars.length; _i < _len; _i++) {
          char = notAllowedChars[_i];
          if (__indexOf.call(str, char) >= 0) {
            return false;
          }
        }
        return true;
      },
      numberBetween: function(min, max, el) {
        var _ref;
        return (Number(min) <= (_ref = Number(el.value)) && _ref <= Number(max));
      },
      numberMax: function(max, el) {
        return Number(el.value) <= Number(max);
      },
      numberMin: function(min, el) {
        return Number(el.value) >= Number(min);
      },
      lengthBetween: function(min, max, el) {
        var _ref;
        return (Number(min) <= (_ref = el.value.length) && _ref <= Number(max));
      },
      lengthMax: function(max, el) {
        return el.value.length <= Number(max);
      },
      lengthMin: function(min, el) {
        return el.value.length >= Number(min);
      },
      lengthIs: function(len, el) {
        return el.value.length === Number(len);
      }
    };
    return v;
  })();

  elValid = (function() {
    var getArgs, getMethod, splitMethods;
    splitMethods = function(str) {
      return str != null ? str.split("&&").map(function(m) {
        return m != null ? m.trim() : void 0;
      }) : void 0;
    };
    getMethod = function(str) {
      return str != null ? str.split("(")[0] : void 0;
    };
    getArgs = function(str) {
      var _ref;
      return str != null ? (_ref = str.match(/\(([^)]+)\)/)) != null ? _ref[1].split(",").map(function(arg) {
        return arg != null ? arg.trim().replace(/'/g, "") : void 0;
      }) : void 0 : void 0;
    };
    return function(el, customFn) {
      var attr, composed;
      if (customFn) {
        return customFn(el);
      } else if ((attr = el.dataset.controlValidation)) {
        composed = splitMethods(attr);
        return composed.every(function(str) {
          var args, method, sigLength;
          method = getMethod(str);
          args = getArgs(str) || [];
          sigLength = controlValidations[method].length;
          args.length = sigLength === 0 ? 0 : sigLength - 1;
          args.push(el);
          if (method in controlValidations) {
            return controlValidations[method].apply(null, args);
          } else {
            return false;
          }
        });
      } else {
        return el.validity.valid;
      }
    };
  })();

  elValue = function(el) {
    if (el.matches("input[type=radio]") || el.matches("input[type=checkbox]")) {
      if (el.checked) {
        return el.value;
      } else {
        return false;
      }
    } else if (el.matches("select")) {
      if (el.selectedOptions[0].disabled === false) {
        return el.selectedOptions[0].value;
      } else {
        return false;
      }
    } else if (el.matches("button") || el.matches("input[type='button']")) {
      return false;
    } else if (el.matches("input") || el.matches("textarea")) {
      return el.value;
    } else {
      return false;
    }
  };

  elClear = function(el) {
    var changed, originalSelected;
    changed = false;
    if (el.matches("[type=radio]") || el.matches("[type=checkbox]")) {
      if (el.checked) {
        el.checked = false;
        changed = true;
      }
    } else if (el.matches("select")) {
      if (el.selectedOptions.length) {
        originalSelected = el.selectedOptions;
        each(el.selectedOptions, function(option) {
          return option.selected = false;
        });
        if (el.selectedOptions.length === originalSelected.length) {
          changed = !every(originalSelected, function(opt) {
            return __indexOf.call(el.selectedOptions, opt) >= 0;
          });
        }
      }
    } else if (el.matches("input")) {
      if (el.value) {
        el.value = "";
        changed = true;
      }
    }
    return changed;
  };

  validEvent = function() {
    return new Event("valid", {
      bubbles: true
    });
  };

  invalidEvent = function() {
    return new Event("invalid", {
      bubbles: true
    });
  };

  changedEvent = function() {
    return new Event("changed", {
      bubbles: true
    });
  };

  window.ValueObject = (function(_super) {
    __extends(ValueObject, _super);

    function ValueObject(arr) {
      if (Array.isArray(arr)) {
        [].push.apply(this, arr);
      } else {
        throw new TypeError("Pass an array to the ValueObject constructor!");
      }
    }

    ValueObject.prototype.normal = function() {
      var arr;
      arr = [];
      [].push.apply(arr, this);
      return arr;
    };

    ValueObject.prototype.valueArray = function() {
      return this.map(function(pair) {
        return pair.value;
      });
    };

    ValueObject.prototype.idArray = function() {
      return this.map(function(pair) {
        return pair.id;
      });
    };

    ValueObject.prototype.idValuePair = function() {
      var o, pair, _i, _len;
      o = {};
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        pair = this[_i];
        o[pair.id] = pair.value;
      }
      return o;
    };

    ValueObject.prototype.valueString = function(delimiter) {
      if (delimiter == null) {
        delimiter = ", ";
      }
      return this.valueArray().join(delimiter);
    };

    ValueObject.prototype.valueArrayOne = function() {
      var m;
      m = this.valueArray();
      if (m.length > 1) {
        return m;
      } else {
        return m[0];
      }
    };

    ValueObject.prototype.idArrayOne = function() {
      var m;
      m = this.idArray();
      if (m.length > 1) {
        return m;
      } else {
        return m[0];
      }
    };

    ValueObject.prototype.at = function(i) {
      return this[i].value;
    };

    ValueObject.prototype.first = function() {
      return this.at(0);
    };

    ValueObject.prototype.last = function() {
      return this.at(this.length - 1);
    };

    ValueObject.prototype.serialize = function() {
      return JSON.stringify(this.normal());
    };

    return ValueObject;

  })(Array);

  ControlCollection = (function(_super) {
    __extends(ControlCollection, _super);

    function ControlCollection(elements) {
      this._setValidityListener = false;
      this._eventListeners = {};
      [].push.apply(this, elements);
    }

    ControlCollection.prototype.value = function() {
      var control, o, v, values, _i, _len;
      values = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        control = this[_i];
        v = elValue(control);
        if (v) {
          o = {};
          o.id = control.id;
          o.value = v;
          values.push(o);
        }
      }
      return new ValueObject(values);
    };

    ControlCollection.prototype.valid = function() {
      return every(this, function(el) {
        return elValid(el);
      });
    };

    ControlCollection.prototype.filter = function() {
      var args, selector;
      args = slice(arguments);
      if (typeof args[0] === "string") {
        selector = args[0];
        args[0] = function(control) {
          return control.matches(selector);
        };
      }
      return new ControlCollection(Array.prototype.filter.apply(this, args));
    };

    ControlCollection.prototype.not = function() {
      var args, fn, notFn;
      args = slice(arguments);
      fn = args.shift();
      if (typeof fn === "string") {
        notFn = function(e) {
          return !e.matches(fn);
        };
      } else {
        notFn = function(e) {
          return !fn(e);
        };
      }
      args.unshift(notFn);
      return new ControlCollection(Array.prototype.filter.apply(this, args));
    };

    ControlCollection.prototype.tag = function(tag) {
      return new ControlCollection(this.filter(function(el) {
        return el.tagName.toLowerCase() === tag.toLowerCase;
      }));
    };

    ControlCollection.prototype.type = function(type) {
      return new ControlCollection(this.filter(function(el) {
        return el.type.toLowerCase() === type.toLowerCase();
      }));
    };

    ControlCollection.prototype.clear = function() {
      var control, _i, _len;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        control = this[_i];
        if (elClear(control)) {
          control.dispatchEvent(changedEvent());
        }
      }
      return this;
    };

    ControlCollection.prototype.disabled = function(param) {
      var control, _i, _len;
      if (param == null) {
        return this;
      }
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        control = this[_i];
        control.disabled = !!param;
      }
      return this;
    };

    ControlCollection.prototype.required = function(param) {
      var control, _i, _len;
      if (param == null) {
        return this;
      }
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        control = this[_i];
        control.required = !!param;
      }
      return this;
    };

    ControlCollection.prototype.checked = function(param) {
      var control, _i, _len;
      if (param == null) {
        return this;
      }
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        control = this[_i];
        if ("checked" in control) {
          control.checked = !!param;
        }
      }
      return this;
    };

    ControlCollection.prototype.on = function(eventType, handler) {
      var eventHandler, _base;
      if (eventType === "valid") {
        this.setValidityListener();
      }
      eventHandler = (function(_this) {
        return function(event) {
          var _ref;
          if (_ref = event.target, __indexOf.call(_this, _ref) >= 0) {
            return handler.bind(_this)(event);
          }
        };
      })(this);
      document.addEventListener(eventType, eventHandler);
      (_base = this._eventListeners)[eventType] || (_base[eventType] = []);
      this._eventListeners[eventType].push(eventHandler);
      return eventHandler;
    };

    ControlCollection.prototype.off = function(eventType, handler) {
      return document.removeEventListener(eventType, handler);
    };

    ControlCollection.prototype.offAll = function(eventType) {
      var list;
      list = eventType ? [eventType] : Object.keys(this._eventListeners);
      return each(list, (function(_this) {
        return function(type) {
          var listeners;
          listeners = _this._eventListeners[type] || [];
          return each(listeners, function(fn) {
            return _this.off(type, fn);
          });
        };
      })(this));
    };

    ControlCollection.prototype.trigger = function(evt) {
      if (!(evt instanceof Event)) {
        evt = new CustomEvent(evt, {
          bubbles: true,
          detail: {}
        });
      }
      return this[0].dispatchEvent(evt);
    };

    ControlCollection.prototype.invoke = function() {
      var args, control, fn, _i, _len;
      fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        control = this[_i];
        if (typeof fn === "string") {
          if (fn in control && isFunction(control[fn])) {
            control[fn](args);
          }
        } else if (isFunction(fn)) {
          fn.apply(control, args);
        }
      }
      return this;
    };

    ControlCollection.prototype.labels = function() {
      var control, labels, _i, _len;
      labels = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        control = this[_i];
        [].push.apply(labels, control.labels);
      }
      return labels;
    };

    ControlCollection.prototype.mapIdToProp = function(prop) {
      var a, control, o, _i, _len;
      a = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        control = this[_i];
        o = {};
        o.id = control.id;
        o[prop] = control[prop];
        a.push(o);
      }
      return new ValueObject(a);
    };

    ControlCollection.prototype.setValidityListener = function() {
      if (!this._validityListener) {
        this._validityListener = true;
        this.on("change", function(event) {
          if (this.valid()) {
            return this.trigger(validEvent());
          } else {
            return this.trigger(invalidEvent());
          }
        });
        this.on("input", function(event) {
          if (this.valid()) {
            return this.trigger(validEvent());
          } else {
            return this.trigger(invalidEvent());
          }
        });
        setTimeout((function(_this) {
          return function() {
            return _this.trigger("change");
          };
        })(this));
        return 0;
      }
    };

    return ControlCollection;

  })(Array);

  Factory = (function() {
    var controlTags;
    controlTags = ["input", "select", "button", "textarea"];
    return function(param) {
      var controlElements, inner;
      controlElements = [];
      inner = function(param) {
        var _ref;
        if (typeof param === "string") {
          inner(document.querySelector(param));
        } else if (param instanceof Element) {
          if (_ref = param.tagName.toLowerCase(), __indexOf.call(controlTags, _ref) < 0) {
            inner(param.querySelectorAll(controlTags.join(", ")));
          } else {
            controlElements.push(param);
          }
        } else if (param.length != null) {
          each(param, function(el) {
            return inner(el);
          });
        }
      };
      inner(param);
      return new ControlCollection(controlElements);
    };
  })();

  Factory.validate = elValid;

  Factory.addValidation = function(name, fn) {
    if (controlValidations[name]) {
      return false;
    }
    return controlValidations[name] = fn;
  };

  Factory.getValidations = function() {
    return extend({}, controlValidations);
  };

  Factory.init = ControlCollection;

  Factory.valueInit = ValueObject;

  window.Controls = Factory;

}).call(this);
