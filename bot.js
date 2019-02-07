const discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.js');
const Handlers = require('./Handlers.js').Handlers;
const ChatHandlerArgs = require('./ChatHandlerArgs.js').ChatHandlerArgs;

const config = require('./config.js');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
	colorize: config.colorize_logs
});
logger.level = config.log_level;

handle_dict = {};
for (var key in Handlers) {
	var handler = Handlers[key];
	var cmds = handler.cmds;
	for (var cmd_key in cmds) {
		var cmd = cmds[cmd_key];
		var existing = handle_dict[cmd];
		if (typeof(existing) !== 'undefined') {
			logger.info('Warning, command "' + cmd + '" is handled by multiple handlers, ordering may be important');
			existing.push(handler);
		}
		else {
			handle_dict[cmd] = [handler];
		}
	}
}

// Initialize discord Bot
var bot = new discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('ready', function (evt) {
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.username + ' - (' + bot.id + ')');
	logger.info('Handling ' + Object.keys(handle_dict).length + ' distinct commands');
});

bot.on('message', function (user, userId, channelId, message, evt) {
	// Our bot needs to know if it will execute a command
	if (message.substring(0, config.prefix.length) !== config.prefix) {
		return;
	}

	var args = message.substring(config.prefix.length).split(' ');
	var cmd = args[0].toLowerCase();

	args = args.splice(1);
	var data = {
		'user': user,
		'userId': userId,
		'channelId': channelId,
		'evt': evt
	};

	function handle_request(cmd, data, args) {
		var handlers = handle_dict[cmd];
		if (typeof(handlers) === 'undefined') {
			logger.info('[UNHANDLED] Received a command "' + cmd + '" from ' + data.user);
			return;
		}

		logger.info('[HANDLED] Handling a command "' + cmd + '" from ' + data.user);
		var results = [];
		var chat_args = new ChatHandlerArgs(bot, logger, data, cmd, config);
		for (var key in handlers) {
			var handler = handlers[key];
			var response = handler.handle(chat_args, args);
			results.push(response);
		}
		function handle_result(channelId, result) {
			if (Array.isArray(result)) {
				for (var key in result) {
					var item = result[key];
					handle_result(channelId, item);
				}
			}
			else if (typeof(result) == typeof('')) {
				 // Single message
				 bot.sendMessage({
					to: channelId,
					message: result
				});
			}
			else if (result != null) {
				if (typeof(result) === typeof({}) && typeof(result.target) !== 'undefined') {
					// An object with target/message
					bot.sendMessage({
						to: result.target,
						message: result.message
					});
				}
				else if (typeof(result) !== 'undefined') {
					// We have something confusing
					logger.info('typeof(result) = ' + typeof(result));
					throw new Error('Only strings, arrays, objects of {target, message}, or combinations are supported');
				}
			}
		}
		handle_result(data.channelId, results);
	}

	if (config.debug) {
		try {
			handle_request(cmd, data, args);
		}
		catch (err) {
			bot.sendMessage({
				to: channelId,
				message: 'FATAL BOT ERROR (' + err.name + '): ' + err.message
			});
		}
	}
	else {
		handle_request(cmd, data, args);
	}
});