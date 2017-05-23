'use strict';

/**
 * @ngdoc service
 * @name appApp.cliente
 * @description
 * # cliente
 * Service in the appApp.
 */
angular.module('appApp').service('Cliente', function ($resource, API) {
    return $resource( API + 'cliente/:id', { id:'@id' },{
  		'get': {
  			method:'GET',
  			isArray: false
  		},
  		'save': {
  			url: API + 'cliente',
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
	        url: API + 'cliente/paginado',
	        method:'GET',
	        isArray: false
	    },
      'autocomplete': {
        url: API + 'cliente/autocomplete',
        method:'GET',
        isArray: false
      }
    });
});
