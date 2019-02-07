var exports = module.exports = {};

exports.Util = class {
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
};