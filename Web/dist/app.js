!
function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                throw new Error("Cannot find module '" + o + "'")
            }
            var f = n[o] = {
                exports: {}
            };
            t[o][0].call(f.exports,
            function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            },
            f, f.exports, e, t, n, r)
        }
        return n[o].exports
    }
    for (var i = "function" == typeof require && require,
    o = 0; o < r.length; o++) s(r[o]);
    return s
}({
    1: [function () {
        (function () {
            "use strict";
            var angularLocalStorage = angular.module("LocalStorageModule", []);
            angularLocalStorage.provider("localStorageService",
            function () {
                this.prefix = "ls",
                this.storageType = "localStorage",
                this.cookie = {
                    expiry: 30,
                    path: "/"
                },
                this.notify = {
                    setItem: !0,
                    removeItem: !1
                },
                this.setPrefix = function (prefix) {
                    this.prefix = prefix
                },
                this.setStorageType = function (storageType) {
                    this.storageType = storageType
                },
                this.setStorageCookie = function (exp, path) {
                    this.cookie = {
                        expiry: exp,
                        path: path
                    }
                },
                this.setStorageCookieDomain = function (domain) {
                    this.cookie.domain = domain
                },
                this.setNotify = function (itemSet, itemRemove) {
                    this.notify = {
                        setItem: itemSet,
                        removeItem: itemRemove
                    }
                },
                this.$get = ["$rootScope", "$window", "$document",
                function ($rootScope, $window, $document) {
                    var webStorage, self = this,
                    prefix = self.prefix,
                    cookie = self.cookie,
                    notify = self.notify,
                    storageType = self.storageType;
                    $document ? $document[0] && ($document = $document[0]) : $document = document,
                    "." !== prefix.substr(-1) && (prefix = prefix ? prefix + "." : "");
                    var deriveQualifiedKey = function (key) {
                        return prefix + key
                    },
                    browserSupportsLocalStorage = function () {
                        try {
                            var supported = storageType in $window && null !== $window[storageType],
                            key = deriveQualifiedKey("__" + Math.round(1e7 * Math.random()));
                            return supported && (webStorage = $window[storageType], webStorage.setItem(key, ""), webStorage.removeItem(key)),
                            supported
                        } catch (e) {
                            return storageType = "cookie",
                            $rootScope.$broadcast("LocalStorageModule.notification.error", e.message),
                            !1
                        }
                    }(),
                    addToLocalStorage = function (key, value) {
                        if (!browserSupportsLocalStorage || "cookie" === self.storageType) return $rootScope.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                        notify.setItem && $rootScope.$broadcast("LocalStorageModule.notification.setitem", {
                            key: key,
                            newvalue: value,
                            storageType: "cookie"
                        }),
                        addToCookies(key, value);
                        "undefined" == typeof value && (value = null);
                        try {
                            (angular.isObject(value) || angular.isArray(value)) && (value = angular.toJson(value)),
                                webStorage && webStorage.setItem(deriveQualifiedKey(key), value),
                                notify.setItem && $rootScope.$broadcast("LocalStorageModule.notification.setitem", {
                                    key: key,
                                    newvalue: value,
                                    storageType: self.storageType
                                })
                        } catch (e) {
                            return $rootScope.$broadcast("LocalStorageModule.notification.error", e.message),
                            addToCookies(key, value)
                        }
                        return !0
                    },
                    getFromLocalStorage = function (key) {
                        if (!browserSupportsLocalStorage || "cookie" === self.storageType) return $rootScope.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                        getFromCookies(key);
                        var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null;
                        return item && "null" !== item ? "{" === item.charAt(0) || "[" === item.charAt(0) ? angular.fromJson(item) : item : null
                    },
                    removeFromLocalStorage = function (key) {
                        if (!browserSupportsLocalStorage) return $rootScope.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                        notify.removeItem && $rootScope.$broadcast("LocalStorageModule.notification.removeitem", {
                            key: key,
                            storageType: "cookie"
                        }),
                        removeFromCookies(key);
                        try {
                            webStorage.removeItem(deriveQualifiedKey(key)),
                            notify.removeItem && $rootScope.$broadcast("LocalStorageModule.notification.removeitem", {
                                key: key,
                                storageType: self.storageType
                            })
                        } catch (e) {
                            return $rootScope.$broadcast("LocalStorageModule.notification.error", e.message),
                            removeFromCookies(key)
                        }
                        return !0
                    },
                    getKeysForLocalStorage = function () {
                        if (!browserSupportsLocalStorage) return $rootScope.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                        !1;
                        var prefixLength = prefix.length,
                        keys = [];
                        for (var key in webStorage) if (key.substr(0, prefixLength) === prefix) try {
                            keys.push(key.substr(prefixLength))
                        } catch (e) {
                            return $rootScope.$broadcast("LocalStorageModule.notification.error", e.Description),
                            []
                        }
                        return keys
                    },
                    clearAllFromLocalStorage = function (regularExpression) {
                        regularExpression = regularExpression || "";
                        var tempPrefix = prefix.slice(0, -1),
                        testRegex = new RegExp(tempPrefix + "." + regularExpression);
                        if (!browserSupportsLocalStorage) return $rootScope.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"),
                        clearAllFromCookies();
                        var prefixLength = prefix.length;
                        for (var key in webStorage) if (testRegex.test(key)) try {
                            removeFromLocalStorage(key.substr(prefixLength))
                        } catch (e) {
                            return $rootScope.$broadcast("LocalStorageModule.notification.error", e.message),
                            clearAllFromCookies()
                        }
                        return !0
                    },
                    browserSupportsCookies = function () {
                        try {
                            return navigator.cookieEnabled || "cookie" in $document && ($document.cookie.length > 0 || ($document.cookie = "test").indexOf.call($document.cookie, "test") > -1)
                        } catch (e) {
                            return $rootScope.$broadcast("LocalStorageModule.notification.error", e.message),
                            !1
                        }
                    },
                    addToCookies = function (key, value) {
                        if ("undefined" == typeof value) return !1;
                        if (!browserSupportsCookies()) return $rootScope.$broadcast("LocalStorageModule.notification.error", "COOKIES_NOT_SUPPORTED"),
                        !1;
                        try {
                            var expiry = "",
                            expiryDate = new Date,
                            cookieDomain = "";
                            if (null === value ? (expiryDate.setTime(expiryDate.getTime() + -864e5), expiry = "; expires=" + expiryDate.toGMTString(), value = "") : 0 !== cookie.expiry && (expiryDate.setTime(expiryDate.getTime() + 24 * cookie.expiry * 60 * 60 * 1e3), expiry = "; expires=" + expiryDate.toGMTString()), key) {
                                var cookiePath = "; path=" + cookie.path;
                                cookie.domain && (cookieDomain = "; domain=" + cookie.domain),
                                $document.cookie = deriveQualifiedKey(key) + "=" + encodeURIComponent(value) + expiry + cookiePath + cookieDomain
                            }
                        } catch (e) {
                            return $rootScope.$broadcast("LocalStorageModule.notification.error", e.message),
                            !1
                        }
                        return !0
                    },
                    getFromCookies = function (key) {
                        if (!browserSupportsCookies()) return $rootScope.$broadcast("LocalStorageModule.notification.error", "COOKIES_NOT_SUPPORTED"),
                        !1;
                        for (var cookies = $document.cookie && $document.cookie.split(";") || [], i = 0; i < cookies.length; i++) {
                            for (var thisCookie = cookies[i];
                            " " === thisCookie.charAt(0) ;) thisCookie = thisCookie.substring(1, thisCookie.length);
                            if (0 === thisCookie.indexOf(deriveQualifiedKey(key) + "=")) return decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length))
                        }
                        return null
                    },
                    removeFromCookies = function (key) {
                        addToCookies(key, null)
                    },
                    clearAllFromCookies = function () {
                        for (var thisCookie = null,
                        prefixLength = prefix.length,
                        cookies = $document.cookie.split(";"), i = 0; i < cookies.length; i++) {
                            for (thisCookie = cookies[i];
                            " " === thisCookie.charAt(0) ;) thisCookie = thisCookie.substring(1, thisCookie.length);
                            var key = thisCookie.substring(prefixLength, thisCookie.indexOf("="));
                            removeFromCookies(key)
                        }
                    },
                    getStorageType = function () {
                        return storageType
                    },
                    bindToScope = function (scope, key, def) {
                        var value = getFromLocalStorage(key);
                        null === value && angular.isDefined(def) ? value = def : angular.isObject(value) && angular.isObject(def) && (value = angular.extend(def, value)),
                        scope[key] = value,
                        scope.$watchCollection(key,
                        function (newVal) {
                            addToLocalStorage(key, newVal)
                        })
                    };
                    return {
                        isSupported: browserSupportsLocalStorage,
                        getStorageType: getStorageType,
                        set: addToLocalStorage,
                        add: addToLocalStorage,
                        get: getFromLocalStorage,
                        keys: getKeysForLocalStorage,
                        remove: removeFromLocalStorage,
                        clearAll: clearAllFromLocalStorage,
                        bind: bindToScope,
                        deriveKey: deriveQualifiedKey,
                        cookie: {
                            set: addToCookies,
                            add: addToCookies,
                            get: getFromCookies,
                            remove: removeFromCookies,
                            clearAll: clearAllFromCookies
                        }
                    }
                }]
            })
        }).call(this)
    },
    {}],
    2: [function () {
        !
            function (window, document, undefined) {
                "use strict";
                function minErr(module) {
                    return function () {
                        var message, i, code = arguments[0],
                        prefix = "[" + (module ? module + ":" : "") + code + "] ",
                        template = arguments[1],
                        templateArgs = arguments,
                        stringify = function (obj) {
                            return "function" == typeof obj ? obj.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof obj ? "undefined" : "string" != typeof obj ? JSON.stringify(obj) : obj
                        };
                        for (message = prefix + template.replace(/\{\d+\}/g,
                        function (match) {
                            var arg, index = +match.slice(1, -1);
                            return index + 2 < templateArgs.length ? (arg = templateArgs[index + 2], "function" == typeof arg ? arg.toString().replace(/ ?\{[\s\S]*$/, "") : "undefined" == typeof arg ? "undefined" : "string" != typeof arg ? toJson(arg) : arg) : match
                        }), message = message + "\nhttp://errors.angularjs.org/1.2.27/" + (module ? module + "/" : "") + code, i = 2; i < arguments.length; i++) message = message + (2 == i ? "?" : "&") + "p" + (i - 2) + "=" + encodeURIComponent(stringify(arguments[i]));
                        return new Error(message)
                    }
                }
                function isArrayLike(obj) {
                    if (null == obj || isWindow(obj)) return !1;
                    var length = obj.length;
                    return 1 === obj.nodeType && length ? !0 : isString(obj) || isArray(obj) || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj
                }
                function forEach(obj, iterator, context) {
                    var key;
                    if (obj) if (isFunction(obj)) for (key in obj) "prototype" == key || "length" == key || "name" == key || obj.hasOwnProperty && !obj.hasOwnProperty(key) || iterator.call(context, obj[key], key);
                    else if (isArray(obj) || isArrayLike(obj)) for (key = 0; key < obj.length; key++) iterator.call(context, obj[key], key);
                    else if (obj.forEach && obj.forEach !== forEach) obj.forEach(iterator, context);
                    else for (key in obj) obj.hasOwnProperty(key) && iterator.call(context, obj[key], key);
                    return obj
                }
                function sortedKeys(obj) {
                    var keys = [];
                    for (var key in obj) obj.hasOwnProperty(key) && keys.push(key);
                    return keys.sort()
                }
                function forEachSorted(obj, iterator, context) {
                    for (var keys = sortedKeys(obj), i = 0; i < keys.length; i++) iterator.call(context, obj[keys[i]], keys[i]);
                    return keys
                }
                function reverseParams(iteratorFn) {
                    return function (value, key) {
                        iteratorFn(key, value)
                    }
                }
                function nextUid() {
                    for (var digit, index = uid.length; index;) {
                        if (index--, digit = uid[index].charCodeAt(0), 57 == digit) return uid[index] = "A",
                        uid.join("");
                        if (90 != digit) return uid[index] = String.fromCharCode(digit + 1),
                        uid.join("");
                        uid[index] = "0"
                    }
                    return uid.unshift("0"),
                    uid.join("")
                }
                function setHashKey(obj, h) {
                    h ? obj.$$hashKey = h : delete obj.$$hashKey
                }
                function extend(dst) {
                    var h = dst.$$hashKey;
                    return forEach(arguments,
                    function (obj) {
                        obj !== dst && forEach(obj,
                        function (value, key) {
                            dst[key] = value
                        })
                    }),
                    setHashKey(dst, h),
                    dst
                }
                function int(str) {
                    return parseInt(str, 10)
                }
                function inherit(parent, extra) {
                    return extend(new (extend(function () { },
                    {
                        prototype: parent
                    })), extra)
                }
                function noop() { }
                function identity($) {
                    return $
                }
                function valueFn(value) {
                    return function () {
                        return value
                    }
                }
                function isUndefined(value) {
                    return "undefined" == typeof value
                }
                function isDefined(value) {
                    return "undefined" != typeof value
                }
                function isObject(value) {
                    return null != value && "object" == typeof value
                }
                function isString(value) {
                    return "string" == typeof value
                }
                function isNumber(value) {
                    return "number" == typeof value
                }
                function isDate(value) {
                    return "[object Date]" === toString.call(value)
                }
                function isFunction(value) {
                    return "function" == typeof value
                }
                function isRegExp(value) {
                    return "[object RegExp]" === toString.call(value)
                }
                function isWindow(obj) {
                    return obj && obj.document && obj.location && obj.alert && obj.setInterval
                }
                function isScope(obj) {
                    return obj && obj.$evalAsync && obj.$watch
                }
                function isFile(obj) {
                    return "[object File]" === toString.call(obj)
                }
                function isBlob(obj) {
                    return "[object Blob]" === toString.call(obj)
                }
                function isPromiseLike(obj) {
                    return obj && isFunction(obj.then)
                }
                function isElement(node) {
                    return !(!node || !(node.nodeName || node.prop && node.attr && node.find))
                }
                function map(obj, iterator, context) {
                    var results = [];
                    return forEach(obj,
                    function (value, index, list) {
                        results.push(iterator.call(context, value, index, list))
                    }),
                    results
                }
                function includes(array, obj) {
                    return -1 != indexOf(array, obj)
                }
                function indexOf(array, obj) {
                    if (array.indexOf) return array.indexOf(obj);
                    for (var i = 0; i < array.length; i++) if (obj === array[i]) return i;
                    return -1
                }
                function arrayRemove(array, value) {
                    var index = indexOf(array, value);
                    return index >= 0 && array.splice(index, 1),
                    value
                }
                function copy(source, destination, stackSource, stackDest) {
                    if (isWindow(source) || isScope(source)) throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
                    if (destination) {
                        if (source === destination) throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
                        if (stackSource = stackSource || [], stackDest = stackDest || [], isObject(source)) {
                            var index = indexOf(stackSource, source);
                            if (-1 !== index) return stackDest[index];
                            stackSource.push(source),
                            stackDest.push(destination)
                        }
                        var result;
                        if (isArray(source)) {
                            destination.length = 0;
                            for (var i = 0; i < source.length; i++) result = copy(source[i], null, stackSource, stackDest),
                            isObject(source[i]) && (stackSource.push(source[i]), stackDest.push(result)),
                            destination.push(result)
                        } else {
                            var h = destination.$$hashKey;
                            isArray(destination) ? destination.length = 0 : forEach(destination,
                            function (value, key) {
                                delete destination[key]
                            });
                            for (var key in source) result = copy(source[key], null, stackSource, stackDest),
                            isObject(source[key]) && (stackSource.push(source[key]), stackDest.push(result)),
                            destination[key] = result;
                            setHashKey(destination, h)
                        }
                    } else destination = source,
                    source && (isArray(source) ? destination = copy(source, [], stackSource, stackDest) : isDate(source) ? destination = new Date(source.getTime()) : isRegExp(source) ? (destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]), destination.lastIndex = source.lastIndex) : isObject(source) && (destination = copy(source, {},
                    stackSource, stackDest)));
                    return destination
                }
                function shallowCopy(src, dst) {
                    if (isArray(src)) {
                        dst = dst || [];
                        for (var i = 0; i < src.length; i++) dst[i] = src[i]
                    } else if (isObject(src)) {
                        dst = dst || {};
                        for (var key in src) !hasOwnProperty.call(src, key) || "$" === key.charAt(0) && "$" === key.charAt(1) || (dst[key] = src[key])
                    }
                    return dst || src
                }
                function equals(o1, o2) {
                    if (o1 === o2) return !0;
                    if (null === o1 || null === o2) return !1;
                    if (o1 !== o1 && o2 !== o2) return !0;
                    var length, key, keySet, t1 = typeof o1,
                    t2 = typeof o2;
                    if (t1 == t2 && "object" == t1) {
                        if (!isArray(o1)) {
                            if (isDate(o1)) return isDate(o2) ? isNaN(o1.getTime()) && isNaN(o2.getTime()) || o1.getTime() === o2.getTime() : !1;
                            if (isRegExp(o1) && isRegExp(o2)) return o1.toString() == o2.toString();
                            if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return !1;
                            keySet = {};
                            for (key in o1) if ("$" !== key.charAt(0) && !isFunction(o1[key])) {
                                if (!equals(o1[key], o2[key])) return !1;
                                keySet[key] = !0
                            }
                            for (key in o2) if (!keySet.hasOwnProperty(key) && "$" !== key.charAt(0) && o2[key] !== undefined && !isFunction(o2[key])) return !1;
                            return !0
                        }
                        if (!isArray(o2)) return !1;
                        if ((length = o1.length) == o2.length) {
                            for (key = 0; length > key; key++) if (!equals(o1[key], o2[key])) return !1;
                            return !0
                        }
                    }
                    return !1
                }
                function concat(array1, array2, index) {
                    return array1.concat(slice.call(array2, index))
                }
                function sliceArgs(args, startIndex) {
                    return slice.call(args, startIndex || 0)
                }
                function bind(self, fn) {
                    var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
                    return !isFunction(fn) || fn instanceof RegExp ? fn : curryArgs.length ?
                    function () {
                        return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0))) : fn.apply(self, curryArgs)
                    } : function () {
                        return arguments.length ? fn.apply(self, arguments) : fn.call(self)
                    }
                }
                function toJsonReplacer(key, value) {
                    var val = value;
                    return "string" == typeof key && "$" === key.charAt(0) ? val = undefined : isWindow(value) ? val = "$WINDOW" : value && document === value ? val = "$DOCUMENT" : isScope(value) && (val = "$SCOPE"),
                    val
                }
                function toJson(obj, pretty) {
                    return "undefined" == typeof obj ? undefined : JSON.stringify(obj, toJsonReplacer, pretty ? "  " : null)
                }
                function fromJson(json) {
                    return isString(json) ? JSON.parse(json) : json
                }
                function toBoolean(value) {
                    if ("function" == typeof value) value = !0;
                    else if (value && 0 !== value.length) {
                        var v = lowercase("" + value);
                        value = !("f" == v || "0" == v || "false" == v || "no" == v || "n" == v || "[]" == v)
                    } else value = !1;
                    return value
                }
                function startingTag(element) {
                    element = jqLite(element).clone();
                    try {
                        element.empty()
                    } catch (e) { }
                    var TEXT_NODE = 3,
                    elemHtml = jqLite("<div>").append(element).html();
                    try {
                        return element[0].nodeType === TEXT_NODE ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
                        function (match, nodeName) {
                            return "<" + lowercase(nodeName)
                        })
                    } catch (e) {
                        return lowercase(elemHtml)
                    }
                }
                function tryDecodeURIComponent(value) {
                    try {
                        return decodeURIComponent(value)
                    } catch (e) { }
                }
                function parseKeyValue(keyValue) {
                    var key_value, key, obj = {};
                    return forEach((keyValue || "").split("&"),
                    function (keyValue) {
                        if (keyValue && (key_value = keyValue.replace(/\+/g, "%20").split("="), key = tryDecodeURIComponent(key_value[0]), isDefined(key))) {
                            var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : !0;
                            hasOwnProperty.call(obj, key) ? isArray(obj[key]) ? obj[key].push(val) : obj[key] = [obj[key], val] : obj[key] = val
                        }
                    }),
                    obj
                }
                function toKeyValue(obj) {
                    var parts = [];
                    return forEach(obj,
                    function (value, key) {
                        isArray(value) ? forEach(value,
                        function (arrayValue) {
                            parts.push(encodeUriQuery(key, !0) + (arrayValue === !0 ? "" : "=" + encodeUriQuery(arrayValue, !0)))
                        }) : parts.push(encodeUriQuery(key, !0) + (value === !0 ? "" : "=" + encodeUriQuery(value, !0)))
                    }),
                    parts.length ? parts.join("&") : ""
                }
                function encodeUriSegment(val) {
                    return encodeUriQuery(val, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
                }
                function encodeUriQuery(val, pctEncodeSpaces) {
                    return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, pctEncodeSpaces ? "%20" : "+")
                }
                function angularInit(element, bootstrap) {
                    function append(element) {
                        element && elements.push(element)
                    }
                    var appElement, module, elements = [element],
                    names = ["ng:app", "ng-app", "x-ng-app", "data-ng-app"],
                    NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
                    forEach(names,
                    function (name) {
                        names[name] = !0,
                        append(document.getElementById(name)),
                        name = name.replace(":", "\\:"),
                        element.querySelectorAll && (forEach(element.querySelectorAll("." + name), append), forEach(element.querySelectorAll("." + name + "\\:"), append), forEach(element.querySelectorAll("[" + name + "]"), append))
                    }),
                    forEach(elements,
                    function (element) {
                        if (!appElement) {
                            var className = " " + element.className + " ",
                            match = NG_APP_CLASS_REGEXP.exec(className);
                            match ? (appElement = element, module = (match[2] || "").replace(/\s+/g, ",")) : forEach(element.attributes,
                            function (attr) {
                                !appElement && names[attr.name] && (appElement = element, module = attr.value)
                            })
                        }
                    }),
                    appElement && bootstrap(appElement, module ? [module] : [])
                }
                function bootstrap(element, modules) {
                    var doBootstrap = function () {
                        if (element = jqLite(element), element.injector()) {
                            var tag = element[0] === document ? "document" : startingTag(element);
                            throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", tag.replace(/</, "&lt;").replace(/>/, "&gt;"))
                        }
                        modules = modules || [],
                        modules.unshift(["$provide",
                        function ($provide) {
                            $provide.value("$rootElement", element)
                        }]),
                        modules.unshift("ng");
                        var injector = createInjector(modules);
                        return injector.invoke(["$rootScope", "$rootElement", "$compile", "$injector", "$animate",
                        function (scope, element, compile, injector) {
                            scope.$apply(function () {
                                element.data("$injector", injector),
                                compile(element)(scope)
                            })
                        }]),
                        injector
                    },
                    NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
                    return window && !NG_DEFER_BOOTSTRAP.test(window.name) ? doBootstrap() : (window.name = window.name.replace(NG_DEFER_BOOTSTRAP, ""), void (angular.resumeBootstrap = function (extraModules) {
                        forEach(extraModules,
                        function (module) {
                            modules.push(module)
                        }),
                        doBootstrap()
                    }))
                }
                function snake_case(name, separator) {
                    return separator = separator || "_",
                    name.replace(SNAKE_CASE_REGEXP,
                    function (letter, pos) {
                        return (pos ? separator : "") + letter.toLowerCase()
                    })
                }
                function bindJQuery() {
                    jQuery = window.jQuery,
                    jQuery && jQuery.fn.on ? (jqLite = jQuery, extend(jQuery.fn, {
                        scope: JQLitePrototype.scope,
                        isolateScope: JQLitePrototype.isolateScope,
                        controller: JQLitePrototype.controller,
                        injector: JQLitePrototype.injector,
                        inheritedData: JQLitePrototype.inheritedData
                    }), jqLitePatchJQueryRemove("remove", !0, !0, !1), jqLitePatchJQueryRemove("empty", !1, !1, !1), jqLitePatchJQueryRemove("html", !1, !1, !0)) : jqLite = JQLite,
                    angular.element = jqLite
                }
                function assertArg(arg, name, reason) {
                    if (!arg) throw ngMinErr("areq", "Argument '{0}' is {1}", name || "?", reason || "required");
                    return arg
                }
                function assertArgFn(arg, name, acceptArrayAnnotation) {
                    return acceptArrayAnnotation && isArray(arg) && (arg = arg[arg.length - 1]),
                    assertArg(isFunction(arg), name, "not a function, got " + (arg && "object" == typeof arg ? arg.constructor.name || "Object" : typeof arg)),
                    arg
                }
                function assertNotHasOwnProperty(name, context) {
                    if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context)
                }
                function getter(obj, path, bindFnToScope) {
                    if (!path) return obj;
                    for (var key, keys = path.split("."), lastInstance = obj, len = keys.length, i = 0; len > i; i++) key = keys[i],
                    obj && (obj = (lastInstance = obj)[key]);
                    return !bindFnToScope && isFunction(obj) ? bind(lastInstance, obj) : obj
                }
                function getBlockElements(nodes) {
                    var startNode = nodes[0],
                    endNode = nodes[nodes.length - 1];
                    if (startNode === endNode) return jqLite(startNode);
                    var element = startNode,
                    elements = [element];
                    do {
                        if (element = element.nextSibling, !element) break;
                        elements.push(element)
                    } while (element !== endNode);
                    return jqLite(elements)
                }
                function setupModuleLoader(window) {
                    function ensure(obj, name, factory) {
                        return obj[name] || (obj[name] = factory())
                    }
                    var $injectorMinErr = minErr("$injector"),
                    ngMinErr = minErr("ng"),
                    angular = ensure(window, "angular", Object);
                    return angular.$$minErr = angular.$$minErr || minErr,
                    ensure(angular, "module",
                    function () {
                        var modules = {};
                        return function (name, requires, configFn) {
                            var assertNotHasOwnProperty = function (name, context) {
                                if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context)
                            };
                            return assertNotHasOwnProperty(name, "module"),
                            requires && modules.hasOwnProperty(name) && (modules[name] = null),
                            ensure(modules, name,
                            function () {
                                function invokeLater(provider, method, insertMethod) {
                                    return function () {
                                        return invokeQueue[insertMethod || "push"]([provider, method, arguments]),
                                        moduleInstance
                                    }
                                }
                                if (!requires) throw $injectorMinErr("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", name);
                                var invokeQueue = [],
                                runBlocks = [],
                                config = invokeLater("$injector", "invoke"),
                                moduleInstance = {
                                    _invokeQueue: invokeQueue,
                                    _runBlocks: runBlocks,
                                    requires: requires,
                                    name: name,
                                    provider: invokeLater("$provide", "provider"),
                                    factory: invokeLater("$provide", "factory"),
                                    service: invokeLater("$provide", "service"),
                                    value: invokeLater("$provide", "value"),
                                    constant: invokeLater("$provide", "constant", "unshift"),
                                    animation: invokeLater("$animateProvider", "register"),
                                    filter: invokeLater("$filterProvider", "register"),
                                    controller: invokeLater("$controllerProvider", "register"),
                                    directive: invokeLater("$compileProvider", "directive"),
                                    config: config,
                                    run: function (block) {
                                        return runBlocks.push(block),
                                        this
                                    }
                                };
                                return configFn && config(configFn),
                                moduleInstance
                            })
                        }
                    })
                }
                function publishExternalAPI(angular) {
                    extend(angular, {
                        bootstrap: bootstrap,
                        copy: copy,
                        extend: extend,
                        equals: equals,
                        element: jqLite,
                        forEach: forEach,
                        injector: createInjector,
                        noop: noop,
                        bind: bind,
                        toJson: toJson,
                        fromJson: fromJson,
                        identity: identity,
                        isUndefined: isUndefined,
                        isDefined: isDefined,
                        isString: isString,
                        isFunction: isFunction,
                        isObject: isObject,
                        isNumber: isNumber,
                        isElement: isElement,
                        isArray: isArray,
                        version: version,
                        isDate: isDate,
                        lowercase: lowercase,
                        uppercase: uppercase,
                        callbacks: {
                            counter: 0
                        },
                        $$minErr: minErr,
                        $$csp: csp
                    }),
                    angularModule = setupModuleLoader(window);
                    try {
                        angularModule("ngLocale")
                    } catch (e) {
                        angularModule("ngLocale", []).provider("$locale", $LocaleProvider)
                    }
                    angularModule("ng", ["ngLocale"], ["$provide",
                    function ($provide) {
                        $provide.provider({
                            $$sanitizeUri: $$SanitizeUriProvider
                        }),
                        $provide.provider("$compile", $CompileProvider).directive({
                            a: htmlAnchorDirective,
                            input: inputDirective,
                            textarea: inputDirective,
                            form: formDirective,
                            script: scriptDirective,
                            select: selectDirective,
                            style: styleDirective,
                            option: optionDirective,
                            ngBind: ngBindDirective,
                            ngBindHtml: ngBindHtmlDirective,
                            ngBindTemplate: ngBindTemplateDirective,
                            ngClass: ngClassDirective,
                            ngClassEven: ngClassEvenDirective,
                            ngClassOdd: ngClassOddDirective,
                            ngCloak: ngCloakDirective,
                            ngController: ngControllerDirective,
                            ngForm: ngFormDirective,
                            ngHide: ngHideDirective,
                            ngIf: ngIfDirective,
                            ngInclude: ngIncludeDirective,
                            ngInit: ngInitDirective,
                            ngNonBindable: ngNonBindableDirective,
                            ngPluralize: ngPluralizeDirective,
                            ngRepeat: ngRepeatDirective,
                            ngShow: ngShowDirective,
                            ngStyle: ngStyleDirective,
                            ngSwitch: ngSwitchDirective,
                            ngSwitchWhen: ngSwitchWhenDirective,
                            ngSwitchDefault: ngSwitchDefaultDirective,
                            ngOptions: ngOptionsDirective,
                            ngTransclude: ngTranscludeDirective,
                            ngModel: ngModelDirective,
                            ngList: ngListDirective,
                            ngChange: ngChangeDirective,
                            required: requiredDirective,
                            ngRequired: requiredDirective,
                            ngValue: ngValueDirective
                        }).directive({
                            ngInclude: ngIncludeFillContentDirective
                        }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives),
                        $provide.provider({
                            $anchorScroll: $AnchorScrollProvider,
                            $animate: $AnimateProvider,
                            $browser: $BrowserProvider,
                            $cacheFactory: $CacheFactoryProvider,
                            $controller: $ControllerProvider,
                            $document: $DocumentProvider,
                            $exceptionHandler: $ExceptionHandlerProvider,
                            $filter: $FilterProvider,
                            $interpolate: $InterpolateProvider,
                            $interval: $IntervalProvider,
                            $http: $HttpProvider,
                            $httpBackend: $HttpBackendProvider,
                            $location: $LocationProvider,
                            $log: $LogProvider,
                            $parse: $ParseProvider,
                            $rootScope: $RootScopeProvider,
                            $q: $QProvider,
                            $sce: $SceProvider,
                            $sceDelegate: $SceDelegateProvider,
                            $sniffer: $SnifferProvider,
                            $templateCache: $TemplateCacheProvider,
                            $timeout: $TimeoutProvider,
                            $window: $WindowProvider,
                            $$rAF: $$RAFProvider,
                            $$asyncCallback: $$AsyncCallbackProvider
                        })
                    }])
                }
                function jqNextId() {
                    return ++jqId
                }
                function camelCase(name) {
                    return name.replace(SPECIAL_CHARS_REGEXP,
                    function (_, separator, letter, offset) {
                        return offset ? letter.toUpperCase() : letter
                    }).replace(MOZ_HACK_REGEXP, "Moz$1")
                }
                function jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments) {
                    function removePatch(param) {
                        var set, setIndex, setLength, element, childIndex, childLength, children, list = filterElems && param ? [this.filter(param)] : [this],
                        fireEvent = dispatchThis;
                        if (!getterIfNoArguments || null != param) for (; list.length;) for (set = list.shift(), setIndex = 0, setLength = set.length; setLength > setIndex; setIndex++) for (element = jqLite(set[setIndex]), fireEvent ? element.triggerHandler("$destroy") : fireEvent = !fireEvent, childIndex = 0, childLength = (children = element.children()).length; childLength > childIndex; childIndex++) list.push(jQuery(children[childIndex]));
                        return originalJqFn.apply(this, arguments)
                    }
                    var originalJqFn = jQuery.fn[name];
                    originalJqFn = originalJqFn.$original || originalJqFn,
                    removePatch.$original = originalJqFn,
                    jQuery.fn[name] = removePatch
                }
                function jqLiteIsTextNode(html) {
                    return !HTML_REGEXP.test(html)
                }
                function jqLiteBuildFragment(html, context) {
                    var tmp, tag, wrap, i, j, jj, fragment = context.createDocumentFragment(),
                    nodes = [];
                    if (jqLiteIsTextNode(html)) nodes.push(context.createTextNode(html));
                    else {
                        for (tmp = fragment.appendChild(context.createElement("div")), tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = "<div>&#160;</div>" + wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2], tmp.removeChild(tmp.firstChild), i = wrap[0]; i--;) tmp = tmp.lastChild;
                        for (j = 0, jj = tmp.childNodes.length; jj > j; ++j) nodes.push(tmp.childNodes[j]);
                        tmp = fragment.firstChild,
                        tmp.textContent = ""
                    }
                    return fragment.textContent = "",
                    fragment.innerHTML = "",
                    nodes
                }
                function jqLiteParseHTML(html, context) {
                    context = context || document;
                    var parsed;
                    return (parsed = SINGLE_TAG_REGEXP.exec(html)) ? [context.createElement(parsed[1])] : jqLiteBuildFragment(html, context)
                }
                function JQLite(element) {
                    if (element instanceof JQLite) return element;
                    if (isString(element) && (element = trim(element)), !(this instanceof JQLite)) {
                        if (isString(element) && "<" != element.charAt(0)) throw jqLiteMinErr("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
                        return new JQLite(element)
                    }
                    if (isString(element)) {
                        jqLiteAddNodes(this, jqLiteParseHTML(element));
                        var fragment = jqLite(document.createDocumentFragment());
                        fragment.append(this)
                    } else jqLiteAddNodes(this, element)
                }
                function jqLiteClone(element) {
                    return element.cloneNode(!0)
                }
                function jqLiteDealoc(element) {
                    jqLiteRemoveData(element);
                    for (var i = 0,
                    children = element.childNodes || []; i < children.length; i++) jqLiteDealoc(children[i])
                }
                function jqLiteOff(element, type, fn, unsupported) {
                    if (isDefined(unsupported)) throw jqLiteMinErr("offargs", "jqLite#off() does not support the `selector` argument");
                    var events = jqLiteExpandoStore(element, "events"),
                    handle = jqLiteExpandoStore(element, "handle");
                    handle && (isUndefined(type) ? forEach(events,
                    function (eventHandler, type) {
                        removeEventListenerFn(element, type, eventHandler),
                        delete events[type]
                    }) : forEach(type.split(" "),
                    function (type) {
                        isUndefined(fn) ? (removeEventListenerFn(element, type, events[type]), delete events[type]) : arrayRemove(events[type] || [], fn)
                    }))
                }
                function jqLiteRemoveData(element, name) {
                    var expandoId = element.ng339,
                    expandoStore = jqCache[expandoId];
                    if (expandoStore) {
                        if (name) return void delete jqCache[expandoId].data[name];
                        expandoStore.handle && (expandoStore.events.$destroy && expandoStore.handle({},
                        "$destroy"), jqLiteOff(element)),
                        delete jqCache[expandoId],
                        element.ng339 = undefined
                    }
                }
                function jqLiteExpandoStore(element, key, value) {
                    var expandoId = element.ng339,
                    expandoStore = jqCache[expandoId || -1];
                    return isDefined(value) ? (expandoStore || (element.ng339 = expandoId = jqNextId(), expandoStore = jqCache[expandoId] = {}), void (expandoStore[key] = value)) : expandoStore && expandoStore[key]
                }
                function jqLiteData(element, key, value) {
                    var data = jqLiteExpandoStore(element, "data"),
                    isSetter = isDefined(value),
                    keyDefined = !isSetter && isDefined(key),
                    isSimpleGetter = keyDefined && !isObject(key);
                    if (data || isSimpleGetter || jqLiteExpandoStore(element, "data", data = {}), isSetter) data[key] = value;
                    else {
                        if (!keyDefined) return data;
                        if (isSimpleGetter) return data && data[key];
                        extend(data, key)
                    }
                }
                function jqLiteHasClass(element, selector) {
                    return element.getAttribute ? (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1 : !1
                }
                function jqLiteRemoveClass(element, cssClasses) {
                    cssClasses && element.setAttribute && forEach(cssClasses.split(" "),
                    function (cssClass) {
                        element.setAttribute("class", trim((" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + trim(cssClass) + " ", " ")))
                    })
                }
                function jqLiteAddClass(element, cssClasses) {
                    if (cssClasses && element.setAttribute) {
                        var existingClasses = (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
                        forEach(cssClasses.split(" "),
                        function (cssClass) {
                            cssClass = trim(cssClass),
                            -1 === existingClasses.indexOf(" " + cssClass + " ") && (existingClasses += cssClass + " ")
                        }),
                        element.setAttribute("class", trim(existingClasses))
                    }
                }
                function jqLiteAddNodes(root, elements) {
                    if (elements) {
                        elements = elements.nodeName || !isDefined(elements.length) || isWindow(elements) ? [elements] : elements;
                        for (var i = 0; i < elements.length; i++) root.push(elements[i])
                    }
                }
                function jqLiteController(element, name) {
                    return jqLiteInheritedData(element, "$" + (name || "ngController") + "Controller")
                }
                function jqLiteInheritedData(element, name, value) {
                    9 == element.nodeType && (element = element.documentElement);
                    for (var names = isArray(name) ? name : [name]; element;) {
                        for (var i = 0,
                        ii = names.length; ii > i; i++) if ((value = jqLite.data(element, names[i])) !== undefined) return value;
                        element = element.parentNode || 11 === element.nodeType && element.host
                    }
                }
                function jqLiteEmpty(element) {
                    for (var i = 0,
                    childNodes = element.childNodes; i < childNodes.length; i++) jqLiteDealoc(childNodes[i]);
                    for (; element.firstChild;) element.removeChild(element.firstChild)
                }
                function getBooleanAttrName(element, name) {
                    var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
                    return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr
                }
                function createEventHandler(element, events) {
                    var eventHandler = function (event, type) {
                        if (event.preventDefault || (event.preventDefault = function () {
                            event.returnValue = !1
                        }), event.stopPropagation || (event.stopPropagation = function () {
                            event.cancelBubble = !0
                        }), event.target || (event.target = event.srcElement || document), isUndefined(event.defaultPrevented)) {
                            var prevent = event.preventDefault;
                            event.preventDefault = function () {
                                event.defaultPrevented = !0,
                                prevent.call(event)
                            },
                            event.defaultPrevented = !1
                        }
                        event.isDefaultPrevented = function () {
                            return event.defaultPrevented || event.returnValue === !1
                        };
                        var eventHandlersCopy = shallowCopy(events[type || event.type] || []);
                        forEach(eventHandlersCopy,
                        function (fn) {
                            fn.call(element, event)
                        }),
                        8 >= msie ? (event.preventDefault = null, event.stopPropagation = null, event.isDefaultPrevented = null) : (delete event.preventDefault, delete event.stopPropagation, delete event.isDefaultPrevented)
                    };
                    return eventHandler.elem = element,
                    eventHandler
                }
                function hashKey(obj, nextUidFn) {
                    var key, objType = typeof obj;
                    return "function" == objType || "object" == objType && null !== obj ? "function" == typeof (key = obj.$$hashKey) ? key = obj.$$hashKey() : key === undefined && (key = obj.$$hashKey = (nextUidFn || nextUid)()) : key = obj,
                    objType + ":" + key
                }
                function HashMap(array, isolatedUid) {
                    if (isolatedUid) {
                        var uid = 0;
                        this.nextUid = function () {
                            return ++uid
                        }
                    }
                    forEach(array, this.put, this)
                }
                function annotate(fn) {
                    var $inject, fnText, argDecl, last;
                    return "function" == typeof fn ? ($inject = fn.$inject) || ($inject = [], fn.length && (fnText = fn.toString().replace(STRIP_COMMENTS, ""), argDecl = fnText.match(FN_ARGS), forEach(argDecl[1].split(FN_ARG_SPLIT),
                    function (arg) {
                        arg.replace(FN_ARG,
                        function (all, underscore, name) {
                            $inject.push(name)
                        })
                    })), fn.$inject = $inject) : isArray(fn) ? (last = fn.length - 1, assertArgFn(fn[last], "fn"), $inject = fn.slice(0, last)) : assertArgFn(fn, "fn", !0),
                    $inject
                }
                function createInjector(modulesToLoad) {
                    function supportObject(delegate) {
                        return function (key, value) {
                            return isObject(key) ? void forEach(key, reverseParams(delegate)) : delegate(key, value)
                        }
                    }
                    function provider(name, provider_) {
                        if (assertNotHasOwnProperty(name, "service"), (isFunction(provider_) || isArray(provider_)) && (provider_ = providerInjector.instantiate(provider_)), !provider_.$get) throw $injectorMinErr("pget", "Provider '{0}' must define $get factory method.", name);
                        return providerCache[name + providerSuffix] = provider_
                    }
                    function factory(name, factoryFn) {
                        return provider(name, {
                            $get: factoryFn
                        })
                    }
                    function service(name, constructor) {
                        return factory(name, ["$injector",
                        function ($injector) {
                            return $injector.instantiate(constructor)
                        }])
                    }
                    function value(name, val) {
                        return factory(name, valueFn(val))
                    }
                    function constant(name, value) {
                        assertNotHasOwnProperty(name, "constant"),
                        providerCache[name] = value,
                        instanceCache[name] = value
                    }
                    function decorator(serviceName, decorFn) {
                        var origProvider = providerInjector.get(serviceName + providerSuffix),
                        orig$get = origProvider.$get;
                        origProvider.$get = function () {
                            var origInstance = instanceInjector.invoke(orig$get, origProvider);
                            return instanceInjector.invoke(decorFn, null, {
                                $delegate: origInstance
                            })
                        }
                    }
                    function loadModules(modulesToLoad) {
                        var moduleFn, invokeQueue, i, ii, runBlocks = [];
                        return forEach(modulesToLoad,
                        function (module) {
                            if (!loadedModules.get(module)) {
                                loadedModules.put(module, !0);
                                try {
                                    if (isString(module)) for (moduleFn = angularModule(module), runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks), invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; ii > i; i++) {
                                        var invokeArgs = invokeQueue[i],
                                        provider = providerInjector.get(invokeArgs[0]);
                                        provider[invokeArgs[1]].apply(provider, invokeArgs[2])
                                    } else isFunction(module) ? runBlocks.push(providerInjector.invoke(module)) : isArray(module) ? runBlocks.push(providerInjector.invoke(module)) : assertArgFn(module, "module")
                                } catch (e) {
                                    throw isArray(module) && (module = module[module.length - 1]),
                                    e.message && e.stack && -1 == e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack),
                                    $injectorMinErr("modulerr", "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e)
                                }
                            }
                        }),
                        runBlocks
                    }
                    function createInternalInjector(cache, factory) {
                        function getService(serviceName) {
                            if (cache.hasOwnProperty(serviceName)) {
                                if (cache[serviceName] === INSTANTIATING) throw $injectorMinErr("cdep", "Circular dependency found: {0}", serviceName + " <- " + path.join(" <- "));
                                return cache[serviceName]
                            }
                            try {
                                return path.unshift(serviceName),
                                cache[serviceName] = INSTANTIATING,
                                cache[serviceName] = factory(serviceName)
                            } catch (err) {
                                throw cache[serviceName] === INSTANTIATING && delete cache[serviceName],
                                err
                            } finally {
                                path.shift()
                            }
                        }
                        function invoke(fn, self, locals) {
                            var length, i, key, args = [],
                            $inject = annotate(fn);
                            for (i = 0, length = $inject.length; length > i; i++) {
                                if (key = $inject[i], "string" != typeof key) throw $injectorMinErr("itkn", "Incorrect injection token! Expected service name as string, got {0}", key);
                                args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key))
                            }
                            return isArray(fn) && (fn = fn[length]),
                            fn.apply(self, args)
                        }
                        function instantiate(Type, locals) {
                            var instance, returnedValue, Constructor = function () { };
                            return Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype,
                            instance = new Constructor,
                            returnedValue = invoke(Type, instance, locals),
                            isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance
                        }
                        return {
                            invoke: invoke,
                            instantiate: instantiate,
                            get: getService,
                            annotate: annotate,
                            has: function (name) {
                                return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name)
                            }
                        }
                    }
                    var INSTANTIATING = {},
                    providerSuffix = "Provider",
                    path = [],
                    loadedModules = new HashMap([], !0),
                    providerCache = {
                        $provide: {
                            provider: supportObject(provider),
                            factory: supportObject(factory),
                            service: supportObject(service),
                            value: supportObject(value),
                            constant: supportObject(constant),
                            decorator: decorator
                        }
                    },
                    providerInjector = providerCache.$injector = createInternalInjector(providerCache,
                    function () {
                        throw $injectorMinErr("unpr", "Unknown provider: {0}", path.join(" <- "))
                    }),
                    instanceCache = {},
                    instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache,
                    function (servicename) {
                        var provider = providerInjector.get(servicename + providerSuffix);
                        return instanceInjector.invoke(provider.$get, provider)
                    });
                    return forEach(loadModules(modulesToLoad),
                    function (fn) {
                        instanceInjector.invoke(fn || noop)
                    }),
                    instanceInjector
                }
                function $AnchorScrollProvider() {
                    var autoScrollingEnabled = !0;
                    this.disableAutoScrolling = function () {
                        autoScrollingEnabled = !1
                    },
                    this.$get = ["$window", "$location", "$rootScope",
                    function ($window, $location, $rootScope) {
                        function getFirstAnchor(list) {
                            var result = null;
                            return forEach(list,
                            function (element) {
                                result || "a" !== lowercase(element.nodeName) || (result = element)
                            }),
                            result
                        }
                        function scroll() {
                            var elm, hash = $location.hash();
                            hash ? (elm = document.getElementById(hash)) ? elm.scrollIntoView() : (elm = getFirstAnchor(document.getElementsByName(hash))) ? elm.scrollIntoView() : "top" === hash && $window.scrollTo(0, 0) : $window.scrollTo(0, 0)
                        }
                        var document = $window.document;
                        return autoScrollingEnabled && $rootScope.$watch(function () {
                            return $location.hash()
                        },
                        function () {
                            $rootScope.$evalAsync(scroll)
                        }),
                        scroll
                    }]
                }
                function $$AsyncCallbackProvider() {
                    this.$get = ["$$rAF", "$timeout",
                    function ($$rAF, $timeout) {
                        return $$rAF.supported ?
                        function (fn) {
                            return $$rAF(fn)
                        } : function (fn) {
                            return $timeout(fn, 0, !1)
                        }
                    }]
                }
                function Browser(window, document, $log, $sniffer) {
                    function completeOutstandingRequest(fn) {
                        try {
                            fn.apply(null, sliceArgs(arguments, 1))
                        } finally {
                            if (outstandingRequestCount--, 0 === outstandingRequestCount) for (; outstandingRequestCallbacks.length;) try {
                                outstandingRequestCallbacks.pop()()
                            } catch (e) {
                                $log.error(e)
                            }
                        }
                    }
                    function startPoller(interval, setTimeout) {
                        !
                            function check() {
                                forEach(pollFns,
                                function (pollFn) {
                                    pollFn()
                                }),
                                pollTimeout = setTimeout(check, interval)
                            }()
                    }
                    function fireUrlChange() {
                        lastBrowserUrl != self.url() && (lastBrowserUrl = self.url(), forEach(urlChangeListeners,
                        function (listener) {
                            listener(self.url())
                        }))
                    }
                    var self = this,
                    rawDocument = document[0],
                    location = window.location,
                    history = window.history,
                    setTimeout = window.setTimeout,
                    clearTimeout = window.clearTimeout,
                    pendingDeferIds = {};
                    self.isMock = !1;
                    var outstandingRequestCount = 0,
                    outstandingRequestCallbacks = [];
                    self.$$completeOutstandingRequest = completeOutstandingRequest,
                    self.$$incOutstandingRequestCount = function () {
                        outstandingRequestCount++
                    },
                    self.notifyWhenNoOutstandingRequests = function (callback) {
                        forEach(pollFns,
                        function (pollFn) {
                            pollFn()
                        }),
                        0 === outstandingRequestCount ? callback() : outstandingRequestCallbacks.push(callback)
                    };
                    var pollTimeout, pollFns = [];
                    self.addPollFn = function (fn) {
                        return isUndefined(pollTimeout) && startPoller(100, setTimeout),
                        pollFns.push(fn),
                        fn
                    };
                    var lastBrowserUrl = location.href,
                    baseElement = document.find("base"),
                    reloadLocation = null;
                    self.url = function (url, replace) {
                        if (location !== window.location && (location = window.location), history !== window.history && (history = window.history), url) {
                            if (lastBrowserUrl == url) return;
                            var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
                            return lastBrowserUrl = url,
                            !sameBase && $sniffer.history ? replace ? history.replaceState(null, "", url) : (history.pushState(null, "", url), baseElement.attr("href", baseElement.attr("href"))) : (sameBase || (reloadLocation = url), replace ? location.replace(url) : location.href = url),
                            self
                        }
                        return reloadLocation || location.href.replace(/%27/g, "'")
                    };
                    var urlChangeListeners = [],
                    urlChangeInit = !1;
                    self.onUrlChange = function (callback) {
                        return urlChangeInit || ($sniffer.history && jqLite(window).on("popstate", fireUrlChange), $sniffer.hashchange ? jqLite(window).on("hashchange", fireUrlChange) : self.addPollFn(fireUrlChange), urlChangeInit = !0),
                        urlChangeListeners.push(callback),
                        callback
                    },
                    self.$$checkUrlChange = fireUrlChange,
                    self.baseHref = function () {
                        var href = baseElement.attr("href");
                        return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, "") : ""
                    };
                    var lastCookies = {},
                    lastCookieString = "",
                    cookiePath = self.baseHref();
                    self.cookies = function (name, value) {
                        var cookieLength, cookieArray, cookie, i, index;
                        if (!name) {
                            if (rawDocument.cookie !== lastCookieString) for (lastCookieString = rawDocument.cookie, cookieArray = lastCookieString.split("; "), lastCookies = {},
                            i = 0; i < cookieArray.length; i++) cookie = cookieArray[i],
                            index = cookie.indexOf("="),
                            index > 0 && (name = unescape(cookie.substring(0, index)), lastCookies[name] === undefined && (lastCookies[name] = unescape(cookie.substring(index + 1))));
                            return lastCookies
                        }
                        value === undefined ? rawDocument.cookie = escape(name) + "=;path=" + cookiePath + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : isString(value) && (cookieLength = (rawDocument.cookie = escape(name) + "=" + escape(value) + ";path=" + cookiePath).length + 1, cookieLength > 4096 && $log.warn("Cookie '" + name + "' possibly not set or overflowed because it was too large (" + cookieLength + " > 4096 bytes)!"))
                    },
                    self.defer = function (fn, delay) {
                        var timeoutId;
                        return outstandingRequestCount++,
                        timeoutId = setTimeout(function () {
                            delete pendingDeferIds[timeoutId],
                            completeOutstandingRequest(fn)
                        },
                        delay || 0),
                        pendingDeferIds[timeoutId] = !0,
                        timeoutId
                    },
                    self.defer.cancel = function (deferId) {
                        return pendingDeferIds[deferId] ? (delete pendingDeferIds[deferId], clearTimeout(deferId), completeOutstandingRequest(noop), !0) : !1
                    }
                }
                function $BrowserProvider() {
                    this.$get = ["$window", "$log", "$sniffer", "$document",
                    function ($window, $log, $sniffer, $document) {
                        return new Browser($window, $document, $log, $sniffer)
                    }]
                }
                function $CacheFactoryProvider() {
                    this.$get = function () {
                        function cacheFactory(cacheId, options) {
                            function refresh(entry) {
                                entry != freshEnd && (staleEnd ? staleEnd == entry && (staleEnd = entry.n) : staleEnd = entry, link(entry.n, entry.p), link(entry, freshEnd), freshEnd = entry, freshEnd.n = null)
                            }
                            function link(nextEntry, prevEntry) {
                                nextEntry != prevEntry && (nextEntry && (nextEntry.p = prevEntry), prevEntry && (prevEntry.n = nextEntry))
                            }
                            if (cacheId in caches) throw minErr("$cacheFactory")("iid", "CacheId '{0}' is already taken!", cacheId);
                            var size = 0,
                            stats = extend({},
                            options, {
                                id: cacheId
                            }),
                            data = {},
                            capacity = options && options.capacity || Number.MAX_VALUE,
                            lruHash = {},
                            freshEnd = null,
                            staleEnd = null;
                            return caches[cacheId] = {
                                put: function (key, value) {
                                    if (capacity < Number.MAX_VALUE) {
                                        var lruEntry = lruHash[key] || (lruHash[key] = {
                                            key: key
                                        });
                                        refresh(lruEntry)
                                    }
                                    if (!isUndefined(value)) return key in data || size++,
                                    data[key] = value,
                                    size > capacity && this.remove(staleEnd.key),
                                    value
                                },
                                get: function (key) {
                                    if (capacity < Number.MAX_VALUE) {
                                        var lruEntry = lruHash[key];
                                        if (!lruEntry) return;
                                        refresh(lruEntry)
                                    }
                                    return data[key]
                                },
                                remove: function (key) {
                                    if (capacity < Number.MAX_VALUE) {
                                        var lruEntry = lruHash[key];
                                        if (!lruEntry) return;
                                        lruEntry == freshEnd && (freshEnd = lruEntry.p),
                                        lruEntry == staleEnd && (staleEnd = lruEntry.n),
                                        link(lruEntry.n, lruEntry.p),
                                        delete lruHash[key]
                                    }
                                    delete data[key],
                                    size--
                                },
                                removeAll: function () {
                                    data = {},
                                    size = 0,
                                    lruHash = {},
                                    freshEnd = staleEnd = null
                                },
                                destroy: function () {
                                    data = null,
                                    stats = null,
                                    lruHash = null,
                                    delete caches[cacheId]
                                },
                                info: function () {
                                    return extend({},
                                    stats, {
                                        size: size
                                    })
                                }
                            }
                        }
                        var caches = {};
                        return cacheFactory.info = function () {
                            var info = {};
                            return forEach(caches,
                            function (cache, cacheId) {
                                info[cacheId] = cache.info()
                            }),
                            info
                        },
                        cacheFactory.get = function (cacheId) {
                            return caches[cacheId]
                        },
                        cacheFactory
                    }
                }
                function $TemplateCacheProvider() {
                    this.$get = ["$cacheFactory",
                    function ($cacheFactory) {
                        return $cacheFactory("templates")
                    }]
                }
                function $CompileProvider($provide, $$sanitizeUriProvider) {
                    var hasDirectives = {},
                    Suffix = "Directive",
                    COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w_\-]+)\s+(.*)$/,
                    CLASS_DIRECTIVE_REGEXP = /(([\d\w_\-]+)(?:\:([^;]+))?;?)/,
                    EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
                    this.directive = function registerDirective(name, directiveFactory) {
                        return assertNotHasOwnProperty(name, "directive"),
                        isString(name) ? (assertArg(directiveFactory, "directiveFactory"), hasDirectives.hasOwnProperty(name) || (hasDirectives[name] = [], $provide.factory(name + Suffix, ["$injector", "$exceptionHandler",
                        function ($injector, $exceptionHandler) {
                            var directives = [];
                            return forEach(hasDirectives[name],
                            function (directiveFactory, index) {
                                try {
                                    var directive = $injector.invoke(directiveFactory);
                                    isFunction(directive) ? directive = {
                                        compile: valueFn(directive)
                                    } : !directive.compile && directive.link && (directive.compile = valueFn(directive.link)),
                                    directive.priority = directive.priority || 0,
                                    directive.index = index,
                                    directive.name = directive.name || name,
                                    directive.require = directive.require || directive.controller && directive.name,
                                    directive.restrict = directive.restrict || "A",
                                    directives.push(directive)
                                } catch (e) {
                                    $exceptionHandler(e)
                                }
                            }),
                            directives
                        }])), hasDirectives[name].push(directiveFactory)) : forEach(name, reverseParams(registerDirective)),
                        this
                    },
                    this.aHrefSanitizationWhitelist = function (regexp) {
                        return isDefined(regexp) ? ($$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.aHrefSanitizationWhitelist()
                    },
                    this.imgSrcSanitizationWhitelist = function (regexp) {
                        return isDefined(regexp) ? ($$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.imgSrcSanitizationWhitelist()
                    },
                    this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$http", "$templateCache", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri",
                    function ($injector, $interpolate, $exceptionHandler, $http, $templateCache, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
                        function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
                            $compileNodes instanceof jqLite || ($compileNodes = jqLite($compileNodes)),
                            forEach($compileNodes,
                            function (node, index) {
                                3 == node.nodeType && node.nodeValue.match(/\S+/) && ($compileNodes[index] = node = jqLite(node).wrap("<span></span>").parent()[0])
                            });
                            var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
                            return safeAddClass($compileNodes, "ng-scope"),
                            function (scope, cloneConnectFn, transcludeControllers, parentBoundTranscludeFn) {
                                assertArg(scope, "scope");
                                var $linkNode = cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) : $compileNodes;
                                forEach(transcludeControllers,
                                function (instance, name) {
                                    $linkNode.data("$" + name + "Controller", instance)
                                });
                                for (var i = 0,
                                ii = $linkNode.length; ii > i; i++) {
                                    var node = $linkNode[i],
                                    nodeType = node.nodeType; (1 === nodeType || 9 === nodeType) && $linkNode.eq(i).data("$scope", scope)
                                }
                                return cloneConnectFn && cloneConnectFn($linkNode, scope),
                                compositeLinkFn && compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn),
                                $linkNode
                            }
                        }
                        function safeAddClass($element, className) {
                            try {
                                $element.addClass(className)
                            } catch (e) { }
                        }
                        function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
                            function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
                                var nodeLinkFn, childLinkFn, node, childScope, i, ii, n, childBoundTranscludeFn, nodeListLength = nodeList.length,
                                stableNodeList = new Array(nodeListLength);
                                for (i = 0; nodeListLength > i; i++) stableNodeList[i] = nodeList[i];
                                for (i = 0, n = 0, ii = linkFns.length; ii > i; n++) node = stableNodeList[n],
                                nodeLinkFn = linkFns[i++],
                                childLinkFn = linkFns[i++],
                                nodeLinkFn ? (nodeLinkFn.scope ? (childScope = scope.$new(), jqLite.data(node, "$scope", childScope)) : childScope = scope, childBoundTranscludeFn = nodeLinkFn.transcludeOnThisElement ? createBoundTranscludeFn(scope, nodeLinkFn.transclude, parentBoundTranscludeFn) : !nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn ? parentBoundTranscludeFn : !parentBoundTranscludeFn && transcludeFn ? createBoundTranscludeFn(scope, transcludeFn) : null, nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn)) : childLinkFn && childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn)
                            }
                            for (var attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, linkFns = [], i = 0; i < nodeList.length; i++) attrs = new Attributes,
                            directives = collectDirectives(nodeList[i], [], attrs, 0 === i ? maxPriority : undefined, ignoreDirective),
                            nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null,
                            nodeLinkFn && nodeLinkFn.scope && safeAddClass(attrs.$$element, "ng-scope"),
                            childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement) && nodeLinkFn.transclude : transcludeFn),
                            linkFns.push(nodeLinkFn, childLinkFn),
                            linkFnFound = linkFnFound || nodeLinkFn || childLinkFn,
                            previousCompileContext = null;
                            return linkFnFound ? compositeLinkFn : null
                        }
                        function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn) {
                            var boundTranscludeFn = function (transcludedScope, cloneFn, controllers) {
                                var scopeCreated = !1;
                                transcludedScope || (transcludedScope = scope.$new(), transcludedScope.$$transcluded = !0, scopeCreated = !0);
                                var clone = transcludeFn(transcludedScope, cloneFn, controllers, previousBoundTranscludeFn);
                                return scopeCreated && clone.on("$destroy",
                                function () {
                                    transcludedScope.$destroy()
                                }),
                                clone
                            };
                            return boundTranscludeFn
                        }
                        function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
                            var match, className, nodeType = node.nodeType,
                            attrsMap = attrs.$attr;
                            switch (nodeType) {
                                case 1:
                                    addDirective(directives, directiveNormalize(nodeName_(node).toLowerCase()), "E", maxPriority, ignoreDirective);
                                    for (var attr, name, nName, ngAttrName, value, isNgAttr, nAttrs = node.attributes,
                                    j = 0,
                                    jj = nAttrs && nAttrs.length; jj > j; j++) {
                                        var attrStartName = !1,
                                        attrEndName = !1;
                                        if (attr = nAttrs[j], !msie || msie >= 8 || attr.specified) {
                                            name = attr.name,
                                            value = trim(attr.value),
                                            ngAttrName = directiveNormalize(name),
                                            (isNgAttr = NG_ATTR_BINDING.test(ngAttrName)) && (name = snake_case(ngAttrName.substr(6), "-"));
                                            var directiveNName = ngAttrName.replace(/(Start|End)$/, "");
                                            ngAttrName === directiveNName + "Start" && (attrStartName = name, attrEndName = name.substr(0, name.length - 5) + "end", name = name.substr(0, name.length - 6)),
                                            nName = directiveNormalize(name.toLowerCase()),
                                            attrsMap[nName] = name,
                                            (isNgAttr || !attrs.hasOwnProperty(nName)) && (attrs[nName] = value, getBooleanAttrName(node, nName) && (attrs[nName] = !0)),
                                            addAttrInterpolateDirective(node, directives, value, nName),
                                            addDirective(directives, nName, "A", maxPriority, ignoreDirective, attrStartName, attrEndName)
                                        }
                                    }
                                    if (className = node.className, isString(className) && "" !== className) for (; match = CLASS_DIRECTIVE_REGEXP.exec(className) ;) nName = directiveNormalize(match[2]),
                                    addDirective(directives, nName, "C", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[3])),
                                    className = className.substr(match.index + match[0].length);
                                    break;
                                case 3:
                                    addTextInterpolateDirective(directives, node.nodeValue);
                                    break;
                                case 8:
                                    try {
                                        match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue),
                                        match && (nName = directiveNormalize(match[1]), addDirective(directives, nName, "M", maxPriority, ignoreDirective) && (attrs[nName] = trim(match[2])))
                                    } catch (e) { }
                            }
                            return directives.sort(byPriority),
                            directives
                        }
                        function groupScan(node, attrStart, attrEnd) {
                            var nodes = [],
                            depth = 0;
                            if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
                                do {
                                    if (!node) throw $compileMinErr("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
                                    1 == node.nodeType && (node.hasAttribute(attrStart) && depth++, node.hasAttribute(attrEnd) && depth--), nodes.push(node), node = node.nextSibling
                                } while (depth > 0)
                            } else nodes.push(node);
                            return jqLite(nodes)
                        }
                        function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                            return function (scope, element, attrs, controllers, transcludeFn) {
                                return element = groupScan(element[0], attrStart, attrEnd),
                                linkFn(scope, element, attrs, controllers, transcludeFn)
                            }
                        }
                        function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
                            function addLinkFns(pre, post, attrStart, attrEnd) {
                                pre && (attrStart && (pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd)), pre.require = directive.require, pre.directiveName = directiveName, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (pre = cloneAndAnnotateFn(pre, {
                                    isolateScope: !0
                                })), preLinkFns.push(pre)),
                                post && (attrStart && (post = groupElementsLinkFnWrapper(post, attrStart, attrEnd)), post.require = directive.require, post.directiveName = directiveName, (newIsolateScopeDirective === directive || directive.$$isolateScope) && (post = cloneAndAnnotateFn(post, {
                                    isolateScope: !0
                                })), postLinkFns.push(post))
                            }
                            function getControllers(directiveName, require, $element, elementControllers) {
                                var value, retrievalMethod = "data",
                                optional = !1;
                                if (isString(require)) {
                                    for (;
                                    "^" == (value = require.charAt(0)) || "?" == value;) require = require.substr(1),
                                    "^" == value && (retrievalMethod = "inheritedData"),
                                    optional = optional || "?" == value;
                                    if (value = null, elementControllers && "data" === retrievalMethod && (value = elementControllers[require]), value = value || $element[retrievalMethod]("$" + require + "Controller"), !value && !optional) throw $compileMinErr("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", require, directiveName);
                                    return value
                                }
                                return isArray(require) && (value = [], forEach(require,
                                function (require) {
                                    value.push(getControllers(directiveName, require, $element, elementControllers))
                                })),
                                value
                            }
                            function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
                                function controllersBoundTransclude(scope, cloneAttachFn) {
                                    var transcludeControllers;
                                    return arguments.length < 2 && (cloneAttachFn = scope, scope = undefined),
                                    hasElementTranscludeDirective && (transcludeControllers = elementControllers),
                                    boundTranscludeFn(scope, cloneAttachFn, transcludeControllers)
                                }
                                var attrs, $element, i, ii, linkFn, controller, isolateScope, transcludeFn, elementControllers = {};
                                if (attrs = compileNode === linkNode ? templateAttrs : shallowCopy(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr)), $element = attrs.$$element, newIsolateScopeDirective) {
                                    var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
                                    isolateScope = scope.$new(!0),
                                    !templateDirective || templateDirective !== newIsolateScopeDirective && templateDirective !== newIsolateScopeDirective.$$originalDirective ? $element.data("$isolateScopeNoTemplate", isolateScope) : $element.data("$isolateScope", isolateScope),
                                    safeAddClass($element, "ng-isolate-scope"),
                                    forEach(newIsolateScopeDirective.scope,
                                    function (definition, scopeName) {
                                        var lastValue, parentGet, parentSet, compare, match = definition.match(LOCAL_REGEXP) || [],
                                        attrName = match[3] || scopeName,
                                        optional = "?" == match[2],
                                        mode = match[1];
                                        switch (isolateScope.$$isolateBindings[scopeName] = mode + attrName, mode) {
                                            case "@":
                                                attrs.$observe(attrName,
                                                function (value) {
                                                    isolateScope[scopeName] = value
                                                }),
                                                attrs.$$observers[attrName].$$scope = scope,
                                                attrs[attrName] && (isolateScope[scopeName] = $interpolate(attrs[attrName])(scope));
                                                break;
                                            case "=":
                                                if (optional && !attrs[attrName]) return;
                                                parentGet = $parse(attrs[attrName]),
                                                compare = parentGet.literal ? equals : function (a, b) {
                                                    return a === b || a !== a && b !== b
                                                },
                                                parentSet = parentGet.assign ||
                                                function () {
                                                    throw lastValue = isolateScope[scopeName] = parentGet(scope),
                                                    $compileMinErr("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", attrs[attrName], newIsolateScopeDirective.name)
                                                },
                                                lastValue = isolateScope[scopeName] = parentGet(scope),
                                                isolateScope.$watch(function () {
                                                    var parentValue = parentGet(scope);
                                                    return compare(parentValue, isolateScope[scopeName]) || (compare(parentValue, lastValue) ? parentSet(scope, parentValue = isolateScope[scopeName]) : isolateScope[scopeName] = parentValue),
                                                    lastValue = parentValue
                                                },
                                                null, parentGet.literal);
                                                break;
                                            case "&":
                                                parentGet = $parse(attrs[attrName]),
                                                isolateScope[scopeName] = function (locals) {
                                                    return parentGet(scope, locals)
                                                };
                                                break;
                                            default:
                                                throw $compileMinErr("iscp", "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}", newIsolateScopeDirective.name, scopeName, definition)
                                        }
                                    })
                                }
                                for (transcludeFn = boundTranscludeFn && controllersBoundTransclude, controllerDirectives && forEach(controllerDirectives,
                                function (directive) {
                                    var controllerInstance, locals = {
                                    $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                                    $element: $element,
                                    $attrs: attrs,
                                    $transclude: transcludeFn
                                };
                                    controller = directive.controller,
                                    "@" == controller && (controller = attrs[directive.name]),
                                    controllerInstance = $controller(controller, locals),
                                    elementControllers[directive.name] = controllerInstance,
                                    hasElementTranscludeDirective || $element.data("$" + directive.name + "Controller", controllerInstance),
                                    directive.controllerAs && (locals.$scope[directive.controllerAs] = controllerInstance)
                                }), i = 0, ii = preLinkFns.length; ii > i; i++) try {
                                    linkFn = preLinkFns[i],
                                    linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn)
                                } catch (e) {
                                    $exceptionHandler(e, startingTag($element))
                                }
                                var scopeToChild = scope;
                                for (newIsolateScopeDirective && (newIsolateScopeDirective.template || null === newIsolateScopeDirective.templateUrl) && (scopeToChild = isolateScope), childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn), i = postLinkFns.length - 1; i >= 0; i--) try {
                                    linkFn = postLinkFns[i],
                                    linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn)
                                } catch (e) {
                                    $exceptionHandler(e, startingTag($element))
                                }
                            }
                            previousCompileContext = previousCompileContext || {};
                            for (var newScopeDirective, directive, directiveName, $template, linkFn, directiveValue, terminalPriority = -Number.MAX_VALUE,
                            controllerDirectives = previousCompileContext.controllerDirectives,
                            newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective,
                            templateDirective = previousCompileContext.templateDirective,
                            nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective,
                            hasTranscludeDirective = !1,
                            hasTemplate = !1,
                            hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective,
                            $compileNode = templateAttrs.$$element = jqLite(compileNode), replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, i = 0, ii = directives.length; ii > i; i++) {
                                directive = directives[i];
                                var attrStart = directive.$$start,
                                attrEnd = directive.$$end;
                                if (attrStart && ($compileNode = groupScan(compileNode, attrStart, attrEnd)), $template = undefined, terminalPriority > directive.priority) break;
                                if ((directiveValue = directive.scope) && (newScopeDirective = newScopeDirective || directive, directive.templateUrl || (assertNoDuplicate("new/isolated scope", newIsolateScopeDirective, directive, $compileNode), isObject(directiveValue) && (newIsolateScopeDirective = directive))), directiveName = directive.name, !directive.templateUrl && directive.controller && (directiveValue = directive.controller, controllerDirectives = controllerDirectives || {},
                                assertNoDuplicate("'" + directiveName + "' controller", controllerDirectives[directiveName], directive, $compileNode), controllerDirectives[directiveName] = directive), (directiveValue = directive.transclude) && (hasTranscludeDirective = !0, directive.$$tlb || (assertNoDuplicate("transclusion", nonTlbTranscludeDirective, directive, $compileNode), nonTlbTranscludeDirective = directive), "element" == directiveValue ? (hasElementTranscludeDirective = !0, terminalPriority = directive.priority, $template = $compileNode, $compileNode = templateAttrs.$$element = jqLite(document.createComment(" " + directiveName + ": " + templateAttrs[directiveName] + " ")), compileNode = $compileNode[0], replaceWith(jqCollection, sliceArgs($template), compileNode), childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, {
                                    nonTlbTranscludeDirective: nonTlbTranscludeDirective
                                })) : ($template = jqLite(jqLiteClone(compileNode)).contents(), $compileNode.empty(), childTranscludeFn = compile($template, transcludeFn))), directive.template) if (hasTemplate = !0, assertNoDuplicate("template", templateDirective, directive, $compileNode), templateDirective = directive, directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template, directiveValue = denormalizeTemplate(directiveValue), directive.replace) {
                                    if (replaceDirective = directive, $template = jqLiteIsTextNode(directiveValue) ? [] : jqLite(trim(directiveValue)), compileNode = $template[0], 1 != $template.length || 1 !== compileNode.nodeType) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", directiveName, "");
                                    replaceWith(jqCollection, $compileNode, compileNode);
                                    var newTemplateAttrs = {
                                        $attr: {}
                                    },
                                    templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs),
                                    unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                                    newIsolateScopeDirective && markDirectivesAsIsolate(templateDirectives),
                                    directives = directives.concat(templateDirectives).concat(unprocessedDirectives),
                                    mergeTemplateAttributes(templateAttrs, newTemplateAttrs),
                                    ii = directives.length
                                } else $compileNode.html(directiveValue);
                                if (directive.templateUrl) hasTemplate = !0,
                                assertNoDuplicate("template", templateDirective, directive, $compileNode),
                                templateDirective = directive,
                                directive.replace && (replaceDirective = directive),
                                nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                                    controllerDirectives: controllerDirectives,
                                    newIsolateScopeDirective: newIsolateScopeDirective,
                                    templateDirective: templateDirective,
                                    nonTlbTranscludeDirective: nonTlbTranscludeDirective
                                }),
                                ii = directives.length;
                                else if (directive.compile) try {
                                    linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn),
                                    isFunction(linkFn) ? addLinkFns(null, linkFn, attrStart, attrEnd) : linkFn && addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd)
                                } catch (e) {
                                    $exceptionHandler(e, startingTag($compileNode))
                                }
                                directive.terminal && (nodeLinkFn.terminal = !0, terminalPriority = Math.max(terminalPriority, directive.priority))
                            }
                            return nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === !0,
                            nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective,
                            nodeLinkFn.templateOnThisElement = hasTemplate,
                            nodeLinkFn.transclude = childTranscludeFn,
                            previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective,
                            nodeLinkFn
                        }
                        function markDirectivesAsIsolate(directives) {
                            for (var j = 0,
                            jj = directives.length; jj > j; j++) directives[j] = inherit(directives[j], {
                                $$isolateScope: !0
                            })
                        }
                        function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
                            if (name === ignoreDirective) return null;
                            var match = null;
                            if (hasDirectives.hasOwnProperty(name)) for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; ii > i; i++) try {
                                directive = directives[i],
                                (maxPriority === undefined || maxPriority > directive.priority) && -1 != directive.restrict.indexOf(location) && (startAttrName && (directive = inherit(directive, {
                                    $$start: startAttrName,
                                    $$end: endAttrName
                                })), tDirectives.push(directive), match = directive)
                            } catch (e) {
                                $exceptionHandler(e)
                            }
                            return match
                        }
                        function mergeTemplateAttributes(dst, src) {
                            var srcAttr = src.$attr,
                            dstAttr = dst.$attr,
                            $element = dst.$$element;
                            forEach(dst,
                            function (value, key) {
                                "$" != key.charAt(0) && (src[key] && src[key] !== value && (value += ("style" === key ? ";" : " ") + src[key]), dst.$set(key, value, !0, srcAttr[key]))
                            }),
                            forEach(src,
                            function (value, key) {
                                "class" == key ? (safeAddClass($element, value), dst["class"] = (dst["class"] ? dst["class"] + " " : "") + value) : "style" == key ? ($element.attr("style", $element.attr("style") + ";" + value), dst.style = (dst.style ? dst.style + ";" : "") + value) : "$" == key.charAt(0) || dst.hasOwnProperty(key) || (dst[key] = value, dstAttr[key] = srcAttr[key])
                            })
                        }
                        function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
                            var afterTemplateNodeLinkFn, afterTemplateChildLinkFn, linkQueue = [],
                            beforeTemplateCompileNode = $compileNode[0],
                            origAsyncDirective = directives.shift(),
                            derivedSyncDirective = extend({},
                            origAsyncDirective, {
                                templateUrl: null,
                                transclude: null,
                                replace: null,
                                $$originalDirective: origAsyncDirective
                            }),
                            templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl;
                            return $compileNode.empty(),
                            $http.get($sce.getTrustedResourceUrl(templateUrl), {
                                cache: $templateCache
                            }).success(function (content) {
                                var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
                                if (content = denormalizeTemplate(content), origAsyncDirective.replace) {
                                    if ($template = jqLiteIsTextNode(content) ? [] : jqLite(trim(content)), compileNode = $template[0], 1 != $template.length || 1 !== compileNode.nodeType) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
                                    tempTemplateAttrs = {
                                        $attr: {}
                                    },
                                    replaceWith($rootElement, $compileNode, compileNode);
                                    var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
                                    isObject(origAsyncDirective.scope) && markDirectivesAsIsolate(templateDirectives),
                                    directives = templateDirectives.concat(directives),
                                    mergeTemplateAttributes(tAttrs, tempTemplateAttrs)
                                } else compileNode = beforeTemplateCompileNode,
                                $compileNode.html(content);
                                for (directives.unshift(derivedSyncDirective), afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext), forEach($rootElement,
                                function (node, i) {
                                    node == compileNode && ($rootElement[i] = $compileNode[0])
                                }), afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn) ; linkQueue.length;) {
                                    var scope = linkQueue.shift(),
                                    beforeTemplateLinkNode = linkQueue.shift(),
                                    linkRootElement = linkQueue.shift(),
                                    boundTranscludeFn = linkQueue.shift(),
                                    linkNode = $compileNode[0];
                                    if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                                        var oldClasses = beforeTemplateLinkNode.className;
                                        previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace || (linkNode = jqLiteClone(compileNode)),
                                        replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode),
                                        safeAddClass(jqLite(linkNode), oldClasses)
                                    }
                                    childBoundTranscludeFn = afterTemplateNodeLinkFn.transcludeOnThisElement ? createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn) : boundTranscludeFn,
                                    afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn)
                                }
                                linkQueue = null
                            }).error(function (response, code, headers, config) {
                                throw $compileMinErr("tpload", "Failed to load template: {0}", config.url)
                            }),
                            function (ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
                                var childBoundTranscludeFn = boundTranscludeFn;
                                linkQueue ? (linkQueue.push(scope), linkQueue.push(node), linkQueue.push(rootElement), linkQueue.push(childBoundTranscludeFn)) : (afterTemplateNodeLinkFn.transcludeOnThisElement && (childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn)), afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn))
                            }
                        }
                        function byPriority(a, b) {
                            var diff = b.priority - a.priority;
                            return 0 !== diff ? diff : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index
                        }
                        function assertNoDuplicate(what, previousDirective, directive, element) {
                            if (previousDirective) throw $compileMinErr("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", previousDirective.name, directive.name, what, startingTag(element))
                        }
                        function addTextInterpolateDirective(directives, text) {
                            var interpolateFn = $interpolate(text, !0);
                            interpolateFn && directives.push({
                                priority: 0,
                                compile: function (templateNode) {
                                    var parent = templateNode.parent(),
                                    hasCompileParent = parent.length;
                                    return hasCompileParent && safeAddClass(templateNode.parent(), "ng-binding"),
                                    function (scope, node) {
                                        var parent = node.parent(),
                                        bindings = parent.data("$binding") || [];
                                        bindings.push(interpolateFn),
                                        parent.data("$binding", bindings),
                                        hasCompileParent || safeAddClass(parent, "ng-binding"),
                                        scope.$watch(interpolateFn,
                                        function (value) {
                                            node[0].nodeValue = value
                                        })
                                    }
                                }
                            })
                        }
                        function getTrustedContext(node, attrNormalizedName) {
                            if ("srcdoc" == attrNormalizedName) return $sce.HTML;
                            var tag = nodeName_(node);
                            return "xlinkHref" == attrNormalizedName || "FORM" == tag && "action" == attrNormalizedName || "IMG" != tag && ("src" == attrNormalizedName || "ngSrc" == attrNormalizedName) ? $sce.RESOURCE_URL : void 0
                        }
                        function addAttrInterpolateDirective(node, directives, value, name) {
                            var interpolateFn = $interpolate(value, !0);
                            if (interpolateFn) {
                                if ("multiple" === name && "SELECT" === nodeName_(node)) throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node));
                                directives.push({
                                    priority: 100,
                                    compile: function () {
                                        return {
                                            pre: function (scope, element, attr) {
                                                var $$observers = attr.$$observers || (attr.$$observers = {});
                                                if (EVENT_HANDLER_ATTR_REGEXP.test(name)) throw $compileMinErr("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                                interpolateFn = $interpolate(attr[name], !0, getTrustedContext(node, name)),
                                                interpolateFn && (attr[name] = interpolateFn(scope), ($$observers[name] || ($$observers[name] = [])).$$inter = !0, (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn,
                                                function (newValue, oldValue) {
                                                    "class" === name && newValue != oldValue ? attr.$updateClass(newValue, oldValue) : attr.$set(name, newValue)
                                                }))
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        function replaceWith($rootElement, elementsToRemove, newNode) {
                            var i, ii, firstElementToRemove = elementsToRemove[0],
                            removeCount = elementsToRemove.length,
                            parent = firstElementToRemove.parentNode;
                            if ($rootElement) for (i = 0, ii = $rootElement.length; ii > i; i++) if ($rootElement[i] == firstElementToRemove) {
                                $rootElement[i++] = newNode;
                                for (var j = i,
                                j2 = j + removeCount - 1,
                                jj = $rootElement.length; jj > j; j++, j2++) jj > j2 ? $rootElement[j] = $rootElement[j2] : delete $rootElement[j];
                                $rootElement.length -= removeCount - 1;
                                break
                            }
                            parent && parent.replaceChild(newNode, firstElementToRemove);
                            var fragment = document.createDocumentFragment();
                            fragment.appendChild(firstElementToRemove),
                            newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
                            for (var k = 1,
                            kk = elementsToRemove.length; kk > k; k++) {
                                var element = elementsToRemove[k];
                                jqLite(element).remove(),
                                fragment.appendChild(element),
                                delete elementsToRemove[k]
                            }
                            elementsToRemove[0] = newNode,
                            elementsToRemove.length = 1
                        }
                        function cloneAndAnnotateFn(fn, annotation) {
                            return extend(function () {
                                return fn.apply(null, arguments)
                            },
                            fn, annotation)
                        }
                        var Attributes = function (element, attr) {
                            this.$$element = element,
                            this.$attr = attr || {}
                        };
                        Attributes.prototype = {
                            $normalize: directiveNormalize,
                            $addClass: function (classVal) {
                                classVal && classVal.length > 0 && $animate.addClass(this.$$element, classVal)
                            },
                            $removeClass: function (classVal) {
                                classVal && classVal.length > 0 && $animate.removeClass(this.$$element, classVal)
                            },
                            $updateClass: function (newClasses, oldClasses) {
                                var toAdd = tokenDifference(newClasses, oldClasses),
                                toRemove = tokenDifference(oldClasses, newClasses);
                                0 === toAdd.length ? $animate.removeClass(this.$$element, toRemove) : 0 === toRemove.length ? $animate.addClass(this.$$element, toAdd) : $animate.setClass(this.$$element, toAdd, toRemove)
                            },
                            $set: function (key, value, writeAttr, attrName) {
                                var nodeName, booleanKey = getBooleanAttrName(this.$$element[0], key);
                                booleanKey && (this.$$element.prop(key, value), attrName = booleanKey),
                                this[key] = value,
                                attrName ? this.$attr[key] = attrName : (attrName = this.$attr[key], attrName || (this.$attr[key] = attrName = snake_case(key, "-"))),
                                nodeName = nodeName_(this.$$element),
                                ("A" === nodeName && "href" === key || "IMG" === nodeName && "src" === key) && (this[key] = value = $$sanitizeUri(value, "src" === key)),
                                writeAttr !== !1 && (null === value || value === undefined ? this.$$element.removeAttr(attrName) : this.$$element.attr(attrName, value));
                                var $$observers = this.$$observers;
                                $$observers && forEach($$observers[key],
                                function (fn) {
                                    try {
                                        fn(value)
                                    } catch (e) {
                                        $exceptionHandler(e)
                                    }
                                })
                            },
                            $observe: function (key, fn) {
                                var attrs = this,
                                $$observers = attrs.$$observers || (attrs.$$observers = {}),
                                listeners = $$observers[key] || ($$observers[key] = []);
                                return listeners.push(fn),
                                $rootScope.$evalAsync(function () {
                                    listeners.$$inter || fn(attrs[key])
                                }),
                                fn
                            }
                        };
                        var startSymbol = $interpolate.startSymbol(),
                        endSymbol = $interpolate.endSymbol(),
                        denormalizeTemplate = "{{" == startSymbol || "}}" == endSymbol ? identity : function (template) {
                            return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol)
                        },
                        NG_ATTR_BINDING = /^ngAttr[A-Z]/;
                        return compile
                    }]
                }
                function directiveNormalize(name) {
                    return camelCase(name.replace(PREFIX_REGEXP, ""))
                }
                function tokenDifference(str1, str2) {
                    var values = "",
                    tokens1 = str1.split(/\s+/),
                    tokens2 = str2.split(/\s+/);
                    outer: for (var i = 0; i < tokens1.length; i++) {
                        for (var token = tokens1[i], j = 0; j < tokens2.length; j++) if (token == tokens2[j]) continue outer;
                        values += (values.length > 0 ? " " : "") + token
                    }
                    return values
                }
                function $ControllerProvider() {
                    var controllers = {},
                    CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
                    this.register = function (name, constructor) {
                        assertNotHasOwnProperty(name, "controller"),
                        isObject(name) ? extend(controllers, name) : controllers[name] = constructor
                    },
                    this.$get = ["$injector", "$window",
                    function ($injector, $window) {
                        return function (expression, locals) {
                            var instance, match, constructor, identifier;
                            if (isString(expression) && (match = expression.match(CNTRL_REG), constructor = match[1], identifier = match[3], expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, !0) || getter($window, constructor, !0), assertArgFn(expression, constructor, !0)), instance = $injector.instantiate(expression, locals), identifier) {
                                if (!locals || "object" != typeof locals.$scope) throw minErr("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", constructor || expression.name, identifier);
                                locals.$scope[identifier] = instance
                            }
                            return instance
                        }
                    }]
                }
                function $DocumentProvider() {
                    this.$get = ["$window",
                    function (window) {
                        return jqLite(window.document)
                    }]
                }
                function $ExceptionHandlerProvider() {
                    this.$get = ["$log",
                    function ($log) {
                        return function () {
                            $log.error.apply($log, arguments)
                        }
                    }]
                }
                function parseHeaders(headers) {
                    var key, val, i, parsed = {};
                    return headers ? (forEach(headers.split("\n"),
                    function (line) {
                        i = line.indexOf(":"),
                        key = lowercase(trim(line.substr(0, i))),
                        val = trim(line.substr(i + 1)),
                        key && (parsed[key] = parsed[key] ? parsed[key] + ", " + val : val)
                    }), parsed) : parsed
                }
                function headersGetter(headers) {
                    var headersObj = isObject(headers) ? headers : undefined;
                    return function (name) {
                        return headersObj || (headersObj = parseHeaders(headers)),
                        name ? headersObj[lowercase(name)] || null : headersObj
                    }
                }
                function transformData(data, headers, fns) {
                    return isFunction(fns) ? fns(data, headers) : (forEach(fns,
                    function (fn) {
                        data = fn(data, headers)
                    }), data)
                }
                function isSuccess(status) {
                    return status >= 200 && 300 > status
                }
                function $HttpProvider() {
                    var JSON_START = /^\s*(\[|\{[^\{])/,
                    JSON_END = /[\}\]]\s*$/,
                    PROTECTION_PREFIX = /^\)\]\}',?\n/,
                    CONTENT_TYPE_APPLICATION_JSON = {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    defaults = this.defaults = {
                        transformResponse: [function (data) {
                            return isString(data) && (data = data.replace(PROTECTION_PREFIX, ""), JSON_START.test(data) && JSON_END.test(data) && (data = fromJson(data))),
                            data
                        }],
                        transformRequest: [function (d) {
                            return !isObject(d) || isFile(d) || isBlob(d) ? d : toJson(d)
                        }],
                        headers: {
                            common: {
                                Accept: "application/json, text/plain, */*"
                            },
                            post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
                            put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
                            patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
                        },
                        xsrfCookieName: "XSRF-TOKEN",
                        xsrfHeaderName: "X-XSRF-TOKEN"
                    },
                    interceptorFactories = this.interceptors = [],
                    responseInterceptorFactories = this.responseInterceptors = [];
                    this.$get = ["$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector",
                    function ($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
                        function $http(requestConfig) {
                            function transformResponse(response) {
                                var resp = extend({},
                                response, {
                                    data: transformData(response.data, response.headers, config.transformResponse)
                                });
                                return isSuccess(response.status) ? resp : $q.reject(resp)
                            }
                            function mergeHeaders(config) {
                                function execHeaders(headers) {
                                    var headerContent;
                                    forEach(headers,
                                    function (headerFn, header) {
                                        isFunction(headerFn) && (headerContent = headerFn(), null != headerContent ? headers[header] = headerContent : delete headers[header])
                                    })
                                }
                                var defHeaderName, lowercaseDefHeaderName, reqHeaderName, defHeaders = defaults.headers,
                                reqHeaders = extend({},
                                config.headers);
                                defHeaders = extend({},
                                defHeaders.common, defHeaders[lowercase(config.method)]);
                                defaultHeadersIteration: for (defHeaderName in defHeaders) {
                                    lowercaseDefHeaderName = lowercase(defHeaderName);
                                    for (reqHeaderName in reqHeaders) if (lowercase(reqHeaderName) === lowercaseDefHeaderName) continue defaultHeadersIteration;
                                    reqHeaders[defHeaderName] = defHeaders[defHeaderName]
                                }
                                return execHeaders(reqHeaders),
                                reqHeaders
                            }
                            var config = {
                                method: "get",
                                transformRequest: defaults.transformRequest,
                                transformResponse: defaults.transformResponse
                            },
                            headers = mergeHeaders(requestConfig);
                            extend(config, requestConfig),
                            config.headers = headers,
                            config.method = uppercase(config.method);
                            var serverRequest = function (config) {
                                headers = config.headers;
                                var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);
                                return isUndefined(reqData) && forEach(headers,
                                function (value, header) {
                                    "content-type" === lowercase(header) && delete headers[header]
                                }),
                                isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials) && (config.withCredentials = defaults.withCredentials),
                                sendReq(config, reqData, headers).then(transformResponse, transformResponse)
                            },
                            chain = [serverRequest, undefined],
                            promise = $q.when(config);
                            for (forEach(reversedInterceptors,
                            function (interceptor) {
                            (interceptor.request || interceptor.requestError) && chain.unshift(interceptor.request, interceptor.requestError),
                                (interceptor.response || interceptor.responseError) && chain.push(interceptor.response, interceptor.responseError)
                            }) ; chain.length;) {
                                var thenFn = chain.shift(),
                                rejectFn = chain.shift();
                                promise = promise.then(thenFn, rejectFn)
                            }
                            return promise.success = function (fn) {
                                return promise.then(function (response) {
                                    fn(response.data, response.status, response.headers, config)
                                }),
                                promise
                            },
                            promise.error = function (fn) {
                                return promise.then(null,
                                function (response) {
                                    fn(response.data, response.status, response.headers, config)
                                }),
                                promise
                            },
                            promise
                        }
                        function createShortMethods() {
                            forEach(arguments,
                            function (name) {
                                $http[name] = function (url, config) {
                                    return $http(extend(config || {},
                                    {
                                        method: name,
                                        url: url
                                    }))
                                }
                            })
                        }
                        function createShortMethodsWithData() {
                            forEach(arguments,
                            function (name) {
                                $http[name] = function (url, data, config) {
                                    return $http(extend(config || {},
                                    {
                                        method: name,
                                        url: url,
                                        data: data
                                    }))
                                }
                            })
                        }
                        function sendReq(config, reqData, reqHeaders) {
                            function done(status, response, headersString, statusText) {
                                cache && (isSuccess(status) ? cache.put(url, [status, response, parseHeaders(headersString), statusText]) : cache.remove(url)),
                                resolvePromise(response, status, headersString, statusText),
                                $rootScope.$$phase || $rootScope.$apply()
                            }
                            function resolvePromise(response, status, headers, statusText) {
                                status = Math.max(status, 0),
                                (isSuccess(status) ? deferred.resolve : deferred.reject)({
                                    data: response,
                                    status: status,
                                    headers: headersGetter(headers),
                                    config: config,
                                    statusText: statusText
                                })
                            }
                            function removePendingReq() {
                                var idx = indexOf($http.pendingRequests, config); -1 !== idx && $http.pendingRequests.splice(idx, 1)
                            }
                            var cache, cachedResp, deferred = $q.defer(),
                            promise = deferred.promise,
                            url = buildUrl(config.url, config.params);
                            if ($http.pendingRequests.push(config), promise.then(removePendingReq, removePendingReq), !config.cache && !defaults.cache || config.cache === !1 || "GET" !== config.method && "JSONP" !== config.method || (cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache), cache) if (cachedResp = cache.get(url), isDefined(cachedResp)) {
                                if (isPromiseLike(cachedResp)) return cachedResp.then(removePendingReq, removePendingReq),
                                cachedResp;
                                isArray(cachedResp) ? resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]) : resolvePromise(cachedResp, 200, {},
                                "OK")
                            } else cache.put(url, promise);
                            if (isUndefined(cachedResp)) {
                                var xsrfValue = urlIsSameOrigin(config.url) ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
                                xsrfValue && (reqHeaders[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue),
                                $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType)
                            }
                            return promise
                        }
                        function buildUrl(url, params) {
                            if (!params) return url;
                            var parts = [];
                            return forEachSorted(params,
                            function (value, key) {
                                null === value || isUndefined(value) || (isArray(value) || (value = [value]), forEach(value,
                                function (v) {
                                    isObject(v) && (v = isDate(v) ? v.toISOString() : toJson(v)),
                                    parts.push(encodeUriQuery(key) + "=" + encodeUriQuery(v))
                                }))
                            }),
                            parts.length > 0 && (url += (-1 == url.indexOf("?") ? "?" : "&") + parts.join("&")),
                            url
                        }
                        var defaultCache = $cacheFactory("$http"),
                        reversedInterceptors = [];
                        return forEach(interceptorFactories,
                        function (interceptorFactory) {
                            reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory))
                        }),
                        forEach(responseInterceptorFactories,
                        function (interceptorFactory, index) {
                            var responseFn = isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory);
                            reversedInterceptors.splice(index, 0, {
                                response: function (response) {
                                    return responseFn($q.when(response))
                                },
                                responseError: function (response) {
                                    return responseFn($q.reject(response))
                                }
                            })
                        }),
                        $http.pendingRequests = [],
                        createShortMethods("get", "delete", "head", "jsonp"),
                        createShortMethodsWithData("post", "put", "patch"),
                        $http.defaults = defaults,
                        $http
                    }]
                }
                function createXhr(method) {
                    if (8 >= msie && (!method.match(/^(get|post|head|put|delete|options)$/i) || !window.XMLHttpRequest)) return new window.ActiveXObject("Microsoft.XMLHTTP");
                    if (window.XMLHttpRequest) return new window.XMLHttpRequest;
                    throw minErr("$httpBackend")("noxhr", "This browser does not support XMLHttpRequest.")
                }
                function $HttpBackendProvider() {
                    this.$get = ["$browser", "$window", "$document",
                    function ($browser, $window, $document) {
                        return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0])
                    }]
                }
                function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
                    function jsonpReq(url, callbackId, done) {
                        var script = rawDocument.createElement("script"),
                        callback = null;
                        return script.type = "text/javascript",
                        script.src = url,
                        script.async = !0,
                        callback = function (event) {
                            removeEventListenerFn(script, "load", callback),
                            removeEventListenerFn(script, "error", callback),
                            rawDocument.body.removeChild(script),
                            script = null;
                            var status = -1,
                            text = "unknown";
                            event && ("load" !== event.type || callbacks[callbackId].called || (event = {
                                type: "error"
                            }), text = event.type, status = "error" === event.type ? 404 : 200),
                            done && done(status, text)
                        },
                        addEventListenerFn(script, "load", callback),
                        addEventListenerFn(script, "error", callback),
                        8 >= msie && (script.onreadystatechange = function () {
                            isString(script.readyState) && /loaded|complete/.test(script.readyState) && (script.onreadystatechange = null, callback({
                                type: "load"
                            }))
                        }),
                        rawDocument.body.appendChild(script),
                        callback
                    }
                    var ABORTED = -1;
                    return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
                        function timeoutRequest() {
                            status = ABORTED,
                            jsonpDone && jsonpDone(),
                            xhr && xhr.abort()
                        }
                        function completeRequest(callback, status, response, headersString, statusText) {
                            timeoutId && $browserDefer.cancel(timeoutId),
                            jsonpDone = xhr = null,
                            0 === status && (status = response ? 200 : "file" == urlResolve(url).protocol ? 404 : 0),
                            status = 1223 === status ? 204 : status,
                            statusText = statusText || "",
                            callback(status, response, headersString, statusText),
                            $browser.$$completeOutstandingRequest(noop)
                        }
                        var status;
                        if ($browser.$$incOutstandingRequestCount(), url = url || $browser.url(), "jsonp" == lowercase(method)) {
                            var callbackId = "_" + (callbacks.counter++).toString(36);
                            callbacks[callbackId] = function (data) {
                                callbacks[callbackId].data = data,
                                callbacks[callbackId].called = !0
                            };
                            var jsonpDone = jsonpReq(url.replace("JSON_CALLBACK", "angular.callbacks." + callbackId), callbackId,
                            function (status, text) {
                                completeRequest(callback, status, callbacks[callbackId].data, "", text),
                                callbacks[callbackId] = noop
                            })
                        } else {
                            var xhr = createXhr(method);
                            if (xhr.open(method, url, !0), forEach(headers,
                            function (value, key) {
                                isDefined(value) && xhr.setRequestHeader(key, value)
                            }), xhr.onreadystatechange = function () {
                                if (xhr && 4 == xhr.readyState) {
                                    var responseHeaders = null,
                                    response = null,
                                    statusText = "";
                                    status !== ABORTED && (responseHeaders = xhr.getAllResponseHeaders(), response = "response" in xhr ? xhr.response : xhr.responseText),
                                    status === ABORTED && 10 > msie || (statusText = xhr.statusText),
                                    completeRequest(callback, status || xhr.status, response, responseHeaders, statusText)
                            }
                            },
                            withCredentials && (xhr.withCredentials = !0), responseType) try {
                                xhr.responseType = responseType
                            } catch (e) {
                                if ("json" !== responseType) throw e
                            }
                            xhr.send(post || null)
                        }
                        if (timeout > 0) var timeoutId = $browserDefer(timeoutRequest, timeout);
                        else isPromiseLike(timeout) && timeout.then(timeoutRequest)
                    }
                }
                function $InterpolateProvider() {
                    var startSymbol = "{{",
                    endSymbol = "}}";
                    this.startSymbol = function (value) {
                        return value ? (startSymbol = value, this) : startSymbol
                    },
                    this.endSymbol = function (value) {
                        return value ? (endSymbol = value, this) : endSymbol
                    },
                    this.$get = ["$parse", "$exceptionHandler", "$sce",
                    function ($parse, $exceptionHandler, $sce) {
                        function $interpolate(text, mustHaveExpression, trustedContext) {
                            for (var startIndex, endIndex, fn, exp, index = 0,
                            parts = [], length = text.length, hasInterpolation = !1, concat = []; length > index;) -1 != (startIndex = text.indexOf(startSymbol, index)) && -1 != (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) ? (index != startIndex && parts.push(text.substring(index, startIndex)), parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex))), fn.exp = exp, index = endIndex + endSymbolLength, hasInterpolation = !0) : (index != length && parts.push(text.substring(index)), index = length);
                            if ((length = parts.length) || (parts.push(""), length = 1), trustedContext && parts.length > 1) throw $interpolateMinErr("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", text);
                            return !mustHaveExpression || hasInterpolation ? (concat.length = length, fn = function (context) {
                                try {
                                    for (var part, i = 0,
                                    ii = length; ii > i; i++) {
                                        if ("function" == typeof (part = parts[i])) if (part = part(context), part = trustedContext ? $sce.getTrusted(trustedContext, part) : $sce.valueOf(part), null == part) part = "";
                                        else switch (typeof part) {
                                            case "string":
                                                break;
                                            case "number":
                                                part = "" + part;
                                                break;
                                            default:
                                                part = toJson(part)
                                        }
                                        concat[i] = part
                                    }
                                    return concat.join("")
                                } catch (err) {
                                    var newErr = $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
                                    $exceptionHandler(newErr)
                                }
                            },
                            fn.exp = text, fn.parts = parts, fn) : void 0
                        }
                        var startSymbolLength = startSymbol.length,
                        endSymbolLength = endSymbol.length;
                        return $interpolate.startSymbol = function () {
                            return startSymbol
                        },
                        $interpolate.endSymbol = function () {
                            return endSymbol
                        },
                        $interpolate
                    }]
                }
                function $IntervalProvider() {
                    this.$get = ["$rootScope", "$window", "$q",
                    function ($rootScope, $window, $q) {
                        function interval(fn, delay, count, invokeApply) {
                            var setInterval = $window.setInterval,
                            clearInterval = $window.clearInterval,
                            deferred = $q.defer(),
                            promise = deferred.promise,
                            iteration = 0,
                            skipApply = isDefined(invokeApply) && !invokeApply;
                            return count = isDefined(count) ? count : 0,
                            promise.then(null, null, fn),
                            promise.$$intervalId = setInterval(function () {
                                deferred.notify(iteration++),
                                count > 0 && iteration >= count && (deferred.resolve(iteration), clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId]),
                                skipApply || $rootScope.$apply()
                            },
                            delay),
                            intervals[promise.$$intervalId] = deferred,
                            promise
                        }
                        var intervals = {};
                        return interval.cancel = function (promise) {
                            return promise && promise.$$intervalId in intervals ? (intervals[promise.$$intervalId].reject("canceled"), $window.clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId], !0) : !1
                        },
                        interval
                    }]
                }
                function $LocaleProvider() {
                    this.$get = function () {
                        return {
                            id: "en-us",
                            NUMBER_FORMATS: {
                                DECIMAL_SEP: ".",
                                GROUP_SEP: ",",
                                PATTERNS: [{
                                    minInt: 1,
                                    minFrac: 0,
                                    maxFrac: 3,
                                    posPre: "",
                                    posSuf: "",
                                    negPre: "-",
                                    negSuf: "",
                                    gSize: 3,
                                    lgSize: 3
                                },
                                {
                                    minInt: 1,
                                    minFrac: 2,
                                    maxFrac: 2,
                                    posPre: "¤",
                                    posSuf: "",
                                    negPre: "(¤",
                                    negSuf: ")",
                                    gSize: 3,
                                    lgSize: 3
                                }],
                                CURRENCY_SYM: "$"
                            },
                            DATETIME_FORMATS: {
                                MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                                SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                                DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                                SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                                AMPMS: ["AM", "PM"],
                                medium: "MMM d, y h:mm:ss a",
                                "short": "M/d/yy h:mm a",
                                fullDate: "EEEE, MMMM d, y",
                                longDate: "MMMM d, y",
                                mediumDate: "MMM d, y",
                                shortDate: "M/d/yy",
                                mediumTime: "h:mm:ss a",
                                shortTime: "h:mm a"
                            },
                            pluralCat: function (num) {
                                return 1 === num ? "one" : "other"
                            }
                        }
                    }
                }
                function encodePath(path) {
                    for (var segments = path.split("/"), i = segments.length; i--;) segments[i] = encodeUriSegment(segments[i]);
                    return segments.join("/")
                }
                function parseAbsoluteUrl(absoluteUrl, locationObj, appBase) {
                    var parsedUrl = urlResolve(absoluteUrl, appBase);
                    locationObj.$$protocol = parsedUrl.protocol,
                    locationObj.$$host = parsedUrl.hostname,
                    locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null
                }
                function parseAppUrl(relativeUrl, locationObj, appBase) {
                    var prefixed = "/" !== relativeUrl.charAt(0);
                    prefixed && (relativeUrl = "/" + relativeUrl);
                    var match = urlResolve(relativeUrl, appBase);
                    locationObj.$$path = decodeURIComponent(prefixed && "/" === match.pathname.charAt(0) ? match.pathname.substring(1) : match.pathname),
                    locationObj.$$search = parseKeyValue(match.search),
                    locationObj.$$hash = decodeURIComponent(match.hash),
                    locationObj.$$path && "/" != locationObj.$$path.charAt(0) && (locationObj.$$path = "/" + locationObj.$$path)
                }
                function beginsWith(begin, whole) {
                    return 0 === whole.indexOf(begin) ? whole.substr(begin.length) : void 0
                }
                function stripHash(url) {
                    var index = url.indexOf("#");
                    return -1 == index ? url : url.substr(0, index)
                }
                function stripFile(url) {
                    return url.substr(0, stripHash(url).lastIndexOf("/") + 1)
                }
                function serverBase(url) {
                    return url.substring(0, url.indexOf("/", url.indexOf("//") + 2))
                }
                function LocationHtml5Url(appBase, basePrefix) {
                    this.$$html5 = !0,
                    basePrefix = basePrefix || "";
                    var appBaseNoFile = stripFile(appBase);
                    parseAbsoluteUrl(appBase, this, appBase),
                    this.$$parse = function (url) {
                        var pathUrl = beginsWith(appBaseNoFile, url);
                        if (!isString(pathUrl)) throw $locationMinErr("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
                        parseAppUrl(pathUrl, this, appBase),
                        this.$$path || (this.$$path = "/"),
                        this.$$compose()
                    },
                    this.$$compose = function () {
                        var search = toKeyValue(this.$$search),
                        hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
                        this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash,
                        this.$$absUrl = appBaseNoFile + this.$$url.substr(1)
                    },
                    this.$$parseLinkUrl = function (url) {
                        var appUrl, prevAppUrl, rewrittenUrl;
                        return (appUrl = beginsWith(appBase, url)) !== undefined ? (prevAppUrl = appUrl, rewrittenUrl = (appUrl = beginsWith(basePrefix, appUrl)) !== undefined ? appBaseNoFile + (beginsWith("/", appUrl) || appUrl) : appBase + prevAppUrl) : (appUrl = beginsWith(appBaseNoFile, url)) !== undefined ? rewrittenUrl = appBaseNoFile + appUrl : appBaseNoFile == url + "/" && (rewrittenUrl = appBaseNoFile),
                        rewrittenUrl && this.$$parse(rewrittenUrl),
                        !!rewrittenUrl
                    }
                }
                function LocationHashbangUrl(appBase, hashPrefix) {
                    var appBaseNoFile = stripFile(appBase);
                    parseAbsoluteUrl(appBase, this, appBase),
                    this.$$parse = function (url) {
                        function removeWindowsDriveName(path, url, base) {
                            var firstPathSegmentMatch, windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
                            return 0 === url.indexOf(base) && (url = url.replace(base, "")),
                            windowsFilePathExp.exec(url) ? path : (firstPathSegmentMatch = windowsFilePathExp.exec(path), firstPathSegmentMatch ? firstPathSegmentMatch[1] : path)
                        }
                        var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url),
                        withoutHashUrl = "#" == withoutBaseUrl.charAt(0) ? beginsWith(hashPrefix, withoutBaseUrl) : this.$$html5 ? withoutBaseUrl : "";
                        if (!isString(withoutHashUrl)) throw $locationMinErr("ihshprfx", 'Invalid url "{0}", missing hash prefix "{1}".', url, hashPrefix);
                        parseAppUrl(withoutHashUrl, this, appBase),
                        this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase),
                        this.$$compose()
                    },
                    this.$$compose = function () {
                        var search = toKeyValue(this.$$search),
                        hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
                        this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash,
                        this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : "")
                    },
                    this.$$parseLinkUrl = function (url) {
                        return stripHash(appBase) == stripHash(url) ? (this.$$parse(url), !0) : !1
                    }
                }
                function LocationHashbangInHtml5Url(appBase, hashPrefix) {
                    this.$$html5 = !0,
                    LocationHashbangUrl.apply(this, arguments);
                    var appBaseNoFile = stripFile(appBase);
                    this.$$parseLinkUrl = function (url) {
                        var rewrittenUrl, appUrl;
                        return appBase == stripHash(url) ? rewrittenUrl = url : (appUrl = beginsWith(appBaseNoFile, url)) ? rewrittenUrl = appBase + hashPrefix + appUrl : appBaseNoFile === url + "/" && (rewrittenUrl = appBaseNoFile),
                        rewrittenUrl && this.$$parse(rewrittenUrl),
                        !!rewrittenUrl
                    },
                    this.$$compose = function () {
                        var search = toKeyValue(this.$$search),
                        hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
                        this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash,
                        this.$$absUrl = appBase + hashPrefix + this.$$url
                    }
                }
                function locationGetter(property) {
                    return function () {
                        return this[property]
                    }
                }
                function locationGetterSetter(property, preprocess) {
                    return function (value) {
                        return isUndefined(value) ? this[property] : (this[property] = preprocess(value), this.$$compose(), this)
                    }
                }
                function $LocationProvider() {
                    var hashPrefix = "",
                    html5Mode = !1;
                    this.hashPrefix = function (prefix) {
                        return isDefined(prefix) ? (hashPrefix = prefix, this) : hashPrefix
                    },
                    this.html5Mode = function (mode) {
                        return isDefined(mode) ? (html5Mode = mode, this) : html5Mode
                    },
                    this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement",
                    function ($rootScope, $browser, $sniffer, $rootElement) {
                        function afterLocationChange(oldUrl) {
                            $rootScope.$broadcast("$locationChangeSuccess", $location.absUrl(), oldUrl)
                        }
                        var $location, LocationMode, appBase, baseHref = $browser.baseHref(),
                        initialUrl = $browser.url();
                        html5Mode ? (appBase = serverBase(initialUrl) + (baseHref || "/"), LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url) : (appBase = stripHash(initialUrl), LocationMode = LocationHashbangUrl),
                        $location = new LocationMode(appBase, "#" + hashPrefix),
                        $location.$$parseLinkUrl(initialUrl, initialUrl);
                        var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
                        $rootElement.on("click",
                        function (event) {
                            if (!event.ctrlKey && !event.metaKey && 2 != event.which) {
                                for (var elm = jqLite(event.target) ;
                                "a" !== lowercase(elm[0].nodeName) ;) if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
                                var absHref = elm.prop("href"),
                                relHref = elm.attr("href") || elm.attr("xlink:href");
                                isObject(absHref) && "[object SVGAnimatedString]" === absHref.toString() && (absHref = urlResolve(absHref.animVal).href),
                                IGNORE_URI_REGEXP.test(absHref) || !absHref || elm.attr("target") || event.isDefaultPrevented() || $location.$$parseLinkUrl(absHref, relHref) && (event.preventDefault(), $location.absUrl() != $browser.url() && ($rootScope.$apply(), window.angular["ff-684208-preventDefault"] = !0))
                            }
                        }),
                        $location.absUrl() != initialUrl && $browser.url($location.absUrl(), !0),
                        $browser.onUrlChange(function (newUrl) {
                            $location.absUrl() != newUrl && ($rootScope.$evalAsync(function () {
                                var oldUrl = $location.absUrl();
                                $location.$$parse(newUrl),
                                $rootScope.$broadcast("$locationChangeStart", newUrl, oldUrl).defaultPrevented ? ($location.$$parse(oldUrl), $browser.url(oldUrl)) : afterLocationChange(oldUrl)
                            }), $rootScope.$$phase || $rootScope.$digest())
                        });
                        var changeCounter = 0;
                        return $rootScope.$watch(function () {
                            var oldUrl = $browser.url(),
                            currentReplace = $location.$$replace;
                            return changeCounter && oldUrl == $location.absUrl() || (changeCounter++, $rootScope.$evalAsync(function () {
                                $rootScope.$broadcast("$locationChangeStart", $location.absUrl(), oldUrl).defaultPrevented ? $location.$$parse(oldUrl) : ($browser.url($location.absUrl(), currentReplace), afterLocationChange(oldUrl))
                            })),
                            $location.$$replace = !1,
                            changeCounter
                        }),
                        $location
                    }]
                }
                function $LogProvider() {
                    var debug = !0,
                    self = this;
                    this.debugEnabled = function (flag) {
                        return isDefined(flag) ? (debug = flag, this) : debug
                    },
                    this.$get = ["$window",
                    function ($window) {
                        function formatError(arg) {
                            return arg instanceof Error && (arg.stack ? arg = arg.message && -1 === arg.stack.indexOf(arg.message) ? "Error: " + arg.message + "\n" + arg.stack : arg.stack : arg.sourceURL && (arg = arg.message + "\n" + arg.sourceURL + ":" + arg.line)),
                            arg
                        }
                        function consoleLog(type) {
                            var console = $window.console || {},
                            logFn = console[type] || console.log || noop,
                            hasApply = !1;
                            try {
                                hasApply = !!logFn.apply
                            } catch (e) { }
                            return hasApply ?
                            function () {
                                var args = [];
                                return forEach(arguments,
                                function (arg) {
                                    args.push(formatError(arg))
                                }),
                                logFn.apply(console, args)
                            } : function (arg1, arg2) {
                                logFn(arg1, null == arg2 ? "" : arg2)
                            }
                        }
                        return {
                            log: consoleLog("log"),
                            info: consoleLog("info"),
                            warn: consoleLog("warn"),
                            error: consoleLog("error"),
                            debug: function () {
                                var fn = consoleLog("debug");
                                return function () {
                                    debug && fn.apply(self, arguments)
                                }
                            }()
                        }
                    }]
                }
                function ensureSafeMemberName(name, fullExpression) {
                    if ("__defineGetter__" === name || "__defineSetter__" === name || "__lookupGetter__" === name || "__lookupSetter__" === name || "__proto__" === name) throw $parseMinErr("isecfld", "Attempting to access a disallowed field in Angular expressions! Expression: {0}", fullExpression);
                    return name
                }
                function ensureSafeObject(obj, fullExpression) {
                    if (obj) {
                        if (obj.constructor === obj) throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
                        if (obj.document && obj.location && obj.alert && obj.setInterval) throw $parseMinErr("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", fullExpression);
                        if (obj.children && (obj.nodeName || obj.prop && obj.attr && obj.find)) throw $parseMinErr("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", fullExpression);
                        if (obj === Object) throw $parseMinErr("isecobj", "Referencing Object in Angular expressions is disallowed! Expression: {0}", fullExpression)
                    }
                    return obj
                }
                function ensureSafeFunction(obj, fullExpression) {
                    if (obj) {
                        if (obj.constructor === obj) throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
                        if (obj === CALL || obj === APPLY || BIND && obj === BIND) throw $parseMinErr("isecff", "Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}", fullExpression)
                    }
                }
                function setter(obj, path, setValue, fullExp, options) {
                    ensureSafeObject(obj, fullExp),
                    options = options || {};
                    for (var key, element = path.split("."), i = 0; element.length > 1; i++) {
                        key = ensureSafeMemberName(element.shift(), fullExp);
                        var propertyObj = ensureSafeObject(obj[key], fullExp);
                        propertyObj || (propertyObj = {},
                        obj[key] = propertyObj),
                        obj = propertyObj,
                        obj.then && options.unwrapPromises && (promiseWarning(fullExp), "$$v" in obj || !
                        function (promise) {
                            promise.then(function (val) {
                                promise.$$v = val
                            })
                        }(obj), obj.$$v === undefined && (obj.$$v = {}), obj = obj.$$v)
                    }
                    return key = ensureSafeMemberName(element.shift(), fullExp),
                    ensureSafeObject(obj[key], fullExp),
                    obj[key] = setValue,
                    setValue
                }
                function isPossiblyDangerousMemberName(name) {
                    return "constructor" == name
                }
                function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
                    ensureSafeMemberName(key0, fullExp),
                    ensureSafeMemberName(key1, fullExp),
                    ensureSafeMemberName(key2, fullExp),
                    ensureSafeMemberName(key3, fullExp),
                    ensureSafeMemberName(key4, fullExp);
                    var eso = function (o) {
                        return ensureSafeObject(o, fullExp)
                    },
                    expensiveChecks = options.expensiveChecks,
                    eso0 = expensiveChecks || isPossiblyDangerousMemberName(key0) ? eso : identity,
                    eso1 = expensiveChecks || isPossiblyDangerousMemberName(key1) ? eso : identity,
                    eso2 = expensiveChecks || isPossiblyDangerousMemberName(key2) ? eso : identity,
                    eso3 = expensiveChecks || isPossiblyDangerousMemberName(key3) ? eso : identity,
                    eso4 = expensiveChecks || isPossiblyDangerousMemberName(key4) ? eso : identity;
                    return options.unwrapPromises ?
                    function (scope, locals) {
                        var promise, pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
                        return null == pathVal ? pathVal : (pathVal = eso0(pathVal[key0]), pathVal && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || (promise = pathVal, promise.$$v = undefined, promise.then(function (val) {
                            promise.$$v = eso0(val)
                        })), pathVal = eso0(pathVal.$$v)), key1 ? null == pathVal ? undefined : (pathVal = eso1(pathVal[key1]), pathVal && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || (promise = pathVal, promise.$$v = undefined, promise.then(function (val) {
                            promise.$$v = eso1(val)
                        })), pathVal = eso1(pathVal.$$v)), key2 ? null == pathVal ? undefined : (pathVal = eso2(pathVal[key2]), pathVal && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || (promise = pathVal, promise.$$v = undefined, promise.then(function (val) {
                            promise.$$v = eso2(val)
                        })), pathVal = eso2(pathVal.$$v)), key3 ? null == pathVal ? undefined : (pathVal = eso3(pathVal[key3]), pathVal && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || (promise = pathVal, promise.$$v = undefined, promise.then(function (val) {
                            promise.$$v = eso3(val)
                        })), pathVal = eso3(pathVal.$$v)), key4 ? null == pathVal ? undefined : (pathVal = eso4(pathVal[key4]), pathVal && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || (promise = pathVal, promise.$$v = undefined, promise.then(function (val) {
                            promise.$$v = eso4(val)
                        })), pathVal = eso4(pathVal.$$v)), pathVal) : pathVal) : pathVal) : pathVal) : pathVal)
                    } : function (scope, locals) {
                        var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
                        return null == pathVal ? pathVal : (pathVal = eso0(pathVal[key0]), key1 ? null == pathVal ? undefined : (pathVal = eso1(pathVal[key1]), key2 ? null == pathVal ? undefined : (pathVal = eso2(pathVal[key2]), key3 ? null == pathVal ? undefined : (pathVal = eso3(pathVal[key3]), key4 ? null == pathVal ? undefined : pathVal = eso4(pathVal[key4]) : pathVal) : pathVal) : pathVal) : pathVal)
                    }
                }
                function getterFnWithExtraArgs(fn, fullExpression) {
                    return function (s, l) {
                        return fn(s, l, promiseWarning, ensureSafeObject, fullExpression)
                    }
                }
                function getterFn(path, options, fullExp) {
                    var expensiveChecks = options.expensiveChecks,
                    getterFnCache = expensiveChecks ? getterFnCacheExpensive : getterFnCacheDefault;
                    if (getterFnCache.hasOwnProperty(path)) return getterFnCache[path];
                    var fn, pathKeys = path.split("."),
                    pathKeysLength = pathKeys.length;
                    if (options.csp) fn = 6 > pathKeysLength ? cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options) : function (scope, locals) {
                        var val, i = 0;
                        do val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals),
                        locals = undefined,
                        scope = val;
                        while (pathKeysLength > i);
                        return val
                    };
                    else {
                        var code = "var p;\n";
                        expensiveChecks && (code += "s = eso(s, fe);\nl = eso(l, fe);\n");
                        var needsEnsureSafeObject = expensiveChecks;
                        forEach(pathKeys,
                        function (key, index) {
                            ensureSafeMemberName(key, fullExp);
                            var lookupJs = (index ? "s" : '((l&&l.hasOwnProperty("' + key + '"))?l:s)') + '["' + key + '"]',
                            wrapWithEso = expensiveChecks || isPossiblyDangerousMemberName(key);
                            wrapWithEso && (lookupJs = "eso(" + lookupJs + ", fe)", needsEnsureSafeObject = !0),
                            code += "if(s == null) return undefined;\ns=" + lookupJs + ";\n",
                            options.unwrapPromises && (code += 'if (s && s.then) {\n pw("' + fullExp.replace(/(["\r\n])/g, "\\$1") + '");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=' + (wrapWithEso ? "eso(v)" : "v") + ";});\n}\n s=" + (wrapWithEso ? "eso(s.$$v)" : "s.$$v") + "\n}\n")
                        }),
                        code += "return s;";
                        var evaledFnGetter = new Function("s", "l", "pw", "eso", "fe", code);
                        evaledFnGetter.toString = valueFn(code),
                        (needsEnsureSafeObject || options.unwrapPromises) && (evaledFnGetter = getterFnWithExtraArgs(evaledFnGetter, fullExp)),
                        fn = evaledFnGetter
                    }
                    return "hasOwnProperty" !== path && (getterFnCache[path] = fn),
                    fn
                }
                function $ParseProvider() {
                    var cacheDefault = {},
                    cacheExpensive = {},
                    $parseOptions = {
                        csp: !1,
                        unwrapPromises: !1,
                        logPromiseWarnings: !0,
                        expensiveChecks: !1
                    };
                    this.unwrapPromises = function (value) {
                        return isDefined(value) ? ($parseOptions.unwrapPromises = !!value, this) : $parseOptions.unwrapPromises
                    },
                    this.logPromiseWarnings = function (value) {
                        return isDefined(value) ? ($parseOptions.logPromiseWarnings = value, this) : $parseOptions.logPromiseWarnings
                    },
                    this.$get = ["$filter", "$sniffer", "$log",
                    function ($filter, $sniffer, $log) {
                        $parseOptions.csp = $sniffer.csp;
                        var $parseOptionsExpensive = {
                            csp: $parseOptions.csp,
                            unwrapPromises: $parseOptions.unwrapPromises,
                            logPromiseWarnings: $parseOptions.logPromiseWarnings,
                            expensiveChecks: !0
                        };
                        return promiseWarning = function (fullExp) {
                            $parseOptions.logPromiseWarnings && !promiseWarningCache.hasOwnProperty(fullExp) && (promiseWarningCache[fullExp] = !0, $log.warn("[$parse] Promise found in the expression `" + fullExp + "`. Automatic unwrapping of promises in Angular expressions is deprecated."))
                        },
                        function (exp, expensiveChecks) {
                            var parsedExpression;
                            switch (typeof exp) {
                                case "string":
                                    var cache = expensiveChecks ? cacheExpensive : cacheDefault;
                                    if (cache.hasOwnProperty(exp)) return cache[exp];
                                    var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions,
                                    lexer = new Lexer(parseOptions),
                                    parser = new Parser(lexer, $filter, parseOptions);
                                    return parsedExpression = parser.parse(exp),
                                    "hasOwnProperty" !== exp && (cache[exp] = parsedExpression),
                                    parsedExpression;
                                case "function":
                                    return exp;
                                default:
                                    return noop
                            }
                        }
                    }]
                }
                function $QProvider() {
                    this.$get = ["$rootScope", "$exceptionHandler",
                    function ($rootScope, $exceptionHandler) {
                        return qFactory(function (callback) {
                            $rootScope.$evalAsync(callback)
                        },
                        $exceptionHandler)
                    }]
                }
                function qFactory(nextTick, exceptionHandler) {
                    function defaultCallback(value) {
                        return value
                    }
                    function defaultErrback(reason) {
                        return reject(reason)
                    }
                    function all(promises) {
                        var deferred = defer(),
                        counter = 0,
                        results = isArray(promises) ? [] : {};
                        return forEach(promises,
                        function (promise, key) {
                            counter++,
                            ref(promise).then(function (value) {
                                results.hasOwnProperty(key) || (results[key] = value, --counter || deferred.resolve(results))
                            },
                            function (reason) {
                                results.hasOwnProperty(key) || deferred.reject(reason)
                            })
                        }),
                        0 === counter && deferred.resolve(results),
                        deferred.promise
                    }
                    var defer = function () {
                        var value, deferred, pending = [];
                        return deferred = {
                            resolve: function (val) {
                                if (pending) {
                                    var callbacks = pending;
                                    pending = undefined,
                                    value = ref(val),
                                    callbacks.length && nextTick(function () {
                                        for (var callback, i = 0,
                                        ii = callbacks.length; ii > i; i++) callback = callbacks[i],
                                        value.then(callback[0], callback[1], callback[2])
                                    })
                                }
                            },
                            reject: function (reason) {
                                deferred.resolve(createInternalRejectedPromise(reason))
                            },
                            notify: function (progress) {
                                if (pending) {
                                    var callbacks = pending;
                                    pending.length && nextTick(function () {
                                        for (var callback, i = 0,
                                        ii = callbacks.length; ii > i; i++) callback = callbacks[i],
                                        callback[2](progress)
                                    })
                                }
                            },
                            promise: {
                                then: function (callback, errback, progressback) {
                                    var result = defer(),
                                    wrappedCallback = function (value) {
                                        try {
                                            result.resolve((isFunction(callback) ? callback : defaultCallback)(value))
                                        } catch (e) {
                                            result.reject(e),
                                            exceptionHandler(e)
                                        }
                                    },
                                    wrappedErrback = function (reason) {
                                        try {
                                            result.resolve((isFunction(errback) ? errback : defaultErrback)(reason))
                                        } catch (e) {
                                            result.reject(e),
                                            exceptionHandler(e)
                                        }
                                    },
                                    wrappedProgressback = function (progress) {
                                        try {
                                            result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress))
                                        } catch (e) {
                                            exceptionHandler(e)
                                        }
                                    };
                                    return pending ? pending.push([wrappedCallback, wrappedErrback, wrappedProgressback]) : value.then(wrappedCallback, wrappedErrback, wrappedProgressback),
                                    result.promise
                                },
                                "catch": function (callback) {
                                    return this.then(null, callback)
                                },
                                "finally": function (callback) {
                                    function makePromise(value, resolved) {
                                        var result = defer();
                                        return resolved ? result.resolve(value) : result.reject(value),
                                        result.promise
                                    }
                                    function handleCallback(value, isResolved) {
                                        var callbackOutput = null;
                                        try {
                                            callbackOutput = (callback || defaultCallback)()
                                        } catch (e) {
                                            return makePromise(e, !1)
                                        }
                                        return isPromiseLike(callbackOutput) ? callbackOutput.then(function () {
                                            return makePromise(value, isResolved)
                                        },
                                        function (error) {
                                            return makePromise(error, !1)
                                        }) : makePromise(value, isResolved)
                                    }
                                    return this.then(function (value) {
                                        return handleCallback(value, !0)
                                    },
                                    function (error) {
                                        return handleCallback(error, !1)
                                    })
                                }
                            }
                        }
                    },
                    ref = function (value) {
                        return isPromiseLike(value) ? value : {
                            then: function (callback) {
                                var result = defer();
                                return nextTick(function () {
                                    result.resolve(callback(value))
                                }),
                                result.promise
                            }
                        }
                    },
                    reject = function (reason) {
                        var result = defer();
                        return result.reject(reason),
                        result.promise
                    },
                    createInternalRejectedPromise = function (reason) {
                        return {
                            then: function (callback, errback) {
                                var result = defer();
                                return nextTick(function () {
                                    try {
                                        result.resolve((isFunction(errback) ? errback : defaultErrback)(reason))
                                    } catch (e) {
                                        result.reject(e),
                                        exceptionHandler(e)
                                    }
                                }),
                                result.promise
                            }
                        }
                    },
                    when = function (value, callback, errback, progressback) {
                        var done, result = defer(),
                        wrappedCallback = function (value) {
                            try {
                                return (isFunction(callback) ? callback : defaultCallback)(value)
                            } catch (e) {
                                return exceptionHandler(e),
                                reject(e)
                            }
                        },
                        wrappedErrback = function (reason) {
                            try {
                                return (isFunction(errback) ? errback : defaultErrback)(reason)
                            } catch (e) {
                                return exceptionHandler(e),
                                reject(e)
                            }
                        },
                        wrappedProgressback = function (progress) {
                            try {
                                return (isFunction(progressback) ? progressback : defaultCallback)(progress)
                            } catch (e) {
                                exceptionHandler(e)
                            }
                        };
                        return nextTick(function () {
                            ref(value).then(function (value) {
                                done || (done = !0, result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback)))
                            },
                            function (reason) {
                                done || (done = !0, result.resolve(wrappedErrback(reason)))
                            },
                            function (progress) {
                                done || result.notify(wrappedProgressback(progress))
                            })
                        }),
                        result.promise
                    };
                    return {
                        defer: defer,
                        reject: reject,
                        when: when,
                        all: all
                    }
                }
                function $$RAFProvider() {
                    this.$get = ["$window", "$timeout",
                    function ($window, $timeout) {
                        var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame,
                        cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.mozCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame,
                        rafSupported = !!requestAnimationFrame,
                        raf = rafSupported ?
                        function (fn) {
                            var id = requestAnimationFrame(fn);
                            return function () {
                                cancelAnimationFrame(id)
                            }
                        } : function (fn) {
                            var timer = $timeout(fn, 16.66, !1);
                            return function () {
                                $timeout.cancel(timer)
                            }
                        };
                        return raf.supported = rafSupported,
                        raf
                    }]
                }
                function $RootScopeProvider() {
                    var TTL = 10,
                    $rootScopeMinErr = minErr("$rootScope"),
                    lastDirtyWatch = null;
                    this.digestTtl = function (value) {
                        return arguments.length && (TTL = value),
                        TTL
                    },
                    this.$get = ["$injector", "$exceptionHandler", "$parse", "$browser",
                    function ($injector, $exceptionHandler, $parse, $browser) {
                        function Scope() {
                            this.$id = nextUid(),
                            this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null,
                            this["this"] = this.$root = this,
                            this.$$destroyed = !1,
                            this.$$asyncQueue = [],
                            this.$$postDigestQueue = [],
                            this.$$listeners = {},
                            this.$$listenerCount = {},
                            this.$$isolateBindings = {}
                        }
                        function beginPhase(phase) {
                            if ($rootScope.$$phase) throw $rootScopeMinErr("inprog", "{0} already in progress", $rootScope.$$phase);
                            $rootScope.$$phase = phase
                        }
                        function clearPhase() {
                            $rootScope.$$phase = null
                        }
                        function compileToFn(exp, name) {
                            var fn = $parse(exp);
                            return assertArgFn(fn, name),
                            fn
                        }
                        function decrementListenerCount(current, count, name) {
                            do current.$$listenerCount[name] -= count,
                            0 === current.$$listenerCount[name] && delete current.$$listenerCount[name];
                            while (current = current.$parent)
                        }
                        function initWatchVal() { }
                        Scope.prototype = {
                            constructor: Scope,
                            $new: function (isolate) {
                                var child;
                                return isolate ? (child = new Scope, child.$root = this.$root, child.$$asyncQueue = this.$$asyncQueue, child.$$postDigestQueue = this.$$postDigestQueue) : (this.$$childScopeClass || (this.$$childScopeClass = function () {
                                    this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null,
                                    this.$$listeners = {},
                                    this.$$listenerCount = {},
                                    this.$id = nextUid(),
                                    this.$$childScopeClass = null
                                },
                                this.$$childScopeClass.prototype = this), child = new this.$$childScopeClass),
                                child["this"] = child,
                                child.$parent = this,
                                child.$$prevSibling = this.$$childTail,
                                this.$$childHead ? (this.$$childTail.$$nextSibling = child, this.$$childTail = child) : this.$$childHead = this.$$childTail = child,
                                child
                            },
                            $watch: function (watchExp, listener, objectEquality) {
                                var scope = this,
                                get = compileToFn(watchExp, "watch"),
                                array = scope.$$watchers,
                                watcher = {
                                    fn: listener,
                                    last: initWatchVal,
                                    get: get,
                                    exp: watchExp,
                                    eq: !!objectEquality
                                };
                                if (lastDirtyWatch = null, !isFunction(listener)) {
                                    var listenFn = compileToFn(listener || noop, "listener");
                                    watcher.fn = function (newVal, oldVal, scope) {
                                        listenFn(scope)
                                    }
                                }
                                if ("string" == typeof watchExp && get.constant) {
                                    var originalFn = watcher.fn;
                                    watcher.fn = function (newVal, oldVal, scope) {
                                        originalFn.call(this, newVal, oldVal, scope),
                                        arrayRemove(array, watcher)
                                    }
                                }
                                return array || (array = scope.$$watchers = []),
                                array.unshift(watcher),
                                function () {
                                    arrayRemove(array, watcher),
                                    lastDirtyWatch = null
                                }
                            },
                            $watchCollection: function (obj, listener) {
                                function $watchCollectionWatch() {
                                    newValue = objGetter(self);
                                    var newLength, key, bothNaN;
                                    if (isObject(newValue)) if (isArrayLike(newValue)) {
                                        oldValue !== internalArray && (oldValue = internalArray, oldLength = oldValue.length = 0, changeDetected++),
                                        newLength = newValue.length,
                                        oldLength !== newLength && (changeDetected++, oldValue.length = oldLength = newLength);
                                        for (var i = 0; newLength > i; i++) bothNaN = oldValue[i] !== oldValue[i] && newValue[i] !== newValue[i],
                                        bothNaN || oldValue[i] === newValue[i] || (changeDetected++, oldValue[i] = newValue[i])
                                    } else {
                                        oldValue !== internalObject && (oldValue = internalObject = {},
                                        oldLength = 0, changeDetected++),
                                        newLength = 0;
                                        for (key in newValue) newValue.hasOwnProperty(key) && (newLength++, oldValue.hasOwnProperty(key) ? (bothNaN = oldValue[key] !== oldValue[key] && newValue[key] !== newValue[key], bothNaN || oldValue[key] === newValue[key] || (changeDetected++, oldValue[key] = newValue[key])) : (oldLength++, oldValue[key] = newValue[key], changeDetected++));
                                        if (oldLength > newLength) {
                                            changeDetected++;
                                            for (key in oldValue) oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key) && (oldLength--, delete oldValue[key])
                                        }
                                    } else oldValue !== newValue && (oldValue = newValue, changeDetected++);
                                    return changeDetected
                                }
                                function $watchCollectionAction() {
                                    if (initRun ? (initRun = !1, listener(newValue, newValue, self)) : listener(newValue, veryOldValue, self), trackVeryOldValue) if (isObject(newValue)) if (isArrayLike(newValue)) {
                                        veryOldValue = new Array(newValue.length);
                                        for (var i = 0; i < newValue.length; i++) veryOldValue[i] = newValue[i]
                                    } else {
                                        veryOldValue = {};
                                        for (var key in newValue) hasOwnProperty.call(newValue, key) && (veryOldValue[key] = newValue[key])
                                    } else veryOldValue = newValue
                                }
                                var newValue, oldValue, veryOldValue, self = this,
                                trackVeryOldValue = listener.length > 1,
                                changeDetected = 0,
                                objGetter = $parse(obj),
                                internalArray = [],
                                internalObject = {},
                                initRun = !0,
                                oldLength = 0;
                                return this.$watch($watchCollectionWatch, $watchCollectionAction)
                            },
                            $digest: function () {
                                var watch, value, last, watchers, length, dirty, next, current, logIdx, logMsg, asyncTask, asyncQueue = this.$$asyncQueue,
                                postDigestQueue = this.$$postDigestQueue,
                                ttl = TTL,
                                target = this,
                                watchLog = [];
                                beginPhase("$digest"),
                                $browser.$$checkUrlChange(),
                                lastDirtyWatch = null;
                                do {
                                    for (dirty = !1, current = target; asyncQueue.length;) {
                                        try {
                                            asyncTask = asyncQueue.shift(),
                                            asyncTask.scope.$eval(asyncTask.expression)
                                        } catch (e) {
                                            clearPhase(),
                                            $exceptionHandler(e)
                                        }
                                        lastDirtyWatch = null
                                    }
                                    traverseScopesLoop: do {
                                        if (watchers = current.$$watchers) for (length = watchers.length; length--;) try {
                                            if (watch = watchers[length]) if ((value = watch.get(current)) === (last = watch.last) || (watch.eq ? equals(value, last) : "number" == typeof value && "number" == typeof last && isNaN(value) && isNaN(last))) {
                                                if (watch === lastDirtyWatch) {
                                                    dirty = !1;
                                                    break traverseScopesLoop
                                                }
                                            } else dirty = !0,
                                            lastDirtyWatch = watch,
                                            watch.last = watch.eq ? copy(value, null) : value,
                                            watch.fn(value, last === initWatchVal ? value : last, current),
                                            5 > ttl && (logIdx = 4 - ttl, watchLog[logIdx] || (watchLog[logIdx] = []), logMsg = isFunction(watch.exp) ? "fn: " + (watch.exp.name || watch.exp.toString()) : watch.exp, logMsg += "; newVal: " + toJson(value) + "; oldVal: " + toJson(last), watchLog[logIdx].push(logMsg))
                                        } catch (e) {
                                            clearPhase(),
                                            $exceptionHandler(e)
                                        }
                                        if (!(next = current.$$childHead || current !== target && current.$$nextSibling)) for (; current !== target && !(next = current.$$nextSibling) ;) current = current.$parent
                                    } while (current = next);
                                    if ((dirty || asyncQueue.length) && !ttl--) throw clearPhase(), $rootScopeMinErr("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", TTL, toJson(watchLog))
                                } while (dirty || asyncQueue.length);
                                for (clearPhase() ; postDigestQueue.length;) try {
                                    postDigestQueue.shift()()
                                } catch (e) {
                                    $exceptionHandler(e)
                                }
                            },
                            $destroy: function () {
                                if (!this.$$destroyed) {
                                    var parent = this.$parent;
                                    this.$broadcast("$destroy"),
                                    this.$$destroyed = !0,
                                    this !== $rootScope && (forEach(this.$$listenerCount, bind(null, decrementListenerCount, this)), parent.$$childHead == this && (parent.$$childHead = this.$$nextSibling), parent.$$childTail == this && (parent.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = null, this.$$listeners = {},
                                    this.$$watchers = this.$$asyncQueue = this.$$postDigestQueue = [], this.$destroy = this.$digest = this.$apply = noop, this.$on = this.$watch = function () {
                                        return noop
                                    })
                                }
                            },
                            $eval: function (expr, locals) {
                                return $parse(expr)(this, locals)
                            },
                            $evalAsync: function (expr) {
                                $rootScope.$$phase || $rootScope.$$asyncQueue.length || $browser.defer(function () {
                                    $rootScope.$$asyncQueue.length && $rootScope.$digest()
                                }),
                                this.$$asyncQueue.push({
                                    scope: this,
                                    expression: expr
                                })
                            },
                            $$postDigest: function (fn) {
                                this.$$postDigestQueue.push(fn)
                            },
                            $apply: function (expr) {
                                try {
                                    return beginPhase("$apply"),
                                    this.$eval(expr)
                                } catch (e) {
                                    $exceptionHandler(e)
                                } finally {
                                    clearPhase();
                                    try {
                                        $rootScope.$digest()
                                    } catch (e) {
                                        throw $exceptionHandler(e),
                                        e
                                    }
                                }
                            },
                            $on: function (name, listener) {
                                var namedListeners = this.$$listeners[name];
                                namedListeners || (this.$$listeners[name] = namedListeners = []),
                                namedListeners.push(listener);
                                var current = this;
                                do current.$$listenerCount[name] || (current.$$listenerCount[name] = 0),
                                current.$$listenerCount[name]++;
                                while (current = current.$parent);
                                var self = this;
                                return function () {
                                    var indexOfListener = indexOf(namedListeners, listener); -1 !== indexOfListener && (namedListeners[indexOfListener] = null, decrementListenerCount(self, 1, name))
                                }
                            },
                            $emit: function (name) {
                                var namedListeners, i, length, empty = [],
                                scope = this,
                                stopPropagation = !1,
                                event = {
                                    name: name,
                                    targetScope: scope,
                                    stopPropagation: function () {
                                        stopPropagation = !0
                                    },
                                    preventDefault: function () {
                                        event.defaultPrevented = !0
                                    },
                                    defaultPrevented: !1
                                },
                                listenerArgs = concat([event], arguments, 1);
                                do {
                                    for (namedListeners = scope.$$listeners[name] || empty, event.currentScope = scope, i = 0, length = namedListeners.length; length > i; i++) if (namedListeners[i]) try {
                                        namedListeners[i].apply(null, listenerArgs)
                                    } catch (e) {
                                        $exceptionHandler(e)
                                    } else namedListeners.splice(i, 1), i--, length--;
                                    if (stopPropagation) return event;
                                    scope = scope.$parent
                                } while (scope);
                                return event
                            },
                            $broadcast: function (name) {
                                for (var listeners, i, length, target = this,
                                current = target,
                                next = target,
                                event = {
                                    name: name,
                                    targetScope: target,
                                    preventDefault: function () {
                                        event.defaultPrevented = !0
                                },
                                    defaultPrevented: !1
                                },
                                listenerArgs = concat([event], arguments, 1) ; current = next;) {
                                    for (event.currentScope = current, listeners = current.$$listeners[name] || [], i = 0, length = listeners.length; length > i; i++) if (listeners[i]) try {
                                        listeners[i].apply(null, listenerArgs)
                                    } catch (e) {
                                        $exceptionHandler(e)
                                    } else listeners.splice(i, 1),
                                    i--,
                                    length--;
                                    if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling)) for (; current !== target && !(next = current.$$nextSibling) ;) current = current.$parent
                                }
                                return event
                            }
                        };
                        var $rootScope = new Scope;
                        return $rootScope
                    }]
                }
                function $$SanitizeUriProvider() {
                    var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
                    imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file):|data:image\/)/;
                    this.aHrefSanitizationWhitelist = function (regexp) {
                        return isDefined(regexp) ? (aHrefSanitizationWhitelist = regexp, this) : aHrefSanitizationWhitelist
                    },
                    this.imgSrcSanitizationWhitelist = function (regexp) {
                        return isDefined(regexp) ? (imgSrcSanitizationWhitelist = regexp, this) : imgSrcSanitizationWhitelist
                    },
                    this.$get = function () {
                        return function (uri, isImage) {
                            var normalizedVal, regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
                            return msie && !(msie >= 8) || (normalizedVal = urlResolve(uri).href, "" === normalizedVal || normalizedVal.match(regex)) ? uri : "unsafe:" + normalizedVal
                        }
                    }
                }
                function escapeForRegexp(s) {
                    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
                }
                function adjustMatcher(matcher) {
                    if ("self" === matcher) return matcher;
                    if (isString(matcher)) {
                        if (matcher.indexOf("***") > -1) throw $sceMinErr("iwcard", "Illegal sequence *** in string matcher.  String: {0}", matcher);
                        return matcher = escapeForRegexp(matcher).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"),
                        new RegExp("^" + matcher + "$")
                    }
                    if (isRegExp(matcher)) return new RegExp("^" + matcher.source + "$");
                    throw $sceMinErr("imatcher", 'Matchers may only be "self", string patterns or RegExp objects')
                }
                function adjustMatchers(matchers) {
                    var adjustedMatchers = [];
                    return isDefined(matchers) && forEach(matchers,
                    function (matcher) {
                        adjustedMatchers.push(adjustMatcher(matcher))
                    }),
                    adjustedMatchers
                }
                function $SceDelegateProvider() {
                    this.SCE_CONTEXTS = SCE_CONTEXTS;
                    var resourceUrlWhitelist = ["self"],
                    resourceUrlBlacklist = [];
                    this.resourceUrlWhitelist = function (value) {
                        return arguments.length && (resourceUrlWhitelist = adjustMatchers(value)),
                        resourceUrlWhitelist
                    },
                    this.resourceUrlBlacklist = function (value) {
                        return arguments.length && (resourceUrlBlacklist = adjustMatchers(value)),
                        resourceUrlBlacklist
                    },
                    this.$get = ["$injector",
                    function ($injector) {
                        function matchUrl(matcher, parsedUrl) {
                            return "self" === matcher ? urlIsSameOrigin(parsedUrl) : !!matcher.exec(parsedUrl.href)
                        }
                        function isResourceUrlAllowedByPolicy(url) {
                            var i, n, parsedUrl = urlResolve(url.toString()),
                            allowed = !1;
                            for (i = 0, n = resourceUrlWhitelist.length; n > i; i++) if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                                allowed = !0;
                                break
                            }
                            if (allowed) for (i = 0, n = resourceUrlBlacklist.length; n > i; i++) if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                                allowed = !1;
                                break
                            }
                            return allowed
                        }
                        function generateHolderType(Base) {
                            var holderType = function (trustedValue) {
                                this.$$unwrapTrustedValue = function () {
                                    return trustedValue
                                }
                            };
                            return Base && (holderType.prototype = new Base),
                            holderType.prototype.valueOf = function () {
                                return this.$$unwrapTrustedValue()
                            },
                            holderType.prototype.toString = function () {
                                return this.$$unwrapTrustedValue().toString()
                            },
                            holderType
                        }
                        function trustAs(type, trustedValue) {
                            var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                            if (!Constructor) throw $sceMinErr("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", type, trustedValue);
                            if (null === trustedValue || trustedValue === undefined || "" === trustedValue) return trustedValue;
                            if ("string" != typeof trustedValue) throw $sceMinErr("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", type);
                            return new Constructor(trustedValue)
                        }
                        function valueOf(maybeTrusted) {
                            return maybeTrusted instanceof trustedValueHolderBase ? maybeTrusted.$$unwrapTrustedValue() : maybeTrusted
                        }
                        function getTrusted(type, maybeTrusted) {
                            if (null === maybeTrusted || maybeTrusted === undefined || "" === maybeTrusted) return maybeTrusted;
                            var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                            if (constructor && maybeTrusted instanceof constructor) return maybeTrusted.$$unwrapTrustedValue();
                            if (type === SCE_CONTEXTS.RESOURCE_URL) {
                                if (isResourceUrlAllowedByPolicy(maybeTrusted)) return maybeTrusted;
                                throw $sceMinErr("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", maybeTrusted.toString())
                            }
                            if (type === SCE_CONTEXTS.HTML) return htmlSanitizer(maybeTrusted);
                            throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.")
                        }
                        var htmlSanitizer = function () {
                            throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.")
                        };
                        $injector.has("$sanitize") && (htmlSanitizer = $injector.get("$sanitize"));
                        var trustedValueHolderBase = generateHolderType(),
                        byType = {};
                        return byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase),
                        byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase),
                        byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase),
                        byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase),
                        byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]),
                        {
                            trustAs: trustAs,
                            getTrusted: getTrusted,
                            valueOf: valueOf
                        }
                    }]
                }
                function $SceProvider() {
                    var enabled = !0;
                    this.enabled = function (value) {
                        return arguments.length && (enabled = !!value),
                        enabled
                    },
                    this.$get = ["$parse", "$sniffer", "$sceDelegate",
                    function ($parse, $sniffer, $sceDelegate) {
                        if (enabled && $sniffer.msie && $sniffer.msieDocumentMode < 8) throw $sceMinErr("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
                        var sce = shallowCopy(SCE_CONTEXTS);
                        sce.isEnabled = function () {
                            return enabled
                        },
                        sce.trustAs = $sceDelegate.trustAs,
                        sce.getTrusted = $sceDelegate.getTrusted,
                        sce.valueOf = $sceDelegate.valueOf,
                        enabled || (sce.trustAs = sce.getTrusted = function (type, value) {
                            return value
                        },
                        sce.valueOf = identity),
                        sce.parseAs = function (type, expr) {
                            var parsed = $parse(expr);
                            return parsed.literal && parsed.constant ? parsed : function (self, locals) {
                                return sce.getTrusted(type, parsed(self, locals))
                            }
                        };
                        var parse = sce.parseAs,
                        getTrusted = sce.getTrusted,
                        trustAs = sce.trustAs;
                        return forEach(SCE_CONTEXTS,
                        function (enumValue, name) {
                            var lName = lowercase(name);
                            sce[camelCase("parse_as_" + lName)] = function (expr) {
                                return parse(enumValue, expr)
                            },
                            sce[camelCase("get_trusted_" + lName)] = function (value) {
                                return getTrusted(enumValue, value)
                            },
                            sce[camelCase("trust_as_" + lName)] = function (value) {
                                return trustAs(enumValue, value)
                            }
                        }),
                        sce
                    }]
                }
                function $SnifferProvider() {
                    this.$get = ["$window", "$document",
                    function ($window, $document) {
                        var vendorPrefix, match, eventSupport = {},
                        android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
                        boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
                        document = $document[0] || {},
                        documentMode = document.documentMode,
                        vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/,
                        bodyStyle = document.body && document.body.style,
                        transitions = !1,
                        animations = !1;
                        if (bodyStyle) {
                            for (var prop in bodyStyle) if (match = vendorRegex.exec(prop)) {
                                vendorPrefix = match[0],
                                vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                                break
                            }
                            vendorPrefix || (vendorPrefix = "WebkitOpacity" in bodyStyle && "webkit"),
                            transitions = !!("transition" in bodyStyle || vendorPrefix + "Transition" in bodyStyle),
                            animations = !!("animation" in bodyStyle || vendorPrefix + "Animation" in bodyStyle),
                            !android || transitions && animations || (transitions = isString(document.body.style.webkitTransition), animations = isString(document.body.style.webkitAnimation))
                        }
                        return {
                            history: !(!$window.history || !$window.history.pushState || 4 > android || boxee),
                            hashchange: "onhashchange" in $window && (!documentMode || documentMode > 7),
                            hasEvent: function (event) {
                                if ("input" == event && 9 == msie) return !1;
                                if (isUndefined(eventSupport[event])) {
                                    var divElm = document.createElement("div");
                                    eventSupport[event] = "on" + event in divElm
                                }
                                return eventSupport[event]
                            },
                            csp: csp(),
                            vendorPrefix: vendorPrefix,
                            transitions: transitions,
                            animations: animations,
                            android: android,
                            msie: msie,
                            msieDocumentMode: documentMode
                        }
                    }]
                }
                function $TimeoutProvider() {
                    this.$get = ["$rootScope", "$browser", "$q", "$exceptionHandler",
                    function ($rootScope, $browser, $q, $exceptionHandler) {
                        function timeout(fn, delay, invokeApply) {
                            var timeoutId, deferred = $q.defer(),
                            promise = deferred.promise,
                            skipApply = isDefined(invokeApply) && !invokeApply;
                            return timeoutId = $browser.defer(function () {
                                try {
                                    deferred.resolve(fn())
                                } catch (e) {
                                    deferred.reject(e),
                                    $exceptionHandler(e)
                                } finally {
                                    delete deferreds[promise.$$timeoutId]
                                }
                                skipApply || $rootScope.$apply()
                            },
                            delay),
                            promise.$$timeoutId = timeoutId,
                            deferreds[timeoutId] = deferred,
                            promise
                        }
                        var deferreds = {};
                        return timeout.cancel = function (promise) {
                            return promise && promise.$$timeoutId in deferreds ? (deferreds[promise.$$timeoutId].reject("canceled"), delete deferreds[promise.$$timeoutId], $browser.defer.cancel(promise.$$timeoutId)) : !1
                        },
                        timeout
                    }]
                }
                function urlResolve(url) {
                    var href = url;
                    return msie && (urlParsingNode.setAttribute("href", href), href = urlParsingNode.href),
                    urlParsingNode.setAttribute("href", href),
                    {
                        href: urlParsingNode.href,
                        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
                        host: urlParsingNode.host,
                        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
                        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
                        hostname: urlParsingNode.hostname,
                        port: urlParsingNode.port,
                        pathname: "/" === urlParsingNode.pathname.charAt(0) ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
                    }
                }
                function urlIsSameOrigin(requestUrl) {
                    var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
                    return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host
                }
                function $WindowProvider() {
                    this.$get = valueFn(window)
                }
                function $FilterProvider($provide) {
                    function register(name, factory) {
                        if (isObject(name)) {
                            var filters = {};
                            return forEach(name,
                            function (filter, key) {
                                filters[key] = register(key, filter)
                            }),
                            filters
                        }
                        return $provide.factory(name + suffix, factory)
                    }
                    var suffix = "Filter";
                    this.register = register,
                    this.$get = ["$injector",
                    function ($injector) {
                        return function (name) {
                            return $injector.get(name + suffix)
                        }
                    }],
                    register("currency", currencyFilter),
                    register("date", dateFilter),
                    register("filter", filterFilter),
                    register("json", jsonFilter),
                    register("limitTo", limitToFilter),
                    register("lowercase", lowercaseFilter),
                    register("number", numberFilter),
                    register("orderBy", orderByFilter),
                    register("uppercase", uppercaseFilter)
                }
                function filterFilter() {
                    return function (array, expression, comparator) {
                        if (!isArray(array)) return array;
                        var comparatorType = typeof comparator,
                        predicates = [];
                        predicates.check = function (value) {
                            for (var j = 0; j < predicates.length; j++) if (!predicates[j](value)) return !1;
                            return !0
                        },
                        "function" !== comparatorType && (comparator = "boolean" === comparatorType && comparator ?
                        function (obj, text) {
                            return angular.equals(obj, text)
                        } : function (obj, text) {
                            if (obj && text && "object" == typeof obj && "object" == typeof text) {
                                for (var objKey in obj) if ("$" !== objKey.charAt(0) && hasOwnProperty.call(obj, objKey) && comparator(obj[objKey], text[objKey])) return !0;
                                return !1
                            }
                            return text = ("" + text).toLowerCase(),
                            ("" + obj).toLowerCase().indexOf(text) > -1
                        });
                        var search = function (obj, text) {
                            if ("string" == typeof text && "!" === text.charAt(0)) return !search(obj, text.substr(1));
                            switch (typeof obj) {
                                case "boolean":
                                case "number":
                                case "string":
                                    return comparator(obj, text);
                                case "object":
                                    switch (typeof text) {
                                        case "object":
                                            return comparator(obj, text);
                                        default:
                                            for (var objKey in obj) if ("$" !== objKey.charAt(0) && search(obj[objKey], text)) return !0
                                    }
                                    return !1;
                                case "array":
                                    for (var i = 0; i < obj.length; i++) if (search(obj[i], text)) return !0;
                                    return !1;
                                default:
                                    return !1
                            }
                        };
                        switch (typeof expression) {
                            case "boolean":
                            case "number":
                            case "string":
                                expression = {
                                    $: expression
                                };
                            case "object":
                                for (var key in expression) !
                                function (path) {
                                    "undefined" != typeof expression[path] && predicates.push(function (value) {
                                        return search("$" == path ? value : value && value[path], expression[path])
                                    })
                                }(key);
                                break;
                            case "function":
                                predicates.push(expression);
                                break;
                            default:
                                return array
                        }
                        for (var filtered = [], j = 0; j < array.length; j++) {
                            var value = array[j];
                            predicates.check(value) && filtered.push(value)
                        }
                        return filtered
                    }
                }
                function currencyFilter($locale) {
                    var formats = $locale.NUMBER_FORMATS;
                    return function (amount, currencySymbol) {
                        return isUndefined(currencySymbol) && (currencySymbol = formats.CURRENCY_SYM),
                        formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).replace(/\u00A4/g, currencySymbol)
                    }
                }
                function numberFilter($locale) {
                    var formats = $locale.NUMBER_FORMATS;
                    return function (number, fractionSize) {
                        return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize)
                    }
                }
                function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
                    if (null == number || !isFinite(number) || isObject(number)) return "";
                    var isNegative = 0 > number;
                    number = Math.abs(number);
                    var numStr = number + "",
                    formatedText = "",
                    parts = [],
                    hasExponent = !1;
                    if (-1 !== numStr.indexOf("e")) {
                        var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
                        match && "-" == match[2] && match[3] > fractionSize + 1 ? (numStr = "0", number = 0) : (formatedText = numStr, hasExponent = !0)
                    }
                    if (hasExponent) fractionSize > 0 && number > -1 && 1 > number && (formatedText = number.toFixed(fractionSize));
                    else {
                        var fractionLen = (numStr.split(DECIMAL_SEP)[1] || "").length;
                        isUndefined(fractionSize) && (fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac)),
                        number = +(Math.round(+(number.toString() + "e" + fractionSize)).toString() + "e" + -fractionSize),
                        0 === number && (isNegative = !1);
                        var fraction = ("" + number).split(DECIMAL_SEP),
                        whole = fraction[0];
                        fraction = fraction[1] || "";
                        var i, pos = 0,
                        lgroup = pattern.lgSize,
                        group = pattern.gSize;
                        if (whole.length >= lgroup + group) for (pos = whole.length - lgroup, i = 0; pos > i; i++) (pos - i) % group === 0 && 0 !== i && (formatedText += groupSep),
                        formatedText += whole.charAt(i);
                        for (i = pos; i < whole.length; i++) (whole.length - i) % lgroup === 0 && 0 !== i && (formatedText += groupSep),
                        formatedText += whole.charAt(i);
                        for (; fraction.length < fractionSize;) fraction += "0";
                        fractionSize && "0" !== fractionSize && (formatedText += decimalSep + fraction.substr(0, fractionSize))
                    }
                    return parts.push(isNegative ? pattern.negPre : pattern.posPre),
                    parts.push(formatedText),
                    parts.push(isNegative ? pattern.negSuf : pattern.posSuf),
                    parts.join("")
                }
                function padNumber(num, digits, trim) {
                    var neg = "";
                    for (0 > num && (neg = "-", num = -num), num = "" + num; num.length < digits;) num = "0" + num;
                    return trim && (num = num.substr(num.length - digits)),
                    neg + num
                }
                function dateGetter(name, size, offset, trim) {
                    return offset = offset || 0,
                    function (date) {
                        var value = date["get" + name]();
                        return (offset > 0 || value > -offset) && (value += offset),
                        0 === value && -12 == offset && (value = 12),
                        padNumber(value, size, trim)
                    }
                }
                function dateStrGetter(name, shortForm) {
                    return function (date, formats) {
                        var value = date["get" + name](),
                        get = uppercase(shortForm ? "SHORT" + name : name);
                        return formats[get][value]
                    }
                }
                function timeZoneGetter(date) {
                    var zone = -1 * date.getTimezoneOffset(),
                    paddedZone = zone >= 0 ? "+" : "";
                    return paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
                }
                function ampmGetter(date, formats) {
                    return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
                }
                function dateFilter($locale) {
                    function jsonStringToDate(string) {
                        var match;
                        if (match = string.match(R_ISO8601_STR)) {
                            var date = new Date(0),
                            tzHour = 0,
                            tzMin = 0,
                            dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                            timeSetter = match[8] ? date.setUTCHours : date.setHours;
                            match[9] && (tzHour = int(match[9] + match[10]), tzMin = int(match[9] + match[11])),
                            dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
                            var h = int(match[4] || 0) - tzHour,
                            m = int(match[5] || 0) - tzMin,
                            s = int(match[6] || 0),
                            ms = Math.round(1e3 * parseFloat("0." + (match[7] || 0)));
                            return timeSetter.call(date, h, m, s, ms),
                            date
                        }
                        return string
                    }
                    var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
                    return function (date, format) {
                        var fn, match, text = "",
                        parts = [];
                        if (format = format || "mediumDate", format = $locale.DATETIME_FORMATS[format] || format, isString(date) && (date = NUMBER_STRING.test(date) ? int(date) : jsonStringToDate(date)), isNumber(date) && (date = new Date(date)), !isDate(date)) return date;
                        for (; format;) match = DATE_FORMATS_SPLIT.exec(format),
                        match ? (parts = concat(parts, match, 1), format = parts.pop()) : (parts.push(format), format = null);
                        return forEach(parts,
                        function (value) {
                            fn = DATE_FORMATS[value],
                            text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
                        }),
                        text
                    }
                }
                function jsonFilter() {
                    return function (object) {
                        return toJson(object, !0)
                    }
                }
                function limitToFilter() {
                    return function (input, limit) {
                        if (!isArray(input) && !isString(input)) return input;
                        if (limit = 1 / 0 === Math.abs(Number(limit)) ? Number(limit) : int(limit), isString(input)) return limit ? limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length) : "";
                        var i, n, out = [];
                        for (limit > input.length ? limit = input.length : limit < -input.length && (limit = -input.length), limit > 0 ? (i = 0, n = limit) : (i = input.length + limit, n = input.length) ; n > i; i++) out.push(input[i]);
                        return out
                    }
                }
                function orderByFilter($parse) {
                    return function (array, sortPredicate, reverseOrder) {
                        function comparator(o1, o2) {
                            for (var i = 0; i < sortPredicate.length; i++) {
                                var comp = sortPredicate[i](o1, o2);
                                if (0 !== comp) return comp
                            }
                            return 0
                        }
                        function reverseComparator(comp, descending) {
                            return toBoolean(descending) ?
                            function (a, b) {
                                return comp(b, a)
                            } : comp
                        }
                        function compare(v1, v2) {
                            var t1 = typeof v1,
                            t2 = typeof v2;
                            return t1 == t2 ? (isDate(v1) && isDate(v2) && (v1 = v1.valueOf(), v2 = v2.valueOf()), "string" == t1 && (v1 = v1.toLowerCase(), v2 = v2.toLowerCase()), v1 === v2 ? 0 : v2 > v1 ? -1 : 1) : t2 > t1 ? -1 : 1
                        }
                        return isArrayLike(array) ? (sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate], 0 === sortPredicate.length && (sortPredicate = ["+"]), sortPredicate = map(sortPredicate,
                        function (predicate) {
                            var descending = !1,
                            get = predicate || identity;
                            if (isString(predicate)) {
                                if (("+" == predicate.charAt(0) || "-" == predicate.charAt(0)) && (descending = "-" == predicate.charAt(0), predicate = predicate.substring(1)), "" === predicate) return reverseComparator(function (a, b) {
                                    return compare(a, b)
                                },
                                descending);
                                if (get = $parse(predicate), get.constant) {
                                    var key = get();
                                    return reverseComparator(function (a, b) {
                                        return compare(a[key], b[key])
                                    },
                                    descending)
                                }
                            }
                            return reverseComparator(function (a, b) {
                                return compare(get(a), get(b))
                            },
                            descending)
                        }), slice.call(array).sort(reverseComparator(comparator, reverseOrder))) : array
                    }
                }
                function ngDirective(directive) {
                    return isFunction(directive) && (directive = {
                        link: directive
                    }),
                    directive.restrict = directive.restrict || "AC",
                    valueFn(directive)
                }
                function FormController(element, attrs, $scope, $animate) {
                    function toggleValidCss(isValid, validationErrorKey) {
                        validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "",
                        $animate.setClass(element, (isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey, (isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey)
                    }
                    var form = this,
                    parentForm = element.parent().controller("form") || nullFormCtrl,
                    invalidCount = 0,
                    errors = form.$error = {},
                    controls = [];
                    form.$name = attrs.name || attrs.ngForm,
                    form.$dirty = !1,
                    form.$pristine = !0,
                    form.$valid = !0,
                    form.$invalid = !1,
                    parentForm.$addControl(form),
                    element.addClass(PRISTINE_CLASS),
                    toggleValidCss(!0),
                    form.$addControl = function (control) {
                        assertNotHasOwnProperty(control.$name, "input"),
                        controls.push(control),
                        control.$name && (form[control.$name] = control)
                    },
                    form.$removeControl = function (control) {
                        control.$name && form[control.$name] === control && delete form[control.$name],
                        forEach(errors,
                        function (queue, validationToken) {
                            form.$setValidity(validationToken, !0, control)
                        }),
                        arrayRemove(controls, control)
                    },
                    form.$setValidity = function (validationToken, isValid, control) {
                        var queue = errors[validationToken];
                        if (isValid) queue && (arrayRemove(queue, control), queue.length || (invalidCount--, invalidCount || (toggleValidCss(isValid), form.$valid = !0, form.$invalid = !1), errors[validationToken] = !1, toggleValidCss(!0, validationToken), parentForm.$setValidity(validationToken, !0, form)));
                        else {
                            if (invalidCount || toggleValidCss(isValid), queue) {
                                if (includes(queue, control)) return
                            } else errors[validationToken] = queue = [],
                            invalidCount++,
                            toggleValidCss(!1, validationToken),
                            parentForm.$setValidity(validationToken, !1, form);
                            queue.push(control),
                            form.$valid = !1,
                            form.$invalid = !0
                        }
                    },
                    form.$setDirty = function () {
                        $animate.removeClass(element, PRISTINE_CLASS),
                        $animate.addClass(element, DIRTY_CLASS),
                        form.$dirty = !0,
                        form.$pristine = !1,
                        parentForm.$setDirty()
                    },
                    form.$setPristine = function () {
                        $animate.removeClass(element, DIRTY_CLASS),
                        $animate.addClass(element, PRISTINE_CLASS),
                        form.$dirty = !1,
                        form.$pristine = !0,
                        forEach(controls,
                        function (control) {
                            control.$setPristine()
                        })
                    }
                }
                function validate(ctrl, validatorName, validity, value) {
                    return ctrl.$setValidity(validatorName, validity),
                    validity ? value : undefined
                }
                function testFlags(validity, flags) {
                    var i, flag;
                    if (flags) for (i = 0; i < flags.length; ++i) if (flag = flags[i], validity[flag]) return !0;
                    return !1
                }
                function addNativeHtml5Validators(ctrl, validatorName, badFlags, ignoreFlags, validity) {
                    if (isObject(validity)) {
                        ctrl.$$hasNativeValidators = !0;
                        var validator = function (value) {
                            return ctrl.$error[validatorName] || testFlags(validity, ignoreFlags) || !testFlags(validity, badFlags) ? value : void ctrl.$setValidity(validatorName, !1)
                        };
                        ctrl.$parsers.push(validator)
                    }
                }
                function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
                    var validity = element.prop(VALIDITY_STATE_PROPERTY),
                    placeholder = element[0].placeholder,
                    noevent = {},
                    type = lowercase(element[0].type);
                    if (ctrl.$$validityState = validity, !$sniffer.android) {
                        var composing = !1;
                        element.on("compositionstart",
                        function () {
                            composing = !0
                        }),
                        element.on("compositionend",
                        function () {
                            composing = !1,
                            listener()
                        })
                    }
                    var listener = function (ev) {
                        if (!composing) {
                            var value = element.val();
                            if (msie && "input" === (ev || noevent).type && element[0].placeholder !== placeholder) return void (placeholder = element[0].placeholder);
                            "password" !== type && toBoolean(attr.ngTrim || "T") && (value = trim(value));
                            var revalidate = validity && ctrl.$$hasNativeValidators; (ctrl.$viewValue !== value || "" === value && revalidate) && (scope.$root.$$phase ? ctrl.$setViewValue(value) : scope.$apply(function () {
                                ctrl.$setViewValue(value)
                            }))
                        }
                    };
                    if ($sniffer.hasEvent("input")) element.on("input", listener);
                    else {
                        var timeout, deferListener = function () {
                            timeout || (timeout = $browser.defer(function () {
                                listener(),
                                timeout = null
                            }))
                        };
                        element.on("keydown",
                        function (event) {
                            var key = event.keyCode;
                            91 === key || key > 15 && 19 > key || key >= 37 && 40 >= key || deferListener()
                        }),
                        $sniffer.hasEvent("paste") && element.on("paste cut", deferListener)
                    }
                    element.on("change", listener),
                    ctrl.$render = function () {
                        element.val(ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue)
                    };
                    var patternValidator, match, pattern = attr.ngPattern;
                    if (pattern) {
                        var validateRegex = function (regexp, value) {
                            return validate(ctrl, "pattern", ctrl.$isEmpty(value) || regexp.test(value), value)
                        };
                        match = pattern.match(/^\/(.*)\/([gim]*)$/),
                        match ? (pattern = new RegExp(match[1], match[2]), patternValidator = function (value) {
                            return validateRegex(pattern, value)
                        }) : patternValidator = function (value) {
                            var patternObj = scope.$eval(pattern);
                            if (!patternObj || !patternObj.test) throw minErr("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", pattern, patternObj, startingTag(element));
                            return validateRegex(patternObj, value)
                        },
                        ctrl.$formatters.push(patternValidator),
                        ctrl.$parsers.push(patternValidator)
                    }
                    if (attr.ngMinlength) {
                        var minlength = int(attr.ngMinlength),
                        minLengthValidator = function (value) {
                            return validate(ctrl, "minlength", ctrl.$isEmpty(value) || value.length >= minlength, value)
                        };
                        ctrl.$parsers.push(minLengthValidator),
                        ctrl.$formatters.push(minLengthValidator)
                    }
                    if (attr.ngMaxlength) {
                        var maxlength = int(attr.ngMaxlength),
                        maxLengthValidator = function (value) {
                            return validate(ctrl, "maxlength", ctrl.$isEmpty(value) || value.length <= maxlength, value)
                        };
                        ctrl.$parsers.push(maxLengthValidator),
                        ctrl.$formatters.push(maxLengthValidator)
                    }
                }
                function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
                    if (textInputType(scope, element, attr, ctrl, $sniffer, $browser), ctrl.$parsers.push(function (value) {
                        var empty = ctrl.$isEmpty(value);
                        return empty || NUMBER_REGEXP.test(value) ? (ctrl.$setValidity("number", !0), "" === value ? null : empty ? value : parseFloat(value)) : (ctrl.$setValidity("number", !1), undefined)
                    }), addNativeHtml5Validators(ctrl, "number", numberBadFlags, null, ctrl.$$validityState), ctrl.$formatters.push(function (value) {
                        return ctrl.$isEmpty(value) ? "" : "" + value
                    }), attr.min) {
                        var minValidator = function (value) {
                            var min = parseFloat(attr.min);
                            return validate(ctrl, "min", ctrl.$isEmpty(value) || value >= min, value)
                        };
                        ctrl.$parsers.push(minValidator),
                        ctrl.$formatters.push(minValidator)
                    }
                    if (attr.max) {
                        var maxValidator = function (value) {
                            var max = parseFloat(attr.max);
                            return validate(ctrl, "max", ctrl.$isEmpty(value) || max >= value, value)
                        };
                        ctrl.$parsers.push(maxValidator),
                        ctrl.$formatters.push(maxValidator)
                    }
                    ctrl.$formatters.push(function (value) {
                        return validate(ctrl, "number", ctrl.$isEmpty(value) || isNumber(value), value)
                    })
                }
                function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
                    textInputType(scope, element, attr, ctrl, $sniffer, $browser);
                    var urlValidator = function (value) {
                        return validate(ctrl, "url", ctrl.$isEmpty(value) || URL_REGEXP.test(value), value)
                    };
                    ctrl.$formatters.push(urlValidator),
                    ctrl.$parsers.push(urlValidator)
                }
                function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
                    textInputType(scope, element, attr, ctrl, $sniffer, $browser);
                    var emailValidator = function (value) {
                        return validate(ctrl, "email", ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value), value)
                    };
                    ctrl.$formatters.push(emailValidator),
                    ctrl.$parsers.push(emailValidator)
                }
                function radioInputType(scope, element, attr, ctrl) {
                    isUndefined(attr.name) && element.attr("name", nextUid()),
                    element.on("click",
                    function () {
                        element[0].checked && scope.$apply(function () {
                            ctrl.$setViewValue(attr.value)
                        })
                    }),
                    ctrl.$render = function () {
                        var value = attr.value;
                        element[0].checked = value == ctrl.$viewValue
                    },
                    attr.$observe("value", ctrl.$render)
                }
                function checkboxInputType(scope, element, attr, ctrl) {
                    var trueValue = attr.ngTrueValue,
                    falseValue = attr.ngFalseValue;
                    isString(trueValue) || (trueValue = !0),
                    isString(falseValue) || (falseValue = !1),
                    element.on("click",
                    function () {
                        scope.$apply(function () {
                            ctrl.$setViewValue(element[0].checked)
                        })
                    }),
                    ctrl.$render = function () {
                        element[0].checked = ctrl.$viewValue
                    },
                    ctrl.$isEmpty = function (value) {
                        return value !== trueValue
                    },
                    ctrl.$formatters.push(function (value) {
                        return value === trueValue
                    }),
                    ctrl.$parsers.push(function (value) {
                        return value ? trueValue : falseValue
                    })
                }
                function classDirective(name, selector) {
                    return name = "ngClass" + name,
                    ["$animate",
                    function ($animate) {
                        function arrayDifference(tokens1, tokens2) {
                            var values = [];
                            outer: for (var i = 0; i < tokens1.length; i++) {
                                for (var token = tokens1[i], j = 0; j < tokens2.length; j++) if (token == tokens2[j]) continue outer;
                                values.push(token)
                            }
                            return values
                        }
                        function arrayClasses(classVal) {
                            if (isArray(classVal)) return classVal;
                            if (isString(classVal)) return classVal.split(" ");
                            if (isObject(classVal)) {
                                var classes = [];
                                return forEach(classVal,
                                function (v, k) {
                                    v && (classes = classes.concat(k.split(" ")))
                                }),
                                classes
                            }
                            return classVal
                        }
                        return {
                            restrict: "AC",
                            link: function (scope, element, attr) {
                                function addClasses(classes) {
                                    var newClasses = digestClassCounts(classes, 1);
                                    attr.$addClass(newClasses)
                                }
                                function removeClasses(classes) {
                                    var newClasses = digestClassCounts(classes, -1);
                                    attr.$removeClass(newClasses)
                                }
                                function digestClassCounts(classes, count) {
                                    var classCounts = element.data("$classCounts") || {},
                                    classesToUpdate = [];
                                    return forEach(classes,
                                    function (className) {
                                        (count > 0 || classCounts[className]) && (classCounts[className] = (classCounts[className] || 0) + count, classCounts[className] === +(count > 0) && classesToUpdate.push(className))
                                    }),
                                    element.data("$classCounts", classCounts),
                                    classesToUpdate.join(" ")
                                }
                                function updateClasses(oldClasses, newClasses) {
                                    var toAdd = arrayDifference(newClasses, oldClasses),
                                    toRemove = arrayDifference(oldClasses, newClasses);
                                    toRemove = digestClassCounts(toRemove, -1),
                                    toAdd = digestClassCounts(toAdd, 1),
                                    0 === toAdd.length ? $animate.removeClass(element, toRemove) : 0 === toRemove.length ? $animate.addClass(element, toAdd) : $animate.setClass(element, toAdd, toRemove)
                                }
                                function ngClassWatchAction(newVal) {
                                    if (selector === !0 || scope.$index % 2 === selector) {
                                        var newClasses = arrayClasses(newVal || []);
                                        if (oldVal) {
                                            if (!equals(newVal, oldVal)) {
                                                var oldClasses = arrayClasses(oldVal);
                                                updateClasses(oldClasses, newClasses)
                                            }
                                        } else addClasses(newClasses)
                                    }
                                    oldVal = shallowCopy(newVal)
                                }
                                var oldVal;
                                scope.$watch(attr[name], ngClassWatchAction, !0),
                                attr.$observe("class",
                                function () {
                                    ngClassWatchAction(scope.$eval(attr[name]))
                                }),
                                "ngClass" !== name && scope.$watch("$index",
                                function ($index, old$index) {
                                    var mod = 1 & $index;
                                    if (mod !== (1 & old$index)) {
                                        var classes = arrayClasses(scope.$eval(attr[name]));
                                        mod === selector ? addClasses(classes) : removeClasses(classes)
                                    }
                                })
                            }
                        }
                    }]
                }
                var VALIDITY_STATE_PROPERTY = "validity",
                lowercase = function (string) {
                    return isString(string) ? string.toLowerCase() : string
                },
                hasOwnProperty = Object.prototype.hasOwnProperty,
                uppercase = function (string) {
                    return isString(string) ? string.toUpperCase() : string
                },
                manualLowercase = function (s) {
                    return isString(s) ? s.replace(/[A-Z]/g,
                    function (ch) {
                        return String.fromCharCode(32 | ch.charCodeAt(0))
                    }) : s
                },
                manualUppercase = function (s) {
                    return isString(s) ? s.replace(/[a-z]/g,
                    function (ch) {
                        return String.fromCharCode(-33 & ch.charCodeAt(0))
                    }) : s
                };
                "i" !== "I".toLowerCase() && (lowercase = manualLowercase, uppercase = manualUppercase);
                var msie, jqLite, jQuery, angularModule, nodeName_, slice = [].slice,
                push = [].push,
                toString = Object.prototype.toString,
                ngMinErr = minErr("ng"),
                angular = window.angular || (window.angular = {}),
                uid = ["0", "0", "0"];
                msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]),
                isNaN(msie) && (msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1])),
                noop.$inject = [],
                identity.$inject = [];
                var isArray = function () {
                    return isFunction(Array.isArray) ? Array.isArray : function (value) {
                        return "[object Array]" === toString.call(value)
                    }
                }(),
                trim = function () {
                    return String.prototype.trim ?
                    function (value) {
                        return isString(value) ? value.trim() : value
                    } : function (value) {
                        return isString(value) ? value.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : value
                    }
                }();
                nodeName_ = 9 > msie ?
                function (element) {
                    return element = element.nodeName ? element : element[0],
                    element.scopeName && "HTML" != element.scopeName ? uppercase(element.scopeName + ":" + element.nodeName) : element.nodeName
                } : function (element) {
                    return element.nodeName ? element.nodeName : element[0].nodeName
                };
                var csp = function () {
                    if (isDefined(csp.isActive_)) return csp.isActive_;
                    var active = !(!document.querySelector("[ng-csp]") && !document.querySelector("[data-ng-csp]"));
                    if (!active) try {
                        new Function("")
                    } catch (e) {
                        active = !0
                    }
                    return csp.isActive_ = active
                },
                SNAKE_CASE_REGEXP = /[A-Z]/g,
                version = {
                    full: "1.2.27",
                    major: 1,
                    minor: 2,
                    dot: 27,
                    codeName: "prime-factorization"
                };
                JQLite.expando = "ng339";
                var jqCache = JQLite.cache = {},
                jqId = 1,
                addEventListenerFn = window.document.addEventListener ?
                function (element, type, fn) {
                    element.addEventListener(type, fn, !1)
                } : function (element, type, fn) {
                    element.attachEvent("on" + type, fn)
                },
                removeEventListenerFn = window.document.removeEventListener ?
                function (element, type, fn) {
                    element.removeEventListener(type, fn, !1)
                } : function (element, type, fn) {
                    element.detachEvent("on" + type, fn)
                },
                SPECIAL_CHARS_REGEXP = (JQLite._data = function (node) {
                    return this.cache[node[this.expando]] || {}
                },
                /([\:\-\_]+(.))/g),
                MOZ_HACK_REGEXP = /^moz([A-Z])/,
                jqLiteMinErr = minErr("jqLite"),
                SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                HTML_REGEXP = /<|&#?\w+;/,
                TAG_NAME_REGEXP = /<([\w:]+)/,
                XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                wrapMap = {
                    option: [1, '<select multiple="multiple">', "</select>"],
                    thead: [1, "<table>", "</table>"],
                    col: [2, "<table><colgroup>", "</colgroup></table>"],
                    tr: [2, "<table><tbody>", "</tbody></table>"],
                    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                    _default: [0, "", ""]
                };
                wrapMap.optgroup = wrapMap.option,
                wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead,
                wrapMap.th = wrapMap.td;
                var JQLitePrototype = JQLite.prototype = {
                    ready: function (fn) {
                        function trigger() {
                            fired || (fired = !0, fn())
                        }
                        var fired = !1;
                        "complete" === document.readyState ? setTimeout(trigger) : (this.on("DOMContentLoaded", trigger), JQLite(window).on("load", trigger))
                    },
                    toString: function () {
                        var value = [];
                        return forEach(this,
                        function (e) {
                            value.push("" + e)
                        }),
                        "[" + value.join(", ") + "]"
                    },
                    eq: function (index) {
                        return jqLite(index >= 0 ? this[index] : this[this.length + index])
                    },
                    length: 0,
                    push: push,
                    sort: [].sort,
                    splice: [].splice
                },
                BOOLEAN_ATTR = {};
                forEach("multiple,selected,checked,disabled,readOnly,required,open".split(","),
                function (value) {
                    BOOLEAN_ATTR[lowercase(value)] = value
                });
                var BOOLEAN_ELEMENTS = {};
                forEach("input,select,option,textarea,button,form,details".split(","),
                function (value) {
                    BOOLEAN_ELEMENTS[uppercase(value)] = !0
                }),
                forEach({
                    data: jqLiteData,
                    removeData: jqLiteRemoveData
                },
                function (fn, name) {
                    JQLite[name] = fn
                }),
                forEach({
                    data: jqLiteData,
                    inheritedData: jqLiteInheritedData,
                    scope: function (element) {
                        return jqLite.data(element, "$scope") || jqLiteInheritedData(element.parentNode || element, ["$isolateScope", "$scope"])
                    },
                    isolateScope: function (element) {
                        return jqLite.data(element, "$isolateScope") || jqLite.data(element, "$isolateScopeNoTemplate")
                    },
                    controller: jqLiteController,
                    injector: function (element) {
                        return jqLiteInheritedData(element, "$injector")
                    },
                    removeAttr: function (element, name) {
                        element.removeAttribute(name)
                    },
                    hasClass: jqLiteHasClass,
                    css: function (element, name, value) {
                        if (name = camelCase(name), !isDefined(value)) {
                            var val;
                            return 8 >= msie && (val = element.currentStyle && element.currentStyle[name], "" === val && (val = "auto")),
                            val = val || element.style[name],
                            8 >= msie && (val = "" === val ? undefined : val),
                            val
                        }
                        element.style[name] = value
                    },
                    attr: function (element, name, value) {
                        var lowercasedName = lowercase(name);
                        if (BOOLEAN_ATTR[lowercasedName]) {
                            if (!isDefined(value)) return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
                            value ? (element[name] = !0, element.setAttribute(name, lowercasedName)) : (element[name] = !1, element.removeAttribute(lowercasedName))
                        } else if (isDefined(value)) element.setAttribute(name, value);
                        else if (element.getAttribute) {
                            var ret = element.getAttribute(name, 2);
                            return null === ret ? undefined : ret
                        }
                    },
                    prop: function (element, name, value) {
                        return isDefined(value) ? void (element[name] = value) : element[name]
                    },
                    text: function () {
                        function getText(element, value) {
                            var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
                            return isUndefined(value) ? textProp ? element[textProp] : "" : void (element[textProp] = value)
                        }
                        var NODE_TYPE_TEXT_PROPERTY = [];
                        return 9 > msie ? (NODE_TYPE_TEXT_PROPERTY[1] = "innerText", NODE_TYPE_TEXT_PROPERTY[3] = "nodeValue") : NODE_TYPE_TEXT_PROPERTY[1] = NODE_TYPE_TEXT_PROPERTY[3] = "textContent",
                        getText.$dv = "",
                        getText
                    }(),
                    val: function (element, value) {
                        if (isUndefined(value)) {
                            if ("SELECT" === nodeName_(element) && element.multiple) {
                                var result = [];
                                return forEach(element.options,
                                function (option) {
                                    option.selected && result.push(option.value || option.text)
                                }),
                                0 === result.length ? null : result
                            }
                            return element.value
                        }
                        element.value = value
                    },
                    html: function (element, value) {
                        if (isUndefined(value)) return element.innerHTML;
                        for (var i = 0,
                        childNodes = element.childNodes; i < childNodes.length; i++) jqLiteDealoc(childNodes[i]);
                        element.innerHTML = value
                    },
                    empty: jqLiteEmpty
                },
                function (fn, name) {
                    JQLite.prototype[name] = function (arg1, arg2) {
                        var i, key, nodeCount = this.length;
                        if (fn !== jqLiteEmpty && (2 == fn.length && fn !== jqLiteHasClass && fn !== jqLiteController ? arg1 : arg2) === undefined) {
                            if (isObject(arg1)) {
                                for (i = 0; nodeCount > i; i++) if (fn === jqLiteData) fn(this[i], arg1);
                                else for (key in arg1) fn(this[i], key, arg1[key]);
                                return this
                            }
                            for (var value = fn.$dv,
                            jj = value === undefined ? Math.min(nodeCount, 1) : nodeCount, j = 0; jj > j; j++) {
                                var nodeValue = fn(this[j], arg1, arg2);
                                value = value ? value + nodeValue : nodeValue
                            }
                            return value
                        }
                        for (i = 0; nodeCount > i; i++) fn(this[i], arg1, arg2);
                        return this
                    }
                }),
                forEach({
                    removeData: jqLiteRemoveData,
                    dealoc: jqLiteDealoc,
                    on: function onFn(element, type, fn, unsupported) {
                        if (isDefined(unsupported)) throw jqLiteMinErr("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
                        var events = jqLiteExpandoStore(element, "events"),
                        handle = jqLiteExpandoStore(element, "handle");
                        events || jqLiteExpandoStore(element, "events", events = {}),
                        handle || jqLiteExpandoStore(element, "handle", handle = createEventHandler(element, events)),
                        forEach(type.split(" "),
                        function (type) {
                            var eventFns = events[type];
                            if (!eventFns) {
                                if ("mouseenter" == type || "mouseleave" == type) {
                                    var contains = document.body.contains || document.body.compareDocumentPosition ?
                                    function (a, b) {
                                        var adown = 9 === a.nodeType ? a.documentElement : a,
                                        bup = b && b.parentNode;
                                        return a === bup || !(!bup || 1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)))
                                    } : function (a, b) {
                                        if (b) for (; b = b.parentNode;) if (b === a) return !0;
                                        return !1
                                    };
                                    events[type] = [];
                                    var eventmap = {
                                        mouseleave: "mouseout",
                                        mouseenter: "mouseover"
                                    };
                                    onFn(element, eventmap[type],
                                    function (event) {
                                        var target = this,
                                        related = event.relatedTarget; (!related || related !== target && !contains(target, related)) && handle(event, type)
                                    })
                                } else addEventListenerFn(element, type, handle),
                                events[type] = [];
                                eventFns = events[type]
                            }
                            eventFns.push(fn)
                        })
                    },
                    off: jqLiteOff,
                    one: function (element, type, fn) {
                        element = jqLite(element),
                        element.on(type,
                        function onFn() {
                            element.off(type, fn),
                            element.off(type, onFn)
                        }),
                        element.on(type, fn)
                    },
                    replaceWith: function (element, replaceNode) {
                        var index, parent = element.parentNode;
                        jqLiteDealoc(element),
                        forEach(new JQLite(replaceNode),
                        function (node) {
                            index ? parent.insertBefore(node, index.nextSibling) : parent.replaceChild(node, element),
                            index = node
                        })
                    },
                    children: function (element) {
                        var children = [];
                        return forEach(element.childNodes,
                        function (element) {
                            1 === element.nodeType && children.push(element)
                        }),
                        children
                    },
                    contents: function (element) {
                        return element.contentDocument || element.childNodes || []
                    },
                    append: function (element, node) {
                        forEach(new JQLite(node),
                        function (child) {
                            (1 === element.nodeType || 11 === element.nodeType) && element.appendChild(child)
                        })
                    },
                    prepend: function (element, node) {
                        if (1 === element.nodeType) {
                            var index = element.firstChild;
                            forEach(new JQLite(node),
                            function (child) {
                                element.insertBefore(child, index)
                            })
                        }
                    },
                    wrap: function (element, wrapNode) {
                        wrapNode = jqLite(wrapNode)[0];
                        var parent = element.parentNode;
                        parent && parent.replaceChild(wrapNode, element),
                        wrapNode.appendChild(element)
                    },
                    remove: function (element) {
                        jqLiteDealoc(element);
                        var parent = element.parentNode;
                        parent && parent.removeChild(element)
                    },
                    after: function (element, newElement) {
                        var index = element,
                        parent = element.parentNode;
                        forEach(new JQLite(newElement),
                        function (node) {
                            parent.insertBefore(node, index.nextSibling),
                            index = node
                        })
                    },
                    addClass: jqLiteAddClass,
                    removeClass: jqLiteRemoveClass,
                    toggleClass: function (element, selector, condition) {
                        selector && forEach(selector.split(" "),
                        function (className) {
                            var classCondition = condition;
                            isUndefined(classCondition) && (classCondition = !jqLiteHasClass(element, className)),
                            (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className)
                        })
                    },
                    parent: function (element) {
                        var parent = element.parentNode;
                        return parent && 11 !== parent.nodeType ? parent : null
                    },
                    next: function (element) {
                        if (element.nextElementSibling) return element.nextElementSibling;
                        for (var elm = element.nextSibling; null != elm && 1 !== elm.nodeType;) elm = elm.nextSibling;
                        return elm
                    },
                    find: function (element, selector) {
                        return element.getElementsByTagName ? element.getElementsByTagName(selector) : []
                    },
                    clone: jqLiteClone,
                    triggerHandler: function (element, event, extraParameters) {
                        var dummyEvent, eventFnsCopy, handlerArgs, eventName = event.type || event,
                        eventFns = (jqLiteExpandoStore(element, "events") || {})[eventName];
                        eventFns && (dummyEvent = {
                            preventDefault: function () {
                                this.defaultPrevented = !0
                            },
                            isDefaultPrevented: function () {
                                return this.defaultPrevented === !0
                            },
                            stopPropagation: noop,
                            type: eventName,
                            target: element
                        },
                        event.type && (dummyEvent = extend(dummyEvent, event)), eventFnsCopy = shallowCopy(eventFns), handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent], forEach(eventFnsCopy,
                        function (fn) {
                            fn.apply(element, handlerArgs)
                        }))
                    }
                },
                function (fn, name) {
                    JQLite.prototype[name] = function (arg1, arg2, arg3) {
                        for (var value, i = 0; i < this.length; i++) isUndefined(value) ? (value = fn(this[i], arg1, arg2, arg3), isDefined(value) && (value = jqLite(value))) : jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
                        return isDefined(value) ? value : this
                    },
                    JQLite.prototype.bind = JQLite.prototype.on,
                    JQLite.prototype.unbind = JQLite.prototype.off
                }),
                HashMap.prototype = {
                    put: function (key, value) {
                        this[hashKey(key, this.nextUid)] = value
                    },
                    get: function (key) {
                        return this[hashKey(key, this.nextUid)]
                    },
                    remove: function (key) {
                        var value = this[key = hashKey(key, this.nextUid)];
                        return delete this[key],
                        value
                    }
                };
                var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
                FN_ARG_SPLIT = /,/,
                FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
                STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
                $injectorMinErr = minErr("$injector"),
                $animateMinErr = minErr("$animate"),
                $AnimateProvider = ["$provide",
                function ($provide) {
                    this.$$selectors = {},
                    this.register = function (name, factory) {
                        var key = name + "-animation";
                        if (name && "." != name.charAt(0)) throw $animateMinErr("notcsel", "Expecting class selector starting with '.' got '{0}'.", name);
                        this.$$selectors[name.substr(1)] = key,
                        $provide.factory(key, factory)
                    },
                    this.classNameFilter = function (expression) {
                        return 1 === arguments.length && (this.$$classNameFilter = expression instanceof RegExp ? expression : null),
                        this.$$classNameFilter
                    },
                    this.$get = ["$timeout", "$$asyncCallback",
                    function ($timeout, $$asyncCallback) {
                        function async(fn) {
                            fn && $$asyncCallback(fn)
                        }
                        return {
                            enter: function (element, parent, after, done) {
                                after ? after.after(element) : (parent && parent[0] || (parent = after.parent()), parent.append(element)),
                                async(done)
                            },
                            leave: function (element, done) {
                                element.remove(),
                                async(done)
                            },
                            move: function (element, parent, after, done) {
                                this.enter(element, parent, after, done)
                            },
                            addClass: function (element, className, done) {
                                className = isString(className) ? className : isArray(className) ? className.join(" ") : "",
                                forEach(element,
                                function (element) {
                                    jqLiteAddClass(element, className)
                                }),
                                async(done)
                            },
                            removeClass: function (element, className, done) {
                                className = isString(className) ? className : isArray(className) ? className.join(" ") : "",
                                forEach(element,
                                function (element) {
                                    jqLiteRemoveClass(element, className)
                                }),
                                async(done)
                            },
                            setClass: function (element, add, remove, done) {
                                forEach(element,
                                function (element) {
                                    jqLiteAddClass(element, add),
                                    jqLiteRemoveClass(element, remove)
                                }),
                                async(done)
                            },
                            enabled: noop
                        }
                    }]
                }],
                $compileMinErr = minErr("$compile");
                $CompileProvider.$inject = ["$provide", "$$sanitizeUriProvider"];
                var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i,
                $interpolateMinErr = minErr("$interpolate"),
                PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
                DEFAULT_PORTS = {
                    http: 80,
                    https: 443,
                    ftp: 21
                },
                $locationMinErr = minErr("$location");
                LocationHashbangInHtml5Url.prototype = LocationHashbangUrl.prototype = LocationHtml5Url.prototype = {
                    $$html5: !1,
                    $$replace: !1,
                    absUrl: locationGetter("$$absUrl"),
                    url: function (url) {
                        if (isUndefined(url)) return this.$$url;
                        var match = PATH_MATCH.exec(url);
                        return match[1] && this.path(decodeURIComponent(match[1])),
                        (match[2] || match[1]) && this.search(match[3] || ""),
                        this.hash(match[5] || ""),
                        this
                    },
                    protocol: locationGetter("$$protocol"),
                    host: locationGetter("$$host"),
                    port: locationGetter("$$port"),
                    path: locationGetterSetter("$$path",
                    function (path) {
                        return path = null !== path ? path.toString() : "",
                        "/" == path.charAt(0) ? path : "/" + path
                    }),
                    search: function (search, paramValue) {
                        switch (arguments.length) {
                            case 0:
                                return this.$$search;
                            case 1:
                                if (isString(search) || isNumber(search)) search = search.toString(),
                                this.$$search = parseKeyValue(search);
                                else {
                                    if (!isObject(search)) throw $locationMinErr("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                                    forEach(search,
                                    function (value, key) {
                                        null == value && delete search[key]
                                    }),
                                    this.$$search = search
                                }
                                break;
                            default:
                                isUndefined(paramValue) || null === paramValue ? delete this.$$search[search] : this.$$search[search] = paramValue
                        }
                        return this.$$compose(),
                        this
                    },
                    hash: locationGetterSetter("$$hash",
                    function (hash) {
                        return null !== hash ? hash.toString() : ""
                    }),
                    replace: function () {
                        return this.$$replace = !0,
                        this
                    }
                };
                var promiseWarning, $parseMinErr = minErr("$parse"),
                promiseWarningCache = {},
                CALL = Function.prototype.call,
                APPLY = Function.prototype.apply,
                BIND = Function.prototype.bind,
                OPERATORS = {
                    "null": function () {
                        return null
                    },
                    "true": function () {
                        return !0
                    },
                    "false": function () {
                        return !1
                    },
                    undefined: noop,
                    "+": function (self, locals, a, b) {
                        return a = a(self, locals),
                        b = b(self, locals),
                        isDefined(a) ? isDefined(b) ? a + b : a : isDefined(b) ? b : undefined
                    },
                    "-": function (self, locals, a, b) {
                        return a = a(self, locals),
                        b = b(self, locals),
                        (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0)
                    },
                    "*": function (self, locals, a, b) {
                        return a(self, locals) * b(self, locals)
                    },
                    "/": function (self, locals, a, b) {
                        return a(self, locals) / b(self, locals)
                    },
                    "%": function (self, locals, a, b) {
                        return a(self, locals) % b(self, locals)
                    },
                    "^": function (self, locals, a, b) {
                        return a(self, locals) ^ b(self, locals)
                    },
                    "=": noop,
                    "===": function (self, locals, a, b) {
                        return a(self, locals) === b(self, locals)
                    },
                    "!==": function (self, locals, a, b) {
                        return a(self, locals) !== b(self, locals)
                    },
                    "==": function (self, locals, a, b) {
                        return a(self, locals) == b(self, locals)
                    },
                    "!=": function (self, locals, a, b) {
                        return a(self, locals) != b(self, locals)
                    },
                    "<": function (self, locals, a, b) {
                        return a(self, locals) < b(self, locals)
                    },
                    ">": function (self, locals, a, b) {
                        return a(self, locals) > b(self, locals)
                    },
                    "<=": function (self, locals, a, b) {
                        return a(self, locals) <= b(self, locals)
                    },
                    ">=": function (self, locals, a, b) {
                        return a(self, locals) >= b(self, locals)
                    },
                    "&&": function (self, locals, a, b) {
                        return a(self, locals) && b(self, locals)
                    },
                    "||": function (self, locals, a, b) {
                        return a(self, locals) || b(self, locals)
                    },
                    "&": function (self, locals, a, b) {
                        return a(self, locals) & b(self, locals)
                    },
                    "|": function (self, locals, a, b) {
                        return b(self, locals)(self, locals, a(self, locals))
                    },
                    "!": function (self, locals, a) {
                        return !a(self, locals)
                    }
                },
                ESCAPE = {
                    n: "\n",
                    f: "\f",
                    r: "\r",
                    t: "    ",
                    v: "",
                    "'": "'",
                    '"': '"'
                },
                Lexer = function (options) {
                    this.options = options
                };
                Lexer.prototype = {
                    constructor: Lexer,
                    lex: function (text) {
                        for (this.text = text, this.index = 0, this.ch = undefined, this.lastCh = ":", this.tokens = []; this.index < this.text.length;) {
                            if (this.ch = this.text.charAt(this.index), this.is("\"'")) this.readString(this.ch);
                            else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek())) this.readNumber();
                            else if (this.isIdent(this.ch)) this.readIdent();
                            else if (this.is("(){}[].,;:?")) this.tokens.push({
                                index: this.index,
                                text: this.ch
                            }),
                            this.index++;
                            else {
                                if (this.isWhitespace(this.ch)) {
                                    this.index++;
                                    continue
                                }
                                var ch2 = this.ch + this.peek(),
                                ch3 = ch2 + this.peek(2),
                                fn = OPERATORS[this.ch],
                                fn2 = OPERATORS[ch2],
                                fn3 = OPERATORS[ch3];
                                fn3 ? (this.tokens.push({
                                    index: this.index,
                                    text: ch3,
                                    fn: fn3
                                }), this.index += 3) : fn2 ? (this.tokens.push({
                                    index: this.index,
                                    text: ch2,
                                    fn: fn2
                                }), this.index += 2) : fn ? (this.tokens.push({
                                    index: this.index,
                                    text: this.ch,
                                    fn: fn
                                }), this.index += 1) : this.throwError("Unexpected next character ", this.index, this.index + 1)
                            }
                            this.lastCh = this.ch
                        }
                        return this.tokens
                    },
                    is: function (chars) {
                        return -1 !== chars.indexOf(this.ch)
                    },
                    was: function (chars) {
                        return -1 !== chars.indexOf(this.lastCh)
                    },
                    peek: function (i) {
                        var num = i || 1;
                        return this.index + num < this.text.length ? this.text.charAt(this.index + num) : !1
                    },
                    isNumber: function (ch) {
                        return ch >= "0" && "9" >= ch
                    },
                    isWhitespace: function (ch) {
                        return " " === ch || "\r" === ch || "   " === ch || "\n" === ch || "" === ch || " " === ch
                    },
                    isIdent: function (ch) {
                        return ch >= "a" && "z" >= ch || ch >= "A" && "Z" >= ch || "_" === ch || "$" === ch
                    },
                    isExpOperator: function (ch) {
                        return "-" === ch || "+" === ch || this.isNumber(ch)
                    },
                    throwError: function (error, start, end) {
                        end = end || this.index;
                        var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
                        throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text)
                    },
                    readNumber: function () {
                        for (var number = "",
                        start = this.index; this.index < this.text.length;) {
                            var ch = lowercase(this.text.charAt(this.index));
                            if ("." == ch || this.isNumber(ch)) number += ch;
                            else {
                                var peekCh = this.peek();
                                if ("e" == ch && this.isExpOperator(peekCh)) number += ch;
                                else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && "e" == number.charAt(number.length - 1)) number += ch;
                                else {
                                    if (!this.isExpOperator(ch) || peekCh && this.isNumber(peekCh) || "e" != number.charAt(number.length - 1)) break;
                                    this.throwError("Invalid exponent")
                                }
                            }
                            this.index++
                        }
                        number = 1 * number,
                        this.tokens.push({
                            index: start,
                            text: number,
                            literal: !0,
                            constant: !0,
                            fn: function () {
                                return number
                            }
                        })
                    },
                    readIdent: function () {
                        for (var lastDot, peekIndex, methodName, ch, parser = this,
                        ident = "",
                        start = this.index; this.index < this.text.length && (ch = this.text.charAt(this.index), "." === ch || this.isIdent(ch) || this.isNumber(ch)) ;) "." === ch && (lastDot = this.index),
                        ident += ch,
                        this.index++;
                        if (lastDot) for (peekIndex = this.index; peekIndex < this.text.length;) {
                            if (ch = this.text.charAt(peekIndex), "(" === ch) {
                                methodName = ident.substr(lastDot - start + 1),
                                ident = ident.substr(0, lastDot - start),
                                this.index = peekIndex;
                                break
                            }
                            if (!this.isWhitespace(ch)) break;
                            peekIndex++
                        }
                        var token = {
                            index: start,
                            text: ident
                        };
                        if (OPERATORS.hasOwnProperty(ident)) token.fn = OPERATORS[ident],
                        token.literal = !0,
                        token.constant = !0;
                        else {
                            var getter = getterFn(ident, this.options, this.text);
                            token.fn = extend(function (self, locals) {
                                return getter(self, locals)
                            },
                            {
                                assign: function (self, value) {
                                    return setter(self, ident, value, parser.text, parser.options)
                                }
                            })
                        }
                        this.tokens.push(token),
                        methodName && (this.tokens.push({
                            index: lastDot,
                            text: "."
                        }), this.tokens.push({
                            index: lastDot + 1,
                            text: methodName
                        }))
                    },
                    readString: function (quote) {
                        var start = this.index;
                        this.index++;
                        for (var string = "",
                        rawString = quote,
                        escape = !1; this.index < this.text.length;) {
                            var ch = this.text.charAt(this.index);
                            if (rawString += ch, escape) {
                                if ("u" === ch) {
                                    var hex = this.text.substring(this.index + 1, this.index + 5);
                                    hex.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + hex + "]"),
                                    this.index += 4,
                                    string += String.fromCharCode(parseInt(hex, 16))
                                } else {
                                    var rep = ESCAPE[ch];
                                    string += rep || ch
                                }
                                escape = !1
                            } else if ("\\" === ch) escape = !0;
                            else {
                                if (ch === quote) return this.index++,
                                void this.tokens.push({
                                    index: start,
                                    text: rawString,
                                    string: string,
                                    literal: !0,
                                    constant: !0,
                                    fn: function () {
                                        return string
                                    }
                                });
                                string += ch
                            }
                            this.index++
                        }
                        this.throwError("Unterminated quote", start)
                    }
                };
                var Parser = function (lexer, $filter, options) {
                    this.lexer = lexer,
                    this.$filter = $filter,
                    this.options = options
                };
                Parser.ZERO = extend(function () {
                    return 0
                },
                {
                    constant: !0
                }),
                Parser.prototype = {
                    constructor: Parser,
                    parse: function (text) {
                        this.text = text,
                        this.tokens = this.lexer.lex(text);
                        var value = this.statements();
                        return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]),
                        value.literal = !!value.literal,
                        value.constant = !!value.constant,
                        value
                    },
                    primary: function () {
                        var primary;
                        if (this.expect("(")) primary = this.filterChain(),
                        this.consume(")");
                        else if (this.expect("[")) primary = this.arrayDeclaration();
                        else if (this.expect("{")) primary = this.object();
                        else {
                            var token = this.expect();
                            primary = token.fn,
                            primary || this.throwError("not a primary expression", token),
                            primary.literal = !!token.literal,
                            primary.constant = !!token.constant
                        }
                        for (var next, context; next = this.expect("(", "[", ".") ;) "(" === next.text ? (primary = this.functionCall(primary, context), context = null) : "[" === next.text ? (context = primary, primary = this.objectIndex(primary)) : "." === next.text ? (context = primary, primary = this.fieldAccess(primary)) : this.throwError("IMPOSSIBLE");
                        return primary
                    },
                    throwError: function (msg, token) {
                        throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index))
                    },
                    peekToken: function () {
                        if (0 === this.tokens.length) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
                        return this.tokens[0]
                    },
                    peek: function (e1, e2, e3, e4) {
                        if (this.tokens.length > 0) {
                            var token = this.tokens[0],
                            t = token.text;
                            if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) return token
                        }
                        return !1
                    },
                    expect: function (e1, e2, e3, e4) {
                        var token = this.peek(e1, e2, e3, e4);
                        return token ? (this.tokens.shift(), token) : !1
                    },
                    consume: function (e1) {
                        this.expect(e1) || this.throwError("is unexpected, expecting [" + e1 + "]", this.peek())
                    },
                    unaryFn: function (fn, right) {
                        return extend(function (self, locals) {
                            return fn(self, locals, right)
                        },
                        {
                            constant: right.constant
                        })
                    },
                    ternaryFn: function (left, middle, right) {
                        return extend(function (self, locals) {
                            return left(self, locals) ? middle(self, locals) : right(self, locals)
                        },
                        {
                            constant: left.constant && middle.constant && right.constant
                        })
                    },
                    binaryFn: function (left, fn, right) {
                        return extend(function (self, locals) {
                            return fn(self, locals, left, right)
                        },
                        {
                            constant: left.constant && right.constant
                        })
                    },
                    statements: function () {
                        for (var statements = []; ;) if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && statements.push(this.filterChain()), !this.expect(";")) return 1 === statements.length ? statements[0] : function (self, locals) {
                            for (var value, i = 0; i < statements.length; i++) {
                                var statement = statements[i];
                                statement && (value = statement(self, locals))
                            }
                            return value
                        }
                    },
                    filterChain: function () {
                        for (var token, left = this.expression() ; ;) {
                            if (!(token = this.expect("|"))) return left;
                            left = this.binaryFn(left, token.fn, this.filter())
                        }
                    },
                    filter: function () {
                        for (var token = this.expect(), fn = this.$filter(token.text), argsFn = []; ;) {
                            if (!(token = this.expect(":"))) {
                                var fnInvoke = function (self, locals, input) {
                                    for (var args = [input], i = 0; i < argsFn.length; i++) args.push(argsFn[i](self, locals));
                                    return fn.apply(self, args)
                                };
                                return function () {
                                    return fnInvoke
                                }
                            }
                            argsFn.push(this.expression())
                        }
                    },
                    expression: function () {
                        return this.assignment()
                    },
                    assignment: function () {
                        var right, token, left = this.ternary();
                        return (token = this.expect("=")) ? (left.assign || this.throwError("implies assignment but [" + this.text.substring(0, token.index) + "] can not be assigned to", token), right = this.ternary(),
                        function (scope, locals) {
                            return left.assign(scope, right(scope, locals), locals)
                        }) : left
                    },
                    ternary: function () {
                        var middle, token, left = this.logicalOR();
                        return (token = this.expect("?")) ? (middle = this.assignment(), (token = this.expect(":")) ? this.ternaryFn(left, middle, this.assignment()) : void this.throwError("expected :", token)) : left
                    },
                    logicalOR: function () {
                        for (var token, left = this.logicalAND() ; ;) {
                            if (!(token = this.expect("||"))) return left;
                            left = this.binaryFn(left, token.fn, this.logicalAND())
                        }
                    },
                    logicalAND: function () {
                        var token, left = this.equality();
                        return (token = this.expect("&&")) && (left = this.binaryFn(left, token.fn, this.logicalAND())),
                        left
                    },
                    equality: function () {
                        var token, left = this.relational();
                        return (token = this.expect("==", "!=", "===", "!==")) && (left = this.binaryFn(left, token.fn, this.equality())),
                        left
                    },
                    relational: function () {
                        var token, left = this.additive();
                        return (token = this.expect("<", ">", "<=", ">=")) && (left = this.binaryFn(left, token.fn, this.relational())),
                        left
                    },
                    additive: function () {
                        for (var token, left = this.multiplicative() ; token = this.expect("+", "-") ;) left = this.binaryFn(left, token.fn, this.multiplicative());
                        return left
                    },
                    multiplicative: function () {
                        for (var token, left = this.unary() ; token = this.expect("*", "/", "%") ;) left = this.binaryFn(left, token.fn, this.unary());
                        return left
                    },
                    unary: function () {
                        var token;
                        return this.expect("+") ? this.primary() : (token = this.expect("-")) ? this.binaryFn(Parser.ZERO, token.fn, this.unary()) : (token = this.expect("!")) ? this.unaryFn(token.fn, this.unary()) : this.primary()
                    },
                    fieldAccess: function (object) {
                        var parser = this,
                        field = this.expect().text,
                        getter = getterFn(field, this.options, this.text);
                        return extend(function (scope, locals, self) {
                            return getter(self || object(scope, locals))
                        },
                        {
                            assign: function (scope, value, locals) {
                                var o = object(scope, locals);
                                return o || object.assign(scope, o = {}),
                                setter(o, field, value, parser.text, parser.options)
                            }
                        })
                    },
                    objectIndex: function (obj) {
                        var parser = this,
                        indexFn = this.expression();
                        return this.consume("]"),
                        extend(function (self, locals) {
                            var v, p, o = obj(self, locals),
                            i = indexFn(self, locals);
                            return ensureSafeMemberName(i, parser.text),
                            o ? (v = ensureSafeObject(o[i], parser.text), v && v.then && parser.options.unwrapPromises && (p = v, "$$v" in v || (p.$$v = undefined, p.then(function (val) {
                                p.$$v = val
                            })), v = v.$$v), v) : undefined
                        },
                        {
                            assign: function (self, value, locals) {
                                var key = ensureSafeMemberName(indexFn(self, locals), parser.text),
                                o = ensureSafeObject(obj(self, locals), parser.text);
                                return o || obj.assign(self, o = {}),
                                o[key] = value
                            }
                        })
                    },
                    functionCall: function (fn, contextGetter) {
                        var argsFn = [];
                        if (")" !== this.peekToken().text) do argsFn.push(this.expression());
                        while (this.expect(","));
                        this.consume(")");
                        var parser = this;
                        return function (scope, locals) {
                            for (var args = [], context = contextGetter ? contextGetter(scope, locals) : scope, i = 0; i < argsFn.length; i++) args.push(ensureSafeObject(argsFn[i](scope, locals), parser.text));
                            var fnPtr = fn(scope, locals, context) || noop;
                            ensureSafeObject(context, parser.text),
                            ensureSafeFunction(fnPtr, parser.text);
                            var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);
                            return ensureSafeObject(v, parser.text)
                        }
                    },
                    arrayDeclaration: function () {
                        var elementFns = [],
                        allConstant = !0;
                        if ("]" !== this.peekToken().text) do {
                            if (this.peek("]")) break;
                            var elementFn = this.expression();
                            elementFns.push(elementFn), elementFn.constant || (allConstant = !1)
                        } while (this.expect(","));
                        return this.consume("]"),
                        extend(function (self, locals) {
                            for (var array = [], i = 0; i < elementFns.length; i++) array.push(elementFns[i](self, locals));
                            return array
                        },
                        {
                            literal: !0,
                            constant: allConstant
                        })
                    },
                    object: function () {
                        var keyValues = [],
                        allConstant = !0;
                        if ("}" !== this.peekToken().text) do {
                            if (this.peek("}")) break;
                            var token = this.expect(), key = token.string || token.text;
                            this.consume(":");
                            var value = this.expression();
                            keyValues.push({
                                key: key,
                                value: value
                            }), value.constant || (allConstant = !1)
                        } while (this.expect(","));
                        return this.consume("}"),
                        extend(function (self, locals) {
                            for (var object = {},
                            i = 0; i < keyValues.length; i++) {
                                var keyValue = keyValues[i];
                                object[keyValue.key] = keyValue.value(self, locals)
                            }
                            return object
                        },
                        {
                            literal: !0,
                            constant: allConstant
                        })
                    }
                };
                var getterFnCacheDefault = {},
                getterFnCacheExpensive = {},
                $sceMinErr = minErr("$sce"),
                SCE_CONTEXTS = {
                    HTML: "html",
                    CSS: "css",
                    URL: "url",
                    RESOURCE_URL: "resourceUrl",
                    JS: "js"
                },
                urlParsingNode = document.createElement("a"),
                originUrl = urlResolve(window.location.href, !0);
                $FilterProvider.$inject = ["$provide"],
                currencyFilter.$inject = ["$locale"],
                numberFilter.$inject = ["$locale"];
                var DECIMAL_SEP = ".",
                DATE_FORMATS = {
                    yyyy: dateGetter("FullYear", 4),
                    yy: dateGetter("FullYear", 2, 0, !0),
                    y: dateGetter("FullYear", 1),
                    MMMM: dateStrGetter("Month"),
                    MMM: dateStrGetter("Month", !0),
                    MM: dateGetter("Month", 2, 1),
                    M: dateGetter("Month", 1, 1),
                    dd: dateGetter("Date", 2),
                    d: dateGetter("Date", 1),
                    HH: dateGetter("Hours", 2),
                    H: dateGetter("Hours", 1),
                    hh: dateGetter("Hours", 2, -12),
                    h: dateGetter("Hours", 1, -12),
                    mm: dateGetter("Minutes", 2),
                    m: dateGetter("Minutes", 1),
                    ss: dateGetter("Seconds", 2),
                    s: dateGetter("Seconds", 1),
                    sss: dateGetter("Milliseconds", 3),
                    EEEE: dateStrGetter("Day"),
                    EEE: dateStrGetter("Day", !0),
                    a: ampmGetter,
                    Z: timeZoneGetter
                },
                DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
                NUMBER_STRING = /^\-?\d+$/;
                dateFilter.$inject = ["$locale"];
                var lowercaseFilter = valueFn(lowercase),
                uppercaseFilter = valueFn(uppercase);
                orderByFilter.$inject = ["$parse"];
                var htmlAnchorDirective = valueFn({
                    restrict: "E",
                    compile: function (element, attr) {
                        return 8 >= msie && (attr.href || attr.name || attr.$set("href", ""), element.append(document.createComment("IE fix"))),
                        attr.href || attr.xlinkHref || attr.name ? void 0 : function (scope, element) {
                            var href = "[object SVGAnimatedString]" === toString.call(element.prop("href")) ? "xlink:href" : "href";
                            element.on("click",
                            function (event) {
                                element.attr(href) || event.preventDefault()
                            })
                        }
                    }
                }),
                ngAttributeAliasDirectives = {};
                forEach(BOOLEAN_ATTR,
                function (propName, attrName) {
                    if ("multiple" != propName) {
                        var normalized = directiveNormalize("ng-" + attrName);
                        ngAttributeAliasDirectives[normalized] = function () {
                            return {
                                priority: 100,
                                link: function (scope, element, attr) {
                                    scope.$watch(attr[normalized],
                                    function (value) {
                                        attr.$set(attrName, !!value)
                                    })
                                }
                            }
                        }
                    }
                }),
                forEach(["src", "srcset", "href"],
                function (attrName) {
                    var normalized = directiveNormalize("ng-" + attrName);
                    ngAttributeAliasDirectives[normalized] = function () {
                        return {
                            priority: 99,
                            link: function (scope, element, attr) {
                                var propName = attrName,
                                name = attrName;
                                "href" === attrName && "[object SVGAnimatedString]" === toString.call(element.prop("href")) && (name = "xlinkHref", attr.$attr[name] = "xlink:href", propName = null),
                                attr.$observe(normalized,
                                function (value) {
                                    return value ? (attr.$set(name, value), void (msie && propName && element.prop(propName, attr[name]))) : void ("href" === attrName && attr.$set(name, null))
                                })
                            }
                        }
                    }
                });
                var nullFormCtrl = {
                    $addControl: noop,
                    $removeControl: noop,
                    $setValidity: noop,
                    $setDirty: noop,
                    $setPristine: noop
                };
                FormController.$inject = ["$element", "$attrs", "$scope", "$animate"];
                var formDirectiveFactory = function (isNgForm) {
                    return ["$timeout",
                    function ($timeout) {
                        var formDirective = {
                            name: "form",
                            restrict: isNgForm ? "EAC" : "E",
                            controller: FormController,
                            compile: function () {
                                return {
                                    pre: function (scope, formElement, attr, controller) {
                                        if (!attr.action) {
                                            var preventDefaultListener = function (event) {
                                                event.preventDefault ? event.preventDefault() : event.returnValue = !1
                                            };
                                            addEventListenerFn(formElement[0], "submit", preventDefaultListener),
                                            formElement.on("$destroy",
                                            function () {
                                                $timeout(function () {
                                                    removeEventListenerFn(formElement[0], "submit", preventDefaultListener)
                                                },
                                                0, !1)
                                            })
                                        }
                                        var parentFormCtrl = formElement.parent().controller("form"),
                                        alias = attr.name || attr.ngForm;
                                        alias && setter(scope, alias, controller, alias),
                                        parentFormCtrl && formElement.on("$destroy",
                                        function () {
                                            parentFormCtrl.$removeControl(controller),
                                            alias && setter(scope, alias, undefined, alias),
                                            extend(controller, nullFormCtrl)
                                        })
                                    }
                                }
                            }
                        };
                        return formDirective
                    }]
                },
                formDirective = formDirectiveFactory(),
                ngFormDirective = formDirectiveFactory(!0),
                URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
                EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
                NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
                inputType = {
                    text: textInputType,
                    number: numberInputType,
                    url: urlInputType,
                    email: emailInputType,
                    radio: radioInputType,
                    checkbox: checkboxInputType,
                    hidden: noop,
                    button: noop,
                    submit: noop,
                    reset: noop,
                    file: noop
                },
                numberBadFlags = ["badInput"],
                inputDirective = ["$browser", "$sniffer",
                function ($browser, $sniffer) {
                    return {
                        restrict: "E",
                        require: "?ngModel",
                        link: function (scope, element, attr, ctrl) {
                            ctrl && (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer, $browser)
                        }
                    }
                }],
                VALID_CLASS = "ng-valid",
                INVALID_CLASS = "ng-invalid",
                PRISTINE_CLASS = "ng-pristine",
                DIRTY_CLASS = "ng-dirty",
                NgModelController = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate",
                function ($scope, $exceptionHandler, $attr, $element, $parse, $animate) {
                    function toggleValidCss(isValid, validationErrorKey) {
                        validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "",
                        $animate.removeClass($element, (isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey),
                        $animate.addClass($element, (isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey)
                    }
                    this.$viewValue = Number.NaN,
                    this.$modelValue = Number.NaN,
                    this.$parsers = [],
                    this.$formatters = [],
                    this.$viewChangeListeners = [],
                    this.$pristine = !0,
                    this.$dirty = !1,
                    this.$valid = !0,
                    this.$invalid = !1,
                    this.$name = $attr.name;
                    var ngModelGet = $parse($attr.ngModel),
                    ngModelSet = ngModelGet.assign;
                    if (!ngModelSet) throw minErr("ngModel")("nonassign", "Expression '{0}' is non-assignable. Element: {1}", $attr.ngModel, startingTag($element));
                    this.$render = noop,
                    this.$isEmpty = function (value) {
                        return isUndefined(value) || "" === value || null === value || value !== value
                    };
                    var parentForm = $element.inheritedData("$formController") || nullFormCtrl,
                    invalidCount = 0,
                    $error = this.$error = {};
                    $element.addClass(PRISTINE_CLASS),
                    toggleValidCss(!0),
                    this.$setValidity = function (validationErrorKey, isValid) {
                        $error[validationErrorKey] !== !isValid && (isValid ? ($error[validationErrorKey] && invalidCount--, invalidCount || (toggleValidCss(!0), this.$valid = !0, this.$invalid = !1)) : (toggleValidCss(!1), this.$invalid = !0, this.$valid = !1, invalidCount++), $error[validationErrorKey] = !isValid, toggleValidCss(isValid, validationErrorKey), parentForm.$setValidity(validationErrorKey, isValid, this))
                    },
                    this.$setPristine = function () {
                        this.$dirty = !1,
                        this.$pristine = !0,
                        $animate.removeClass($element, DIRTY_CLASS),
                        $animate.addClass($element, PRISTINE_CLASS)
                    },
                    this.$setViewValue = function (value) {
                        this.$viewValue = value,
                        this.$pristine && (this.$dirty = !0, this.$pristine = !1, $animate.removeClass($element, PRISTINE_CLASS), $animate.addClass($element, DIRTY_CLASS), parentForm.$setDirty()),
                        forEach(this.$parsers,
                        function (fn) {
                            value = fn(value)
                        }),
                        this.$modelValue !== value && (this.$modelValue = value, ngModelSet($scope, value), forEach(this.$viewChangeListeners,
                        function (listener) {
                            try {
                                listener()
                            } catch (e) {
                                $exceptionHandler(e)
                            }
                        }))
                    };
                    var ctrl = this;
                    $scope.$watch(function () {
                        var value = ngModelGet($scope);
                        if (ctrl.$modelValue !== value) {
                            var formatters = ctrl.$formatters,
                            idx = formatters.length;
                            for (ctrl.$modelValue = value; idx--;) value = formatters[idx](value);
                            ctrl.$viewValue !== value && (ctrl.$viewValue = value, ctrl.$render())
                        }
                        return value
                    })
                }],
                ngModelDirective = function () {
                    return {
                        require: ["ngModel", "^?form"],
                        controller: NgModelController,
                        link: function (scope, element, attr, ctrls) {
                            var modelCtrl = ctrls[0],
                            formCtrl = ctrls[1] || nullFormCtrl;
                            formCtrl.$addControl(modelCtrl),
                            scope.$on("$destroy",
                            function () {
                                formCtrl.$removeControl(modelCtrl)
                            })
                        }
                    }
                },
                ngChangeDirective = valueFn({
                    require: "ngModel",
                    link: function (scope, element, attr, ctrl) {
                        ctrl.$viewChangeListeners.push(function () {
                            scope.$eval(attr.ngChange)
                        })
                    }
                }),
                requiredDirective = function () {
                    return {
                        require: "?ngModel",
                        link: function (scope, elm, attr, ctrl) {
                            if (ctrl) {
                                attr.required = !0;
                                var validator = function (value) {
                                    return attr.required && ctrl.$isEmpty(value) ? void ctrl.$setValidity("required", !1) : (ctrl.$setValidity("required", !0), value)
                                };
                                ctrl.$formatters.push(validator),
                                ctrl.$parsers.unshift(validator),
                                attr.$observe("required",
                                function () {
                                    validator(ctrl.$viewValue)
                                })
                            }
                        }
                    }
                },
                ngListDirective = function () {
                    return {
                        require: "ngModel",
                        link: function (scope, element, attr, ctrl) {
                            var match = /\/(.*)\//.exec(attr.ngList),
                            separator = match && new RegExp(match[1]) || attr.ngList || ",",
                            parse = function (viewValue) {
                                if (!isUndefined(viewValue)) {
                                    var list = [];
                                    return viewValue && forEach(viewValue.split(separator),
                                    function (value) {
                                        value && list.push(trim(value))
                                    }),
                                    list
                                }
                            };
                            ctrl.$parsers.push(parse),
                            ctrl.$formatters.push(function (value) {
                                return isArray(value) ? value.join(", ") : undefined
                            }),
                            ctrl.$isEmpty = function (value) {
                                return !value || !value.length
                            }
                        }
                    }
                },
                CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/,
                ngValueDirective = function () {
                    return {
                        priority: 100,
                        compile: function (tpl, tplAttr) {
                            return CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue) ?
                            function (scope, elm, attr) {
                                attr.$set("value", scope.$eval(attr.ngValue))
                            } : function (scope, elm, attr) {
                                scope.$watch(attr.ngValue,
                                function (value) {
                                    attr.$set("value", value)
                                })
                            }
                        }
                    }
                },
                ngBindDirective = ngDirective({
                    compile: function (templateElement) {
                        return templateElement.addClass("ng-binding"),
                        function (scope, element, attr) {
                            element.data("$binding", attr.ngBind),
                            scope.$watch(attr.ngBind,
                            function (value) {
                                element.text(value == undefined ? "" : value)
                            })
                        }
                    }
                }),
                ngBindTemplateDirective = ["$interpolate",
                function ($interpolate) {
                    return function (scope, element, attr) {
                        var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
                        element.addClass("ng-binding").data("$binding", interpolateFn),
                        attr.$observe("ngBindTemplate",
                        function (value) {
                            element.text(value)
                        })
                    }
                }],
                ngBindHtmlDirective = ["$sce", "$parse",
                function ($sce, $parse) {
                    return {
                        compile: function (tElement) {
                            return tElement.addClass("ng-binding"),
                            function (scope, element, attr) {
                                function getStringValue() {
                                    return (parsed(scope) || "").toString()
                                }
                                element.data("$binding", attr.ngBindHtml);
                                var parsed = $parse(attr.ngBindHtml);
                                scope.$watch(getStringValue,
                                function () {
                                    element.html($sce.getTrustedHtml(parsed(scope)) || "")
                                })
                            }
                        }
                    }
                }],
                ngClassDirective = classDirective("", !0),
                ngClassOddDirective = classDirective("Odd", 0),
                ngClassEvenDirective = classDirective("Even", 1),
                ngCloakDirective = ngDirective({
                    compile: function (element, attr) {
                        attr.$set("ngCloak", undefined),
                        element.removeClass("ng-cloak")
                    }
                }),
                ngControllerDirective = [function () {
                    return {
                        scope: !0,
                        controller: "@",
                        priority: 500
                    }
                }],
                ngEventDirectives = {},
                forceAsyncEvents = {
                    blur: !0,
                    focus: !0
                };
                forEach("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),
                function (eventName) {
                    var directiveName = directiveNormalize("ng-" + eventName);
                    ngEventDirectives[directiveName] = ["$parse", "$rootScope",
                    function ($parse, $rootScope) {
                        return {
                            compile: function ($element, attr) {
                                var fn = $parse(attr[directiveName], !0);
                                return function (scope, element) {
                                    element.on(eventName,
                                    function (event) {
                                        var callback = function () {
                                            fn(scope, {
                                                $event: event
                                            })
                                        };
                                        forceAsyncEvents[eventName] && $rootScope.$$phase ? scope.$evalAsync(callback) : scope.$apply(callback)
                                    })
                                }
                            }
                        }
                    }]
                });
                var ngIfDirective = ["$animate",
                function ($animate) {
                    return {
                        transclude: "element",
                        priority: 600,
                        terminal: !0,
                        restrict: "A",
                        $$tlb: !0,
                        link: function ($scope, $element, $attr, ctrl, $transclude) {
                            var block, childScope, previousElements;
                            $scope.$watch($attr.ngIf,
                            function (value) {
                                toBoolean(value) ? childScope || (childScope = $scope.$new(), $transclude(childScope,
                                function (clone) {
                                    clone[clone.length++] = document.createComment(" end ngIf: " + $attr.ngIf + " "),
                                    block = {
                                        clone: clone
                                    },
                                    $animate.enter(clone, $element.parent(), $element)
                                })) : (previousElements && (previousElements.remove(), previousElements = null), childScope && (childScope.$destroy(), childScope = null), block && (previousElements = getBlockElements(block.clone), $animate.leave(previousElements,
                                function () {
                                    previousElements = null
                                }), block = null))
                            })
                        }
                    }
                }],
                ngIncludeDirective = ["$http", "$templateCache", "$anchorScroll", "$animate", "$sce",
                function ($http, $templateCache, $anchorScroll, $animate, $sce) {
                    return {
                        restrict: "ECA",
                        priority: 400,
                        terminal: !0,
                        transclude: "element",
                        controller: angular.noop,
                        compile: function (element, attr) {
                            var srcExp = attr.ngInclude || attr.src,
                            onloadExp = attr.onload || "",
                            autoScrollExp = attr.autoscroll;
                            return function (scope, $element, $attr, ctrl, $transclude) {
                                var currentScope, previousElement, currentElement, changeCounter = 0,
                                cleanupLastIncludeContent = function () {
                                    previousElement && (previousElement.remove(), previousElement = null),
                                    currentScope && (currentScope.$destroy(), currentScope = null),
                                    currentElement && ($animate.leave(currentElement,
                                    function () {
                                        previousElement = null
                                    }), previousElement = currentElement, currentElement = null)
                                };
                                scope.$watch($sce.parseAsResourceUrl(srcExp),
                                function (src) {
                                    var afterAnimation = function () {
                                        !isDefined(autoScrollExp) || autoScrollExp && !scope.$eval(autoScrollExp) || $anchorScroll()
                                    },
                                    thisChangeId = ++changeCounter;
                                    src ? ($http.get(src, {
                                        cache: $templateCache
                                    }).success(function (response) {
                                        if (thisChangeId === changeCounter) {
                                            var newScope = scope.$new();
                                            ctrl.template = response;
                                            var clone = $transclude(newScope,
                                            function (clone) {
                                                cleanupLastIncludeContent(),
                                                $animate.enter(clone, null, $element, afterAnimation)
                                            });
                                            currentScope = newScope,
                                            currentElement = clone,
                                            currentScope.$emit("$includeContentLoaded"),
                                            scope.$eval(onloadExp)
                                        }
                                    }).error(function () {
                                        thisChangeId === changeCounter && cleanupLastIncludeContent()
                                    }), scope.$emit("$includeContentRequested")) : (cleanupLastIncludeContent(), ctrl.template = null)
                                })
                            }
                        }
                    }
                }],
                ngIncludeFillContentDirective = ["$compile",
                function ($compile) {
                    return {
                        restrict: "ECA",
                        priority: -400,
                        require: "ngInclude",
                        link: function (scope, $element, $attr, ctrl) {
                            $element.html(ctrl.template),
                            $compile($element.contents())(scope)
                        }
                    }
                }],
                ngInitDirective = ngDirective({
                    priority: 450,
                    compile: function () {
                        return {
                            pre: function (scope, element, attrs) {
                                scope.$eval(attrs.ngInit)
                            }
                        }
                    }
                }),
                ngNonBindableDirective = ngDirective({
                    terminal: !0,
                    priority: 1e3
                }),
                ngPluralizeDirective = ["$locale", "$interpolate",
                function ($locale, $interpolate) {
                    var BRACE = /{}/g;
                    return {
                        restrict: "EA",
                        link: function (scope, element, attr) {
                            var numberExp = attr.count,
                            whenExp = attr.$attr.when && element.attr(attr.$attr.when),
                            offset = attr.offset || 0,
                            whens = scope.$eval(whenExp) || {},
                            whensExpFns = {},
                            startSymbol = $interpolate.startSymbol(),
                            endSymbol = $interpolate.endSymbol(),
                            isWhen = /^when(Minus)?(.+)$/;
                            forEach(attr,
                            function (expression, attributeName) {
                                isWhen.test(attributeName) && (whens[lowercase(attributeName.replace("when", "").replace("Minus", "-"))] = element.attr(attr.$attr[attributeName]))
                            }),
                            forEach(whens,
                            function (expression, key) {
                                whensExpFns[key] = $interpolate(expression.replace(BRACE, startSymbol + numberExp + "-" + offset + endSymbol))
                            }),
                            scope.$watch(function () {
                                var value = parseFloat(scope.$eval(numberExp));
                                return isNaN(value) ? "" : (value in whens || (value = $locale.pluralCat(value - offset)), whensExpFns[value](scope, element, !0))
                            },
                            function (newVal) {
                                element.text(newVal)
                            })
                        }
                    }
                }],
                ngRepeatDirective = ["$parse", "$animate",
                function ($parse, $animate) {
                    function getBlockStart(block) {
                        return block.clone[0]
                    }
                    function getBlockEnd(block) {
                        return block.clone[block.clone.length - 1]
                    }
                    var NG_REMOVED = "$$NG_REMOVED",
                    ngRepeatMinErr = minErr("ngRepeat");
                    return {
                        transclude: "element",
                        priority: 1e3,
                        terminal: !0,
                        $$tlb: !0,
                        link: function ($scope, $element, $attr, ctrl, $transclude) {
                            var trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, lhs, rhs, valueIdentifier, keyIdentifier, expression = $attr.ngRepeat,
                            match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),
                            hashFnLocals = {
                                $id: hashKey
                            };
                            if (!match) throw ngRepeatMinErr("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
                            if (lhs = match[1], rhs = match[2], trackByExp = match[3], trackByExp ? (trackByExpGetter = $parse(trackByExp), trackByIdExpFn = function (key, value, index) {
                                return keyIdentifier && (hashFnLocals[keyIdentifier] = key),
                                hashFnLocals[valueIdentifier] = value,
                                hashFnLocals.$index = index,
                                trackByExpGetter($scope, hashFnLocals)
                            }) : (trackByIdArrayFn = function (key, value) {
                                return hashKey(value)
                            },
                            trackByIdObjFn = function (key) {
                                return key
                            }), match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/), !match) throw ngRepeatMinErr("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
                            valueIdentifier = match[3] || match[1],
                            keyIdentifier = match[2];
                            var lastBlockMap = {};
                            $scope.$watchCollection(rhs,
                            function (collection) {
                                var index, length, nextNode, arrayLength, childScope, key, value, trackById, trackByIdFn, collectionKeys, block, elementsToRemove, previousNode = $element[0],
                                nextBlockMap = {},
                                nextBlockOrder = [];
                                if (isArrayLike(collection)) collectionKeys = collection,
                                trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                                else {
                                    trackByIdFn = trackByIdExpFn || trackByIdObjFn,
                                    collectionKeys = [];
                                    for (key in collection) collection.hasOwnProperty(key) && "$" != key.charAt(0) && collectionKeys.push(key);
                                    collectionKeys.sort()
                                }
                                for (arrayLength = collectionKeys.length, length = nextBlockOrder.length = collectionKeys.length, index = 0; length > index; index++) if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], trackById = trackByIdFn(key, value, index), assertNotHasOwnProperty(trackById, "`track by` id"), lastBlockMap.hasOwnProperty(trackById)) block = lastBlockMap[trackById],
                                delete lastBlockMap[trackById],
                                nextBlockMap[trackById] = block,
                                nextBlockOrder[index] = block;
                                else {
                                    if (nextBlockMap.hasOwnProperty(trackById)) throw forEach(nextBlockOrder,
                                    function (block) {
                                        block && block.scope && (lastBlockMap[block.id] = block)
                                    }),
                                    ngRepeatMinErr("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, toJson(value));
                                    nextBlockOrder[index] = {
                                        id: trackById
                                    },
                                    nextBlockMap[trackById] = !1
                                }
                                for (key in lastBlockMap) lastBlockMap.hasOwnProperty(key) && (block = lastBlockMap[key], elementsToRemove = getBlockElements(block.clone), $animate.leave(elementsToRemove), forEach(elementsToRemove,
                                function (element) {
                                    element[NG_REMOVED] = !0
                                }), block.scope.$destroy());
                                for (index = 0, length = collectionKeys.length; length > index; index++) {
                                    if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], block = nextBlockOrder[index], nextBlockOrder[index - 1] && (previousNode = getBlockEnd(nextBlockOrder[index - 1])), block.scope) {
                                        childScope = block.scope,
                                        nextNode = previousNode;
                                        do nextNode = nextNode.nextSibling;
                                        while (nextNode && nextNode[NG_REMOVED]);
                                        getBlockStart(block) != nextNode && $animate.move(getBlockElements(block.clone), null, jqLite(previousNode)),
                                        previousNode = getBlockEnd(block)
                                    } else childScope = $scope.$new();
                                    childScope[valueIdentifier] = value,
                                    keyIdentifier && (childScope[keyIdentifier] = key),
                                    childScope.$index = index,
                                    childScope.$first = 0 === index,
                                    childScope.$last = index === arrayLength - 1,
                                    childScope.$middle = !(childScope.$first || childScope.$last),
                                    childScope.$odd = !(childScope.$even = 0 === (1 & index)),
                                    block.scope || $transclude(childScope,
                                    function (clone) {
                                        clone[clone.length++] = document.createComment(" end ngRepeat: " + expression + " "),
                                        $animate.enter(clone, null, jqLite(previousNode)),
                                        previousNode = clone,
                                        block.scope = childScope,
                                        block.clone = clone,
                                        nextBlockMap[block.id] = block
                                    })
                                }
                                lastBlockMap = nextBlockMap
                            })
                        }
                    }
                }],
                ngShowDirective = ["$animate",
                function ($animate) {
                    return function (scope, element, attr) {
                        scope.$watch(attr.ngShow,
                        function (value) {
                            $animate[toBoolean(value) ? "removeClass" : "addClass"](element, "ng-hide")
                        })
                    }
                }],
                ngHideDirective = ["$animate",
                function ($animate) {
                    return function (scope, element, attr) {
                        scope.$watch(attr.ngHide,
                        function (value) {
                            $animate[toBoolean(value) ? "addClass" : "removeClass"](element, "ng-hide")
                        })
                    }
                }],
                ngStyleDirective = ngDirective(function (scope, element, attr) {
                    scope.$watch(attr.ngStyle,
                    function (newStyles, oldStyles) {
                        oldStyles && newStyles !== oldStyles && forEach(oldStyles,
                        function (val, style) {
                            element.css(style, "")
                        }),
                        newStyles && element.css(newStyles)
                    },
                    !0)
                }),
                ngSwitchDirective = ["$animate",
                function ($animate) {
                    return {
                        restrict: "EA",
                        require: "ngSwitch",
                        controller: ["$scope",
                        function () {
                            this.cases = {}
                        }],
                        link: function (scope, element, attr, ngSwitchController) {
                            var watchExpr = attr.ngSwitch || attr.on,
                            selectedTranscludes = [],
                            selectedElements = [],
                            previousElements = [],
                            selectedScopes = [];
                            scope.$watch(watchExpr,
                            function (value) {
                                var i, ii;
                                for (i = 0, ii = previousElements.length; ii > i; ++i) previousElements[i].remove();
                                for (previousElements.length = 0, i = 0, ii = selectedScopes.length; ii > i; ++i) {
                                    var selected = selectedElements[i];
                                    selectedScopes[i].$destroy(),
                                    previousElements[i] = selected,
                                    $animate.leave(selected,
                                    function () {
                                        previousElements.splice(i, 1)
                                    })
                                }
                                selectedElements.length = 0,
                                selectedScopes.length = 0,
                                (selectedTranscludes = ngSwitchController.cases["!" + value] || ngSwitchController.cases["?"]) && (scope.$eval(attr.change), forEach(selectedTranscludes,
                                function (selectedTransclude) {
                                    var selectedScope = scope.$new();
                                    selectedScopes.push(selectedScope),
                                    selectedTransclude.transclude(selectedScope,
                                    function (caseElement) {
                                        var anchor = selectedTransclude.element;
                                        selectedElements.push(caseElement),
                                        $animate.enter(caseElement, anchor.parent(), anchor)
                                    })
                                }))
                            })
                        }
                    }
                }],
                ngSwitchWhenDirective = ngDirective({
                    transclude: "element",
                    priority: 800,
                    require: "^ngSwitch",
                    link: function (scope, element, attrs, ctrl, $transclude) {
                        ctrl.cases["!" + attrs.ngSwitchWhen] = ctrl.cases["!" + attrs.ngSwitchWhen] || [],
                        ctrl.cases["!" + attrs.ngSwitchWhen].push({
                            transclude: $transclude,
                            element: element
                        })
                    }
                }),
                ngSwitchDefaultDirective = ngDirective({
                    transclude: "element",
                    priority: 800,
                    require: "^ngSwitch",
                    link: function (scope, element, attr, ctrl, $transclude) {
                        ctrl.cases["?"] = ctrl.cases["?"] || [],
                        ctrl.cases["?"].push({
                            transclude: $transclude,
                            element: element
                        })
                    }
                }),
                ngTranscludeDirective = ngDirective({
                    link: function ($scope, $element, $attrs, controller, $transclude) {
                        if (!$transclude) throw minErr("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", startingTag($element));
                        $transclude(function (clone) {
                            $element.empty(),
                            $element.append(clone)
                        })
                    }
                }),
                scriptDirective = ["$templateCache",
                function ($templateCache) {
                    return {
                        restrict: "E",
                        terminal: !0,
                        compile: function (element, attr) {
                            if ("text/ng-template" == attr.type) {
                                var templateUrl = attr.id,
                                text = element[0].text;
                                $templateCache.put(templateUrl, text)
                            }
                        }
                    }
                }],
                ngOptionsMinErr = minErr("ngOptions"),
                ngOptionsDirective = valueFn({
                    terminal: !0
                }),
                selectDirective = ["$compile", "$parse",
                function ($compile, $parse) {
                    var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
                    nullModelCtrl = {
                        $setViewValue: noop
                    };
                    return {
                        restrict: "E",
                        require: ["select", "?ngModel"],
                        controller: ["$element", "$scope", "$attrs",
                        function ($element, $scope, $attrs) {
                            var nullOption, unknownOption, self = this,
                            optionsMap = {},
                            ngModelCtrl = nullModelCtrl;
                            self.databound = $attrs.ngModel,
                            self.init = function (ngModelCtrl_, nullOption_, unknownOption_) {
                                ngModelCtrl = ngModelCtrl_,
                                nullOption = nullOption_,
                                unknownOption = unknownOption_
                            },
                            self.addOption = function (value) {
                                assertNotHasOwnProperty(value, '"option value"'),
                                optionsMap[value] = !0,
                                ngModelCtrl.$viewValue == value && ($element.val(value), unknownOption.parent() && unknownOption.remove())
                            },
                            self.removeOption = function (value) {
                                this.hasOption(value) && (delete optionsMap[value], ngModelCtrl.$viewValue == value && this.renderUnknownOption(value))
                            },
                            self.renderUnknownOption = function (val) {
                                var unknownVal = "? " + hashKey(val) + " ?";
                                unknownOption.val(unknownVal),
                                $element.prepend(unknownOption),
                                $element.val(unknownVal),
                                unknownOption.prop("selected", !0)
                            },
                            self.hasOption = function (value) {
                                return optionsMap.hasOwnProperty(value)
                            },
                            $scope.$on("$destroy",
                            function () {
                                self.renderUnknownOption = noop
                            })
                        }],
                        link: function (scope, element, attr, ctrls) {
                            function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
                                ngModelCtrl.$render = function () {
                                    var viewValue = ngModelCtrl.$viewValue;
                                    selectCtrl.hasOption(viewValue) ? (unknownOption.parent() && unknownOption.remove(), selectElement.val(viewValue), "" === viewValue && emptyOption.prop("selected", !0)) : isUndefined(viewValue) && emptyOption ? selectElement.val("") : selectCtrl.renderUnknownOption(viewValue)
                                },
                                selectElement.on("change",
                                function () {
                                    scope.$apply(function () {
                                        unknownOption.parent() && unknownOption.remove(),
                                        ngModelCtrl.$setViewValue(selectElement.val())
                                    })
                                })
                            }
                            function setupAsMultiple(scope, selectElement, ctrl) {
                                var lastView;
                                ctrl.$render = function () {
                                    var items = new HashMap(ctrl.$viewValue);
                                    forEach(selectElement.find("option"),
                                    function (option) {
                                        option.selected = isDefined(items.get(option.value))
                                    })
                                },
                                scope.$watch(function () {
                                    equals(lastView, ctrl.$viewValue) || (lastView = shallowCopy(ctrl.$viewValue), ctrl.$render())
                                }),
                                selectElement.on("change",
                                function () {
                                    scope.$apply(function () {
                                        var array = [];
                                        forEach(selectElement.find("option"),
                                        function (option) {
                                            option.selected && array.push(option.value)
                                        }),
                                        ctrl.$setViewValue(array)
                                    })
                                })
                            }
                            function setupAsOptions(scope, selectElement, ctrl) {
                                function getSelectedSet() {
                                    var selectedSet = !1;
                                    if (multiple) {
                                        var modelValue = ctrl.$modelValue;
                                        if (trackFn && isArray(modelValue)) {
                                            selectedSet = new HashMap([]);
                                            for (var locals = {},
                                            trackIndex = 0; trackIndex < modelValue.length; trackIndex++) locals[valueName] = modelValue[trackIndex],
                                            selectedSet.put(trackFn(scope, locals), modelValue[trackIndex])
                                        } else selectedSet = new HashMap(modelValue)
                                    }
                                    return selectedSet
                                }
                                function render() {
                                    var optionGroupName, optionGroup, option, existingParent, existingOptions, existingOption, key, groupLength, length, groupIndex, index, selected, lastElement, element, label, optionGroups = {
                                        "": []
                                    },
                                    optionGroupNames = [""],
                                    modelValue = ctrl.$modelValue,
                                    values = valuesFn(scope) || [],
                                    keys = keyName ? sortedKeys(values) : values,
                                    locals = {},
                                    selectedSet = getSelectedSet();
                                    for (index = 0; length = keys.length, length > index; index++) {
                                        if (key = index, keyName) {
                                            if (key = keys[index], "$" === key.charAt(0)) continue;
                                            locals[keyName] = key
                                        }
                                        if (locals[valueName] = values[key], optionGroupName = groupByFn(scope, locals) || "", (optionGroup = optionGroups[optionGroupName]) || (optionGroup = optionGroups[optionGroupName] = [], optionGroupNames.push(optionGroupName)), multiple) selected = isDefined(selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals)));
                                        else {
                                            if (trackFn) {
                                                var modelCast = {};
                                                modelCast[valueName] = modelValue,
                                                selected = trackFn(scope, modelCast) === trackFn(scope, locals)
                                            } else selected = modelValue === valueFn(scope, locals);
                                            selectedSet = selectedSet || selected
                                        }
                                        label = displayFn(scope, locals),
                                        label = isDefined(label) ? label : "",
                                        optionGroup.push({
                                            id: trackFn ? trackFn(scope, locals) : keyName ? keys[index] : index,
                                            label: label,
                                            selected: selected
                                        })
                                    }
                                    for (multiple || (nullOption || null === modelValue ? optionGroups[""].unshift({
                                        id: "",
                                        label: "",
                                        selected: !selectedSet
                                    }) : selectedSet || optionGroups[""].unshift({
                                        id: "?",
                                        label: "",
                                        selected: !0
                                    })), groupIndex = 0, groupLength = optionGroupNames.length; groupLength > groupIndex; groupIndex++) {
                                        for (optionGroupName = optionGroupNames[groupIndex], optionGroup = optionGroups[optionGroupName], optionGroupsCache.length <= groupIndex ? (existingParent = {
                                            element: optGroupTemplate.clone().attr("label", optionGroupName),
                                            label: optionGroup.label
                                        },
                                        existingOptions = [existingParent], optionGroupsCache.push(existingOptions), selectElement.append(existingParent.element)) : (existingOptions = optionGroupsCache[groupIndex], existingParent = existingOptions[0], existingParent.label != optionGroupName && existingParent.element.attr("label", existingParent.label = optionGroupName)), lastElement = null, index = 0, length = optionGroup.length; length > index; index++) option = optionGroup[index],
                                        (existingOption = existingOptions[index + 1]) ? (lastElement = existingOption.element, existingOption.label !== option.label && (lastElement.text(existingOption.label = option.label), lastElement.prop("label", existingOption.label)), existingOption.id !== option.id && lastElement.val(existingOption.id = option.id), lastElement[0].selected !== option.selected && (lastElement.prop("selected", existingOption.selected = option.selected), msie && lastElement.prop("selected", existingOption.selected))) : ("" === option.id && nullOption ? element = nullOption : (element = optionTemplate.clone()).val(option.id).prop("selected", option.selected).attr("selected", option.selected).prop("label", option.label).text(option.label), existingOptions.push(existingOption = {
                                            element: element,
                                            label: option.label,
                                            id: option.id,
                                            selected: option.selected
                                        }), selectCtrl.addOption(option.label, element), lastElement ? lastElement.after(element) : existingParent.element.append(element), lastElement = element);
                                        for (index++; existingOptions.length > index;) option = existingOptions.pop(),
                                        selectCtrl.removeOption(option.label),
                                        option.element.remove()
                                    }
                                    for (; optionGroupsCache.length > groupIndex;) optionGroupsCache.pop()[0].element.remove()
                                }
                                var match;
                                if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) throw ngOptionsMinErr("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
                                var displayFn = $parse(match[2] || match[1]),
                                valueName = match[4] || match[6],
                                keyName = match[5],
                                groupByFn = $parse(match[3] || ""),
                                valueFn = $parse(match[2] ? match[1] : valueName),
                                valuesFn = $parse(match[7]),
                                track = match[8],
                                trackFn = track ? $parse(match[8]) : null,
                                optionGroupsCache = [[{
                                    element: selectElement,
                                    label: ""
                                }]];
                                nullOption && ($compile(nullOption)(scope), nullOption.removeClass("ng-scope"), nullOption.remove()),
                                selectElement.empty(),
                                selectElement.on("change",
                                function () {
                                    scope.$apply(function () {
                                        var optionGroup, key, value, optionElement, index, groupIndex, length, groupLength, trackIndex, collection = valuesFn(scope) || [],
                                        locals = {};
                                        if (multiple) {
                                            for (value = [], groupIndex = 0, groupLength = optionGroupsCache.length; groupLength > groupIndex; groupIndex++) for (optionGroup = optionGroupsCache[groupIndex], index = 1, length = optionGroup.length; length > index; index++) if ((optionElement = optionGroup[index].element)[0].selected) {
                                                if (key = optionElement.val(), keyName && (locals[keyName] = key), trackFn) for (trackIndex = 0; trackIndex < collection.length && (locals[valueName] = collection[trackIndex], trackFn(scope, locals) != key) ; trackIndex++);
                                                else locals[valueName] = collection[key];
                                                value.push(valueFn(scope, locals))
                                            }
                                        } else if (key = selectElement.val(), "?" == key) value = undefined;
                                        else if ("" === key) value = null;
                                        else if (trackFn) {
                                            for (trackIndex = 0; trackIndex < collection.length; trackIndex++) if (locals[valueName] = collection[trackIndex], trackFn(scope, locals) == key) {
                                                value = valueFn(scope, locals);
                                                break
                                            }
                                        } else locals[valueName] = collection[key],
                                        keyName && (locals[keyName] = key),
                                        value = valueFn(scope, locals);
                                        ctrl.$setViewValue(value),
                                        render()
                                    })
                                }),
                                ctrl.$render = render,
                                scope.$watchCollection(valuesFn, render),
                                scope.$watchCollection(function () {
                                    var locals = {},
                                    values = valuesFn(scope);
                                    if (values) {
                                        for (var toDisplay = new Array(values.length), i = 0, ii = values.length; ii > i; i++) locals[valueName] = values[i],
                                        toDisplay[i] = displayFn(scope, locals);
                                        return toDisplay
                                    }
                                },
                                render),
                                multiple && scope.$watchCollection(function () {
                                    return ctrl.$modelValue
                                },
                                render)
                            }
                            if (ctrls[1]) {
                                for (var emptyOption, selectCtrl = ctrls[0], ngModelCtrl = ctrls[1], multiple = attr.multiple, optionsExp = attr.ngOptions, nullOption = !1, optionTemplate = jqLite(document.createElement("option")), optGroupTemplate = jqLite(document.createElement("optgroup")), unknownOption = optionTemplate.clone(), i = 0, children = element.children(), ii = children.length; ii > i; i++) if ("" === children[i].value) {
                                    emptyOption = nullOption = children.eq(i);
                                    break
                                }
                                selectCtrl.init(ngModelCtrl, nullOption, unknownOption),
                                multiple && (ngModelCtrl.$isEmpty = function (value) {
                                    return !value || 0 === value.length
                                }),
                                optionsExp ? setupAsOptions(scope, element, ngModelCtrl) : multiple ? setupAsMultiple(scope, element, ngModelCtrl) : setupAsSingle(scope, element, ngModelCtrl, selectCtrl)
                            }
                        }
                    }
                }],
                optionDirective = ["$interpolate",
                function ($interpolate) {
                    var nullSelectCtrl = {
                        addOption: noop,
                        removeOption: noop
                    };
                    return {
                        restrict: "E",
                        priority: 100,
                        compile: function (element, attr) {
                            if (isUndefined(attr.value)) {
                                var interpolateFn = $interpolate(element.text(), !0);
                                interpolateFn || attr.$set("value", element.text())
                            }
                            return function (scope, element, attr) {
                                var selectCtrlName = "$selectController",
                                parent = element.parent(),
                                selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
                                selectCtrl && selectCtrl.databound ? element.prop("selected", !1) : selectCtrl = nullSelectCtrl,
                                interpolateFn ? scope.$watch(interpolateFn,
                                function (newVal, oldVal) {
                                    attr.$set("value", newVal),
                                    newVal !== oldVal && selectCtrl.removeOption(oldVal),
                                    selectCtrl.addOption(newVal)
                                }) : selectCtrl.addOption(attr.value),
                                element.on("$destroy",
                                function () {
                                    selectCtrl.removeOption(attr.value)
                                })
                            }
                        }
                    }
                }],
                styleDirective = valueFn({
                    restrict: "E",
                    terminal: !0
                });
                return window.angular.bootstrap ? void console.log("WARNING: Tried to load angular more than once.") : (bindJQuery(), publishExternalAPI(angular), void jqLite(document).ready(function () {
                    angularInit(document, bootstrap)
                }))
            }(window, document),
            !window.angular.$$csp() && window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}.ng-hide-add-active,.ng-hide-remove{display:block!important;}</style>')
    },
    {}],
    3: [function (require, module, exports) {
        (function (global) {
            (function () {
                function baseIndexOf(array, value, fromIndex) {
                    for (var index = (fromIndex || 0) - 1, length = array ? array.length : 0; ++index < length;) if (array[index] === value) return index;
                    return -1
                }
                function cacheIndexOf(cache, value) {
                    var type = typeof value;
                    if (cache = cache.cache, "boolean" == type || null == value) return cache[value] ? 0 : -1;
                    "number" != type && "string" != type && (type = "object");
                    var key = "number" == type ? value : keyPrefix + value;
                    return cache = (cache = cache[type]) && cache[key],
                    "object" == type ? cache && baseIndexOf(cache, value) > -1 ? 0 : -1 : cache ? 0 : -1
                }
                function cachePush(value) {
                    var cache = this.cache,
                    type = typeof value;
                    if ("boolean" == type || null == value) cache[value] = !0;
                    else {
                        "number" != type && "string" != type && (type = "object");
                        var key = "number" == type ? value : keyPrefix + value,
                        typeCache = cache[type] || (cache[type] = {});
                        "object" == type ? (typeCache[key] || (typeCache[key] = [])).push(value) : typeCache[key] = !0
                    }
                }
                function charAtCallback(value) {
                    return value.charCodeAt(0)
                }
                function compareAscending(a, b) {
                    for (var ac = a.criteria,
                    bc = b.criteria,
                    index = -1,
                    length = ac.length; ++index < length;) {
                        var value = ac[index],
                        other = bc[index];
                        if (value !== other) {
                            if (value > other || "undefined" == typeof value) return 1;
                            if (other > value || "undefined" == typeof other) return -1
                        }
                    }
                    return a.index - b.index
                }
                function createCache(array) {
                    var index = -1,
                    length = array.length,
                    first = array[0],
                    mid = array[length / 2 | 0],
                    last = array[length - 1];
                    if (first && "object" == typeof first && mid && "object" == typeof mid && last && "object" == typeof last) return !1;
                    var cache = getObject();
                    cache["false"] = cache["null"] = cache["true"] = cache.undefined = !1;
                    var result = getObject();
                    for (result.array = array, result.cache = cache, result.push = cachePush; ++index < length;) result.push(array[index]);
                    return result
                }
                function escapeStringChar(match) {
                    return "\\" + stringEscapes[match]
                }
                function getArray() {
                    return arrayPool.pop() || []
                }
                function getObject() {
                    return objectPool.pop() || {
                        array: null,
                        cache: null,
                        criteria: null,
                        "false": !1,
                        index: 0,
                        "null": !1,
                        number: null,
                        object: null,
                        push: null,
                        string: null,
                        "true": !1,
                        undefined: !1,
                        value: null
                    }
                }
                function releaseArray(array) {
                    array.length = 0,
                    arrayPool.length < maxPoolSize && arrayPool.push(array)
                }
                function releaseObject(object) {
                    var cache = object.cache;
                    cache && releaseObject(cache),
                    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null,
                    objectPool.length < maxPoolSize && objectPool.push(object)
                }
                function slice(array, start, end) {
                    start || (start = 0),
                    "undefined" == typeof end && (end = array ? array.length : 0);
                    for (var index = -1,
                    length = end - start || 0,
                    result = Array(0 > length ? 0 : length) ; ++index < length;) result[index] = array[start + index];
                    return result
                }
                function runInContext(context) {
                    function lodash(value) {
                        return value && "object" == typeof value && !isArray(value) && hasOwnProperty.call(value, "__wrapped__") ? value : new lodashWrapper(value)
                    }
                    function lodashWrapper(value, chainAll) {
                        this.__chain__ = !!chainAll,
                        this.__wrapped__ = value
                    }
                    function baseBind(bindData) {
                        function bound() {
                            if (partialArgs) {
                                var args = slice(partialArgs);
                                push.apply(args, arguments)
                            }
                            if (this instanceof bound) {
                                var thisBinding = baseCreate(func.prototype),
                                result = func.apply(thisBinding, args || arguments);
                                return isObject(result) ? result : thisBinding
                            }
                            return func.apply(thisArg, args || arguments)
                        }
                        var func = bindData[0],
                        partialArgs = bindData[2],
                        thisArg = bindData[4];
                        return setBindData(bound, bindData),
                        bound
                    }
                    function baseClone(value, isDeep, callback, stackA, stackB) {
                        if (callback) {
                            var result = callback(value);
                            if ("undefined" != typeof result) return result
                        }
                        var isObj = isObject(value);
                        if (!isObj) return value;
                        var className = toString.call(value);
                        if (!cloneableClasses[className]) return value;
                        var ctor = ctorByClass[className];
                        switch (className) {
                            case boolClass:
                            case dateClass:
                                return new ctor(+value);
                            case numberClass:
                            case stringClass:
                                return new ctor(value);
                            case regexpClass:
                                return result = ctor(value.source, reFlags.exec(value)),
                                result.lastIndex = value.lastIndex,
                                result
                        }
                        var isArr = isArray(value);
                        if (isDeep) {
                            var initedStack = !stackA;
                            stackA || (stackA = getArray()),
                            stackB || (stackB = getArray());
                            for (var length = stackA.length; length--;) if (stackA[length] == value) return stackB[length];
                            result = isArr ? ctor(value.length) : {}
                        } else result = isArr ? slice(value) : assign({},
                        value);
                        return isArr && (hasOwnProperty.call(value, "index") && (result.index = value.index), hasOwnProperty.call(value, "input") && (result.input = value.input)),
                        isDeep ? (stackA.push(value), stackB.push(result), (isArr ? forEach : forOwn)(value,
                        function (objValue, key) {
                            result[key] = baseClone(objValue, isDeep, callback, stackA, stackB)
                        }), initedStack && (releaseArray(stackA), releaseArray(stackB)), result) : result
                    }
                    function baseCreate(prototype) {
                        return isObject(prototype) ? nativeCreate(prototype) : {}
                    }
                    function baseCreateCallback(func, thisArg, argCount) {
                        if ("function" != typeof func) return identity;
                        if ("undefined" == typeof thisArg || !("prototype" in func)) return func;
                        var bindData = func.__bindData__;
                        if ("undefined" == typeof bindData && (support.funcNames && (bindData = !func.name), bindData = bindData || !support.funcDecomp, !bindData)) {
                            var source = fnToString.call(func);
                            support.funcNames || (bindData = !reFuncName.test(source)),
                            bindData || (bindData = reThis.test(source), setBindData(func, bindData))
                        }
                        if (bindData === !1 || bindData !== !0 && 1 & bindData[1]) return func;
                        switch (argCount) {
                            case 1:
                                return function (value) {
                                    return func.call(thisArg, value)
                                };
                            case 2:
                                return function (a, b) {
                                    return func.call(thisArg, a, b)
                                };
                            case 3:
                                return function (value, index, collection) {
                                    return func.call(thisArg, value, index, collection)
                                };
                            case 4:
                                return function (accumulator, value, index, collection) {
                                    return func.call(thisArg, accumulator, value, index, collection)
                                }
                        }
                        return bind(func, thisArg)
                    }
                    function baseCreateWrapper(bindData) {
                        function bound() {
                            var thisBinding = isBind ? thisArg : this;
                            if (partialArgs) {
                                var args = slice(partialArgs);
                                push.apply(args, arguments)
                            }
                            if ((partialRightArgs || isCurry) && (args || (args = slice(arguments)), partialRightArgs && push.apply(args, partialRightArgs), isCurry && args.length < arity)) return bitmask |= 16,
                            baseCreateWrapper([func, isCurryBound ? bitmask : -4 & bitmask, args, null, thisArg, arity]);
                            if (args || (args = arguments), isBindKey && (func = thisBinding[key]), this instanceof bound) {
                                thisBinding = baseCreate(func.prototype);
                                var result = func.apply(thisBinding, args);
                                return isObject(result) ? result : thisBinding
                            }
                            return func.apply(thisBinding, args)
                        }
                        var func = bindData[0],
                        bitmask = bindData[1],
                        partialArgs = bindData[2],
                        partialRightArgs = bindData[3],
                        thisArg = bindData[4],
                        arity = bindData[5],
                        isBind = 1 & bitmask,
                        isBindKey = 2 & bitmask,
                        isCurry = 4 & bitmask,
                        isCurryBound = 8 & bitmask,
                        key = func;
                        return setBindData(bound, bindData),
                        bound
                    }
                    function baseDifference(array, values) {
                        var index = -1,
                        indexOf = getIndexOf(),
                        length = array ? array.length : 0,
                        isLarge = length >= largeArraySize && indexOf === baseIndexOf,
                        result = [];
                        if (isLarge) {
                            var cache = createCache(values);
                            cache ? (indexOf = cacheIndexOf, values = cache) : isLarge = !1
                        }
                        for (; ++index < length;) {
                            var value = array[index];
                            indexOf(values, value) < 0 && result.push(value)
                        }
                        return isLarge && releaseObject(values),
                        result
                    }
                    function baseFlatten(array, isShallow, isStrict, fromIndex) {
                        for (var index = (fromIndex || 0) - 1, length = array ? array.length : 0, result = []; ++index < length;) {
                            var value = array[index];
                            if (value && "object" == typeof value && "number" == typeof value.length && (isArray(value) || isArguments(value))) {
                                isShallow || (value = baseFlatten(value, isShallow, isStrict));
                                var valIndex = -1,
                                valLength = value.length,
                                resIndex = result.length;
                                for (result.length += valLength; ++valIndex < valLength;) result[resIndex++] = value[valIndex]
                            } else isStrict || result.push(value)
                        }
                        return result
                    }
                    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
                        if (callback) {
                            var result = callback(a, b);
                            if ("undefined" != typeof result) return !!result
                        }
                        if (a === b) return 0 !== a || 1 / a == 1 / b;
                        var type = typeof a,
                        otherType = typeof b;
                        if (!(a !== a || a && objectTypes[type] || b && objectTypes[otherType])) return !1;
                        if (null == a || null == b) return a === b;
                        var className = toString.call(a),
                        otherClass = toString.call(b);
                        if (className == argsClass && (className = objectClass), otherClass == argsClass && (otherClass = objectClass), className != otherClass) return !1;
                        switch (className) {
                            case boolClass:
                            case dateClass:
                                return +a == +b;
                            case numberClass:
                                return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
                            case regexpClass:
                            case stringClass:
                                return a == String(b)
                        }
                        var isArr = className == arrayClass;
                        if (!isArr) {
                            var aWrapped = hasOwnProperty.call(a, "__wrapped__"),
                            bWrapped = hasOwnProperty.call(b, "__wrapped__");
                            if (aWrapped || bWrapped) return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
                            if (className != objectClass) return !1;
                            var ctorA = a.constructor,
                            ctorB = b.constructor;
                            if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && "constructor" in a && "constructor" in b) return !1
                        }
                        var initedStack = !stackA;
                        stackA || (stackA = getArray()),
                        stackB || (stackB = getArray());
                        for (var length = stackA.length; length--;) if (stackA[length] == a) return stackB[length] == b;
                        var size = 0;
                        if (result = !0, stackA.push(a), stackB.push(b), isArr) {
                            if (length = a.length, size = b.length, result = size == length, result || isWhere) for (; size--;) {
                                var index = length,
                                value = b[size];
                                if (isWhere) for (; index-- && !(result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB)) ;);
                                else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) break
                            }
                        } else forIn(b,
                        function (value, key, b) {
                            return hasOwnProperty.call(b, key) ? (size++, result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB)) : void 0
                        }),
                        result && !isWhere && forIn(a,
                        function (value, key, a) {
                            return hasOwnProperty.call(a, key) ? result = --size > -1 : void 0
                        });
                        return stackA.pop(),
                        stackB.pop(),
                        initedStack && (releaseArray(stackA), releaseArray(stackB)),
                        result
                    }
                    function baseMerge(object, source, callback, stackA, stackB) {
                        (isArray(source) ? forEach : forOwn)(source,
                            function (source, key) {
                                var found, isArr, result = source,
                                value = object[key];
                                if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
                                    for (var stackLength = stackA.length; stackLength--;) if (found = stackA[stackLength] == source) {
                                        value = stackB[stackLength];
                                        break
                                    }
                                    if (!found) {
                                        var isShallow;
                                        callback && (result = callback(value, source), (isShallow = "undefined" != typeof result) && (value = result)),
                                        isShallow || (value = isArr ? isArray(value) ? value : [] : isPlainObject(value) ? value : {}),
                                        stackA.push(source),
                                        stackB.push(value),
                                        isShallow || baseMerge(value, source, callback, stackA, stackB)
                                    }
                                } else callback && (result = callback(value, source), "undefined" == typeof result && (result = source)),
                                "undefined" != typeof result && (value = result);
                                object[key] = value
                            })
                    }
                    function baseRandom(min, max) {
                        return min + floor(nativeRandom() * (max - min + 1))
                    }
                    function baseUniq(array, isSorted, callback) {
                        var index = -1,
                        indexOf = getIndexOf(),
                        length = array ? array.length : 0,
                        result = [],
                        isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
                        seen = callback || isLarge ? getArray() : result;
                        if (isLarge) {
                            var cache = createCache(seen);
                            indexOf = cacheIndexOf,
                            seen = cache
                        }
                        for (; ++index < length;) {
                            var value = array[index],
                            computed = callback ? callback(value, index, array) : value; (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) && ((callback || isLarge) && seen.push(computed), result.push(value))
                        }
                        return isLarge ? (releaseArray(seen.array), releaseObject(seen)) : callback && releaseArray(seen),
                        result
                    }
                    function createAggregator(setter) {
                        return function (collection, callback, thisArg) {
                            var result = {};
                            callback = lodash.createCallback(callback, thisArg, 3);
                            var index = -1,
                            length = collection ? collection.length : 0;
                            if ("number" == typeof length) for (; ++index < length;) {
                                var value = collection[index];
                                setter(result, value, callback(value, index, collection), collection)
                            } else forOwn(collection,
                            function (value, key, collection) {
                                setter(result, value, callback(value, key, collection), collection)
                            });
                            return result
                        }
                    }
                    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
                        var isBind = 1 & bitmask,
                        isBindKey = 2 & bitmask,
                        isCurry = 4 & bitmask,
                        isPartial = 16 & bitmask,
                        isPartialRight = 32 & bitmask;
                        if (!isBindKey && !isFunction(func)) throw new TypeError;
                        isPartial && !partialArgs.length && (bitmask &= -17, isPartial = partialArgs = !1),
                        isPartialRight && !partialRightArgs.length && (bitmask &= -33, isPartialRight = partialRightArgs = !1);
                        var bindData = func && func.__bindData__;
                        if (bindData && bindData !== !0) return bindData = slice(bindData),
                        bindData[2] && (bindData[2] = slice(bindData[2])),
                        bindData[3] && (bindData[3] = slice(bindData[3])),
                        !isBind || 1 & bindData[1] || (bindData[4] = thisArg),
                        !isBind && 1 & bindData[1] && (bitmask |= 8),
                        !isCurry || 4 & bindData[1] || (bindData[5] = arity),
                        isPartial && push.apply(bindData[2] || (bindData[2] = []), partialArgs),
                        isPartialRight && unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs),
                        bindData[1] |= bitmask,
                        createWrapper.apply(null, bindData);
                        var creater = 1 == bitmask || 17 === bitmask ? baseBind : baseCreateWrapper;
                        return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity])
                    }
                    function escapeHtmlChar(match) {
                        return htmlEscapes[match]
                    }
                    function getIndexOf() {
                        var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
                        return result
                    }
                    function isNative(value) {
                        return "function" == typeof value && reNative.test(value)
                    }
                    function shimIsPlainObject(value) {
                        var ctor, result;
                        return value && toString.call(value) == objectClass && (ctor = value.constructor, !isFunction(ctor) || ctor instanceof ctor) ? (forIn(value,
                        function (value, key) {
                            result = key
                        }), "undefined" == typeof result || hasOwnProperty.call(value, result)) : !1
                    }
                    function unescapeHtmlChar(match) {
                        return htmlUnescapes[match]
                    }
                    function isArguments(value) {
                        return value && "object" == typeof value && "number" == typeof value.length && toString.call(value) == argsClass || !1
                    }
                    function clone(value, isDeep, callback, thisArg) {
                        return "boolean" != typeof isDeep && null != isDeep && (thisArg = callback, callback = isDeep, isDeep = !1),
                        baseClone(value, isDeep, "function" == typeof callback && baseCreateCallback(callback, thisArg, 1))
                    }
                    function cloneDeep(value, callback, thisArg) {
                        return baseClone(value, !0, "function" == typeof callback && baseCreateCallback(callback, thisArg, 1))
                    }
                    function create(prototype, properties) {
                        var result = baseCreate(prototype);
                        return properties ? assign(result, properties) : result
                    }
                    function findKey(object, callback, thisArg) {
                        var result;
                        return callback = lodash.createCallback(callback, thisArg, 3),
                        forOwn(object,
                        function (value, key, object) {
                            return callback(value, key, object) ? (result = key, !1) : void 0
                        }),
                        result
                    }
                    function findLastKey(object, callback, thisArg) {
                        var result;
                        return callback = lodash.createCallback(callback, thisArg, 3),
                        forOwnRight(object,
                        function (value, key, object) {
                            return callback(value, key, object) ? (result = key, !1) : void 0
                        }),
                        result
                    }
                    function forInRight(object, callback, thisArg) {
                        var pairs = [];
                        forIn(object,
                        function (value, key) {
                            pairs.push(key, value)
                        });
                        var length = pairs.length;
                        for (callback = baseCreateCallback(callback, thisArg, 3) ; length-- && callback(pairs[length--], pairs[length], object) !== !1;);
                        return object
                    }
                    function forOwnRight(object, callback, thisArg) {
                        var props = keys(object),
                        length = props.length;
                        for (callback = baseCreateCallback(callback, thisArg, 3) ; length--;) {
                            var key = props[length];
                            if (callback(object[key], key, object) === !1) break
                        }
                        return object
                    }
                    function functions(object) {
                        var result = [];
                        return forIn(object,
                        function (value, key) {
                            isFunction(value) && result.push(key)
                        }),
                        result.sort()
                    }
                    function has(object, key) {
                        return object ? hasOwnProperty.call(object, key) : !1
                    }
                    function invert(object) {
                        for (var index = -1,
                        props = keys(object), length = props.length, result = {}; ++index < length;) {
                            var key = props[index];
                            result[object[key]] = key
                        }
                        return result
                    }
                    function isBoolean(value) {
                        return value === !0 || value === !1 || value && "object" == typeof value && toString.call(value) == boolClass || !1
                    }
                    function isDate(value) {
                        return value && "object" == typeof value && toString.call(value) == dateClass || !1
                    }
                    function isElement(value) {
                        return value && 1 === value.nodeType || !1
                    }
                    function isEmpty(value) {
                        var result = !0;
                        if (!value) return result;
                        var className = toString.call(value),
                        length = value.length;
                        return className == arrayClass || className == stringClass || className == argsClass || className == objectClass && "number" == typeof length && isFunction(value.splice) ? !length : (forOwn(value,
                        function () {
                            return result = !1
                        }), result)
                    }
                    function isEqual(a, b, callback, thisArg) {
                        return baseIsEqual(a, b, "function" == typeof callback && baseCreateCallback(callback, thisArg, 2))
                    }
                    function isFinite(value) {
                        return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value))
                    }
                    function isFunction(value) {
                        return "function" == typeof value
                    }
                    function isObject(value) {
                        return !(!value || !objectTypes[typeof value])
                    }
                    function isNaN(value) {
                        return isNumber(value) && value != +value
                    }
                    function isNull(value) {
                        return null === value
                    }
                    function isNumber(value) {
                        return "number" == typeof value || value && "object" == typeof value && toString.call(value) == numberClass || !1
                    }
                    function isRegExp(value) {
                        return value && "object" == typeof value && toString.call(value) == regexpClass || !1
                    }
                    function isString(value) {
                        return "string" == typeof value || value && "object" == typeof value && toString.call(value) == stringClass || !1
                    }
                    function isUndefined(value) {
                        return "undefined" == typeof value
                    }
                    function mapValues(object, callback, thisArg) {
                        var result = {};
                        return callback = lodash.createCallback(callback, thisArg, 3),
                        forOwn(object,
                        function (value, key, object) {
                            result[key] = callback(value, key, object)
                        }),
                        result
                    }
                    function merge(object) {
                        var args = arguments,
                        length = 2;
                        if (!isObject(object)) return object;
                        if ("number" != typeof args[2] && (length = args.length), length > 3 && "function" == typeof args[length - 2]) var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
                        else length > 2 && "function" == typeof args[length - 1] && (callback = args[--length]);
                        for (var sources = slice(arguments, 1, length), index = -1, stackA = getArray(), stackB = getArray() ; ++index < length;) baseMerge(object, sources[index], callback, stackA, stackB);
                        return releaseArray(stackA),
                        releaseArray(stackB),
                        object
                    }
                    function omit(object, callback, thisArg) {
                        var result = {};
                        if ("function" != typeof callback) {
                            var props = [];
                            forIn(object,
                            function (value, key) {
                                props.push(key)
                            }),
                            props = baseDifference(props, baseFlatten(arguments, !0, !1, 1));
                            for (var index = -1,
                            length = props.length; ++index < length;) {
                                var key = props[index];
                                result[key] = object[key]
                            }
                        } else callback = lodash.createCallback(callback, thisArg, 3),
                        forIn(object,
                        function (value, key, object) {
                            callback(value, key, object) || (result[key] = value)
                        });
                        return result
                    }
                    function pairs(object) {
                        for (var index = -1,
                        props = keys(object), length = props.length, result = Array(length) ; ++index < length;) {
                            var key = props[index];
                            result[index] = [key, object[key]]
                        }
                        return result
                    }
                    function pick(object, callback, thisArg) {
                        var result = {};
                        if ("function" != typeof callback) for (var index = -1,
                        props = baseFlatten(arguments, !0, !1, 1), length = isObject(object) ? props.length : 0; ++index < length;) {
                            var key = props[index];
                            key in object && (result[key] = object[key])
                        } else callback = lodash.createCallback(callback, thisArg, 3),
                        forIn(object,
                        function (value, key, object) {
                            callback(value, key, object) && (result[key] = value)
                        });
                        return result
                    }
                    function transform(object, callback, accumulator, thisArg) {
                        var isArr = isArray(object);
                        if (null == accumulator) if (isArr) accumulator = [];
                        else {
                            var ctor = object && object.constructor,
                            proto = ctor && ctor.prototype;
                            accumulator = baseCreate(proto)
                        }
                        return callback && (callback = lodash.createCallback(callback, thisArg, 4), (isArr ? forEach : forOwn)(object,
                        function (value, index, object) {
                            return callback(accumulator, value, index, object)
                        })),
                        accumulator
                    }
                    function values(object) {
                        for (var index = -1,
                        props = keys(object), length = props.length, result = Array(length) ; ++index < length;) result[index] = object[props[index]];
                        return result
                    }
                    function at(collection) {
                        for (var args = arguments,
                        index = -1,
                        props = baseFlatten(args, !0, !1, 1), length = args[2] && args[2][args[1]] === collection ? 1 : props.length, result = Array(length) ; ++index < length;) result[index] = collection[props[index]];
                        return result
                    }
                    function contains(collection, target, fromIndex) {
                        var index = -1,
                        indexOf = getIndexOf(),
                        length = collection ? collection.length : 0,
                        result = !1;
                        return fromIndex = (0 > fromIndex ? nativeMax(0, length + fromIndex) : fromIndex) || 0,
                        isArray(collection) ? result = indexOf(collection, target, fromIndex) > -1 : "number" == typeof length ? result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1 : forOwn(collection,
                        function (value) {
                            return ++index >= fromIndex ? !(result = value === target) : void 0
                        }),
                        result
                    }
                    function every(collection, callback, thisArg) {
                        var result = !0;
                        callback = lodash.createCallback(callback, thisArg, 3);
                        var index = -1,
                        length = collection ? collection.length : 0;
                        if ("number" == typeof length) for (; ++index < length && (result = !!callback(collection[index], index, collection)) ;);
                        else forOwn(collection,
                        function (value, index, collection) {
                            return result = !!callback(value, index, collection)
                        });
                        return result
                    }
                    function filter(collection, callback, thisArg) {
                        var result = [];
                        callback = lodash.createCallback(callback, thisArg, 3);
                        var index = -1,
                        length = collection ? collection.length : 0;
                        if ("number" == typeof length) for (; ++index < length;) {
                            var value = collection[index];
                            callback(value, index, collection) && result.push(value)
                        } else forOwn(collection,
                        function (value, index, collection) {
                            callback(value, index, collection) && result.push(value)
                        });
                        return result
                    }
                    function find(collection, callback, thisArg) {
                        callback = lodash.createCallback(callback, thisArg, 3);
                        var index = -1,
                        length = collection ? collection.length : 0;
                        if ("number" != typeof length) {
                            var result;
                            return forOwn(collection,
                            function (value, index, collection) {
                                return callback(value, index, collection) ? (result = value, !1) : void 0
                            }),
                            result
                        }
                        for (; ++index < length;) {
                            var value = collection[index];
                            if (callback(value, index, collection)) return value
                        }
                    }
                    function findLast(collection, callback, thisArg) {
                        var result;
                        return callback = lodash.createCallback(callback, thisArg, 3),
                        forEachRight(collection,
                        function (value, index, collection) {
                            return callback(value, index, collection) ? (result = value, !1) : void 0
                        }),
                        result
                    }
                    function forEach(collection, callback, thisArg) {
                        var index = -1,
                        length = collection ? collection.length : 0;
                        if (callback = callback && "undefined" == typeof thisArg ? callback : baseCreateCallback(callback, thisArg, 3), "number" == typeof length) for (; ++index < length && callback(collection[index], index, collection) !== !1;);
                        else forOwn(collection, callback);
                        return collection
                    }
                    function forEachRight(collection, callback, thisArg) {
                        var length = collection ? collection.length : 0;
                        if (callback = callback && "undefined" == typeof thisArg ? callback : baseCreateCallback(callback, thisArg, 3), "number" == typeof length) for (; length-- && callback(collection[length], length, collection) !== !1;);
                        else {
                            var props = keys(collection);
                            length = props.length,
                            forOwn(collection,
                            function (value, key, collection) {
                                return key = props ? props[--length] : --length,
                                callback(collection[key], key, collection)
                            })
                        }
                        return collection
                    }
                    function invoke(collection, methodName) {
                        var args = slice(arguments, 2),
                        index = -1,
                        isFunc = "function" == typeof methodName,
                        length = collection ? collection.length : 0,
                        result = Array("number" == typeof length ? length : 0);
                        return forEach(collection,
                        function (value) {
                            result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args)
                        }),
                        result
                    }
                    function map(collection, callback, thisArg) {
                        var index = -1,
                        length = collection ? collection.length : 0;
                        if (callback = lodash.createCallback(callback, thisArg, 3), "number" == typeof length) for (var result = Array(length) ; ++index < length;) result[index] = callback(collection[index], index, collection);
                        else result = [],
                        forOwn(collection,
                        function (value, key, collection) {
                            result[++index] = callback(value, key, collection)
                        });
                        return result
                    }
                    function max(collection, callback, thisArg) {
                        var computed = -1 / 0,
                        result = computed;
                        if ("function" != typeof callback && thisArg && thisArg[callback] === collection && (callback = null), null == callback && isArray(collection)) for (var index = -1,
                        length = collection.length; ++index < length;) {
                            var value = collection[index];
                            value > result && (result = value)
                        } else callback = null == callback && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg, 3),
                        forEach(collection,
                        function (value, index, collection) {
                            var current = callback(value, index, collection);
                            current > computed && (computed = current, result = value)
                        });
                        return result
                    }
                    function min(collection, callback, thisArg) {
                        var computed = 1 / 0,
                        result = computed;
                        if ("function" != typeof callback && thisArg && thisArg[callback] === collection && (callback = null), null == callback && isArray(collection)) for (var index = -1,
                        length = collection.length; ++index < length;) {
                            var value = collection[index];
                            result > value && (result = value)
                        } else callback = null == callback && isString(collection) ? charAtCallback : lodash.createCallback(callback, thisArg, 3),
                        forEach(collection,
                        function (value, index, collection) {
                            var current = callback(value, index, collection);
                            computed > current && (computed = current, result = value)
                        });
                        return result
                    }
                    function reduce(collection, callback, accumulator, thisArg) {
                        if (!collection) return accumulator;
                        var noaccum = arguments.length < 3;
                        callback = lodash.createCallback(callback, thisArg, 4);
                        var index = -1,
                        length = collection.length;
                        if ("number" == typeof length) for (noaccum && (accumulator = collection[++index]) ; ++index < length;) accumulator = callback(accumulator, collection[index], index, collection);
                        else forOwn(collection,
                        function (value, index, collection) {
                            accumulator = noaccum ? (noaccum = !1, value) : callback(accumulator, value, index, collection)
                        });
                        return accumulator
                    }
                    function reduceRight(collection, callback, accumulator, thisArg) {
                        var noaccum = arguments.length < 3;
                        return callback = lodash.createCallback(callback, thisArg, 4),
                        forEachRight(collection,
                        function (value, index, collection) {
                            accumulator = noaccum ? (noaccum = !1, value) : callback(accumulator, value, index, collection)
                        }),
                        accumulator
                    }
                    function reject(collection, callback, thisArg) {
                        return callback = lodash.createCallback(callback, thisArg, 3),
                        filter(collection,
                        function (value, index, collection) {
                            return !callback(value, index, collection)
                        })
                    }
                    function sample(collection, n, guard) {
                        if (collection && "number" != typeof collection.length && (collection = values(collection)), null == n || guard) return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
                        var result = shuffle(collection);
                        return result.length = nativeMin(nativeMax(0, n), result.length),
                        result
                    }
                    function shuffle(collection) {
                        var index = -1,
                        length = collection ? collection.length : 0,
                        result = Array("number" == typeof length ? length : 0);
                        return forEach(collection,
                        function (value) {
                            var rand = baseRandom(0, ++index);
                            result[index] = result[rand],
                            result[rand] = value
                        }),
                        result
                    }
                    function size(collection) {
                        var length = collection ? collection.length : 0;
                        return "number" == typeof length ? length : keys(collection).length
                    }
                    function some(collection, callback, thisArg) {
                        var result;
                        callback = lodash.createCallback(callback, thisArg, 3);
                        var index = -1,
                        length = collection ? collection.length : 0;
                        if ("number" == typeof length) for (; ++index < length && !(result = callback(collection[index], index, collection)) ;);
                        else forOwn(collection,
                        function (value, index, collection) {
                            return !(result = callback(value, index, collection))
                        });
                        return !!result
                    }
                    function sortBy(collection, callback, thisArg) {
                        var index = -1,
                        isArr = isArray(callback),
                        length = collection ? collection.length : 0,
                        result = Array("number" == typeof length ? length : 0);
                        for (isArr || (callback = lodash.createCallback(callback, thisArg, 3)), forEach(collection,
                        function (value, key, collection) {
                            var object = result[++index] = getObject();
                            isArr ? object.criteria = map(callback,
                            function (key) {
                                return value[key]
                        }) : (object.criteria = getArray())[0] = callback(value, key, collection),
                            object.index = index,
                            object.value = value
                        }), length = result.length, result.sort(compareAscending) ; length--;) {
                            var object = result[length];
                            result[length] = object.value,
                            isArr || releaseArray(object.criteria),
                            releaseObject(object)
                        }
                        return result
                    }
                    function toArray(collection) {
                        return collection && "number" == typeof collection.length ? slice(collection) : values(collection)
                    }
                    function compact(array) {
                        for (var index = -1,
                        length = array ? array.length : 0, result = []; ++index < length;) {
                            var value = array[index];
                            value && result.push(value)
                        }
                        return result
                    }
                    function difference(array) {
                        return baseDifference(array, baseFlatten(arguments, !0, !0, 1))
                    }
                    function findIndex(array, callback, thisArg) {
                        var index = -1,
                        length = array ? array.length : 0;
                        for (callback = lodash.createCallback(callback, thisArg, 3) ; ++index < length;) if (callback(array[index], index, array)) return index;
                        return -1
                    }
                    function findLastIndex(array, callback, thisArg) {
                        var length = array ? array.length : 0;
                        for (callback = lodash.createCallback(callback, thisArg, 3) ; length--;) if (callback(array[length], length, array)) return length;
                        return -1
                    }
                    function first(array, callback, thisArg) {
                        var n = 0,
                        length = array ? array.length : 0;
                        if ("number" != typeof callback && null != callback) {
                            var index = -1;
                            for (callback = lodash.createCallback(callback, thisArg, 3) ; ++index < length && callback(array[index], index, array) ;) n++
                        } else if (n = callback, null == n || thisArg) return array ? array[0] : undefined;
                        return slice(array, 0, nativeMin(nativeMax(0, n), length))
                    }
                    function flatten(array, isShallow, callback, thisArg) {
                        return "boolean" != typeof isShallow && null != isShallow && (thisArg = callback, callback = "function" != typeof isShallow && thisArg && thisArg[isShallow] === array ? null : isShallow, isShallow = !1),
                        null != callback && (array = map(array, callback, thisArg)),
                        baseFlatten(array, isShallow)
                    }
                    function indexOf(array, value, fromIndex) {
                        if ("number" == typeof fromIndex) {
                            var length = array ? array.length : 0;
                            fromIndex = 0 > fromIndex ? nativeMax(0, length + fromIndex) : fromIndex || 0
                        } else if (fromIndex) {
                            var index = sortedIndex(array, value);
                            return array[index] === value ? index : -1
                        }
                        return baseIndexOf(array, value, fromIndex)
                    }
                    function initial(array, callback, thisArg) {
                        var n = 0,
                        length = array ? array.length : 0;
                        if ("number" != typeof callback && null != callback) {
                            var index = length;
                            for (callback = lodash.createCallback(callback, thisArg, 3) ; index-- && callback(array[index], index, array) ;) n++
                        } else n = null == callback || thisArg ? 1 : callback || n;
                        return slice(array, 0, nativeMin(nativeMax(0, length - n), length))
                    }
                    function intersection() {
                        for (var args = [], argsIndex = -1, argsLength = arguments.length, caches = getArray(), indexOf = getIndexOf(), trustIndexOf = indexOf === baseIndexOf, seen = getArray() ; ++argsIndex < argsLength;) {
                            var value = arguments[argsIndex]; (isArray(value) || isArguments(value)) && (args.push(value), caches.push(trustIndexOf && value.length >= largeArraySize && createCache(argsIndex ? args[argsIndex] : seen)))
                        }
                        var array = args[0],
                        index = -1,
                        length = array ? array.length : 0,
                        result = [];
                        outer: for (; ++index < length;) {
                            var cache = caches[0];
                            if (value = array[index], (cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
                                for (argsIndex = argsLength, (cache || seen).push(value) ; --argsIndex;) if (cache = caches[argsIndex], (cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) continue outer;
                                result.push(value)
                            }
                        }
                        for (; argsLength--;) cache = caches[argsLength],
                        cache && releaseObject(cache);
                        return releaseArray(caches),
                        releaseArray(seen),
                        result
                    }
                    function last(array, callback, thisArg) {
                        var n = 0,
                        length = array ? array.length : 0;
                        if ("number" != typeof callback && null != callback) {
                            var index = length;
                            for (callback = lodash.createCallback(callback, thisArg, 3) ; index-- && callback(array[index], index, array) ;) n++
                        } else if (n = callback, null == n || thisArg) return array ? array[length - 1] : undefined;
                        return slice(array, nativeMax(0, length - n))
                    }
                    function lastIndexOf(array, value, fromIndex) {
                        var index = array ? array.length : 0;
                        for ("number" == typeof fromIndex && (index = (0 > fromIndex ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1) ; index--;) if (array[index] === value) return index;
                        return -1
                    }
                    function pull(array) {
                        for (var args = arguments,
                        argsIndex = 0,
                        argsLength = args.length,
                        length = array ? array.length : 0; ++argsIndex < argsLength;) for (var index = -1,
                        value = args[argsIndex]; ++index < length;) array[index] === value && (splice.call(array, index--, 1), length--);
                        return array
                    }
                    function range(start, end, step) {
                        start = +start || 0,
                        step = "number" == typeof step ? step : +step || 1,
                        null == end && (end = start, start = 0);
                        for (var index = -1,
                        length = nativeMax(0, ceil((end - start) / (step || 1))), result = Array(length) ; ++index < length;) result[index] = start,
                        start += step;
                        return result
                    }
                    function remove(array, callback, thisArg) {
                        var index = -1,
                        length = array ? array.length : 0,
                        result = [];
                        for (callback = lodash.createCallback(callback, thisArg, 3) ; ++index < length;) {
                            var value = array[index];
                            callback(value, index, array) && (result.push(value), splice.call(array, index--, 1), length--)
                        }
                        return result
                    }
                    function rest(array, callback, thisArg) {
                        if ("number" != typeof callback && null != callback) {
                            var n = 0,
                            index = -1,
                            length = array ? array.length : 0;
                            for (callback = lodash.createCallback(callback, thisArg, 3) ; ++index < length && callback(array[index], index, array) ;) n++
                        } else n = null == callback || thisArg ? 1 : nativeMax(0, callback);
                        return slice(array, n)
                    }
                    function sortedIndex(array, value, callback, thisArg) {
                        var low = 0,
                        high = array ? array.length : low;
                        for (callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity, value = callback(value) ; high > low;) {
                            var mid = low + high >>> 1;
                            callback(array[mid]) < value ? low = mid + 1 : high = mid
                        }
                        return low
                    }
                    function union() {
                        return baseUniq(baseFlatten(arguments, !0, !0))
                    }
                    function uniq(array, isSorted, callback, thisArg) {
                        return "boolean" != typeof isSorted && null != isSorted && (thisArg = callback, callback = "function" != typeof isSorted && thisArg && thisArg[isSorted] === array ? null : isSorted, isSorted = !1),
                        null != callback && (callback = lodash.createCallback(callback, thisArg, 3)),
                        baseUniq(array, isSorted, callback)
                    }
                    function without(array) {
                        return baseDifference(array, slice(arguments, 1))
                    }
                    function xor() {
                        for (var index = -1,
                        length = arguments.length; ++index < length;) {
                            var array = arguments[index];
                            if (isArray(array) || isArguments(array)) var result = result ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result))) : array
                        }
                        return result || []
                    }
                    function zip() {
                        for (var array = arguments.length > 1 ? arguments : arguments[0], index = -1, length = array ? max(pluck(array, "length")) : 0, result = Array(0 > length ? 0 : length) ; ++index < length;) result[index] = pluck(array, index);
                        return result
                    }
                    function zipObject(keys, values) {
                        var index = -1,
                        length = keys ? keys.length : 0,
                        result = {};
                        for (values || !length || isArray(keys[0]) || (values = []) ; ++index < length;) {
                            var key = keys[index];
                            values ? result[key] = values[index] : key && (result[key[0]] = key[1])
                        }
                        return result
                    }
                    function after(n, func) {
                        if (!isFunction(func)) throw new TypeError;
                        return function () {
                            return --n < 1 ? func.apply(this, arguments) : void 0
                        }
                    }
                    function bind(func, thisArg) {
                        return arguments.length > 2 ? createWrapper(func, 17, slice(arguments, 2), null, thisArg) : createWrapper(func, 1, null, null, thisArg)
                    }
                    function bindAll(object) {
                        for (var funcs = arguments.length > 1 ? baseFlatten(arguments, !0, !1, 1) : functions(object), index = -1, length = funcs.length; ++index < length;) {
                            var key = funcs[index];
                            object[key] = createWrapper(object[key], 1, null, null, object)
                        }
                        return object
                    }
                    function bindKey(object, key) {
                        return arguments.length > 2 ? createWrapper(key, 19, slice(arguments, 2), null, object) : createWrapper(key, 3, null, null, object)
                    }
                    function compose() {
                        for (var funcs = arguments,
                        length = funcs.length; length--;) if (!isFunction(funcs[length])) throw new TypeError;
                        return function () {
                            for (var args = arguments,
                            length = funcs.length; length--;) args = [funcs[length].apply(this, args)];
                            return args[0]
                        }
                    }
                    function curry(func, arity) {
                        return arity = "number" == typeof arity ? arity : +arity || func.length,
                        createWrapper(func, 4, null, null, null, arity)
                    }
                    function debounce(func, wait, options) {
                        var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0,
                        maxWait = !1,
                        trailing = !0;
                        if (!isFunction(func)) throw new TypeError;
                        if (wait = nativeMax(0, wait) || 0, options === !0) {
                            var leading = !0;
                            trailing = !1
                        } else isObject(options) && (leading = options.leading, maxWait = "maxWait" in options && (nativeMax(wait, options.maxWait) || 0), trailing = "trailing" in options ? options.trailing : trailing);
                        var delayed = function () {
                            var remaining = wait - (now() - stamp);
                            if (0 >= remaining) {
                                maxTimeoutId && clearTimeout(maxTimeoutId);
                                var isCalled = trailingCall;
                                maxTimeoutId = timeoutId = trailingCall = undefined,
                                isCalled && (lastCalled = now(), result = func.apply(thisArg, args), timeoutId || maxTimeoutId || (args = thisArg = null))
                            } else timeoutId = setTimeout(delayed, remaining)
                        },
                        maxDelayed = function () {
                            timeoutId && clearTimeout(timeoutId),
                            maxTimeoutId = timeoutId = trailingCall = undefined,
                            (trailing || maxWait !== wait) && (lastCalled = now(), result = func.apply(thisArg, args), timeoutId || maxTimeoutId || (args = thisArg = null))
                        };
                        return function () {
                            if (args = arguments, stamp = now(), thisArg = this, trailingCall = trailing && (timeoutId || !leading), maxWait === !1) var leadingCall = leading && !timeoutId;
                            else {
                                maxTimeoutId || leading || (lastCalled = stamp);
                                var remaining = maxWait - (stamp - lastCalled),
                                isCalled = 0 >= remaining;
                                isCalled ? (maxTimeoutId && (maxTimeoutId = clearTimeout(maxTimeoutId)), lastCalled = stamp, result = func.apply(thisArg, args)) : maxTimeoutId || (maxTimeoutId = setTimeout(maxDelayed, remaining))
                            }
                            return isCalled && timeoutId ? timeoutId = clearTimeout(timeoutId) : timeoutId || wait === maxWait || (timeoutId = setTimeout(delayed, wait)),
                            leadingCall && (isCalled = !0, result = func.apply(thisArg, args)),
                            !isCalled || timeoutId || maxTimeoutId || (args = thisArg = null),
                            result
                        }
                    }
                    function defer(func) {
                        if (!isFunction(func)) throw new TypeError;
                        var args = slice(arguments, 1);
                        return setTimeout(function () {
                            func.apply(undefined, args)
                        },
                        1)
                    }
                    function delay(func, wait) {
                        if (!isFunction(func)) throw new TypeError;
                        var args = slice(arguments, 2);
                        return setTimeout(function () {
                            func.apply(undefined, args)
                        },
                        wait)
                    }
                    function memoize(func, resolver) {
                        if (!isFunction(func)) throw new TypeError;
                        var memoized = function () {
                            var cache = memoized.cache,
                            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];
                            return hasOwnProperty.call(cache, key) ? cache[key] : cache[key] = func.apply(this, arguments)
                        };
                        return memoized.cache = {},
                        memoized
                    }
                    function once(func) {
                        var ran, result;
                        if (!isFunction(func)) throw new TypeError;
                        return function () {
                            return ran ? result : (ran = !0, result = func.apply(this, arguments), func = null, result)
                        }
                    }
                    function partial(func) {
                        return createWrapper(func, 16, slice(arguments, 1))
                    }
                    function partialRight(func) {
                        return createWrapper(func, 32, null, slice(arguments, 1))
                    }
                    function throttle(func, wait, options) {
                        var leading = !0,
                        trailing = !0;
                        if (!isFunction(func)) throw new TypeError;
                        return options === !1 ? leading = !1 : isObject(options) && (leading = "leading" in options ? options.leading : leading, trailing = "trailing" in options ? options.trailing : trailing),
                        debounceOptions.leading = leading,
                        debounceOptions.maxWait = wait,
                        debounceOptions.trailing = trailing,
                        debounce(func, wait, debounceOptions)
                    }
                    function wrap(value, wrapper) {
                        return createWrapper(wrapper, 16, [value])
                    }
                    function constant(value) {
                        return function () {
                            return value
                        }
                    }
                    function createCallback(func, thisArg, argCount) {
                        var type = typeof func;
                        if (null == func || "function" == type) return baseCreateCallback(func, thisArg, argCount);
                        if ("object" != type) return property(func);
                        var props = keys(func),
                        key = props[0],
                        a = func[key];
                        return 1 != props.length || a !== a || isObject(a) ?
                        function (object) {
                            for (var length = props.length,
                            result = !1; length-- && (result = baseIsEqual(object[props[length]], func[props[length]], null, !0)) ;);
                            return result
                        } : function (object) {
                            var b = object[key];
                            return a === b && (0 !== a || 1 / a == 1 / b)
                        }
                    }
                    function escape(string) {
                        return null == string ? "" : String(string).replace(reUnescapedHtml, escapeHtmlChar)
                    }
                    function identity(value) {
                        return value
                    }
                    function mixin(object, source, options) {
                        var chain = !0,
                        methodNames = source && functions(source);
                        source && (options || methodNames.length) || (null == options && (options = source), ctor = lodashWrapper, source = object, object = lodash, methodNames = functions(source)),
                        options === !1 ? chain = !1 : isObject(options) && "chain" in options && (chain = options.chain);
                        var ctor = object,
                        isFunc = isFunction(ctor);
                        forEach(methodNames,
                        function (methodName) {
                            var func = object[methodName] = source[methodName];
                            isFunc && (ctor.prototype[methodName] = function () {
                                var chainAll = this.__chain__,
                                value = this.__wrapped__,
                                args = [value];
                                push.apply(args, arguments);
                                var result = func.apply(object, args);
                                if (chain || chainAll) {
                                    if (value === result && isObject(result)) return this;
                                    result = new ctor(result),
                                    result.__chain__ = chainAll
                                }
                                return result
                            })
                        })
                    }
                    function noConflict() {
                        return context._ = oldDash,
                        this
                    }
                    function noop() { }
                    function property(key) {
                        return function (object) {
                            return object[key]
                        }
                    }
                    function random(min, max, floating) {
                        var noMin = null == min,
                        noMax = null == max;
                        if (null == floating && ("boolean" == typeof min && noMax ? (floating = min, min = 1) : noMax || "boolean" != typeof max || (floating = max, noMax = !0)), noMin && noMax && (max = 1), min = +min || 0, noMax ? (max = min, min = 0) : max = +max || 0, floating || min % 1 || max % 1) {
                            var rand = nativeRandom();
                            return nativeMin(min + rand * (max - min + parseFloat("1e-" + ((rand + "").length - 1))), max)
                        }
                        return baseRandom(min, max)
                    }
                    function result(object, key) {
                        if (object) {
                            var value = object[key];
                            return isFunction(value) ? object[key]() : value
                        }
                    }
                    function template(text, data, options) {
                        var settings = lodash.templateSettings;
                        text = String(text || ""),
                        options = defaults({},
                        options, settings);
                        var isEvaluating, imports = defaults({},
                        options.imports, settings.imports),
                        importsKeys = keys(imports),
                        importsValues = values(imports),
                        index = 0,
                        interpolate = options.interpolate || reNoMatch,
                        source = "__p += '",
                        reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
                        text.replace(reDelimiters,
                        function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
                            return interpolateValue || (interpolateValue = esTemplateValue),
                            source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar),
                            escapeValue && (source += "' +\n__e(" + escapeValue + ") +\n'"),
                            evaluateValue && (isEvaluating = !0, source += "';\n" + evaluateValue + ";\n__p += '"),
                            interpolateValue && (source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'"),
                            index = offset + match.length,
                            match
                        }),
                        source += "';\n";
                        var variable = options.variable,
                        hasVariable = variable;
                        hasVariable || (variable = "obj", source = "with (" + variable + ") {\n" + source + "\n}\n"),
                        source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;"),
                        source = "function(" + variable + ") {\n" + (hasVariable ? "" : variable + " || (" + variable + " = {});\n") + "var __t, __p = '', __e = _.escape" + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
                        var sourceURL = "\n/*\n//# sourceURL=" + (options.sourceURL || "/lodash/template/source[" + templateCounter++ + "]") + "\n*/";
                        try {
                            var result = Function(importsKeys, "return " + source + sourceURL).apply(undefined, importsValues)
                        } catch (e) {
                            throw e.source = source,
                            e
                        }
                        return data ? result(data) : (result.source = source, result)
                    }
                    function times(n, callback, thisArg) {
                        n = (n = +n) > -1 ? n : 0;
                        var index = -1,
                        result = Array(n);
                        for (callback = baseCreateCallback(callback, thisArg, 1) ; ++index < n;) result[index] = callback(index);
                        return result
                    }
                    function unescape(string) {
                        return null == string ? "" : String(string).replace(reEscapedHtml, unescapeHtmlChar)
                    }
                    function uniqueId(prefix) {
                        var id = ++idCounter;
                        return String(null == prefix ? "" : prefix) + id
                    }
                    function chain(value) {
                        return value = new lodashWrapper(value),
                        value.__chain__ = !0,
                        value
                    }
                    function tap(value, interceptor) {
                        return interceptor(value),
                        value
                    }
                    function wrapperChain() {
                        return this.__chain__ = !0,
                        this
                    }
                    function wrapperToString() {
                        return String(this.__wrapped__)
                    }
                    function wrapperValueOf() {
                        return this.__wrapped__
                    }
                    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
                    var Array = context.Array,
                    Boolean = context.Boolean,
                    Date = context.Date,
                    Function = context.Function,
                    Math = context.Math,
                    Number = context.Number,
                    Object = context.Object,
                    RegExp = context.RegExp,
                    String = context.String,
                    TypeError = context.TypeError,
                    arrayRef = [],
                    objectProto = Object.prototype,
                    oldDash = context._,
                    toString = objectProto.toString,
                    reNative = RegExp("^" + String(toString).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$"),
                    ceil = Math.ceil,
                    clearTimeout = context.clearTimeout,
                    floor = Math.floor,
                    fnToString = Function.prototype.toString,
                    getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
                    hasOwnProperty = objectProto.hasOwnProperty,
                    push = arrayRef.push,
                    setTimeout = context.setTimeout,
                    splice = arrayRef.splice,
                    unshift = arrayRef.unshift,
                    defineProperty = function () {
                        try {
                            var o = {},
                            func = isNative(func = Object.defineProperty) && func,
                            result = func(o, o, o) && func
                        } catch (e) { }
                        return result
                    }(),
                    nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
                    nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
                    nativeIsFinite = context.isFinite,
                    nativeIsNaN = context.isNaN,
                    nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
                    nativeMax = Math.max,
                    nativeMin = Math.min,
                    nativeParseInt = context.parseInt,
                    nativeRandom = Math.random,
                    ctorByClass = {};
                    ctorByClass[arrayClass] = Array,
                    ctorByClass[boolClass] = Boolean,
                    ctorByClass[dateClass] = Date,
                    ctorByClass[funcClass] = Function,
                    ctorByClass[objectClass] = Object,
                    ctorByClass[numberClass] = Number,
                    ctorByClass[regexpClass] = RegExp,
                    ctorByClass[stringClass] = String,
                    lodashWrapper.prototype = lodash.prototype;
                    var support = lodash.support = {};
                    support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext),
                    support.funcNames = "string" == typeof Function.name,
                    lodash.templateSettings = {
                        escape: /<%-([\s\S]+?)%>/g,
                        evaluate: /<%([\s\S]+?)%>/g,
                        interpolate: reInterpolate,
                        variable: "",
                        imports: {
                            _: lodash
                        }
                    },
                    nativeCreate || (baseCreate = function () {
                        function Object() { }
                        return function (prototype) {
                            if (isObject(prototype)) {
                                Object.prototype = prototype;
                                var result = new Object;
                                Object.prototype = null
                            }
                            return result || context.Object()
                        }
                    }());
                    var setBindData = defineProperty ?
                    function (func, value) {
                        descriptor.value = value,
                        defineProperty(func, "__bindData__", descriptor)
                    } : noop,
                    isArray = nativeIsArray ||
                    function (value) {
                        return value && "object" == typeof value && "number" == typeof value.length && toString.call(value) == arrayClass || !1
                    },
                    shimKeys = function (object) {
                        var index, iterable = object,
                        result = [];
                        if (!iterable) return result;
                        if (!objectTypes[typeof object]) return result;
                        for (index in iterable) hasOwnProperty.call(iterable, index) && result.push(index);
                        return result
                    },
                    keys = nativeKeys ?
                    function (object) {
                        return isObject(object) ? nativeKeys(object) : []
                    } : shimKeys,
                    htmlEscapes = {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;"
                    },
                    htmlUnescapes = invert(htmlEscapes),
                    reEscapedHtml = RegExp("(" + keys(htmlUnescapes).join("|") + ")", "g"),
                    reUnescapedHtml = RegExp("[" + keys(htmlEscapes).join("") + "]", "g"),
                    assign = function (object, source, guard) {
                        var index, iterable = object,
                        result = iterable;
                        if (!iterable) return result;
                        var args = arguments,
                        argsIndex = 0,
                        argsLength = "number" == typeof guard ? 2 : args.length;
                        if (argsLength > 3 && "function" == typeof args[argsLength - 2]) var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
                        else argsLength > 2 && "function" == typeof args[argsLength - 1] && (callback = args[--argsLength]);
                        for (; ++argsIndex < argsLength;) if (iterable = args[argsIndex], iterable && objectTypes[typeof iterable]) for (var ownIndex = -1,
                        ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0; ++ownIndex < length;) index = ownProps[ownIndex],
                        result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
                        return result
                    },
                    defaults = function (object, source, guard) {
                        var index, iterable = object,
                        result = iterable;
                        if (!iterable) return result;
                        for (var args = arguments,
                        argsIndex = 0,
                        argsLength = "number" == typeof guard ? 2 : args.length; ++argsIndex < argsLength;) if (iterable = args[argsIndex], iterable && objectTypes[typeof iterable]) for (var ownIndex = -1,
                        ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0; ++ownIndex < length;) index = ownProps[ownIndex],
                        "undefined" == typeof result[index] && (result[index] = iterable[index]);
                        return result
                    },
                    forIn = function (collection, callback, thisArg) {
                        var index, iterable = collection,
                        result = iterable;
                        if (!iterable) return result;
                        if (!objectTypes[typeof iterable]) return result;
                        callback = callback && "undefined" == typeof thisArg ? callback : baseCreateCallback(callback, thisArg, 3);
                        for (index in iterable) if (callback(iterable[index], index, collection) === !1) return result;
                        return result
                    },
                    forOwn = function (collection, callback, thisArg) {
                        var index, iterable = collection,
                        result = iterable;
                        if (!iterable) return result;
                        if (!objectTypes[typeof iterable]) return result;
                        callback = callback && "undefined" == typeof thisArg ? callback : baseCreateCallback(callback, thisArg, 3);
                        for (var ownIndex = -1,
                        ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0; ++ownIndex < length;) if (index = ownProps[ownIndex], callback(iterable[index], index, collection) === !1) return result;
                        return result
                    },
                    isPlainObject = getPrototypeOf ?
                    function (value) {
                        if (!value || toString.call(value) != objectClass) return !1;
                        var valueOf = value.valueOf,
                        objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
                        return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value)
                    } : shimIsPlainObject,
                    countBy = createAggregator(function (result, value, key) {
                        hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1
                    }),
                    groupBy = createAggregator(function (result, value, key) {
                        (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value)
                    }),
                    indexBy = createAggregator(function (result, value, key) {
                        result[key] = value
                    }),
                    pluck = map,
                    where = filter,
                    now = isNative(now = Date.now) && now ||
                    function () {
                        return (new Date).getTime()
                    },
                    parseInt = 8 == nativeParseInt(whitespace + "08") ? nativeParseInt : function (value, radix) {
                        return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, "") : value, radix || 0)
                    };
                    return lodash.after = after,
                    lodash.assign = assign,
                    lodash.at = at,
                    lodash.bind = bind,
                    lodash.bindAll = bindAll,
                    lodash.bindKey = bindKey,
                    lodash.chain = chain,
                    lodash.compact = compact,
                    lodash.compose = compose,
                    lodash.constant = constant,
                    lodash.countBy = countBy,
                    lodash.create = create,
                    lodash.createCallback = createCallback,
                    lodash.curry = curry,
                    lodash.debounce = debounce,
                    lodash.defaults = defaults,
                    lodash.defer = defer,
                    lodash.delay = delay,
                    lodash.difference = difference,
                    lodash.filter = filter,
                    lodash.flatten = flatten,
                    lodash.forEach = forEach,
                    lodash.forEachRight = forEachRight,
                    lodash.forIn = forIn,
                    lodash.forInRight = forInRight,
                    lodash.forOwn = forOwn,
                    lodash.forOwnRight = forOwnRight,
                    lodash.functions = functions,
                    lodash.groupBy = groupBy,
                    lodash.indexBy = indexBy,
                    lodash.initial = initial,
                    lodash.intersection = intersection,
                    lodash.invert = invert,
                    lodash.invoke = invoke,
                    lodash.keys = keys,
                    lodash.map = map,
                    lodash.mapValues = mapValues,
                    lodash.max = max,
                    lodash.memoize = memoize,
                    lodash.merge = merge,
                    lodash.min = min,
                    lodash.omit = omit,
                    lodash.once = once,
                    lodash.pairs = pairs,
                    lodash.partial = partial,
                    lodash.partialRight = partialRight,
                    lodash.pick = pick,
                    lodash.pluck = pluck,
                    lodash.property = property,
                    lodash.pull = pull,
                    lodash.range = range,
                    lodash.reject = reject,
                    lodash.remove = remove,
                    lodash.rest = rest,
                    lodash.shuffle = shuffle,
                    lodash.sortBy = sortBy,
                    lodash.tap = tap,
                    lodash.throttle = throttle,
                    lodash.times = times,
                    lodash.toArray = toArray,
                    lodash.transform = transform,
                    lodash.union = union,
                    lodash.uniq = uniq,
                    lodash.values = values,
                    lodash.where = where,
                    lodash.without = without,
                    lodash.wrap = wrap,
                    lodash.xor = xor,
                    lodash.zip = zip,
                    lodash.zipObject = zipObject,
                    lodash.collect = map,
                    lodash.drop = rest,
                    lodash.each = forEach,
                    lodash.eachRight = forEachRight,
                    lodash.extend = assign,
                    lodash.methods = functions,
                    lodash.object = zipObject,
                    lodash.select = filter,
                    lodash.tail = rest,
                    lodash.unique = uniq,
                    lodash.unzip = zip,
                    mixin(lodash),
                    lodash.clone = clone,
                    lodash.cloneDeep = cloneDeep,
                    lodash.contains = contains,
                    lodash.escape = escape,
                    lodash.every = every,
                    lodash.find = find,
                    lodash.findIndex = findIndex,
                    lodash.findKey = findKey,
                    lodash.findLast = findLast,
                    lodash.findLastIndex = findLastIndex,
                    lodash.findLastKey = findLastKey,
                    lodash.has = has,
                    lodash.identity = identity,
                    lodash.indexOf = indexOf,
                    lodash.isArguments = isArguments,
                    lodash.isArray = isArray,
                    lodash.isBoolean = isBoolean,
                    lodash.isDate = isDate,
                    lodash.isElement = isElement,
                    lodash.isEmpty = isEmpty,
                    lodash.isEqual = isEqual,
                    lodash.isFinite = isFinite,
                    lodash.isFunction = isFunction,
                    lodash.isNaN = isNaN,
                    lodash.isNull = isNull,
                    lodash.isNumber = isNumber,
                    lodash.isObject = isObject,
                    lodash.isPlainObject = isPlainObject,
                    lodash.isRegExp = isRegExp,
                    lodash.isString = isString,
                    lodash.isUndefined = isUndefined,
                    lodash.lastIndexOf = lastIndexOf,
                    lodash.mixin = mixin,
                    lodash.noConflict = noConflict,
                    lodash.noop = noop,
                    lodash.now = now,
                    lodash.parseInt = parseInt,
                    lodash.random = random,
                    lodash.reduce = reduce,
                    lodash.reduceRight = reduceRight,
                    lodash.result = result,
                    lodash.runInContext = runInContext,
                    lodash.size = size,
                    lodash.some = some,
                    lodash.sortedIndex = sortedIndex,
                    lodash.template = template,
                    lodash.unescape = unescape,
                    lodash.uniqueId = uniqueId,
                    lodash.all = every,
                    lodash.any = some,
                    lodash.detect = find,
                    lodash.findWhere = find,
                    lodash.foldl = reduce,
                    lodash.foldr = reduceRight,
                    lodash.include = contains,
                    lodash.inject = reduce,
                    mixin(function () {
                        var source = {};
                        return forOwn(lodash,
                        function (func, methodName) {
                            lodash.prototype[methodName] || (source[methodName] = func)
                        }),
                        source
                    }(), !1),
                    lodash.first = first,
                    lodash.last = last,
                    lodash.sample = sample,
                    lodash.take = first,
                    lodash.head = first,
                    forOwn(lodash,
                    function (func, methodName) {
                        var callbackable = "sample" !== methodName;
                        lodash.prototype[methodName] || (lodash.prototype[methodName] = function (n, guard) {
                            var chainAll = this.__chain__,
                            result = func(this.__wrapped__, n, guard);
                            return chainAll || null != n && (!guard || callbackable && "function" == typeof n) ? new lodashWrapper(result, chainAll) : result
                        })
                    }),
                    lodash.VERSION = "2.4.1",
                    lodash.prototype.chain = wrapperChain,
                    lodash.prototype.toString = wrapperToString,
                    lodash.prototype.value = wrapperValueOf,
                    lodash.prototype.valueOf = wrapperValueOf,
                    forEach(["join", "pop", "shift"],
                    function (methodName) {
                        var func = arrayRef[methodName];
                        lodash.prototype[methodName] = function () {
                            var chainAll = this.__chain__,
                            result = func.apply(this.__wrapped__, arguments);
                            return chainAll ? new lodashWrapper(result, chainAll) : result
                        }
                    }),
                    forEach(["push", "reverse", "sort", "unshift"],
                    function (methodName) {
                        var func = arrayRef[methodName];
                        lodash.prototype[methodName] = function () {
                            return func.apply(this.__wrapped__, arguments),
                            this
                        }
                    }),
                    forEach(["concat", "slice", "splice"],
                    function (methodName) {
                        var func = arrayRef[methodName];
                        lodash.prototype[methodName] = function () {
                            return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__)
                        }
                    }),
                    lodash
                }
                var undefined, arrayPool = [],
                objectPool = [],
                idCounter = 0,
                keyPrefix = +new Date + "",
                largeArraySize = 75,
                maxPoolSize = 40,
                whitespace = "  \f ﻿\n\r\u2028\u2029 ᠎             　",
                reEmptyStringLeading = /\b__p \+= '';/g,
                reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
                reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
                reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
                reFlags = /\w*$/,
                reFuncName = /^\s*function[ \n\r\t]+\w/,
                reInterpolate = /<%=([\s\S]+?)%>/g,
                reLeadingSpacesAndZeros = RegExp("^[" + whitespace + "]*0+(?=.$)"),
                reNoMatch = /($^)/,
                reThis = /\bthis\b/,
                reUnescapedString = /['\n\r\t\u2028\u2029\\]/g,
                contextProps = ["Array", "Boolean", "Date", "Function", "Math", "Number", "Object", "RegExp", "String", "_", "attachEvent", "clearTimeout", "isFinite", "isNaN", "parseInt", "setTimeout"],
                templateCounter = 0,
                argsClass = "[object Arguments]",
                arrayClass = "[object Array]",
                boolClass = "[object Boolean]",
                dateClass = "[object Date]",
                funcClass = "[object Function]",
                numberClass = "[object Number]",
                objectClass = "[object Object]",
                regexpClass = "[object RegExp]",
                stringClass = "[object String]",
                cloneableClasses = {};
                cloneableClasses[funcClass] = !1,
                cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = !0;
                var debounceOptions = {
                    leading: !1,
                    maxWait: 0,
                    trailing: !1
                },
                descriptor = {
                    configurable: !1,
                    enumerable: !1,
                    value: null,
                    writable: !1
                },
                objectTypes = {
                    "boolean": !1,
                    "function": !0,
                    object: !0,
                    number: !1,
                    string: !1,
                    undefined: !1
                },
                stringEscapes = {
                    "\\": "\\",
                    "'": "'",
                    "\n": "n",
                    "\r": "r",
                    "   ": "t",
                    "\u2028": "u2028",
                    "\u2029": "u2029"
                },
                root = objectTypes[typeof window] && window || this,
                freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
                freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
                moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
                freeGlobal = objectTypes[typeof global] && global; !freeGlobal || freeGlobal.global !== freeGlobal && freeGlobal.window !== freeGlobal || (root = freeGlobal);
                var _ = runInContext();
                "function" == typeof define && "object" == typeof define.amd && define.amd ? (root._ = _, define(function () {
                    return _
                })) : freeExports && freeModule ? moduleExports ? (freeModule.exports = _)._ = _ : freeExports._ = _ : root._ = _
            }).call(this)
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    },
    {}],
    4: [function (require) {
        !
            function () {
                "use strict";
                var App = angular.module("BowerSearch", ["LocalStorageModule"]);
                App.config(["$locationProvider",
                function ($locationProvider) {
                    $locationProvider.html5Mode(!0)
                }]),
                require("../directives/shortcut")(App),
                require("../directives/bind_once")(App),
                require("../directives/bind_attr_once")(App),
                require("../filters/format_date")(App),
                require("../controllers/index_controller")(App)
            }()
    },
    {
        "../controllers/index_controller": 7,
        "../directives/bind_attr_once": 8,
        "../directives/bind_once": 9,
        "../directives/shortcut": 10,
        "../filters/format_date": 11
    }],
    5: [function (require, module) {
        module.exports = ["Chart.js", "coffeescript", "linux", "express", "phantom", "homebrew", "jade", "jasmine", "angulerjs", "web-starter-kit", "EaselJS", "EpicEditor", "FitVids", "Flat-UI", "FlowTypeJS", "Flowtype.js", "Font-Awesome", "Ladda", "Metro-UI-CSS", "PhysicsJS", "ResponsiveSlides", "Semantic-UI", "SlidesJs", "Snap.svg", "Swipe", "URIjs", "abcdef1234567890", "angular-1.1.6", "angular-boostrap-ui", "backbone.marionette", "blueimp-file-upload", "boostrap-sass", "bootstrap-3-datepicker", "bootstrap-ui", "bxslider-4", "flowtype", "fullPage.js", "grunt", "gulp", "handlebars-wycats", "handson-table", "history", "inuitcss", "jQuery", "jknob", "jquery-fittext.js", "jquery-flot", "jquery.cookie", "jquery_validation", "jsPlumb", "ladda-boostrap-hakimel", "letteringjs", "momentjs", "nnnick-chartjs", "normalize-css", "pixi", "request", "respondJS", "respondJs", "responsiveSlides.js", "scrollReveal.js", "scrollr", "semantic", "sir-trevor", "soundmanager2", "spinjs", "store.js", "tinyicon", "turnjs", "twbs-bootstrap-sass", "twitter", "ui-bootstrap", "ui.bootstrap", "yui"]
    },
    {}],
    6: [function (require, module) {
        module.exports = {
            "https://github.com/angular/bower-angular": "angular",
            "https://github.com/twbs/bootstrap": "bootstrap",
            "https://github.com/FortAwesome/Font-Awesome": "fontawesome",
            "https://github.com/jquery/jquery": "jquery",
            "https://github.com/jabranr/Socialmedia": "socialmedia",
            "https://github.com/jashkenas/underscore": "underscore",
            "https://github.com/moment/moment": "moment"
        }
    },
    {}],
    7: [function (require, module) {
        module.exports = function (App) {
            "use strict";
            var API_URL = "https://bower-component-list.herokuapp.com",
            LEFT_KEY = 37,
            RIGHT_KEY = 39;
            App.controller("IndexController", ["$scope", "$http", "$location", "localStorageService",
            function ($scope, $http, $location, localStorageService) {
                $scope.leftKey = LEFT_KEY,
                $scope.rightKey = RIGHT_KEY,
                $scope.loading = !0,
                $scope.loadingError = !1,
                $scope.hasResults = !1;
                var ignore = require("../config/ignore"),
                whitelist = require("../config/whitelist"),
                items = [],
                matchedResults = [];
                $scope.results = [];
                var extractQuery = function () {
                    var urlParams = $location.search();
                    return _.isObject(urlParams) && "undefined" != typeof urlParams.q ? urlParams.q : ""
                };
                $scope.q = extractQuery(),
                $scope.qParams = {
                    keyword: "",
                    owner: null
                },
                $scope.sortField = "stars",
                $scope.sortReverse = !0,
                $scope.limit = 30,
                $scope.page = 1,
                $scope.count = 0,
                $scope.pagesCount = 1;
                var matchesByName = function (item) {
                    return -1 !== item.name.toLowerCase().indexOf($scope.qParams.keyword.toLowerCase()) ? !0 : !1
                },
                matchesByKeyword = function (item) {
                    return _.isArray(item.keywords) && 0 !== item.keywords.length ? $scope.qParams.keyword.split(" ").every(function (qKeyword) {
                        return item.keywords.some(function (keyword) {
                            return -1 !== keyword.toLowerCase().indexOf(qKeyword.toLowerCase())
                        })
                    }) : !1
                },
                matchesByOwner = function (item) {
                    return $scope.qParams.owner && 0 !== $scope.qParams.owner.length ? item.owner && item.owner.length > 0 && -1 !== item.owner.toLowerCase().indexOf($scope.qParams.owner.toLowerCase()) ? !0 : !1 : !0
                },
                find = function (items) {
                    return _.filter(items,
                    function (item) {
                        if (-1 !== ignore.indexOf(item.name)) return !1;
                        if (_.isString(item.website) && "undefined" != typeof whitelist[item.website]) {
                            var whitelistedName = whitelist[item.website];
                            if (item.name !== whitelistedName) return !1
                        }
                        return 0 === $scope.q.length ? !0 : (matchesByName(item) || matchesByKeyword(item)) && matchesByOwner(item) ? !0 : !1
                    })
                },
                sort = function (matchedResults) {
                    var list = _.sortBy(matchedResults,
                    function (item) {
                        return item[$scope.sortField]
                    });
                    return $scope.sortReverse && (list = list.reverse()),
                    list
                },
                limit = function (matchedResults) {
                    var from = ($scope.page - 1) * $scope.limit,
                    to = from + $scope.limit,
                    list = matchedResults.slice(from, to);
                    return $scope.hasResults = list.length > 0,
                    list
                },
                dedupe = function (matchedResults) {
                    return _.uniq(matchedResults.reverse(),
                    function (item) {
                        return item.website
                    })
                },
                prioritize = function (matchedResults) {
                    if (!$scope.qParams.keyword) return matchedResults;
                    var match = _.findIndex(matchedResults,
                    function (item) {
                        return $scope.qParams.keyword.toLowerCase() === item.name.toLowerCase()
                    });
                    return -1 !== match && matchedResults.splice(0, 0, matchedResults.splice(match, 1)[0]),
                    matchedResults
                };
                if ($scope.search = function () {
                    if ($scope.loading) return !1;
                    var keywords = [],
                    owner = null;
                    $scope.q.split(" ").forEach(function (v) {
                        0 === v.indexOf("owner:") ? owner = v.replace("owner:", "") : keywords.push(v)
                }),
                    $scope.qParams = {
                    keyword: keywords.join(" "),
                    owner: owner
                },
                    $scope.page = 1,
                    matchedResults = find(items),
                    matchedResults = dedupe(matchedResults),
                    matchedResults = sort(matchedResults),
                    matchedResults = prioritize(matchedResults),
                    $scope.results = limit(matchedResults),
                    $scope.count = matchedResults.length,
                    $scope.pagesCount = Math.ceil($scope.count / $scope.limit)
                },
                $scope.sortResults = function (field) {
                    $scope.sortReverse = $scope.sortField === field ? !$scope.sortReverse : !1,
                    $scope.sortField = field,
                    matchedResults = sort(matchedResults),
                    $scope.results = limit(matchedResults)
                },
                $scope.goToPrev = function () {
                    $scope.hasPrev() && ($scope.page--, $scope.results = limit(matchedResults))
                },
                $scope.goToNext = function () {
                    $scope.hasNext() && ($scope.page++, $scope.results = limit(matchedResults))
                },
                $scope.hasPrev = function () {
                    return 1 !== $scope.page
                },
                $scope.hasNext = function () {
                    return $scope.page !== $scope.pagesCount
                },
                0 === $scope.q.length) {
                    var firstPage = localStorageService.get("firstPage");
                    _.isArray(firstPage) && (items = firstPage, $scope.loading = !1, $scope.search())
                }
                $http.get(API_URL).then(function (res) {
                    if (200 !== res.status) return $scope.loadingError = !0,
                    !1;
                    if (items = res.data, $scope.loading = !1, 0 === $scope.q.length) {
                        var sorted = sort(items),
                        firstPage = limit(sorted);
                        localStorageService.add("firstPage", firstPage)
                    }
                    $scope.search();
                    var searchOnLocationChange = !0,
                    updateLocationOnQueryChange = !0;
                    $scope.$watch("q", _.debounce(function (q) {
                        $scope.$apply(function () {
                            updateLocationOnQueryChange && (searchOnLocationChange = !1, $location.search(q.length ? {
                                q: q
                            } : {})),
                            updateLocationOnQueryChange = !0
                        })
                    },
                    300)),
                    $scope.$on("$locationChangeSuccess",
                    function () {
                        searchOnLocationChange && (updateLocationOnQueryChange = !1, $scope.q = extractQuery(), $scope.search()),
                        searchOnLocationChange = !0
                    })
                })
            }])
        }
    },
    {
        "../config/ignore": 5,
        "../config/whitelist": 6
    }],
    8: [function (require, module) {
        module.exports = function (App) {
            "use strict";
            App.directive("bindAttrOnce", ["$parse",
            function ($parse) {
                return {
                    compile: function (element, attributes) {
                        return function (scope, element) {
                            var attrs = $parse(attributes.bindAttrOnce)(scope);
                            angular.forEach(attrs,
                            function (value, key) {
                                element[0][key] = value
                            })
                        }
                    }
                }
            }])
        }
    },
    {}],
    9: [function (require, module) {
        module.exports = function (App) {
            "use strict";
            App.directive("bindOnce", ["$parse",
            function ($parse) {
                return {
                    compile: function (element, attributes) {
                        return function (scope, element) {
                            element.text($parse(attributes.bindOnce)(scope))
                        }
                    }
                }
            }])
        }
    },
    {}],
    10: [function (require, module) {
        module.exports = function (App) {
            "use strict";
            App.directive("shortcut", ["$document",
            function ($document) {
                return {
                    link: function (scope, element, attrs) {
                        attrs.$observe("shortcut",
                        function (value) {
                            var keycode = parseInt(value, 10),
                            searchField = document.getElementById("q"),
                            handler = function (e) {
                                e.keyCode === keycode && document.activeElement !== searchField && element.triggerHandler("click")
                            };
                            $document.on("keydown", handler),
                            scope.$on("$destroy",
                            function () {
                                $document.unbind("keydown", handler)
                            })
                        })
                    }
                }
            }])
        }
    },
    {}],
    11: [function (require, module) {
        module.exports = function (App) {
            "use strict";
            App.filter("formatDate",
            function () {
                return function (timestamp) {
                    var date = new Date(timestamp),
                    seconds = Math.floor((new Date - date) / 1e3),
                    interval = Math.floor(seconds / 31536e3);
                    return interval > 1 ? interval + " years ago" : (interval = Math.floor(seconds / 2592e3), interval > 1 ? interval + " months ago" : (interval = Math.floor(seconds / 604800), interval > 1 ? interval + " weeks ago" : (interval = Math.floor(seconds / 86400), interval > 1 ? interval + " days ago" : (interval = Math.floor(seconds / 3600), interval > 1 ? interval + " hours ago" : (interval = Math.floor(seconds / 60), interval > 1 ? interval + " minutes ago" : Math.floor(seconds) + " seconds ago")))))
                }
            })
        }
    },
    {}],
    12: [function (require) {
        !
            function (window) {
                "use strict";
                require("../bower_components/angular/angular"),
                require("../bower_components/angular-local-storage/angular-local-storage"),
                window._ = require("../bower_components/lodash/dist/lodash"),
                require("./config/bootstrap")
            }(window)
    },
    {
        "../bower_components/angular-local-storage/angular-local-storage": 1,
        "../bower_components/angular/angular": 2,
        "../bower_components/lodash/dist/lodash": 3,
        "./config/bootstrap": 4
    }]
},
{},
[12]);