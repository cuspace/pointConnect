/*jshint browser: true, devel: true*/
/*globals vec3*/
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
		var create = function (sceneId, positionsArr, mouseEnterHandler) {
			_sceneEl = document.getElementById(sceneId);
			positionsArr.forEach(function (item, index, array) {
				var aEntity = document.createElement('a-entity');
				aEntity.setAttribute('id', _template.id + index);
				aEntity.setAttribute('geometry', _template.geometry);
				aEntity.setAttribute('material', _template.material);
				aEntity.setAttribute('position', item);
				aEntity.onmouseenter = mouseEnterHandler();
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
		var _getMidPos = function (p1, p2) {
			return {x: (p1.x+p2.x)*0.5, y: (p1.y+p2.y)*0.5, z: (p2.z+p2.z)*0.5};
		};
		var _getHeight = function (p1, p2) {
			return vec3.len(vec3.fromValues(p1.x-p2.x, p1.y-p2.y, p1.z-p2.z));
		};
		var _getRotation = function (p1, p2) {
			var ref = vec3.fromValues(0, 1, 0);
			var v1 = vec3.fromValues(p1.x-p2.x, p1.y-p2.y, p1.z-p2.z);
			var angle = vec3.angle(v1, ref)*180/Math.PI;
			angle = (p1.x < p2.x) ? angle : -angle;
			return {x:0,y:0,z:angle};
		};
		var create = function (sceneId, positionsArr) {
			_makePairTbl(positionsArr.length);
			
			_sceneEl = document.getElementById(sceneId);
			
			for(var i = 0; i < _pairTbl.length; i++) {
				for(var j = i+1; j < _pairTbl[i].length; j++) {
					
					var pos = _getMidPos(positionsArr[i], positionsArr[j]);
					var h = _getHeight(positionsArr[i], positionsArr[j]);
					var rot = _getRotation(positionsArr[i], positionsArr[j]);
					//console.log('p1.x:'+positionsArr[i].x+', p2.x:'+positionsArr[j].x+' , rot:'+rot.z);
					
					var aEntity = document.createElement('a-entity');
					aEntity.setAttribute('id', _template.id);
					aEntity.setAttribute('geometry', _template.geometry);
					aEntity.setAttribute('geometry', 'height', h);
					aEntity.setAttribute('material', _template.material);
					aEntity.setAttribute('visible', _template.visible);
					aEntity.setAttribute('position', pos);
					aEntity.setAttribute('rotation', rot);
					_sceneEl.appendChild(aEntity);
				}
			}
		};
		return {
			create: create
		};
	})();
	
	var mouseEnterHandler = function() {
		return function() {
			console.log('a');
		};
	};
	
	var sceneId = 'scene1';
	var positions = [
		{x: -0.5, y: +1.0, z: -5.0},
		{x: +0.5, y: +1.0, z: -5.0},
		{x: -2.0, y: -1.0, z: -5.0},
		{x: +2.0, y: -1.0, z: -5.0}
	];
	Point.create(sceneId, positions, mouseEnterHandler);
  Line.create(sceneId, positions);
})();