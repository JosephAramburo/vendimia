<?php
// Application middleware

// e.g: $app->add(new \Slim\Csrf\Guard);

class middlewareToken
{
    /**
     * Example middleware invokable class
     *
     * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
     * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
     * @param  callable                                 $next     Next middleware
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function __invoke($request, $response, $next)
    {
        $aut = new autorizacion();
	    $aut =  $aut->token($request);
	    if($aut->status != 200){
	        return $response->withStatus($aut->status)
	            ->withHeader('Content-Type', 'application/json')
	            ->write(json_encode(array('mensaje' => $aut->mensaje)));
	    }else{
	        $response = $next($request, $response);
	    }
	     return $response;
    }
}
