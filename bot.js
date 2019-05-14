const discord = require('discord.js');
const {transports, createLogger, format} = require('winston');
const auth = require('./auth.js');
const Handlers = require('./Handlers.js').Handlers;
const ChatHandlerArgs = require('./ChatHandlerArgs.js').ChatHandlerArgs;
const ImageMessage = require('./ImageMessage.js').ImageMessage;
const TargetedMessage = require('./TargetedMessage.js').TargetedMessage;
const Util = require('./Util.js').Util;

const config = require('./config.js');

// Configure logger settings
const logger = createLogger({
	format: format.combine(
		format.timestamp({
			format: function() {
				// Explicitly get local time here
				var v = new Date();
				var pad = function (input, padChar, padLength) {
					while (input.length < padLength) input = padChar + input;
					return input;
				};
				var d = pad(v.getDate().toString(), '0', 2);
				var h = pad(v.getHours().toString(), '0', 2);
				var m = pad(v.getMinutes().toString(), '0', 2);
				var s = pad(v.getSeconds().toString(), '0', 2);
				var f = pad(v.getMilliseconds().toString(), '0', 3);
				return d + '-' + h + ':' + m + ':' + s + '.' + f;
			}
		}),
		format.json()
	),
	transports: [
		new transports.Console({
			colorize: config.colorize_logs,
			level: config.log_level,
		}),
		//new transports.File({filename: 'logs/error.log', level: 'error'}),
	]
});

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

function catch_error(error, src) {
	if (src) {
		logger.error(src + ': ' + error);
	}
	else {
		logger.error('Error: ' + error);
	}
}

var bot = new discord.Client();

bot.on('ready', function (evt) {
	logger.info('Connected, logged in as: ' + bot.user.username + ' - (' + bot.user.id + ')');
	logger.info('Handling ' + Object.keys(handle_dict).length + ' distinct commands');
});

bot.on('message', function (message) {
	var user = message.author;
	var userId = user.id;
	var channelId = message.channel.id;
	var content = message.content;
	// Our bot needs to know if it will execute a command
	if (content.substring(0, config.prefix.length) !== config.prefix) {
		return;
	}
	if (user.equals(bot.user)) {
		return;
	}

	var args = content.substring(config.prefix.length).split(' ');
	var cmd = args[0].toLowerCase();

	args = args.splice(1);
	var data = {
		'user': user,
		'userId': userId,
		'channelId': channelId,
		'evt': message
	};

	function handle_request(cmd, data, args) {
		var handlers = handle_dict[cmd];
		const command_string = 'a command "' + cmd + '" from ' + data.user.username + ' (' + data.user.id + ')';
		if (typeof(handlers) === 'undefined') {
			logger.info('[UNHANDLED] Received ' + command_string);
			return;
		}

		logger.info('[HANDLED] Handling ' + command_string);
		var results = [];
		var chat_args = new ChatHandlerArgs(bot, logger, data, cmd, config);
		for (var key in handlers) {
			var handler = handlers[key];
			var response = handler.handle(chat_args, args);
			results.push(response);
		}
		function handle_result(target, result) {
			if (Array.isArray(result)) {
				for (var key in result) {
					var item = result[key];
					handle_result(target, item);
				}
			}
			else if (typeof(result) == typeof('')) {
				// Single message
				target.
					send(result).
					catch((error) => catch_error(error, 'Single message error handler'));
			}
			else if (result != null) {
				const error_string = 'Only strings, arrays, objects of type TargetedMessage/Embed, or combinations are supported';
				if (typeof(result) === typeof({})) {
					var proto = result.constructor;
					if (proto === TargetedMessage) {
						// An object with target/message
						handle_result(result.target, result.message);
					}
					else if (proto === ImageMessage) {
						target.
							send(result.text, { "files": [result.url] }).
							catch((error) => catch_error(error, 'ImageMessage error handler'));
					}
					else if (proto === discord.RichEmbed) {
						target.
							send(result).
							catch((error) => catch_error(error, 'RichEmbed error handler'));
					}
					else {
						// We have something confusing
						logger.info('proto.name = ' + proto.name);
						throw new Error(error_string);
					}
				}
				else if (typeof(result) !== 'undefined') {
					// We have something confusing
					logger.info('typeof(result) = ' + typeof(result));
					throw new Error(error_string);
				}
			}
		}
		handle_result(data.evt.channel, results);
	}

	if (config.allow_crashing) {
		handle_request(cmd, data, args);
	}
	else {
		try {
			handle_request(cmd, data, args);
		}
		catch (err) {
			if (config.send_crash_error_detail_to_channel) {
				message.channel.
					send('FATAL BOT ERROR (' + err.name + '): ' + err.message).
					catch((error) => catch_error(error, 'Bot error handler'));
			}
			else {
				message.channel.
					send('A fatal error occurred with the command, please contact the maintainer of the bot').
					catch((error) => catch_error(error, 'Bot error handler'));
			}
		}
	}
});

bot.login(auth.token);