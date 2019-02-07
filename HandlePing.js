var exports = module.exports = {};
var NodeHandler = require('./NodeHandler.js').NodeHandler;

exports.HandlePing = class extends NodeHandler {
	constructor() {
		super("ping");
	}

	handle(data, args) {
		return "Pong!";
	}
};