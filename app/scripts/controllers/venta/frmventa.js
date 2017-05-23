'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:VentaFrmventaCtrl
 * @description
 * # VentaFrmventaCtrl
 * Controller of the appApp
 */
angular.module('appApp').controller('VentaFrmventaCtrl', function ($scope, toaster, constantes, Venta, $location, Cliente, Articulo, InputValid, Configuracion, TipoAbonos, blockUIConfig, $uibModal) {
	$scope.titulo = "Registro de Ventas";
	$scope.clientes = [];
	$scope.articulos = [];
	$scope.tiposAbonos = [];
    $scope.abonos = [];
	$scope.datos = [];
	$scope.selectCliente = {};
	$scope.selectArticulo = {};
    $scope.venta = {enganche: 0,bonificacion:0,total:0};
	$scope.busquedas = {loadCliente:false,loadArticulo:false,selectCli:false,selectArticulo:false,selectAbono:"0"};	
    $scope.mostrarAbonos = false;
	var config = {};
    var existencias = [];
    var peticion = false;
	$('#buscarCliente').focus();

    function datosIniciales(){
    	Configuracion.get().$promise.then(function (resp) {
	        config = resp.data[0];
	    }).catch(function () {

	    });
	    TipoAbonos.get().$promise.then(function (resp) {
	        $scope.tiposAbonos = resp.data;
	    }).catch(function () {

	    });
	    blockUIConfig.autoBlock = false;
    }

    datosIniciales();
	/*************************************************
					INICIO CLIENTE
	**************************************************/
	$scope.buscarCliente = function (input) {
        blockUIConfig.autoBlock = false;
        $scope.clientes = [];
        $scope.busquedas.loadCliente = true;
        $scope.busquedas.selectCli = false;
        if (input.$valid) {
            Cliente.autocomplete({filter:$scope.busquedas.clienteNombre}).$promise.then(function (resp) {
            	var cli = resp.data;
            	angular.forEach(cli,function(cliente){
            		var obj = {id:cliente.id, nombreCompleto : cliente.nombre+' '+cliente.apellidoPaterno+' '+cliente.apellidoMaterno,rfc:cliente.rfc};
            		 $scope.clientes.push(obj);
            	});
                $scope.busquedas.loadCliente = false;
            }).catch(function () {
            	$scope.busquedas.loadCliente = false;
            });
        }
    };

	$scope.onSelectCliente = function ($item, $model, $label) {
		$scope.selectCliente = $model;
        $scope.busquedas.clienteNombre = $model.id + ' - ' + $model.nombreCompleto;
        $scope.busquedas.selectCli = true;
    };
    /*************************************************
					FIN CLIENTE
	**************************************************/
	/*************************************************
					INICIO ARTICULO
	**************************************************/
	$scope.buscarArticulo = function (input) {
        blockUIConfig.autoBlock = false;
        $scope.selectArticulo = {}
        $scope.articulos = [];
        $scope.busquedas.loadArticulo = true;
        $scope.busquedas.selectArticulo = false;
        if (input.$valid) {
            Articulo.autocomplete({filter:$scope.busquedas.articuloNombre}).$promise.then(function (resp) {
                $scope.articulos = resp.data;                
            }).catch(function () {            	
            });
            $scope.busquedas.loadArticulo = false;
        }
    };
    $scope.onSelectArticulo = function ($item, $model, $label) {
       $scope.selectArticulo = $model;
       $scope.busquedas.selectArticulo = true;
       $scope.busquedas.loadArticulo = false;
    };

    $scope.agregar = function(){
    	if($scope.busquedas.selectArticulo){
            if(!exitsArt($scope.selectArticulo.id)){
                if(parseInt($scope.selectArticulo.existencia) > 0){
                    $scope.selectArticulo.precio = $scope.selectArticulo.precio * (1 + (parseFloat(config.tasa) * parseInt(config.plazoMaximo)) / 100);
                    $scope.datos.push($scope.selectArticulo);
                    existencias.push({id:$scope.selectArticulo.id,cantidadAnterior:0, cantidadActualizada:0});
                    var nombreInput = 'carritoCantidad' + ($scope.datos.length - 1).toString();
                    $scope.selectArticulo = {};
                    $scope.busquedas.articuloNombre = '';
                    setTimeout(function(){
                        $('#'+nombreInput).focus();
                    },200)
                        
                }else{
                    toaster.pop('warning','El artículo seleccionado no cuenta con existencia, favor de verificar.');
                }
            }else{
                toaster.pop('warning','Ya se encuentra el artículo agregado.');
            }		
    	}else{
    		toaster.pop('warning','Seleccione un articulo que se han mostrado anteriormente.');
    	}
    };

    function exitsArt(id){
        var flag = false;
        angular.forEach($scope.datos, function(dato){
            if(dato.id === id)
                flag = true;
        });
        return flag;
    };

    $scope.cambiarValores = function (formInput, index, name) {
        var nombre = name + index;
        formInput = formInput[nombre];
        var totalCarrito = existencias.length;
        var dato = $scope.datos[index];
        blockUIConfig.autoBlock = true;
        if (formInput.$valid) {            
            var valores = existenciaAnteriores(dato.id);

            if(valores.find){
                existencias[valores.index].cantidadAnterior = parseInt(existencias[valores.index].cantidadActualizada);
                existencias[valores.index].cantidadActualizada = parseInt(dato.cantidad);
                var params = {
                    existenciaAnterior: existencias[valores.index].cantidadAnterior,
                    existenciaActualizada: existencias[valores.index].cantidadActualizada
                };
            }
            Articulo.update({id:dato.id}, params).$promise.then(function (resp) {                
                var data = resp.data;
                $scope.datos[index].importe = parseInt(dato.cantidad) * (Math.round(dato.precio * 100) / 100);
                totales();               
            }).catch(function (resp) {
                existencias[valores.index].cantidadActualizada = 0;
                console.log(resp);
                toaster.pop('error',constantes.error,resp.data.meta.mensaje);
            });
        }
         
    };

    function existenciaAnteriores(id){
        var flag = {find:false};
        for (var i = 0; i < existencias.length; i++) {
            if(existencias[i].id === id)
                flag = {find:true,index:i};
        }
       return flag;
    }

    $scope.mostrarEliminar = function (formInput, index, name) {
        var nombre = name + index;
        formInput = formInput[nombre];
        if (formInput.$valid)
            return true;
        else
            return false;
    }

    $scope.eliminar = function (index) {    
        Articulo.updateExistencia({idArticulo:$scope.datos[index].id,cantidad:$scope.datos[index].cantidad}).$promise.then(function(resp){
            $scope.datos.splice(index, 1);
            totales();
        }).catch(function(resp){

        });
    };
    /*************************************************
					FIN ARTICULO
	**************************************************/

    function totales() {
        $scope.venta.enganche = 0;
        $scope.venta.bonificacion = 0;
        $scope.venta.total = 0;
        angular.forEach($scope.datos, function (dato) {
            var enganche = (parseInt(config.enganche) / 100) * (Math.round(dato.importe * 100) / 100);
            var bonificacion = enganche * ((parseFloat(config.tasa) * parseInt(config.plazoMaximo)) / 100);
            $scope.venta.enganche += enganche;
            $scope.venta.bonificacion += bonificacion;
            $scope.venta.total += dato.importe - enganche - bonificacion;
        });
    };

    $scope.$watch('venta.total', function () {
        $scope.abonos = [];
        var tasa = parseFloat(config.tasa);
        var ventaTotal = (Math.round($scope.venta.total * 100) / 100);
        var plazoMaximo = parseInt(config.plazoMaximo);
        var precioContado = ventaTotal / (1 + (tasa * plazoMaximo) / 100);
        precioContado = (Math.round(precioContado * 100) / 100);

        angular.forEach($scope.tiposAbonos, function (tipo) {
            var obj = {};
            var mes = parseInt(tipo.abonoMeses);
            obj.mes = mes;
            obj.totalPagar = precioContado * (1 + (tasa * mes) / 100);
            obj.abono = obj.totalPagar / mes;
            obj.ahorro = ventaTotal - obj.totalPagar;
            $scope.abonos.push(obj);
        });
    }, true);

    $scope.mostrarAbonos = function () {

       var errors = valid();
       if(errors.length > 0){
        toaster.pop('warning',constantes.error,errors[0].mensaje);
        return;
       }
        $scope.mostrarAbonos = !$scope.mostrarAbonos;
        $('#abonos').collapse("toggle");
    };

    function valid(){
        var error = [];   
        if($scope.busquedas.selectCli === false){
            error.push({mensaje:'Seleccione un cliente.'});
            return error;
        }
        angular.forEach($scope.datos,function(dato,index){
            var nameInput = 'carritoCantidad'+index;
            if(typeof(dato.cantidad) === 'undefined' || dato.cantidad === ""){
                error.push({mensaje:'La cantidad de '+dato.descripcion+' es incorrecto, ingrese por favor una cantidad correcta.'});
            }
        });       
        return error;
    };

    $scope.guardar = function(){
        var errors = valid();
       if(errors.length > 0){
        toaster.pop('warning',constantes.error,errors[0].mensaje);
        return;
       }
        blockUIConfig.autoBlock = true;
        var selectAbono = $scope.abonos[$scope.busquedas.selectAbono];
        var enc = {
            clienteId: $scope.selectCliente.id,
            mesPago: selectAbono.mes,
            abono: selectAbono.abono,
            ahorro: selectAbono.ahorro,
            totalPagar: selectAbono.totalPagar,
            bonificacion: $scope.venta.bonificacion,
            enganche: $scope.venta.enganche,
            total: $scope.venta.total
        };
        Venta.save({enc: enc, det: $scope.datos}).$promise.then(function (resp) {
            toaster.pop('success',constantes.success,resp.meta.mensaje);
            $location.url('/venta');
        }).catch(function (resp) {
            toaster.pop('error',constantes.error,resp.data.meta.mensaje);
        });
    };

    $scope.regresar = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/ventanaregreso.html',
            controller: 'VentanaregresoCtrl'
        });

        modalInstance.result.then(function (resp) {
            if(resp === 200){
                console.log($scope.datos);
                return;
                $location.url('/venta');
            }
        }, function () { 

        });
    };

	$scope.focusInput = function(input){
        $('#'+input).focus();
    };

    $scope.cssIcono = function (formInput) {
        return InputValid.icono(formInput);
    };
    $scope.cssInput = function (formInput) {
        return InputValid.input(formInput);
    };
});
