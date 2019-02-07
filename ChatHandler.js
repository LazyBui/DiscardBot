var exports = module.exports = {};

exports.ChatHandler = class {
	constructor(cmds) {
		if (new.target === exports.ChatHandler) throw new Error('Cannot instantiate a ChatHandler directly');
		if (typeof(this.handle) !== 'function') throw new Error('Must implement a two-argument function called handle');

		if (arguments.length > 1) {
			// Assume that they were passed in separately
			cmds = arguments;
		}

		if (Array.isArray(cmds)) {
			for (var key in cmds) {
				var item = cmds[key];
				if (typeof(item) !== typeof('')) throw new Error('All items must be a lowercased string');
			}
			this._cmds = cmds;
		}
		else if (typeof(cmds) !== typeof('')) throw new Error('Must be a lowercased string or array of lowercased strings');
		else this._cmds = cmds.split(/[,\s]+/);
	}

	get cmds() { return this._cmds.slice(); }
};