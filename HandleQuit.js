var exports = module.exports = {};
const ChatHandler = require('./ChatHandler.js').ChatHandler;

exports.HandleQuit = class extends ChatHandler {
	constructor() {
		super(['dc', 'disconnect', 'quit', 'exit']);
	}

	handle(data, args) {
		data.bot.disconnect();
		return null;
	}
};