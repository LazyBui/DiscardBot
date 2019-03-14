var exports = module.exports = {};

class ImageMessage {
	constructor(url, text) {
		this._url = url;
		this._text = text || '';
	}

	get url() { return this._url; }
	get text() { return this._text; }
};

exports.ImageMessage = ImageMessage;