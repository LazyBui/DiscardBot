var exports = module.exports = {};

exports.ChatHandlerArgs = class {
	constructor(bot, logger, event_data, cmd, config) {
		this._bot = bot;
		this._logger = logger;
		this._event_data = event_data;
		this._cmd = cmd;
		this._config = config;
	}

	get bot() { return this._bot; }
	get logger() { return this._logger; }
	get event_data() { return this._event_data; }
	get cmd() { return this._cmd; }
	get config() { return this._config; }
};