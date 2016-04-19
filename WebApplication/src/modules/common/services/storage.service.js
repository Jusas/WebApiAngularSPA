/**
 * A sample angular service.
 * Wraps LocalStorage and SessionStorage to a service.
 * Has little use, but works as an example.
 */
(function () {
    'use strict';

    angular
		.module('common')
		.factory('Storage', Storage);

    Storage.$inject = [];

    /**
	 * Storage service.
	 * Provides different storage methods for storing JSON objects in their serialized form.
	 */
    function Storage() {

        return {
            sessionStorage: new BrowserStorage(window.sessionStorage),
            localStorage: new BrowserStorage(window.localStorage)
        };
    }

    /**
	 * A storage object.
	 * Has an extra 'updated' and 'expires' fields to go along with data which
	 * allows data expiration.
	 * Expiration date is optional.
	 * @param data
	 * @param expires
	 * @returns {{updated: string, expires: Date, data: *}}
	 * @constructor
	 */

    function StorageObject(data, expires) {
        return {
            updated: new Date().toJSON(),
            expires: (expires != null || expires !== undefined) ? expires.toJSON() : null,
            data: data
        };
    }

    /**
	 * Browser storage, can be initialized with different storage containers
	 * that implement the standard localStorage interface.
	 * @param storageContainer
	 * @constructor
	 */
    function BrowserStorage(storageContainer) {

        this.storageContainer = storageContainer;

        this.setItem = function (key, data) {
            var storageObj = new StorageObject(data);
            this.storageContainer.setItem(key, angular.toJson(storageObj));
        };

        /**
		 * Gets the stored object with the given key.
		 * If 'withMetaData' is set true, returns the whole StorageObject.
		 * Otherwise only returns the StorageObject's data.
		 * If the item with the given key cannot be found, returns null.
		 * @param key
		 * @param withMetaData
		 * @returns {*}
		 */
        this.getItem = function (key, withMetaData) {
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

        };

        this.hasItem = function (key) {
            return this.storageContainer.hasOwnProperty(key);
        };

        this.removeItem = function (key) {
            this.storageContainer.removeItem(key, true);
        };

        /**
		 * Checks if the stored item has expired by comparing
		 * its expired date to current date, or the 'expirationDate' argument
		 * if provided. The 'expirationDate' argument is optional.
		 * If the item cannot be found, throws an exception.
		 * @param key
		 * @param expirationDate
		 * @returns {boolean}
		 */
        this.hasExpired = function (key, expirationDate) {
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

        this.clearAllItems = function () {
            this.storageContainer.clear();
        };
    }

})();