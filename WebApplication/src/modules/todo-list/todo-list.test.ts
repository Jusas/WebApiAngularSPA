/// <reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
class MyClass {
    someVar: string;
    constructor(public foo: string) {
        this.someVar = foo;
        console.log("foo!");
        let name: string = "John";
        // test foo
    }
}
