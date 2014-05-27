hash-o-matic
============

Hash up an unlimited number of values, but the problem is that the final hashed value is dependent on the order in which these values are added. What hash-o-matic does is it will order the object's properties by the property name before hashing. This is useful if you frequently hash the same variables through-out your app(s) but can't recall the order in which the values were added. The only real catch is the variables must have the same naming throughout your code.

## Installation

	npm install hash-o-matic
	
## Usage

* Look at the unit tests for more examples
	
	var hashomatic = require('hash-o-matic');	
	var caseinsensitive = true;
	var normalizestrings = true;
	
	var hash, hash2;
	
	// Simple string hashing
	hash = hashomatic.hash('the quick brown fox jumps over the lazy dog');
	console.log(hash);
	
	// 'case insensitive(by lower casing all)' string hashing
	hash = hashomatic.hash('ThE Quick Brown fOx jUmps oveR the laZy dog', caseinsensitive, normalizestrings);
	hash2 = hashomatic.hash('tHe qUICK bROWN FoX JuMPS OVEr THE LAzY DOG', caseinsensitive, normalizestrings);
	console.log(hash === hash2); // true
	
	// Object hashing; ordering, case, and normalized strings
	var object = {'a': "", "b": "not empty", 'c': "", d: null},
        object2 = {"a": '', 'b': 'not empty', "c": '', d: ""};
	
	hash = hashomatic.hash(object, caseinsensitive, normalizestrings);
	hash2 = hashomatic.hash(object2, caseinsensitive, normalizestrings);
	console.log(hash === hash2); // true
	
	
## Tests

	mocha test/*.js

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release
