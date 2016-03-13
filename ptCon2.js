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
				color: 'white',
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
				aEntity.onmouseenter = mouseEnterHandler;
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
			visible: 'false'
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
			_sceneEl = document.getElementById(sceneId);
			
			for(var i = 0; i < positionsArr.length; i++) {
				for(var j = i+1; j < positionsArr.length; j++) {
					
					var pos = _getMidPos(positionsArr[i], positionsArr[j]);
					var h = _getHeight(positionsArr[i], positionsArr[j]);
					var rot = _getRotation(positionsArr[i], positionsArr[j]);
					//console.log('p1.x:'+positionsArr[i].x+', p2.x:'+positionsArr[j].x+' , rot:'+rot.z);
					
					var aEntity = document.createElement('a-entity');
					aEntity.setAttribute('id', _template.id+i+j);
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
	
	
	var sceneId = 'scene1';
	var positions = [
		{x: -0.5, y: +1.0, z: -5.0},
		{x: +0.5, y: +1.0, z: -5.0},
		{x: -0.5, y: -1.0, z: -5.0},
		{x: +0.5, y: -1.0, z: -5.0}
	];
	var pairTbl = [];
	var twoPoints = [];
	var makePairTbl = function(n) {
		for(var i = 0; i < n; i++) {
			pairTbl.push([]);
			for(var j = 0; j < n; j++) {
				pairTbl[i].push(0);
			}
		}
	};
	var actionCases = [];
	var case1 = {
		tbl: [[0, 0, 1, 0], [0, 0, 0, 1], [1, 0, 0, 0], [0, 1, 0, 0]],
		do: function() {
			var leds = document.querySelectorAll('.led');
			for(var i = 0; i < leds.length; i++) {
				var led = leds[i];
				led.setAttribute('material', 'color', '#f00');
			}
		},
		undo: function() {
			var leds = document.querySelectorAll('.led');
			for(var i = 0; i < leds.length; i++) {
				var led = leds[i];
				led.setAttribute('material', 'color', '#600');
			}
		}
	};
	actionCases.push(case1);
	
	makePairTbl(positions.length);
	
	var mouseEnterHandler = function(tbl, tp, cases) {
		return function() {
			if(tp.length === 0) {
				tp.push(this.id);
//				console.log(tp);
				this.setAttribute('material', 'color', '#00ffeb');
				return;
			}
			var i = parseInt(tp[0].substr(5));
			var j = parseInt(this.id.substr(5));
			if(i === j) {
				tp.pop();
//				console.log(tp);
				this.setAttribute('material', 'color', 'white');
				return;
			}
			if (i > j) {
				var tmp = i;
				i = j;
				j = tmp;
			}
//			console.log('('+i+','+j+')');
//			console.log(tbl);
			var lineEl = document.getElementById('line'+i+j);
			if(tbl[i][j] === 0 && tbl[i][j] === 0) {
				//make line visible
				lineEl.setAttribute('visible', 'true');
				tbl[i][j] = 1;
				tbl[j][i] = 1;
			}
			else {
				//make line invisible
				lineEl.setAttribute('visible', 'false');
				tbl[i][j] = 0;
				tbl[j][i] = 0;
			}
			tp.pop();
//			console.log(tp);
			document.getElementById('point'+i).setAttribute('material', 'color', 'white');
			document.getElementById('point'+j).setAttribute('material', 'color', 'white');
			var sameCase = true;
			cases.forEach(function(item, index, array) {
				for(var i = 0; i < item.tbl.length; i++) {
					for(var j = 0; j < item.tbl[i].length; j++) {
						if(item.tbl[i][j] !== tbl[i][j]) {
							sameCase = false;
							break;
						}
					}
				}
				if(sameCase) {
					item.do();
				}
				else {
					item.undo();
				}
				sameCase = true;
			});
		};
	};
	
	Point.create(sceneId, positions, mouseEnterHandler(pairTbl, twoPoints, actionCases));
  Line.create(sceneId, positions);
})();