var exports = module.exports = {};

exports.NodeHandlerArgs = class {
	constructor(bot, logger, event_data, cmd) {
		this._bot = bot;
		this._logger = logger;
		this._event_data = event_data;
		this._cmd = cmd;
	}

	get bot() { return this._bot; }
	get logger() { return this._logger; }
	get event_data() { return this._event_data; }
	get cmd() { return this._cmd; }
};