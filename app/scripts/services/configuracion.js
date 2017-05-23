'use strict';

/**
 * @ngdoc service
 * @name appApp.Configuracion
 * @description
 * # Configuracion
 * Service in the appApp.
 */
angular.module('appApp').service('Configuracion', function ($resource, API) {
    return $resource( API + 'configuracion/:id', { id:'@id' },{
  		'get': {
  			method:'GET',
  			isArray: false
  		},
  		'save': {
  			url: API + 'configuracion',
  			method:'POST',
  			isArray: false  		
      },
      'update': {
        method:'PUT',
        isArray: false
      }
    });
});
