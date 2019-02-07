var exports = module.exports = {};
const ChatHandler = require('./ChatHandler.js').ChatHandler;

exports.HandlePing = class extends ChatHandler {
	constructor() {
		super('ping');
	}

	handle(data, args) {
		return 'Pong!';
	}
};