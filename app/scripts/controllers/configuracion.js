'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ConfiguracionCtrl
 * @description
 * # ConfiguracionCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('ConfiguracionCtrl', function ($scope, Configuracion, toaster, InputValid, constantes) {
	var tipo = 'save';
	var id;
	$scope.titulo = 'Configuración General';
	$scope.configuracion = {};

	function getConfiguraciones(){
		Configuracion.get().$promise.then(function(resp){
			$scope.configuracion = resp.data[0];
			id = $scope.configuracion.id;
			tipo = 'update';
		}).catch(function(resp){

		});
	}

	getConfiguraciones();

	$scope.guardar = function(form){
		if(form.$valid){
			Configuracion[tipo]({id:id},$scope.configuracion).$promise.then(function(resp){
				 toaster.pop('success',constantes.success,resp.meta.mensaje);
			}).catch(function(resp){
				 toaster.pop('error',constantes.error,resp.data.meta.mensaje);
			});
		}

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
