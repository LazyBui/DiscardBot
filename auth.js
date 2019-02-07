var exports = module.exports = {};
const fs = require('fs');
const path = require('path');
const file_path = path.join(__dirname, 'token.txt');

exports.token = fs.readFileSync(file_path, {'encoding': 'utf-8'});