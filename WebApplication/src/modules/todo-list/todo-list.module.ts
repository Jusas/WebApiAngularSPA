///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>

/**
 * An Angular module definition.
 * Here you introduce all the directives, controllers and services to your
 * module and define dependencies that this module requires (in this case the 'Common' module).
 * Note to make here: directives always start with lowercase. Angular will throw an exception if you don't do this.
 */
module TodoList {
    angular.module('TodoList', ['Common'])
        .controller('TodoListController', TodoListController);
}
