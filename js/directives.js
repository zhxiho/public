'use strict';

/* Directives */

angular.module('xDeskApp')
.directive('public', function() {
	return {
		restrict: 'E',
		templateUrl: 'login/public.html',
		replace: false
	}
});
