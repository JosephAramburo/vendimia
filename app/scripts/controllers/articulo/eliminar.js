'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ArticuloEliminarCtrl
 * @description
 * # ArticuloEliminarCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('ArticuloEliminarCtrl', function ($scope, Articulo, toaster, $uibModalInstance, id, constantes) {
	$scope.titulo = "Articulo";
    $scope.pregunta = "¿Quiere inactivar el Articulo?";
    $scope.aceptar = function () {
        Articulo.delete({id:id}).$promise.then(function (resp) {
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
