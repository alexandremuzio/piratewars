'use strict';

var _ = require('underscore');

function EntityAttrs() {
	this._attrs = {};
}

EntityAttrs.prototype.getAll = function () {
	return this._attrs;
};

EntityAttrs.prototype.get = function (key) {
	return this._attrs[key];
};

EntityAttrs.prototype.set = function (update) {
	_.extend(this._attrs, update);
};

module.exports = EntityAttrs;