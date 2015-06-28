'use strict'

var GameEngine = require('../game_engine.js');
var ComponentManager = require('./component_manager.js');
var Transform = require('../components/transform.js');

function Entity(id, key) {
	// console.log("inside entity constr");
	GameEngine.getInstance().addEntity(this, id);
    this.key = key;
    this.id = id;
	this.transform = new Transform();
	this.components = new ComponentManager(this);
	this._eventHandlers = {};
};

/**
 * @override
 */
Entity.prototype.update = function() {
	this.components.update();
}

Entity.prototype.destroy = function() {
    this.trigger('entity.destroy', this);    
    GameEngine.getInstance().deleteEntity(this);
}

Entity.prototype.sync = function(transform) {
	this.trigger('entity.sync', transform, this);
}

Entity.prototype.damage = function(amount, attacker) {
    this.trigger('entity.damage', amount, attacker, this);
}

Entity.prototype.collision = function(collider) {
    this.trigger('entity.collision', collider, this);
}

//internal
Entity.prototype.on = function(event, handler) {
    this._eventHandlers[event] = this._eventHandlers[event] || [];
    this._eventHandlers[event].push(handler);
}

Entity.prototype.trigger = function(event) {
    var params = Array.prototype.slice.call(arguments, 1);
    if (this._eventHandlers[event]) {
        for (var i = 0; i < this._eventHandlers[event].length; i++) {
            this._eventHandlers[event][i].apply(this, params);
        }
    }
}

module.exports = Entity;