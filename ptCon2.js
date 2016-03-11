/*jshint browser: true, devel: true*/
(function() {
	"use strict";
	
	var Point = (function() {
		var _sceneEl;
		var create = function (sceneId, pos2dArr) {
			_sceneEl = document.getElementById(sceneId);
			console.log(_sceneEl);
		};
		return {
			create: create
		};
	})();
	
	Point.create('scene1');

})();