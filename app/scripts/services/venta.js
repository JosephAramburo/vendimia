'use strict';

/**
 * @ngdoc service
 * @name appApp.Venta
 * @description
 * # Venta
 * Service in the appApp.
 */
angular.module('appApp').service('Venta', function ($resource, API) {
    return $resource( API + 'venta/:id', { id:'@id' },{
  		'get': {
  			method:'GET',
  			isArray: false
  		},
  		'save': {
  			url: API + 'venta',
  			method:'POST',
  			isArray: false
  		},
  		'update': {
  			method:'PUT',
  			isArray: false
  		},
  		'query': {
  			method:'GET',
  			isArray: false
  		},
  		'remove': {
  			method:'DELETE',
  			isArray: false
  		},
  		'delete': {
  			method:'DELETE',
  			isArray: false
  		},
      	'paginado': {
	        url: API + 'venta/paginado',
	        method:'GET',
	        isArray: false
      	}
    });
});
