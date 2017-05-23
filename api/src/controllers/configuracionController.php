<?php
/********************************************
                    GET
Autor : Joseph Aramburo
Descripcion: Obtener todos los registros de la tabla
********************************************/
$app->get('/configuracion', function ($request, $response, $args) {
	 
     $meta = new stdClass();
    try {
        $conf = new CatConfiguraciones();
        $data = $conf->all();

        $meta->status = 200;       
        $meta->count = count($data);

        if( count($data) == 0){
             $meta->status = 500; 
             $meta->mensaje = 'No se encontraron registros.'; 
            return $response->withStatus($meta->status)
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
                    GET ID
Autor : Joseph Aramburo
Descripcion: Obtener registro por ID
********************************************/
$app->get('/configuracion/{id}', function ($request, $response, $args) {
     
     $meta = new stdClass();
    try {
        $id = $request->getAttribute('id');
        $conf = new CatConfiguraciones();
        $data = $conf->where('id', $id)->first();

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
                    POST
Autor : Joseph Aramburo
Descripcion: Insertar registro
********************************************/
$app->post('/configuracion', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $params = $request->getParsedBody();
        $conf = new CatConfiguraciones();
        $conf->tasa = isset($params['tasa']) ? $params['tasa'] : '';
        $conf->enganche = isset($params['enganche']) ? $params['enganche'] : '';
        $conf->plazoMaximo = isset($params['plazoMaximo']) ? $params['plazoMaximo'] : '';
        $conf->save();

        $id = $conf->id;

        $data = $conf->where('id', $id)->first();
        $meta->count = count($data);
        $meta->mensaje = 'Bien Hecho. La configuración ha sido registrada.'; 

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
                    PUT
Autor : Joseph Aramburo
Descripcion: Actualizar registro
********************************************/
$app->put('/configuracion/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
    $meta->status = 200;  
    try {
        $id = $request->getAttribute('id');
        $params = $request->getParsedBody();

        $conf = new CatConfiguraciones();
        $affectedRows = $conf
                        ->where('id', $id)
                        ->update(array(
                            'tasa' => $params['tasa'],
                            'enganche' => $params['enganche'],
                            'plazoMaximo' => $params['plazoMaximo']
                        ));
        if($affectedRows > 0){
            $meta->mensaje = 'Bien Hecho. La configuración ha sido registrada.';   
            $data = $conf->where('id', $id)->first();
            $meta->count = count($data);
        }else{
             $meta->mensaje = 'Problemas al Actualizar la Configuraciones Generales.'; 
             $meta->status = 500;  
             $data = array();
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

function existConf($db){

    $data = $db
            ->table('catConfiguraciones')
            ->count();

    if(intval($data) > 0){
        return TRUE;
    }else{
        return FALSE;
    }

}