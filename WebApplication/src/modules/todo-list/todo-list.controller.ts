///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
module TodoList {

    export class TodoListController {
        
        public static $inject = ['$scope', 'Storage'];
        public title: string;

        constructor(private $scope: angular.IScope, private Storage: any) {
            this.title = "Todo List";
            this.initialize();
        }

        private initialize() {
            // Do some controller initialization here, like setting up watches etc.
        }

    }
}