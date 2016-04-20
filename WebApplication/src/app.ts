///<reference path="../scripts/typings/angularjs/angular.d.ts"/>
module Todo {
    "use strict";

    /**
     * The app class.
     * 
     */
    export class TodoApp
    {
        public static requiredModules = [
            'ngAnimate',
            'ngRoute',
            'ngResource',
            'Common',
            'TodoList',
            'AngularTemplates'
        ];

        public static $inject = ['$routeProvider'];

        static config($routeProvider) {
            // Do configuration here.

            // Setting up routes.
            $routeProvider.when('/', {
                templateUrl: 'modules/todo-list/todo-list.tpl.html',
                controller: 'TodoListController',
                controllerAs: 'todolist'
            });
        }

        static run() {
            console.log("Angular has been set up");
        }
    }

    angular.module('TodoApp', TodoApp.requiredModules)
        .config(TodoApp.config)
        .run(TodoApp.run);

}