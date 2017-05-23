'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ClienteFrmclienteCtrl
 * @description
 * # ClienteFrmclienteCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('ClienteFrmclienteCtrl', function ($scope, toaster, constantes, $routeParams, Cliente, InputValid, $location, $uibModal) {
	$scope.titulo = 'Registro de Cliente';
	$scope.cliente = {};
     var id = $routeParams.id;
     var tipo = 'save';
     if(typeof(id) !== 'undefined'){
     	$scope.titulo = "Editar de Cliente";
     	tipo = 'update';
     	Cliente.get({id:id}).$promise.then(function (resp) {
	        $scope.cliente = resp.data;
	    }).catch(function(){

	    });
     };

     $('#nombre').focus();    

    $scope.guardar = function (form) {
        if (form.$valid) {
            Cliente[tipo]({id:id},$scope.cliente).$promise.then(function (resp) {
                toaster.pop('success',constantes.success,resp.meta.mensaje);
                $location.path('/cliente');
            }).catch(function (resp) {
                 toaster.pop('error',constantes.error,resp.data.meta.mensaje);
            });
        }
    };

    $scope.focusInput = function(input){
        $('#'+input).focus();
    };

    $scope.regresar = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/ventanaregreso.html',
            controller: 'VentanaregresoCtrl'
        });

        modalInstance.result.then(function (resp) {
            if(resp === 200)
                $location.url('/cliente');
        }, function () { 

        });
    };

    $scope.cssIcono = function (formInput) {
        return InputValid.icono(formInput);
    };
    $scope.cssInput = function (formInput) {
        return InputValid.input(formInput);
    };
});
