///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
/**
 * A simple Angular controller.
 * As with any other Angular components, $inject is required
 * for proper dependency injection.
 * The controller code itself is pretty self explatory.
 */
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
            // Note on the watch: simple "todoItems" string won't work, Angular won't be
            // able to resolve it. This is due to using controllerAs syntax, we could do this
            // if we watched the scope directly but since we don't, it won't work.
            // See http://kenhowardpdx.com/blog/2015/05/how-to-watch-scope-properties-in-angular-with-typescript/
            // for full explanation.
            this.$scope.$watch(() => this.todoItems, (newValue: ITodoItem[], oldValue: ITodoItem[]) => {
                this.Storage.localStorage.setItem('todolist', this.todoItems);
            }, true);
        }

        public addItem() {
            this.todoItems.push({
                done: false,
                text: 'new todo item'
            });
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