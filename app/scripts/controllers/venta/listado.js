'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:VentaListadoCtrl
 * @description
 * # VentaListadoCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('VentaListadoCtrl', function ($scope, Venta, $uibModal, $filter) {
	$scope.titulo = 'Ventas Activas';
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
        Venta.paginado($scope.query).$promise.then(function (resp) {
            $scope.totalItems = resp.meta.count;

            angular.forEach(resp.data, function(data, index){
                resp.data[index].fecha = $filter('date')(new Date( resp.data[index].fecha),'dd/MM/yyyy'); 
            });
            $scope.datos = resp.data;
        }).catch(function(){
        	
        });
    };    
   
    $scope.eliminar = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/eliminar.html',
            controller: 'VentaEliminarCtrl',
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
