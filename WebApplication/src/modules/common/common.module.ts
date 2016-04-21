///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>

/**
 * An Angular module definition.
 * Here you introduce all the directives, controllers and services to your
 * module and define dependencies that this module requires.
 * Note to make here: directives always start with lowercase. Angular will throw an exception if you don't do this.
 */ 
module Common {
    angular.module('Common', [])
        // An example of a directive
        .directive('exampleDirective', ExampleDirective.factory())
        // An example of a service
        .factory('Storage', Storage.factory());
}
