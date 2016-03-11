/*jshint browser: true, devel: true*/
(function() {
	"use strict";
	
	var Point = (function() {
		var _sceneEl;
		var	_template = {
			id: 'point',
			geometry: {
				primitive: 'box',
				depth: 0.2,
				width: 0.5,
				height: 0.5
			},
			material: {
				color: 'gray',
				metalness: 0.5
			}
		};
		var create = function (sceneId, positionsArr) {
			_sceneEl = document.getElementById(sceneId);
			positionsArr.forEach(function (item, index, array) {
				var aEntity = document.createElement('a-entity');
				aEntity.setAttribute('id', _template.id + index);
				aEntity.setAttribute('geometry', _template.geometry);
				aEntity.setAttribute('material', _template.material);
				aEntity.setAttribute('position', item);
				_sceneEl.appendChild(aEntity);
			});
		};
		return {
			create: create
		};
	})();
	
	var Line = (function() {
		var _sceneEl;
		var _template = {
			id: 'line',
			geometry: {
				primitive: 'cylinder',
				radius: 0.05,
				height: 2
			},
			material: {
				color: 'white',
				metalness: 0.5
			},
			visible: 'true'
		};
		var _pairTbl = [];
		var _makePairTbl = function(n) {
			for(var i = 0; i < n; i++) {
				_pairTbl.push([]);
				for(var j = 0; j < n; j++) {
					_pairTbl[i].push(0);
				}
			}
		};
		var create = function (sceneId, positionsArr) {
			_makePairTbl(positionsArr.length);
			_sceneEl = document.getElementById(sceneId);
			var aEntity = document.createElement('a-entity');
			aEntity.setAttribute('id', _template.id);
			aEntity.setAttribute('geometry', _template.geometry);
			aEntity.setAttribute('material', _template.material);
			aEntity.setAttribute('visible', _template.visible);
			_sceneEl.appendChild(aEntity);
		};
		return {
			create: create
		};
	})();
	
	var sceneId = 'scene1';
	var positions = [
		{x: -0.5, y: +1.0, z: -5.0},
		{x: +0.5, y: +1.0, z: -5.0},
		{x: -2.0, y: -1.0, z: -5.0},
		{x: +2.0, y: -1.0, z: -5.0}
	];
	Point.create(sceneId, positions);
  Line.create(sceneId, positions);
})();