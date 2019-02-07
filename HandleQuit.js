var exports = module.exports = {};
var NodeHandler = require('./NodeHandler.js').NodeHandler;

exports.HandleQuit = class extends NodeHandler {
	constructor() {
		super(["dc", "disconnect", "quit", "exit"]);
	}

	handle(data, args) {
		data.bot.disconnect();
		return null;
	}
};