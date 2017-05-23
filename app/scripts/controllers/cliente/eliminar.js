'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ClienteEliminarCtrl
 * @description
 * # ClienteEliminarCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('ClienteEliminarCtrl', function ($scope, Cliente, toaster, $uibModalInstance, id, constantes) {
	$scope.titulo = "Cliente";
    $scope.pregunta = "¿Quiere inactivar al cliente?";
    $scope.aceptar = function () {
        Cliente.delete({id:id}).$promise.then(function (resp) {
            toaster.pop('success',constantes.success,resp.meta.mensaje);            
            $uibModalInstance.close(200);
        }).catch(function (resp) {
            toaster.pop('error',constantes.error,resp.data.meta.mensaje);
            $uibModalInstance.dismiss('cancel');
        });
    };

    $scope.cancelar = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
