/**
 * Directive for a performance wise faster ng-click.
 */
(function () {

    angular
		.module('common')
		.directive('lightNgClick', lightNgClick);

    lightNgClick.$inject = [];

    function lightNgClick() {
        return {
            restrict: 'A',
            scope: {
                "lightNgClick": "&"
            },
            link: function (scope, element, attrs) {
                if (typeof (scope.lightNgClick) == 'function') {
                    element.bind('click', function () {
                        scope.lightNgClick();
                        scope.$evalAsync();
                    });
                }
            }
        };
    }

})();
