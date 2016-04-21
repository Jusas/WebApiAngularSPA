///<reference path="../scripts/typings/angularjs/angular.d.ts"/>
module Todo {
    "use strict";

    /**
     * The app class. This is the main Angular app definition.
     *
     * Short description of the whole app: it's a simple todo-list where
     * you can add items, remove checked items and rename items at will.
     * All the todo-items persist in your browser's localStorage.
     * 
     * Things to note here:
     * - requiredModules contains the list of modules the app
     *   requires to function
     * - Angular comes in several modules. The core module doesn't contain
     *   things like routing or CSS animation related automated functionality,
     *   those modules need to be added as additional modules.
     * - Common module is defined in common.module.ts, TodoList module in
     *   todo-list.module.ts and AngularTemplates module is generated and
     *   contains pre-built HTML templates that are driven into $templateCache.
     *   Directives and other components use those templates.
     * - App configuration is done in the config() method. For example if we wanted
     *   to use [[ ]] for angular bindings instead of {{ }} we could set that up here
     *   by configuring it with the $interpolationProvider. Usually there's not
     *   much if any configuring you need to do here.
     * - This particular app defines routes (well, just one). The routes
     *   are directly related to the ng-view attribute in the main index.html file.
     *   Read more about routes: https://docs.angularjs.org/api/ngRoute
     * - run() method is executed when the application is all set up and ready to run.
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