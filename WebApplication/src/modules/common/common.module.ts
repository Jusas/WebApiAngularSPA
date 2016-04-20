///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>

// Note to make here: directives always start with lowercase. Angular will throw an exception if you don't do this.
module Common {
    angular.module('Common', [])
        .directive('exampleDirective', ExampleDirective.factory())
        .factory('Storage', Storage.factory());
}
