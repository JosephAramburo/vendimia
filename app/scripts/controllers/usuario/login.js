'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:UsuarioLoginCtrl
 * @description
 * # UsuarioLoginCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('UsuarioLoginCtrl', function ($scope, Usuario, toaster, $location, token, InputValid, store, constantes) {   
	$scope.usuario = {};
    $scope.login = function () {       
        Usuario.authentication($scope.usuario).$promise.then(function (resp) {  
       
            store.remove('id');
            store.remove('token');
            store.remove('nombre');
            store.remove('isAdmin');

            store.set('nombre',resp.data.nombre);
            store.set('id',resp.data.id);
            token.set('token', resp.data.token);
            token.set('isAdmin', resp.data.isToken);

            $location.path('/index');        
        }).catch(function (resp) {        
          	toaster.pop('error',constantes.error,resp.data.meta.mensaje);
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
