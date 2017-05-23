'use strict';

/**
 * @ngdoc service
 * @name appApp.Usuario
 * @description
 * # Usuario
 * Service in the appApp.
 */
angular.module('appApp').service('Usuario', function ($resource, API) {
    return $resource( API + 'usuario/:id', { id:'@id' },{
  		'get': {
  			method:'GET',
  			isArray: false
  		},
  		'save': {
  			url: API + 'usuario',
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
  		'authentication':{
  			url: API + 'usuario/login',
  			method:'POST',
  			isArray: false
  		},
      'permissionsUpdate':{
        url: API + 'usuario/permisosUpdate',
        method:'POST',
        isArray: false
      },
      'getPermissions':{
        url: API + 'usuario/:idUsuario/permisos',
        method:'GET',
        params:{
           idUsuario:'@idUsuario', 
        },
        isArray: false
      }
  	});
  });
