var exports = module.exports = {
	debug: true,
	prefix: '!',
	colorize_logs: true,
	log_level: 'debug',
	// Crashing can help report better location information when an error occurs, but you would not generally want this for regular running
	allow_crashing: true,
	// This only applies if allow_crashing is false
	send_crash_error_detail_to_channel: false,
};