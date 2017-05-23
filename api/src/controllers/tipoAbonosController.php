<?php
/********************************************
                    GET
Autor : Joseph Aramburo
Descripcion: Obtener todos los registros de la tabla
********************************************/
$app->get('/tipoAbonos', function ($request, $response, $args) {
	 
     $meta = new stdClass();
    try {
        $tipAbn = new TipoAbonos();
        $data = $tipAbn->all();

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