/**
 * Owl Carousel v1 Pseudo-Plugins
 * v0.1.2
 */

var OwlPlugins = {
	// Plugin structure
	plugin: function(callbacks, reusables){
		// Quick reference to lib for calling what is known to be a function
		this.addCallbackValue = function(settings, callbackName, cbValue) {
			OwlPlugins.lib.applyCallback(
				settings,
				callbackName,
				cbValue
			);
		};

		// Identify a fully scoped reusable function
		this.getReusableFunc = function(callbackName){
			var callbackBits = callbackName.split(".");
			var cb = null, scope = reusables;
			for (var i = 0; i < callbackBits.length; i++) {
				if (scope.hasOwnProperty(callbackBits[i])) {
					scope = scope[callbackBits[i]];
					if (i == callbackBits.length - 1 && typeof(scope) == 'function') {
						cb = scope;
					}
				}
				else {
					// Throw error?
					break;
				}
			}
			return cb;
		};

		// Allows introspection into type of callback value to determine
		// if we are allowed to add it
		// Returns TRUE on successful type check, FALSE on failure
		this.addPotentialCallbackValue = function(settings, callbackName, cbValue){
			if (typeof(cbValue) == "function") {
				this.addCallbackValue(settings, callbackName, cbValue);
				return true;
			}
			else if (typeof(cbValue) == 'string') {
				var reusable = this.getReusableFunc(cbValue);
				if (reusable != null) {
					this.addCallbackValue(settings, callbackName, this.getReusableFunc(cbValue));
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		};

		// Throw an error if the callback is not of a desired type
		this.throwCallbackError = function(callbackName){
			throw callbackName + " must be either a function, a name of a reusable function, or an array of either of these.";
		};

		// Add a callback value that is either a function
		// or an array of functions
		this.addCallback = function(settings, callbackName, cbValue) {
			var added = this.addPotentialCallbackValue(settings, callbackName, cbValue);

			if (!added) {
				if (Object.prototype.toString.call(cbValue) === '[object Array]') {
					for (var i = 0; i < cbValue.length; i++) {
						var addedItem = this.addPotentialCallbackValue(settings, callbackName, cbValue[i]);
						if (!addedItem) {
							this.throwCallbackError(callbackName + "[" + i + "]");
						}
					}
				}
				else {
					this.throwCallbackError(callbackName);
				}
			}
		};

		// Apply a plugin to a set of Owl Carousel settings
		this.applyTo = function(settings){
			for (var callbackName in callbacks) {
				var cbValue = callbacks[callbackName];
				this.addCallback(settings, callbackName, cbValue);
			}
		};
	},
	// Library functions
	lib: {
		// Use functional composition to chain together the results
		// of consective functions
		compose: function() {
			var fns = arguments;
			return function (result) {
				for (var i = fns.length - 1; i > -1; i--) {
					result = fns[i].call(this, result);
				}
				return result;
			};
		},
		// Applies a callback function to a given setting
		// If this callback does not exist, just add the function
		// If it does, use functional composition to add it together
		applyCallback: function(baseSettings, callbackName, callbackFunc) {
			if (typeof(baseSettings[callbackName]) != "undefined") {
				var current = baseSettings[callbackName],
				composed = OwlPlugins.lib.compose(current, callbackFunc);
				baseSettings[callbackName] = composed;
			}
			else {
				baseSettings[callbackName] = callbackFunc;
			}
		}
	},
	// Common utilities
	utils: {
		// Generate a GUID-like random number
		generateUUID: function() {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c=='x' ? r : (r&0x3|0x8)).toString(16);
			});
			return uuid;
		},
		// Create a namespaced HTML ID that is random enough
		// to be more or less unique
		makeID: function(prefix) {
			return prefix + "-" + OwlPlugins.utils.generateUUID();
		},
		// Add a value onto a space-separated attribute
		pushAttr: function($, elem, attrName, newAttrValue) {
			var attrValues = [],
			readAttr = $(elem).attr(attrName);
			if (!!readAttr) {
				attrValues = readAttr.split(' ');
			}
			attrValues.push(newAttrValue);
			$(elem).attr(
				attrName,
				attrValues.join(' ')
			)
		},
		// Round a decimal number to a number of digits
		roundDecimal: function(num, digits) {
			if (digits <= 0) return num;
			var factor = (digits * 10),
			n = Math.round(num * factor),
			suf = (n % factor) / factor,
			pre = (n / factor) - suf;
			return pre + suf;
		}
	}
};