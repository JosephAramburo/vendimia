<?php

/********************************************
                    PAGINACION
Autor : Joseph Aramburo
Descripcion: Obtener la paginacion de la tabla
********************************************/
$app->get('/cliente/paginado', function ($request, $response, $args) {
     
     $meta = new stdClass();
    try {
        $params = $request->getQueryParams();
        $limit = isset($params['limit']) ? intVal($params['limit']): 10;
        $page = isset($params['page']) ? $params['page']: 1;        
        $offset = (($page * $limit) - $limit);
        $limit = ($limit * $page);

        if($offset < 0)
            $offset = 0;
  
        $cli = new CatCliente();
        $meta->status = 200;        
        $meta->count = $cli->count();

        $data = $this->db
            ->table('catCliente')
            ->select('catCliente.*', 'estatus.nombre AS estatus')
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
                AUTOCOMPLETE
Autor : Joseph Aramburo
Descripcion: Obtener autocomplete de los registros de las tablas
********************************************/
$app->get('/cliente/autocomplete', function ($request, $response, $args) {
     
    $meta = new stdClass();
    $meta->status = 200;
    try {
        $params = $request->getQueryParams();
        $filter = isset($params['filter']) ? '%' .$params['filter'].'%' : '';

        $cli = new CatCliente();       
        $data = $cli
                ->whereRaw('CONCAT(nombre," ",apellidoPaterno," ",apellidoMaterno) like ? AND estatusId = 1', array($filter))
                ->select('id','nombre','apellidoPaterno','apellidoMaterno','rfc')
                ->limit(10)
                ->orderBy('nombre')
                ->orderBy('apellidoPaterno')
                ->get();
         $meta->count = count($data);                
         
        return $response->withStatus($meta->status)
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
/********************************************
                    GET
Autor : Joseph Aramburo
Descripcion: Obtener todos los registros de la tabla
********************************************/
$app->get('/cliente', function ($request, $response, $args) {
	 
     $meta = new stdClass();
    try {
        $art = new CatCliente();
        $data = $art->all();

        $meta->status = 200;       
        $meta->count = count($data);


        if(count($meta->count) < 1){
            $meta->mensaje = 'No se encontraron datos.';  
            $meta->status = 500;   
        }

         return $response->withStatus($meta->status)
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
                GET POR ID
Autor : Joseph Aramburo
Descripcion: Obtener un registro por ID
********************************************/
$app->get('/cliente/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
	try {
        $id = $request->getAttribute('id');
        $art = new CatCliente();
        $data = $art->where('id', $id)->first();
       
        $meta->status = 200;       
        $meta->count = count($data);

        if(count($data) < 1){
            $meta->mensaje = 'No se encontraron datos.';  
            $meta->status = 500;   
        }

         return $response->withStatus($meta->status)
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
                    DELETE
Autor : Joseph Aramburo
Descripcion: Borrar registro (cambiar de estatus)
********************************************/
$app->delete('/cliente/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $id = $request->getAttribute('id');
        $cli = new CatCliente();       
        $affectedRows = 
                        $cli
                        ->where('id', $id)
                        ->update(array(
                            'estatusId' => 3));

        if($affectedRows > 0){
            $meta->mensaje = 'Bien Hecho. El cliente ha sido inactivado correctamente.';   
        }

        $data = $cli->where('id', $id)->first();
        $meta->count = count($data);


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
$app->post('/cliente', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $params = $request->getParsedBody();


        if(!existCli($params['rfc'], $this->db)){
            $cli = new CatCliente();
            $cli->nombre = isset($params['nombre']) ? $params['nombre'] : '';
            $cli->apellidoPaterno = isset($params['apellidoPaterno']) ? $params['apellidoPaterno'] : '';
            $cli->apellidoMaterno = isset($params['apellidoMaterno']) ? $params['apellidoMaterno'] : '';
            $cli->rfc = isset($params['rfc']) ? $params['rfc'] : '';
            $cli->save();

            $id = $cli->id;

            $data = $cli->where('id', $id)->first();
            $meta->count = count($data);
            $meta->mensaje = 'Bien Hecho. El cliente ha sido registrado correctamente.'; 
             return $response->withStatus(200)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode(array('meta' => $meta, 'data' => $data)));
        }else{
            $meta->status = 500;
            $meta->mensaje = 'Ya se encuentra registrado un cliente con esa mismo RFC.';
            return $response->withStatus(500)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(array('meta' => $meta)));
        }

    } catch (Illuminate\Database\QueryException $e) {
        $meta->status = 500;
        $meta->mensaje = $e;
        return $response->withStatus(500)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode(array('meta' => $meta)));
    }
})->add(new middlewareToken());
/********************************************
                    PUT
Autor : Joseph Aramburo
Descripcion: Actualizar registro
********************************************/
$app->put('/cliente/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $id = $request->getAttribute('id');
        $params = $request->getParsedBody();

        if(!existCli($params['rfc'], $this->db, $id)){
            $cli = new CatCliente();
            $affectedRows = $cli
                            ->where('id', $id)
                            ->update(array(
                                'nombre' => $params['nombre'],
                                'apellidoPaterno' => $params['apellidoPaterno'],
                                'apellidoMaterno' => $params['apellidoMaterno'],
                                'rfc' => $params['rfc']
                            ));

            if($affectedRows > 0){
                $meta->mensaje = 'Bien Hecho. El cliente ha sido registrado correctamente.';   
            }else{
                 $meta->mensaje = 'Problemas al Actualizar el cliente.';
                  $meta->status = 500;  
            }

            $data = $cli->where('id', $id)->first();
            $meta->count = count($data);

             return $response->withStatus($meta->status)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(array('meta' => $meta, 'data' => $data)));
        }else{
            $meta->status = 500;
            $meta->mensaje = 'Ya se encuentra registrado un articulo con esa misma descripción.';
            return $response->withStatus(500)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(array('meta' => $meta)));
        }

    } catch (Illuminate\Database\QueryException $e) {
        $meta->status = 500;
        $meta->mensaje = $e;
        return $response->withStatus(500)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode(array('meta' => $meta)));
    }
})->add(new middlewareToken());

function existCli($rfc, $db, $id = 0){

    $data = $db
            ->table('catCliente')
            ->where('id','<>', $id)
            ->where('rfc','=', $rfc)
            ->count();

    if(intval($data) > 0){
        return TRUE;
    }else{
        return FALSE;
    }

}