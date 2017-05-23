'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ArticuloFrmarticuloCtrl
 * @description
 * # ArticuloFrmarticuloCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('ArticuloFrmarticuloCtrl', function ($scope, Articulo, toaster, $routeParams, $location, InputValid, constantes, $uibModal) {
    $scope.articulo = {};
    $scope.titulo = "Registro de Articulos";
     var id = $routeParams.id;
     var tipo = 'save';
     if(typeof(id) !== 'undefined'){
     	$scope.titulo = "Editar de Articulo";
     	tipo = 'update';
     	Articulo.get({id:id}).$promise.then(function (resp) {
	        $scope.articulo = resp.data;
	    });
     };    

    $scope.guardar = function (form) {
        if (form.$valid) {
            Articulo[tipo]({id:id},$scope.articulo).$promise.then(function (resp) {
                toaster.pop('success',constantes.success,resp.meta.mensaje);
                $location.path('/articulos');
            }).catch(function (resp) {
                 toaster.pop('error',constantes.error,resp.data.meta.mensaje);
            });
        }
    };

     $scope.regresar = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/ventanaregreso.html',
            controller: 'VentanaregresoCtrl'
        });

        modalInstance.result.then(function (resp) {
            if(resp === 200)
                $location.url('/articulos');
        }, function () { 

        });
    };

    $scope.focusInput = function(input){
        $('#'+input).focus();
    };

    $scope.cssIcono = function (formInput) {
        return InputValid.icono(formInput);
    };
    $scope.cssInput = function (formInput) {
        return InputValid.input(formInput);
    };
});
