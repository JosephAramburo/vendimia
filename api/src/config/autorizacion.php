<?php 
require __DIR__ . '/../library/JWT/JWT.php';

class autorizacion{
	
	public function token($request){
		$meta = new stdClass();
		$meta->status = 500;
		$meta->mensaje = 'Token no encontrado';
		if(isset($request->getHeader('authorization')[0])){
			$token = $request->getHeader('authorization')[0];
			$token = explode(" ", $token);
			$token = $token[1];
			$settingsToken = require __DIR__ . '/settingsApp.php';
			
			if($token != null){ 
				$meta->status = 200;
				$meta->mensaje = 'correcto';
				$jwt = new JWT();       
	        	$decodeToken = $jwt->decode($token,$settingsToken['token']['key']);
			}
		}

		return $meta;
	}
}
