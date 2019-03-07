var exports = module.exports = {};

class TargetedMessage {
	constructor(target, message) {
		this._target = target;
		this._message = message;
	}

	get target() { return this._target; }
	get message() { return this._message; }
};

exports.TargetedMessage = TargetedMessage;