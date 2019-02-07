var exports = module.exports = {};

exports.Util = class {
	static bold(txt) { return '**' + txt + '**'; }
	static italic(txt) { return '*' + txt + '*'; }
	static strikethrough(txt) { return '~~' + txt + '~~'; }
	static code(txt) { return '`' + txt + '`'; }
	static code_section(txt) { return '```' + txt + '```'; }
	static underline(txt) { return '__' + txt + '__'; }
	static ranged_random(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
	static get_integer(value) {
		var result = parseInt(value, 10);
		if (isNaN(result)) throw new Error('Must be a valid integer');
		return result;
	}
};