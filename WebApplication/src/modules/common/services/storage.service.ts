
module Common {

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