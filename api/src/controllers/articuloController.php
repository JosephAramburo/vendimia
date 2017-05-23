<?php

/********************************************
                    PAGINACION
Autor : Joseph Aramburo
Descripcion: Obtener la paginacion de la tabla
********************************************/
$app->get('/articulo/paginado', function ($request, $response, $args) {
     
     $meta = new stdClass();
    try {
        $params = $request->getQueryParams();
        $limit = isset($params['limit']) ? intVal($params['limit']): 10;
        $page = isset($params['page']) ? $params['page']: 1;
        //$offset = (--$page) * intVal($limit);
        $offset = (($page * $limit) - $limit);
        $limit = ($limit * $page);

        if($offset < 0)
            $offset = 0;
  
        $art = new CatArticulo();
        $meta->status = 200;        
        $meta->count = $art->count();
        
        // $data = $art
        //         ->join('estatus', 'estatus.id', '=', 'estatus')
        //         ->select('*')
        //         ->skip($offset)
        //         ->limit($limit)
        //         ->get();

        $data = $this->db
            ->table('catArticulo')
            ->select('catArticulo.*', 'estatus.nombre AS estatus')
            ->join('estatus','estatus.id','=','catArticulo.estatusId')
            ->offset($offset)
            ->limit($limit)
            ->get();

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
Descripcion: Obtener autocomplete de los registros de las tabla
********************************************/
$app->get('/articulo/autocomplete', function ($request, $response, $args) {
     
    $meta = new stdClass();
    $meta->status = 200;
    try {
        $params = $request->getQueryParams();
        $filter = isset($params['filter']) ? '%' .$params['filter'].'%' : '';

        $art = new CatArticulo();       
        $data = $art
                ->whereRaw('descripcion like ? AND estatusId = 1', array($filter))
                ->limit(10)
                ->orderBy('descripcion')
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
$app->get('/articulo', function ($request, $response, $args) {
	 
     $meta = new stdClass();
    try {
        $art = new CatArticulo();
        $data = $art->all();

        $meta->status = 200;       
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
                GET POR ID
Autor : Joseph Aramburo
Descripcion: Obtener un registro por ID
********************************************/
$app->get('/articulo/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
	try {
        $id = $request->getAttribute('id');
        $art = new CatArticulo();
        $data = $art->where('id', $id)->first();
       
        $meta->status = 200;       
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
                    DELETE
Autor : Joseph Aramburo
Descripcion: Borrar registro (cambiar de estatus)
********************************************/
$app->delete('/articulo/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $id = $request->getAttribute('id');
        $art = new CatArticulo();       
        $affectedRows = 
                        $art
                        ->where('id', $id)
                        ->update(array(
                            'estatusId' => 3, 
                            'fechaEliminado' => date('Y-m-d H:i:s'))
                        );

        if($affectedRows > 0){
            $meta->mensaje = 'Articulo Inactivado Correctamente.';   
        }

        $data = $art->where('id', $id)->first();
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
$app->post('/articulo', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $params = $request->getParsedBody();


        if(!existArt($params['descripcion'], $this->db)){
            $art = new CatArticulo();
            $art->descripcion = $params['descripcion'];
            $art->modelo = isset($params['modelo']) ? $params['modelo'] : '';
            $art->precio = $params['precio'];
            $art->existencia = $params['existencia'];
            $art->save();

            $id = $art->id;

            $data = $art->where('id', $id)->first();
            $meta->count = count($data);
            $meta->mensaje = 'Bien Hecho. El Articulo ha sido registrado correctamente.'; 
             return $response->withStatus(200)
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
/********************************************
                    PUT
Autor : Joseph Aramburo
Descripcion: Actualizar registro
********************************************/
$app->put('/articulo/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $id = $request->getAttribute('id');
        $params = $request->getParsedBody();
         $art = new CatArticulo();
         //ACTUALIZAR EXISTENCIA DEL ARTICULO
        if(isset($params['existenciaActualizada'])){
            $data = $art->where('id', $id)->first();
            $existenciaAnterior = intval($data['existencia']) + intval($params['existenciaAnterior']);
            if($existenciaAnterior >= $params['existenciaActualizada']){
               
                $existenciaActualizada = $existenciaAnterior - intval($params['existenciaActualizada']);
         
               $affectedRows = $art->where('id', $id)->update(array('existencia' => $existenciaActualizada));
                if($affectedRows > 0){
                    $meta->mensaje = 'Bien Hecho. La existencia del articulo ha sido actualizado correctamente.'; 
                    $meta->status = 200;  
                    $data = $art->where('id', $id)->first();
                    $meta->count = count($data);

                     return $response->withStatus($meta->status)
                        ->withHeader('Content-Type', 'application/json')
                        ->write(json_encode(array('meta' => $meta, 'data' => $data)));  
                }else{
                    $meta->mensaje = 'Problemas al Actualizar el Articulo.';
                    $meta->status = 500;  
                    return $response->withStatus($meta->status)
                        ->withHeader('Content-Type', 'application/json')
                        ->write(json_encode(array('meta' => $meta)));
                } 
                
            }else{
                $meta->status = 500;
                $meta->mensaje = 'El artículo seleccionado no cuenta con existencia suficiente, favor de verificar. La existencia actual es de '.$existenciaAnterior;

                $affectedRows = $art->where('id', $id)->update(array('existencia' => $existenciaAnterior));
            
                return $response->withStatus(500)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode(array('meta' => $meta)));
            }

        }else{//ACTUALIZACION DE ARTICULO EN CATALAGO
            if(!existArt($params['descripcion'], $this->db, $id)){               
                $affectedRows = $art->where('id', $id)->update($params);

                if($affectedRows > 0){
                    $meta->mensaje = 'Bien Hecho. El Articulo ha sido registrado correctamente.';   
                }else{
                    $meta->mensaje = 'Problemas al Actualizar el Articulo.';
                    $meta->status = 500;  
                }

                $data = $art->where('id', $id)->first();
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
        PUT ACTUALIZAR LA EXISTENCIA POR ID
Autor : Joseph Aramburo
Descripcion: Actualizar registro
********************************************/
$app->put('/articulo/updateExistencia/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $id = $request->getAttribute('id');
        $params = $request->getParsedBody();
         $art = new CatArticulo();
         //ACTUALIZAR EXISTENCIA DEL ARTICULO
        $data = $art->where('id', $id)->first();
        $existencia = intval($data['existencia']) + intval($params['cantidad']);                
        $affectedRows = $art->where('id', $id)->update(array('existencia' => $existencia));
        if($affectedRows > 0){
            $meta->mensaje = 'Bien Hecho. La existencia del articulo ha sido actualizado correctamente.'; 
            $meta->status = 200;  
            $data = $art->where('id', $id)->first();
            $meta->count = count($data);

             return $response->withStatus($meta->status)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(array('meta' => $meta, 'data' => $data)));  
        }else{
            $meta->mensaje = 'Problemas al Actualizar el Articulo.';
            $meta->status = 500;  
            return $response->withStatus($meta->status)
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


function existArt($descripcion, $db, $id = 0){

    $data = $db
            ->table('catArticulo')
            ->where('id','<>', $id)
            ->where('descripcion','=', $descripcion)
            ->count();

    if(intval($data) > 0){
        return TRUE;
    }else{
        return FALSE;
    }

}