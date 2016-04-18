(function () {
    'use strict';

    angular
		.module('todo-list')
		.controller('TodoListController', TodoListController);

    TodoListController.$inject = ['$scope', 'Storage'];

    /* @ngInject */
    function TodoListController($scope, Storage) {
        var vm = this;
        vm.title = 'TodoListController';

        activate();

        ////////////////

        function activate() {
            // Do stuff.
        }
    }

})();