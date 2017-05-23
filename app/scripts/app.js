'use strict';

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
  .module('appApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'blockUI',
    'angular-jwt',
    'toaster',
    'angular-storage'
  ])
  .config(function ($routeProvider, blockUIConfig,  $httpProvider, jwtInterceptorProvider, tokenProvider, jwtOptionsProvider) {
    blockUIConfig.message = 'Cargando, espere porfavor!';
    blockUIConfig.delay = 0;
    
    jwtOptionsProvider.config({
      whiteListedDomains: ['apivendimia2017.000webhostapp.com']
    });
     //en cada peticion enviamos el token a traves de los headers con el nombre Authorization 
    jwtInterceptorProvider.tokenGetter = function () {
        return tokenProvider.$get().get("token");
    };
    $httpProvider.interceptors.push('jwtInterceptor');
    $routeProvider
      .when('/', {
        templateUrl: 'views/usuario/login.html',
        controller: 'UsuarioLoginCtrl',
        controllerAs: 'usuario/login'
      })
      .when('/index', {
        templateUrl: 'views/main.html'
      })
      .when('/configuracion', {
        templateUrl: 'views/configuracion.html',
        controller: 'ConfiguracionCtrl',
        controllerAs: 'configuracion'
      })
      .when('/articulos', {
        templateUrl: 'views/articulo/listado.html',
        controller: 'ArticuloListadoCtrl',
        controllerAs: 'articulo/listado'
      })
      .when('/articulos/agregar', {
        templateUrl: 'views/articulo/frmarticulo.html',
        controller: 'ArticuloFrmarticuloCtrl',
        controllerAs: 'articulo/frmArticulo'
      })
      .when('/articulos/:id/editar', {
        templateUrl: 'views/articulo/frmarticulo.html',
        controller: 'ArticuloFrmarticuloCtrl',
        controllerAs: 'articulo/frmArticulo'
      })
      .when('/cliente', {
        templateUrl: 'views/cliente/listado.html',
        controller: 'ClienteListadoCtrl',
        controllerAs: 'cliente/listado'
      })
      .when('/cliente/agregar', {
        templateUrl: 'views/cliente/frmcliente.html',
        controller: 'ClienteFrmclienteCtrl',
        controllerAs: 'cliente/frmCliente'
      })
      .when('/cliente/:id/editar', {
        templateUrl: 'views/cliente/frmcliente.html',
        controller: 'ClienteFrmclienteCtrl',
        controllerAs: 'cliente/frmCliente'
      })
      .when('/venta', {
        templateUrl: 'views/venta/listado.html',
        controller: 'VentaListadoCtrl',
        controllerAs: 'venta/listado'
      })
      .when('/venta/nueva', {
        templateUrl: 'views/venta/frmventa.html',
        controller: 'VentaFrmventaCtrl',
        controllerAs: 'venta/frmVenta'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function ($rootScope, $location, toaster, jwtHelper, store) {

        $rootScope.$on('$routeChangeStart', function () {
            var token = store.get("token") || null;
            if (!token) {
                $location.path('/');
                return;
            }
            // if (token !== null) {
            //     var permissions = store.get("permisos");
            //      if(permissions !== null){
            //         permissions.forEach(function(permiso){
            //             PermPermissionStore
            //              .definePermission(permiso, function () {
            //                return true;
            //              });
            //         });
            //      }
            //     var tokenPayload = jwtHelper.decodeToken(token);                            
            //     // var bool = jwtHelper.isTokenExpired(token);                               
            //     // if (bool === true) {
            //     //     // toaster.pop({
            //     //     //     type: 'error',
            //     //     //     title: 'Error',
            //     //     //     body: 'El token expiro',
            //     //     //     timeout: 3000
            //     //     // });
            //     //     $location.path("/");                        
            //     // }
            // }
        });
  });
