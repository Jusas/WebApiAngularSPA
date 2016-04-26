module Common {

    /**
    * Component API (scope/bindings definition).
    */
    export class ExampleComponentAPI {
        // This is a necessary declaration. Otherwise typescript can't resolve the 
        // members as valid for the IComponentOptions bindings.
        [binding: string]: string;
        name = "@";
    }

    /**
     * Component definition. A component is basically a much simplified directive and is the
     * basic building block of applications. It doesn't have complex stuff like link or compile
     * methods and always has isolated scope.
     */
    export class ExampleComponent implements angular.IComponentOptions {
        bindings = new ExampleComponentAPI();
        templateUrl = "modules/common/components/example.component.tpl.html";
        controller = ExampleComponentController;
    }

    /**
     * The controller for the component.
     */
    class ExampleComponentController {

        public static $inject = ['Storage'];
        constructor(private Storage: Common.Storage) {
            console.log("ExampleComponentController constructor", Storage);
        }

        printToConsole(stuff: string) {
            console.log(stuff);
        }
    }
}