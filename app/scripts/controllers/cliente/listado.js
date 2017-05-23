'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ClienteListadoCtrl
 * @description
 * # ClienteListadoCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('ClienteListadoCtrl', function ($scope, Cliente, $uibModal) {
	$scope.titulo = 'Clientes Registrados';
	$scope.datos = [];
    $scope.query = {limit:'10'};  
    $scope.currentPage = 1;

	$scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        //console.log('Page changed to: ' + $scope.currentPage);
    };

     $scope.$watch('currentPage', function() {
         $scope.search();   
    });

    $scope.search = function(){        
        $scope.query.page = $scope.currentPage;
        Cliente.paginado($scope.query).$promise.then(function (resp) {
            $scope.totalItems = resp.meta.count;
            $scope.datos = resp.data;
        }).catch(function(){
        	
        });
    };    
   
    $scope.eliminar = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/eliminar.html',
            controller: 'ClienteEliminarCtrl',
            resolve: {
                id: function () {
                    return id;
                }
            }
        });

        modalInstance.result.then(function (resp) {
            if(resp === 200)
                $scope.search();
        }, function () {    
        });
    };
});
