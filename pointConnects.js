var posZ = -6;
var pointPositions = [
	{x:-0.5,y:1,z:posZ},
	{x:0.5,y:1,z:posZ},
	{x:-2,y:-1,z:posZ},
	{x:2,y:-1,z:posZ}
];
var lineMap = ['02', '30', '12', '31'];
var pointBaseColor = 'gray';
var pointOnColor = 'crimson';
var lineColor = 'skyblue';

var toggleLine = function(id1, id2, lineId, colorOn) {
	var el1 = document.getElementById(id1);
	var el2 = document.getElementById(id2);
	var lineEl = document.getElementById(lineId);
	var el1On = el1.getAttribute('material').color === colorOn;
	var el2On = el2.getAttribute('material').color === colorOn;
	(el1On && el2On) ?
		lineEl.setAttribute('visible', 'true') :
		lineEl.setAttribute('visible', 'false');
};
var toggleElColor = function(pId, lId, el, colorBase, colorOn, lineMap) {
	return function() {
		(el.getAttribute('material').color === colorBase) ?
			el.setAttribute('material', 'color', colorOn) :
			el.setAttribute('material', 'color', colorBase);	

		for(var i = 0; i < lineMap.length; i++) {
			toggleLine(pId+lineMap[i][0], pId+lineMap[i][1], lId+lineMap[i], colorOn);
		}
	}
};
var point = {
	id: 'point',
	geometry: {
		primitive: 'box',
		depth: 0.2,
		width: 0.5,
		height: 0.5
	},
	material: {
		color: pointBaseColor,
		metalness: 0
	},
	position: {
		x: -1,
		y: 0,
		z: -2
	}
};
var line = {
	id: 'line',
	geometry: {
		primitive: 'cylinder',
		radius: 0.05,
		height: 2
	},
	material: {
		color: lineColor,
		metalness: 0
	},
	rotation: {
		x: 0,
		y: 0,
		z: 90
	},
	position: {
		x: 0,
		y: 0,
		z: posZ
	},
	visible: 'false'
};

var scene = document.getElementById('scene1');

//points
for(var i = 0; i < pointPositions.length; i++) {
	var ett = document.createElement('a-entity');
	ett.setAttribute('id', point.id + i);
	ett.setAttribute('geometry', point.geometry);
	ett.setAttribute('material', point.material);
	ett.setAttribute('position', pointPositions[i]);
	scene.appendChild(ett);
	ett.onmouseenter = toggleElColor(point.id, line.id, ett, point.material.color, pointOnColor, lineMap);
}

//lines
var calcMidPos = function(pos1, pos2) {
	return {x: (pos1.x+pos2.x)/2, y: (pos1.y+pos2.y)/2, z: (pos1.z+pos2.z)/2};
};
for(var i = 0; i < lineMap.length; i++) {
	var i1 = parseInt(lineMap[i][0]);
	var i2 = parseInt(lineMap[i][1]);

	// line center position
	var pos = calcMidPos(pointPositions[i1], pointPositions[i2]);

	// line rotation
	var v1 = vec3.fromValues(
		pointPositions[i2].x - pointPositions[i1].x,
		pointPositions[i2].y - pointPositions[i1].y,
		pointPositions[i2].z - pointPositions[i1].z
	);
	var ref = vec3.fromValues(0, 1, 0);
	var angle = vec3.angle(v1, ref)*180/Math.PI;
	var rot = {x:0,y:0,z:angle};

	// line height
	var height = vec3.len(v1);

	var ett = document.createElement('a-entity');
	ett.setAttribute('id', line.id + lineMap[i]);
	ett.setAttribute('geometry', line.geometry);
	ett.setAttribute('geometry', 'height', height);
	ett.setAttribute('material', line.material);
	ett.setAttribute('rotation', rot);
	ett.setAttribute('position', pos);
	ett.setAttribute('visible', line.visible);
	scene.appendChild(ett);
}