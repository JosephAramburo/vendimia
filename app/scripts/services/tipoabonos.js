'use strict';

/**
 * @ngdoc service
 * @name appApp.TipoAbonos
 * @description
 * # TipoAbonos
 * Service in the appApp.
 */
angular.module('appApp').service('TipoAbonos', function ($resource, API) {
    return $resource( API + 'tipoAbonos/:id', { id:'@id' },{
  		'get': {
  			method:'GET',
  			isArray: false
  		}
    });
});
