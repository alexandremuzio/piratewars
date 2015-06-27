'use strict'

var GameEngine = require('../game_engine.js');
var ComponentManager = require('./component_manager.js');
var Transform = require('../components/transform.js');
var ChildrenManager = require('./children_manager.js');
var _ = require('underscore');

function Entity(id, key) {
	// console.log("inside entity constr");
	GameEngine.getInstance().addEntity(this, id);
    this.key = key;
    this.id = id;
    this.father;
	this.transform = new Transform(this);
	this.components = new ComponentManager(this);
	this.childrenManager = new ChildrenManager(this);
    this._eventHandlers = {};
};

/**
 * @override
 */
Entity.prototype.updateBeforeWorldStep = function() {
    this.components.updateBeforeWorldStep();
}

Entity.prototype.updateAfterWorldStep = function() {
    this.components.updateAfterWorldStep();
}

// father must be an reference to an entity
// x0, y0, alpha0 are initial transform local variables
Entity.prototype.setFather = function( father, x0, y0, alpha0 ) {
    if( this.father ){
        console.error('Entity ' + this.id + ' already has a father');
    }
    else{
        this.father = father;
        this.transform.initLocalVariables(x0, y0, alpha0);
        father.childrenManager.add(this);
    }
}

Entity.prototype.destroy = function() {
    // Destroy children first
    _.each(this.childrenManager.getChildrenArray(), function(subentity){
        subentity.destroy();
    });

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