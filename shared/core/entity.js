'use strict';

var _ = require('underscore');
var GameEngine = require('../game_engine.js');
var ComponentManager = require('./component_manager.js');
var Transform = require('../components/transform.js');
var SubentityManager = require('./subentity_manager.js');
var EntityAttrs = require('./entity_attrs');

function Entity(id, key) {
    // console.log("inside entity constr");
    GameEngine.getInstance().addEntity(this, id);
    this.key = key;
    this.id = id;

    this.initialAttrs = new EntityAttrs();
    this.attrs = new EntityAttrs();
    this.transform = new Transform(this);
    this.components = new ComponentManager(this);
    this.subentityManager = new SubentityManager(this);

    this._eventHandlers = {};
    this._followBaseEntityAngle = true;
}

/**
 * @override
 */
Entity.prototype.updateBeforeWorldStep = function () {
    this.components.updateBeforeWorldStep();
};

Entity.prototype.updateAfterWorldStep = function () {
    this.components.updateAfterWorldStep();
};

// base must be an reference to an entity
// x0, y0, alpha0 are initial transform local variables
Entity.prototype.setBaseEntity = function (baseEntity, x0, y0, alpha0) {
    if (this.baseEntity) {
        console.error('Entity ' + this.id + ' already has a baseEntity');
    }
    else {
        this.baseEntity = baseEntity;
        this.transform.initLocalVariables(x0, y0, alpha0);
        baseEntity.subentityManager.add(this);
    }
};

Entity.prototype.setFollowBaseEntityAngle = function (value) {
    this._followBaseEntityAngle = value;
};

Entity.prototype.getFollowBaseEntityAngle = function (value) {
    return this._followBaseEntityAngle;
};

Entity.prototype.destroy = function () {
    // GameEngine.getInstance().printEntityHierarchy();
    // console.log('entity.key = ' + this.key + ' detroyed ----------------------------------------');

    // Destroy subentitys first
    _.each(this.subentityManager.getAll(), function (subentity) {
        subentity.destroy();
    });

    if (this.baseEntity)
        this.baseEntity.subentityManager.remove(this);

    this.trigger('entity.destroy', this);
    GameEngine.getInstance().deleteEntity(this);
};

Entity.prototype.sync = function (transform) {
    this.trigger('entity.sync', transform, this);
};

Entity.prototype.syncAfter = function (transform) {
    this.trigger('entity.syncAfter', transform, this);
};

Entity.prototype.damage = function (amount, attacker) {
    this.trigger('entity.damage', amount, attacker, this);
};

Entity.prototype.collision = function (collider) {
    this.trigger('entity.collision', collider, this);
};

Entity.prototype.die = function () {
    // console.log('entity(' + this.key + ').die called');

    _.each(this.subentityManager.getAll(), function (subentity) {
        subentity.die();
    });
    this.trigger('entity.die', this);
};

Entity.prototype.revive = function () {
    _.each(this.subentityManager.getAll(), function (subentity) {
        subentity.revive();
    });

    this.trigger('entity.revive', this);
};

//internal
Entity.prototype.on = function (event, handler) {
    this._eventHandlers[event] = this._eventHandlers[event] || [];
    this._eventHandlers[event].push(handler);
};

Entity.prototype.trigger = function (event) {
    var params = Array.prototype.slice.call(arguments, 1);
    if (this._eventHandlers[event]) {
        for (var i = 0; i < this._eventHandlers[event].length; i++) {
            this._eventHandlers[event][i].apply(this, params);
        }
    }
};

module.exports = Entity;