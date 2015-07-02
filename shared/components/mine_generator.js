'use strict'

var BaseComponent = require('../core/component.js');
var MathUtils = require('../../shared/utils/math.js');
var GameEngine = require('../../shared/game_engine.js');

var mine_settings = require('../../shared/settings/mine.json');

function MineGenerator() {
	this.key = "mine_generator";
	this._idCount = 0;
	this.temporaryEntitiesIDs = [];
};

///
MineGenerator.prototype = Object.create(BaseComponent.prototype);
MineGenerator.prototype.constructor = MineGenerator;
///

MineGenerator.prototype.createMines = function(initialPosition, boatAngle, boatVelocityArray){ 
	// console.log('createMines called');
	// var playerPos = this.owner.transform.getPosition();
	// console.log('player.x = ' + playerPos.x + ' | player.y = ' + playerPos.y);

	//transferir para dentro do input
	var alpha0 = boatAngle+Math.PI-(mine_settings.n_mines-1)/2*mine_settings.angle_spacement;
	// console.log('alpha0 = ' + alpha0);
	for( var i = 0; i < mine_settings.n_mines; i++ ){
		// nao deve lancar outra mina antes dessa explodir
		// ou arrumar para criar ids diferentes
		var mineId = this.getId();
		var mineKey = 'mine_' + this._idCount;
		this._idCount++;
		var mineAngle = alpha0 + i*mine_settings.angle_spacement;
		var mineDeltaPosition = MathUtils.vector(mine_settings.initial_distance, mineAngle);
		// console.log('initialPosition:');
		// console.log(initialPosition);
		// console.log('mineDeltaPosition:');
		// console.log(mineDeltaPosition);
		var minePosition = {
			"x": initialPosition.x + mineDeltaPosition.x,
			"y": initialPosition.y + mineDeltaPosition.y
		}
		// console.log('minePosition:');
		// console.log(minePosition);
		var mineVelocity = MathUtils.vector(mine_settings.physics.initial_velocity, mineAngle);
		mineVelocity = {
			"x": mineVelocity.x + boatVelocityArray[0]*mine_settings.boat_velocity_factor,
			"y": mineVelocity.y + boatVelocityArray[1]*mine_settings.boat_velocity_factor,
		}
		// console.log(ProjectileFactory);
		// console.log(ProjectileFactory.createMine);
		// console.log(mineId);
		// console.log(minePosition);
		// console.log(mineAngle);
		// console.log(mine_settings.physics.initial_velocity);
		var mine = this.createMine(mineId, mineKey, minePosition, mineAngle, mineVelocity);		
		this.temporaryEntitiesIDs.push(mineId);
	}
	// GameEngine.getInstance().printEntityHierarchy();
},

// MineGenerator.prototype.update = function(){ 
// 	if( !this.owner.subentityManager.hasSubentity() )
// 		this.owner.destroy();
// }

module.exports = MineGenerator;