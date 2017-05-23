<?php
/***************** GET ALL*********************/
$app->get('/usuario', function ($request, $response, $args) {
	 
     $meta = new stdClass();
    try {
        $usuario = new TableModel($this->db,'usuario');
        $data = $usuario->get();

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
/***************** GET ID*********************/
$app->get('/usuario/{id}', function ($request, $response, $args) {
    $meta = new stdClass();
	try {
        $id = $request->getAttribute('id');
        $usuario = new TableModel($this->db,'usuario');
        $data = $usuario->get($id);

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
/***************** LOGIN *********************/
$app->post('/usuario/login', function ($request, $response, $args) {
     
     $meta = new stdClass();
    try {
        $params = $request->getParsedBody();
        // $usuario = new TableModel($this->db,'usuario');
        // $data = $usuario->get();;
        $params['estatusId'] = 1;
        $params['password'] = sha1($params['password']);
        $usuario = $this->db->table('usuario')->where($params)->first();

        $meta->status = 200; 

        if(!$usuario){
            $meta->status = 500;
            $meta->mensaje = 'Usuario no encontrado, verifique su correo o password.';
            return $response->withStatus($meta->status)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(array('meta' => $meta)));
        }else{
            $config = require __DIR__ . '/../config/settingsApp.php';
            $jwt = new JWT();
            $token = $jwt->encode(array(
                'id' => $usuario->id,
                'issuedAt' => date(DATE_ISO8601, strtotime("now")),
                'nombre' => $usuario->nombre.' '.$usuario->apellidoPaterno.' '.$usuario->apellidoMaterno,
                'salon' => TRUE,
                'uri' => $request->getUri(),
                'iat' => time(),
                'exp' => time() + $config['token']['tiempo'],
                'ttl' => 86400
            ),  $config['token']['key']);

            $std = new stdClass();
            $std->nombre = $usuario->nombre.' '.$usuario->apellidoPaterno.' '.$usuario->apellidoMaterno;
            $std->id = $usuario->id;
            $std->token = $token;
            $std->isAdmin = $usuario->isAdmin;
             return $response->withStatus(200)
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode(array('meta' => $meta, 'data' => $std)));
        }

        
    } catch (Illuminate\Database\QueryException $e) {
        $meta->status = 500;
        $meta->mensaje = $e;
        return $response->withStatus(500)
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode(array('meta' => $meta)));
    }

});
