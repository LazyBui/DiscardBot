var exports = module.exports = {};
const ChatHandler = require('./ChatHandler.js').ChatHandler;

class HandlePing extends ChatHandler {
	constructor() {
		super('ping');
	}

	handle(data, args) {
		return 'Pong!';
	}
};

exports.HandlePing = HandlePing;