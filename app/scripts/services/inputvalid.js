'use strict';

/**
 * @ngdoc service
 * @name appApp.InputValid
 * @description
 * # InputValid
 * Service in the appApp.
 */
angular.module('appApp').service('InputValid', function () {
     var inputValid = {};

    inputValid.icono = function (formInput) {
        return {
            'glyphicon-ok': formInput.$valid && formInput.$dirty,
            'glyphicon-remove': formInput.$invalid && formInput.$dirty
        };
    };

    inputValid.input = function (formInput) {
        return {
            'has-success': formInput.$valid && formInput.$dirty,
            'has-error': formInput.$invalid && formInput.$dirty
        };
    };

    return inputValid;
  });
