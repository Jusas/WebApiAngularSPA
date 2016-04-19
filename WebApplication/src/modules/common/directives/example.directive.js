/**
 * A sample structure of a directive with all the basic elements in place.
 * Does nothing really.
 */
(function () {
    'use strict';

    angular
		.module('common')
		.directive('example', Example);

    Example.$inject = [];

    /* @ngInject */
    function Example() {
        var directive = {
            bindToController: true,
            controller: ExampleController,
            templateUrl: 'modules/common/directives/example.directive.html',
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {
            // Link time code
            scope.vm.name = "example";
        }
    }



    ExampleController.$inject = ['$scope'];

    /* @ngInject */
    function ExampleController($scope) {
        // The controller
    }

})();