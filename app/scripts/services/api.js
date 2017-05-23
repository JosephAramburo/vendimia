'use strict';

/**
 * @ngdoc service
 * @name appApp.api
 * @description http://localhost/apiVendimia2017/
 * # api
 * Constant in the appApp.
 */
angular.module('appApp')
  .constant('API', 'http://localhost/apiVendimia2017/')
  .constant('constantes',  {
    "limits": ['10','20','30'],
    "nombre" : "Vendimia 2017",
    "success" : "Éxito",
    "error" : "Ocurrio un problema"
  });
