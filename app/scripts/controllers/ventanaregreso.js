'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:VentanaregresoCtrl
 * @description
 * # VentanaregresoCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('VentanaregresoCtrl', function ($scope,$uibModalInstance) {
	$scope.titulo = "¿Desea regresar a la pantalla anterior?";
    $scope.aceptar = function () {                   
        $uibModalInstance.close(200);
    };
    $scope.cancelar = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
