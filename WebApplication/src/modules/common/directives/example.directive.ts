module Common {

    export class ExampleDirective implements angular.IDirective {

        public static $inject = ['$rootScope', 'Storage'];
        public restrict = 'E';
        public templateUrl = 'modules/common/directives/example.directive.html';
        public controllerAs = 'vm';
        public bindToController = true;
        public scope = {
            name: '='
        };
        
        constructor(private $rootScope: angular.IScope, private Storage: any) {
            console.log("directive constructor called");
        }

        link(scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {
            // Link time code here.
            console.log("link, data: ", scope, element, attrs);
        }

        controller($scope: angular.IScope, Storage: any) {
            console.log("controller init");
            console.log("controller name: ", this.scope.name);
        }

        static factory(): angular.IDirectiveFactory {
            return ($rootScope: angular.IScope, Storage: any) => {
                return new ExampleDirective($rootScope, Storage);
            }
        }
    }
}
