'use strict';

/**
 * @ngdoc service
 * @name appApp.Articulo
 * @description
 * # Articulo
 * Service in the appApp.
 */
angular.module('appApp').service('Articulo', function ($resource, API) {
	return $resource( API + 'articulo/:id', { id:'@id' },{
  		'get': {
  			method:'GET',
  			isArray: false
  		},
  		'save': {
  			url: API + 'articulo',
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
        url: API + 'articulo/paginado',
        method:'GET',
        isArray: false
      },
      'autocomplete': {
        url: API + 'articulo/autocomplete',
        method:'GET',
        isArray: false
      },
      'updateExistencia': {
        url: API + 'articulo/updateExistencia/:idArticulo',
        method:'PUT',
        params:{
           idArticulo:'@idArticulo', 
        },
        isArray: false
      }
    });
});
