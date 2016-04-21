/**
 * This file contains a sample directive.
 * The directive itself is very simple but should contain all the
 * necessary components you may need to implement your directive.
 * See: https://docs.angularjs.org/guide/directive.
 *
 * Note that the inclusion of this directive to the module is done
 * in the module definition file itself (common.module.ts).
 *
 * In Typescript representation the directive looks different from
 * the pure JS representation and is split into 4 parts:
 * - The API (the directive scope description)
 * - The directive itself (the basic structure of the directive to provide for angular)
 * - The Link class, running the code that needs to be run when the
 *   directive linking runs
 * - The Controller class, acting as the controller to your template.
 *
 * This division is not optimal but due to the way Angular initializes
 * directives this is the most logical and a clean way of doing it.
 */
module Common {

    /**
     * Directive API (scope definition).
     */
    export class ExampleDirectiveAPI {
        name = "@";
    }

    /**
     * The directive definition itself.
     * The factory() method is called when the directive is declared in the module
     * (check common.module.ts).
     * For pure javascript documentation see https://docs.angularjs.org/guide/directive.
     */
    export class ExampleDirective implements angular.IDirective {
        
        restrict = 'E';
        templateUrl = 'modules/common/directives/example.directive.tpl.html';
        controllerAs = 'vm';
        bindToController = true;
        transclude = false;
        scope = new ExampleDirectiveAPI();
        
        constructor() {
            console.log("directive constructor called");
        }
        
        link = (scope: angular.IScope, element: angular.IAugmentedJQuery,
            attrs: angular.IAttributes, ctrl: ExampleDirectiveController,
            transcludeFn: angular.ITranscludeFunction) => {
            return new ExampleDirectiveLink(scope, element, attrs, ctrl, transcludeFn);
        }
        
        controller = ExampleDirectiveController.factory();
        
        static factory(): angular.IDirectiveFactory {
            var directive = () => new ExampleDirective();
            return directive;
        }
    }

    /**
     * The linking class/function.
     * The constructor runs in the linking stage of the directive.
     * Note that the Controller gets created before the linking runs
     * (as can be seen from having the controller as a parameter to the link function).
     */
    class ExampleDirectiveLink {
        constructor(private scope: angular.IScope, private element: angular.IAugmentedJQuery,
            private attrs: angular.IAttributes, private ctrl: ExampleDirectiveController,
            private transcludeFn: angular.ITranscludeFunction) {

            this.doSomeLinkingStuff();
        }

        doSomeLinkingStuff() {
            console.log("link, data: ", this.scope, this.element, this.attrs, this.ctrl, this.transcludeFn);
        }
    }

    /**
     * The directive controller.
     * Acts as the controller for the template.
     * Note that the factory provides the method to create an instance of the controller.
     * This is due to the way we're forced to introduce the controller to the directive.
     * The factory method is also where the controller gets its dependancy injection.
     * The $inject is related to code minification.
     * Read more about Angular DI: https://docs.angularjs.org/guide/di (search Property Annotation)
     */
    class ExampleDirectiveController {

        // Just an ordinary property that gets exposed to the template.
        foo: string = "this is foo!";

        constructor(private $scope: angular.IScope, private Storage: Common.Storage) {
            console.log("directive controller constructor", $scope, Storage);
        }

        static factory(): angular.IDirectiveFactory {
            var controller = ($scope: angular.IScope, Storage: Common.Storage) =>
                new ExampleDirectiveController($scope, Storage);
            controller.$inject = ['$scope', 'Storage'];
            return controller;
        }

        // Just an ordinary method that gets exposed to the template.
        sayFoo() {
            console.log("foo!");
        }

    }

}
