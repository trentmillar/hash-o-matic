'use strict';


/**
 * Expose `hashomatic(isnormalized, {"param1": param1, "param2": param2, "param3": param3, ...})`
 */

//module.exports = hashomatic;

/**
 * Hash an unlimited amount of parameters which will be
 * ordered alphabetically then a hash is generated.
 *
 *
 * @param (boolean) isnormalized normalize empty and null strings
 * @param {object} ...
 * @return {String}
 * @api public
 */

/*
 parts are modified from the canonical-json project by Mirko Kiefer and can be found here:
 https://github.com/mirkokiefer/canonical-json/blob/master/index.js
 */

var md5omatic = require('md5-o-matic');


function hashomatic() {
    hashomatic = {
        _isnormalized: false,
        _iscaseinsensitive: false,
        _cx: /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        _escapable: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        _gap: null,
        _indent: null,
        _meta: {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        _rep: null,
        _isEmptyString: function (str) {
            return(!str || str.length === 0 || /^\s*$/.test(str));
        },
        _quote: function (string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            hashomatic._escapable.lastIndex = 0;
            return hashomatic._escapable.test(string) ? '"' + string.replace(hashomatic._escapable, function (a) {
                var c = hashomatic._meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        },

        _str: function (key, holder) {

            // Produce a string from holder[key].

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = hashomatic._gap,
                partial,
                value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if (typeof hashomatic._rep === 'function') {
                value = hashomatic._rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.

            switch (typeof value) {
                case 'undefined':
                    return hashomatic._isnormalized ? hashomatic._quote(null) : undefined;

                case 'string':
                    return hashomatic._isnormalized && hashomatic._isEmptyString(value)
                        ? hashomatic._quote(null)
                        : hashomatic._quote(hashomatic._iscaseinsensitive
                        ? value.toLowerCase()
                        : value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : hashomatic._quote(null);

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.

                    if (!value) {
                        return hashomatic._quote(null);
                    }

                    // Make an array to hold the partial results of stringifying this object value.

                    hashomatic._gap += hashomatic._indent;
                    partial = [];

                    // Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = hashomatic._str(i, value) || hashomatic._quote(null);
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.

                        v = partial.length === 0
                            ? '[]'
                            : hashomatic._gap
                            ? '[\n' + hashomatic._gap + partial.join(',\n' + hashomatic._gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                        hashomatic._gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to be stringified.

                    if (hashomatic._rep && typeof hashomatic._rep === 'object') {
                        length = hashomatic._rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof hashomatic._rep[i] === 'string') {
                                k = hashomatic._rep[i];
                                v = hashomatic._str(k, value);
                                if (hashomatic._iscaseinsensitive) {
                                    k = k.toLowerCase();
                                }
                                partial.push(hashomatic._quote(k) + (hashomatic._gap ? ': ' : ':') + v);
                            }
                        }
                    }
                    else {

                        // Otherwise, iterate through all of the keys in the object.
                        var keysSorted = Object.keys(value).sort();
                        for (i in keysSorted) {
                            k = keysSorted[i];
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = hashomatic._str(k, value);
                                if (v) {
                                    if (hashomatic._iscaseinsensitive) {
                                        k = k.toLowerCase();
                                    }
                                    partial.push(hashomatic._quote(k) + (hashomatic._gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.

                    v = partial.length === 0
                        ? '{}'
                        : hashomatic._gap
                        ? '{\n' + hashomatic._gap + partial.join(',\n' + hashomatic._gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                    hashomatic._gap = mind;
                    return v;
            }
        },
        // If the JSON object does not yet have a stringify method, give it one.
        _stringify: function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            hashomatic._gap = '';
            hashomatic._indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    hashomatic._indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            }
            else if (typeof space === 'string') {
                hashomatic._indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            hashomatic._rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return hashomatic._str('', {'': value});
        },
        hash: function (data, doNormalizeEmptyAndNullStrings, isCaseInsensitive) {
            hashomatic._iscaseinsensitive = isCaseInsensitive || false;
            hashomatic._isnormalized = doNormalizeEmptyAndNullStrings || false;
            return md5omatic(hashomatic._stringify(data));
        }
    };
    return hashomatic;

}

module.exports = hashomatic();
