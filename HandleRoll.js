var exports = module.exports = {};
const NodeHandler = require('./NodeHandler.js').NodeHandler;
const Util = require('./Util.js').Util;

class Modifier {
	static to_string(modifier) {
		if (typeof(modifier) != typeof(1)) throw new Error('Must be an integer');
		if (modifier == 0) return '';
		if (modifier > 0) return '+' + modifier.toString();
		return modifier.toString();
	}
}

class RollArgument {
	constructor(max, modifier) {
		if (typeof(max) != typeof(1)) throw new Error('Must be an integer');
		if (!modifier) modifier = 0;
		if (typeof(modifier) != typeof(1)) throw new Error('Must be an integer');
		this._max = max;
		this._modifier = modifier;
	}
	
	get has_modifier() { return this._modifier != 0; }
	get max() { return this._max; }
	get modifier() { return this._modifier; }
	get modifier_as_string() { return Modifier.to_string(this._modifier); }
}

class RollResult {
	constructor(value, modifier, request) {
		this._value = value;
		this._modifier = modifier;
		this._request = request;
	}

	get has_modifier() { return this._modifier != 0; }
	get modifier() { return this._modifier; }
	get modifier_as_string() { return Modifier.to_string(this._modifier); }
	get value() { return this._value; }
	get final_value() { return this._value + this._modifier; }
	get request() { return this._request; }
}

class RollResults {
	constructor() {
		this._total = 0;
		this._dice = [];
	}

	add(result) {
		if (result.constructor != RollResult) throw new Error('Must be a RollResult');
		this._dice.push(result);
		this._total = this._total + result.final_value;
	}

	get total() { return this._total; }
	get dice() { return this._dice.slice(); }
	get count() { return this._dice.length; }
}

function collect_rolls(rolls) {
	var collection = new RollResults();

	for (var key in rolls) {
		var roll = rolls[key];
		if (roll.constructor != RollArgument) throw new Error('Must all be RollArguments');
		
		var physicalRoll = Util.ranged_random(1, roll.max);
		collection.add(new RollResult(physicalRoll, roll.modifier, roll));
	}

	return collection;
}

function format_rolls(target, collection) {
	var dice = collection.dice;
	var result = 'Rolled ' + collection.count + 'd' + dice[0].request.max + ': [Scores: ';
	var any = false;
	for (var key in dice) {
		var die = dice[key];
		if (any) {
			result = result + ', ';
		}

		if (target != null) {
			if (die.final_value >= target) {
				result = result + Util.italic(Util.bold(die.final_value));
			}
			else {
				result = result + Util.italic(die.final_value);
			}
		}
		else {
			result = result + Util.bold(die.final_value);
		}

		if (die.has_modifier) {
			result = result + ' (' + die.value + die.modifier_as_string + ')';
		}
		any = true;
	}
	
	result = result + '] [Total: ' + Util.bold(collection.total);
	if (target != null) {
		result = result + '; Target: ' + Util.bold(target);
	}
	result = result + ']';
	return result;
}

function roll(target, rolls) {
	return format_rolls(target, collect_rolls(rolls));
}

exports.HandleRoll = class extends NodeHandler {
	constructor() {
		super('roll');
	}

	handle(data, args) {
		if (args.length < 2) {
			return 'INVALID ARGS: SPECIFY AT LEAST <QUANTITY> <SIDES>';
		}

		var quantity = null;
		var sides = null;
		try {
			quantity = Util.get_integer(args[0]);
			if (quantity < 1) throw new Error('Must be 1 or greater');
		}
		catch (e) {
			return 'INVALID QUANTITY: ' + args[0];
		}
		try {
			sides = Util.get_integer(args[1]);
			if (sides <= 1) throw new Error('Must be 2 or greater');
		}
		catch {
			return 'INVALID SIDES: ' + args[1];
		}

		var target = null;
		var modifiers = [];
		function parse_arg(arg) {
			if (arg.startsWith('-t')) {
				var target = null;
				try {
					target = Util.get_integer(arg.substring(2));
				}
				catch {
					return 'INVALID TARGET: ' + arg;
				}
				return target;
			}
			else {
				// Assume we have modifiers
				var split = arg.split('/');
				try {
					for (var key in split) {
						split[key] = Util.get_integer(split[key]);
					}
				}
				catch {
					return 'INVALID MODIFIERS: ' + arg;
				}
				return split;
			}
			throw new Error('Control flow cannot reach here');
		}

		if (args.length > 4) {
			return 'TOO MANY ARGS, SPECIFY AT MOST ONE TARGET AND ONE SET OF MODIFIERS';
		}

		if (args.length >= 3) {
			var arg = args[2];
			var result = parse_arg(arg);
			if (typeof(result) === typeof('')) {
				return result;
			}
			if (typeof(result) === typeof(1)) {
				target = result;
			}
			else {
				modifiers = result;
			}
		}

		if (args.length == 4) {
			var arg = args[3];
			var result = parse_arg(arg);
			if (typeof(result) === typeof('')) return result;

			if (typeof(result) === typeof(1)) {
				if (target != null) return 'INVALID ARG, SPECIFY ONLY ONE TARGET';
				target = result;
			}
			else {
				if (modifiers.length > 0) return 'INVALID ARG, SPECIFY ONLY ONE SET OF MODIFIERS DELIMITED BY /';
				modifiers = result;
			}
		}

		var rolls = [];
		for (var i = 0; i < quantity; i++) {
			if (modifiers.length > i) {
				rolls.push(new RollArgument(sides, modifiers[i]));
			}
			else {
				rolls.push(new RollArgument(sides, 0));
			}
		}

		return roll(target, rolls);
	}
};