/**
 * Angular application configuration.
 */
(function () {

    var appDependencies = [
		'ngAnimate',
        'ngRoute',
		'ngResource',
		'common',
        'todo-list'
    ];

    angular
		.module('todo-app', appDependencies)
		.config(config)
		.run(run);

    
    config.$inject = [];

    function config() {
        // Do some configuring here.
    }

    run.$inject = [];

    function run() {
        console.log("Angular has been set up.");        
    }

})();