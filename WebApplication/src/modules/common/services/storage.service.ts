
/**
 * An example Angular Service (or factory) implementation in Typescript.
 * In essence a service is (usually) a singleton that provides some service.
 * This particular service provides storage services, in essence wraps
 * localStorage and sessionStorage into a single service with some extra
 * features like providing functionality for data expiration.
 * Skip to class Storage to see the actual Service definition.
 * Read more about Services: https://docs.angularjs.org/guide/services
 */
module Common {

    /**
     * Utility classes for the Storage service.
     */

    export interface IBrowserStorage {
        setItem(key: any, data: any): void;
        getItem(key: any): any;
        removeItem(key: any): void;
        clear(): void;
    }

    export class StorageObject {
        constructor(public data: any, public updated: Object = null, public expires: Object = null) {}
    }


    export class BrowserStorage {

        constructor(private storageContainer: IBrowserStorage) {            
        }

        setItem(key: string, data: any) {
            var storageObj = new StorageObject(data);
            this.storageContainer.setItem(key, angular.toJson(storageObj));
        }

        getItem(key: string, withMetaData: boolean = false) {
            var item = this.storageContainer.getItem(key);
            if (item === null) {
                console.warn("Tried to get a non-existing item '" + key + "' from persistent storage");
                return null;
            }
            try {
                var storageObj = angular.fromJson(item);
                if (withMetaData) {
                    return storageObj;
                }
                else {
                    return storageObj.data;
                }

            }
            catch (e) {
                this.removeItem(key);
                console.warn("Got malformed item '" + key + "' from persistent storage, removing it");
            }
        }

        
        hasItem(key: string) {
            return this.storageContainer.hasOwnProperty(key);
        };

        removeItem(key: string) {
            this.storageContainer.removeItem(key);
        };

        hasExpired(key: string, expirationDate: Object = null) {
            var item = this.getItem(key, true);
            if (item === null) {
                throw ("Item " + key + " does not exist in persistent storage");
            }

            var expires = item.expires != null ? item.expires : expirationDate;
            if (expires == null || expires === undefined) {
                return false;
            }

            var now = Date.now();
            var itemExpirationDate = new Date(expires);
            if (itemExpirationDate.getTime() < now) {
                return true;
            }
            return false;

        };

        clear() {
            this.storageContainer.clear();
        }

    }

    /**
     * The Storage service class.
     * This is a quite compact definition as most of the functionality
     * was defined in other classes.
     * Notable things:
     * - The service is introduced to Angular in the module file (common.module.ts)
     * - The $inject is for dependency injection (minification protection) and the order and
     *   names must match the constructor parameters
     * - $rootScope is actually not used for anything here except to demonstrate dependency injection
     * - A factory method is one again required for Angular to instantiate the service.
     *
     * Services are pretty simple to implement even in Typescript.
     */
    export class Storage {

        public static $inject = ['$rootScope'];
        sessionStorage: IBrowserStorage;
        localStorage: IBrowserStorage;

        constructor(private $rootScope: angular.IScope) {
            console.log("Service constructor, rootscope is: ", this.$rootScope);
            this.localStorage = new BrowserStorage(window.localStorage);
            this.sessionStorage = new BrowserStorage(window.sessionStorage);
        }
        
        static factory() {
            return ($rootScope: angular.IScope) => {
                return new Storage($rootScope);
            }
        }


    }
}