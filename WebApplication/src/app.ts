///<reference path="../scripts/typings/angularjs/angular.d.ts"/>
module Todo {
    "use strict";

    var dependencies = [
        'ngAnimate',
        'ngRoute',
        'ngResource',
        'Common',
        'TodoList',
        'AngularTemplates'
    ];

    angular.module('TodoApp', dependencies)
        .config(TodoApp.config)
        .run(TodoApp.run);


    class TodoApp
    {
        public static $inject = ['$routeProvider'];

        static config($routeProvider) {
            // Do configuration here.

            // Setting up routes.
            $routeProvider.when('/', {
                templateUrl: 'modules/todo-list/todo-list.tpl.html',
                controller: 'TodoListController'
            });
        }

        static run() {
            console.log("Angular has been set up");
        }
    }

}