'use strict';

/**
 * @ngdoc service
 * @name appApp.token
 * @description
 * # token
 * Service in the appApp.
 */
angular.module('appApp').service('token', function (store) {
     var token = {};
    
    token.get = function (key) {
        return  store.get(key);
    };

    token.set = function (key, val) {
        return  store.set(key, val);
    };

    token.unset = function (key) {
        return  store.remove(key);
    };

    return token;
  });
