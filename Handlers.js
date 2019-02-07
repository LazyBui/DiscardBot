var exports = module.exports = {};
var HandleRoll = require('./HandleRoll.js').HandleRoll;
var HandleQuit = require('./HandleQuit.js').HandleQuit;
var HandlePing = require('./HandlePing.js').HandlePing;

exports.Handlers = [
	new HandleRoll(),
	new HandleQuit(),
	new HandlePing(),
];