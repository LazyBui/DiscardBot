var exports = module.exports = {};
const NodeHandler = require('./NodeHandler.js').NodeHandler;

exports.HandlePing = class extends NodeHandler {
	constructor() {
		super("ping");
	}

	handle(data, args) {
		return "Pong!";
	}
};