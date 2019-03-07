var exports = module.exports = {};

class Util {
	static get newline() { return '\r\n'; }
	static bold(txt) { return '**' + txt + '**'; }
	static italic(txt) { return '*' + txt + '*'; }
	static strikethrough(txt) { return '~~' + txt + '~~'; }
	static code(txt) { return '`' + txt + '`'; }
	static code_section(txt) { return '```' + txt + '```'; }
	static underline(txt) { return '__' + txt + '__'; }
	static ranged_random(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
	static get_integer(value, constraints) {
		constraints = constraints || {};
		var result = parseInt(value, 10);
		if (isNaN(result)) throw new Error('Must be a valid integer');
		if (constraints.min) {
			if (constraints.min_exclusive && constraints.min >= result) throw new Error('Must be greater than ' + constraints.min);
			if (constraints.min > result) throw new Error('Must be at least ' + constraints.min);
		}
		if (constraints.max) {
			if (constraints.max_exclusive && constraints.max <= result) throw new Error('Must be less than ' + constraints.max);
			if (constraints.max < result) throw new Error('Must be at most ' + constraints.max);
		}
		return result;
	}
	static inspect_object(obj, indent) {
		if (!indent) indent = 0;
		if (obj == null) return 'null';
		if (typeof(obj) === 'undefined') return 'undefined';

		var result = '\t'.repeat(indent);
		for (var val in obj) {
			if (result.length > 0) result += Util.newline;
			result += '\t'.repeat(indent);
			var t = typeof(obj[val]);
			var v = obj[val];

			if (!obj.hasOwnProperty(val)) result += '[i] ';
			try {
				v = v.toString();
				result += 'prop "' + val + '" - type "' + t + '" - val "' + v + '"'; 
			}
			catch {
				result += 'prop "' + val + '" - type "' + t + '" - val N/A';
			}
		}

		return result;
	}
	static inspect_type(obj, indent) {
		if (!indent) indent = 0;
		if (obj == null) return 'null';
		if (typeof(obj) === 'undefined') return 'undefined';
		if (typeof(obj) !== 'object') return 'NOT OBJECT';
		var proto = obj.prototype ? obj.prototype : obj.constructor.prototype;
		var str = (obj.prototype ? obj.prototype.constructor.name : obj.constructor.name).toString();
		var result = '\t'.repeat(indent) + 'Prototype: ' + str + Util.newline;
		Object.getOwnPropertyNames(proto).forEach(function (val, idx, array) {
			if (result.length > 0) result += Util.newline;
			result += '\t'.repeat(indent);
			var t = typeof(obj[val]);
			var v = obj[val];
			try {
				if (val == 'constructor') {
					var split = v.toString().split('{');
					for (var key in split) {
						var elem = split[key].trim();
						if (!elem.startsWith('constructor')) continue;
						var constructorLength = 'constructor'.length;
						v = 'args: ' + elem.substring(constructorLength + 1, elem.length - 1);
						break;
					}
				}
				else {
					v = v.toString();
				}
				result += 'prop "' + val + '" - type "' + t + '" - val "' + v + '"'; 
			}
			catch {
				result += 'prop "' + val + '" - type "' + t + '" - val N/A';
			}
		});
		return result;
	}
	static log_properties(obj) {
		Object.getOwnPropertyNames(obj).forEach(function (val, idx, array) {
			console.log('obj.' + val + ' = ' + obj[val]);
		});
	}
};

exports.Util = Util;