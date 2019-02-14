var exports = module.exports = {};
const ChatHandler = require('./ChatHandler.js').ChatHandler;

class HandleQuit extends ChatHandler {
	constructor() {
		super(['dc', 'disconnect', 'quit', 'exit']);
	}

	handle(data, args) {
		data.bot.disconnect();
		return null;
	}
};

exports.HandleQuit = HandleQuit;