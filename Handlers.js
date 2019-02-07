var exports = module.exports = {};
var HandleRoll = require('./HandleRoll.js');
var HandleQuit = require('./HandleQuit.js');
var HandlePing = require('./HandlePing.js');

exports.Handlers = [
	new HandleRoll.HandleRoll(),
	new HandleQuit.HandleQuit(),
	new HandlePing.HandlePing(),
];