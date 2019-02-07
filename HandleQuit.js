var exports = module.exports = {};
const NodeHandler = require('./NodeHandler.js').NodeHandler;

exports.HandleQuit = class extends NodeHandler {
	constructor() {
		super(['dc', 'disconnect', 'quit', 'exit']);
	}

	handle(data, args) {
		data.bot.disconnect();
		return null;
	}
};