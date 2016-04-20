///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
module TodoList {

    export class TodoListController {
        
        public static $inject = ['$scope', 'Storage'];
        public title: string;
        public todoItems: ITodoItem[];

        constructor(private $scope: angular.IScope, private Storage: any) {
            this.title = "Todo List";
            this.initialize();
        }

        private initialize() {
            // Do some controller initialization here, like setting up watches etc.

            this.todoItems = this.Storage.localStorage.getItem('todolist');
            if (this.todoItems == null) {
                this.todoItems = [];
            }

            // Watch for changes on the todoItems, save to localStorage upon any change.
            this.$scope.$watch(() => this.todoItems, (newValue: ITodoItem[], oldValue: ITodoItem[]) => {
                this.Storage.localStorage.setItem('todolist', this.todoItems);
            }, true);
        }

        public addItem() {
            this.todoItems.push({ done: false, text: 'new todo item' });
        }

        public clearDone() {
            for (var i = this.todoItems.length - 1; i >= 0; i--) {
                if (this.todoItems[i].done) {
                    this.todoItems.splice(i, 1);
                }
            }
        }

    }
}