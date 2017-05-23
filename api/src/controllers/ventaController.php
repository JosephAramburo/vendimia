<?php

/********************************************
                    PAGINACION
Autor : Joseph Aramburo
Descripcion: Obtener la paginacion de la tabla
********************************************/
$app->get('/venta/paginado', function ($request, $response, $args) {
     
     $meta = new stdClass();
    try {
        $params = $request->getQueryParams();
        $limit = isset($params['limit']) ? intVal($params['limit']): 10;
        $page = isset($params['page']) ? $params['page']: 1;        
        $offset = (($page * $limit) - $limit);
        $limit = ($limit * $page);

        if($offset < 0)
            $offset = 0;
  
        $ventaEnc = new VentaEnc();
        $meta->status = 200;        
        $meta->count = $ventaEnc->count();

        $data = $this->db
            ->table('ventaEnc')
            ->select('ventaEnc.id','catCliente.id AS clienteId','catCliente.nombre','catCliente.apellidoPaterno','catCliente.apellidoMaterno', 'ventaEnc.total','ventaEnc.created_at AS fecha','estatus.nombre AS estatus', 'ventaEnc.estatusId')
            ->join('catCliente','catCliente.id','=','ventaEnc.clienteId')
            ->join('estatus','estatus.id','=','catCliente.estatusId')
            ->offset($offset)
            ->limit($limit)
            ->get();

        if(count($data) < 1){
            $meta->mensaje = 'No se encontraron datos.';  
            return $response->withStatus(500)
                        ->withHeader('Content-Type', 'application/json')
                        ->write(json_encode(array('meta' => $meta)));
        }

         return $response->withStatus(200)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode(array('meta' => $meta, 'data' => $data)));
    } catch (Illuminate\Database\QueryException $e) {
        $meta->status = 500;
        $meta->mensaje = $e;
        return $response->withStatus(500)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode(array('meta' => $meta)));
    }

})->add(new middlewareToken());
/********************************************
                    POST
Autor : Joseph Aramburo
Descripcion: Insertar registro
********************************************/
$app->post('/venta', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $params = $request->getParsedBody();
        $this->db->getConnection()->beginTransaction();
        $enc = $params['enc'];
        $det = $params['det'];

        $ventaEnc = new VentaEnc();
        $ventaEnc->clienteId = $enc['clienteId'];
        $ventaEnc->mesPago = $enc['mesPago'];
        $ventaEnc->abono = $enc['abono'];
        $ventaEnc->ahorro = $enc['ahorro'];
        $ventaEnc->totalPagar = $enc['totalPagar'];
        $ventaEnc->bonificacion = $enc['bonificacion'];
        $ventaEnc->enganche = $enc['enganche']; 
        $ventaEnc->total = $enc['total'];   
        $ventaEnc->save();

        $id = $ventaEnc->id;

        if(!isset($ventaEnc->id)){
            $this->db->rollback();
             $meta->status = 500;
             $meta->mensaje = 'Problemas al guardar la Venta.';  
             return $response->withStatus($meta->status)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(array('meta' => $meta)));
        }


        foreach ($det as $key => $detalle) {
            $ventaDet = new VentaDet();
            $ventaDet->ventaEncId = $id;
            $ventaDet->articuloId = $detalle['id'];
            $ventaDet->cantidad = $detalle['cantidad'];
            $ventaDet->precio = $detalle['precio'];
            $ventaDet->save();
            if(!isset($ventaDet->id)){
                $this->db->getConnection()->rollback();
                 $meta->status = 500;
                 $meta->mensaje = 'Problemas al guardar el detalle de la Venta.';  
                 return $response->withStatus($meta->status)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode(array('meta' => $meta)));
            }
        }

        $this->db->getConnection()->commit();

        $data = $ventaEnc->where('id', $id)->first();
        $meta->count = count($data);
        $meta->mensaje = 'Bien Hecho, Tu venta ha sido registrada correctamente.';

        return $response->withStatus(200)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode(array('meta' => $meta,'data' => $data)));
        

    } catch (Illuminate\Database\QueryException $e) {
        $meta->status = 500;
        $meta->mensaje = $e;
        return $response->withStatus(500)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode(array('meta' => $meta)));
    }
})->add(new middlewareToken());