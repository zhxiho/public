// var xdesk = angular.module('xDesk_log',['xDesk_log.filters', 'xDesk_log.services', 'xDesk_log.directives']);
angular.module('xDeskApp',['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'login/login.html'
		})
		.state('q_login', {
			url: '/q_login',
			templateUrl: 'login/q_login.html'
		})
		.state('resources_list', {
			url: '/resources_list',
			templateUrl: 'login/resources_list.html'
		})
		.state('user_set', {
			url: '/user_set',
			templateUrl: 'set/set_config.html'
		})
		.state('voice_set', {
			url: '/voice_set',
			templateUrl: 'set/voice_set.html'
		})
		.state('usb_set', {
			url: '/usb_set',
			templateUrl: 'set/usb_set.html',
		})
		.state('display_set', {
			url: '/display_set',
			templateUrl: 'set/display_set.html',
		})
		.state('network_set', {
			url: '/network_set',
			templateUrl: 'set/network_set.html',
		})
		.state('system_set', {
			url: '/system_set',
			templateUrl: 'set/system_set.html'
		})
		.state('network_check', {
			url: '/network_check',
			templateUrl: 'login/network_check.html',
		});

})
.config(['$compileProvider', function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file:chrome-extension):/);
}]);