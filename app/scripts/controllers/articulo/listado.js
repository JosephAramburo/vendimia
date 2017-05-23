'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:ArticuloListadoCtrl
 * @description
 * # ArticuloListadoCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('ArticuloListadoCtrl', function ($scope, Articulo, $uibModal) {
	$scope.titulo = 'Articulos Registrados';
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
        Articulo.paginado($scope.query).$promise.then(function (resp) {
            $scope.totalItems = resp.meta.count;
            $scope.datos = resp.data;
        });
    };    
   
    $scope.eliminar = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/eliminar.html',
            controller: 'ArticuloEliminarCtrl',
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
