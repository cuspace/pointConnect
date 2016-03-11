/*jshint browser: true, devel: true*/
(function() {
	"use strict";
	
	var Point = (function() {
		var create = function (sceneId, pos2dArr) {
			console.log('create');
		};
		return {
			create: create
		};
	})();
	
	Point.create();

})();