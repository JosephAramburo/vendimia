'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('MainCtrl', function ($scope, $filter, $location, token, store) {
   $scope.fecha = "Fecha: " + $filter('date')(new Date(), 'dd/MM/yyyy');
   $scope.menu = function () {
        var path = $location.path();
        if (path.toString() === '/')
            return false;
        else {
            return true;
        }
    };

    $scope.cerrarSesion = function(){        
        token.unset("token");
        store.remove('nombre');
        store.remove('id');
        store.remove('isAdmin');
        $location.path('/');  
    };
  });
