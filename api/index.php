<?php
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
//use \Illuminate\Database\Query\Builder;


require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/src/config/autorizacion.php';

date_default_timezone_set('America/Mazatlan');

// Instantiate the app
$settings = require __DIR__ . '/src/settings.php';
$app = new \Slim\App($settings);

// Set up dependencies
require __DIR__ . '/src/dependencies.php';

// Register middleware
require __DIR__ . '/src/middleware.php';

$container = new \Illuminate\Container\Container;
$connFactory = new \Illuminate\Database\Connectors\ConnectionFactory($container);
$conn = $connFactory->make($settings['settings']['db']);
$resolver = new \Illuminate\Database\ConnectionResolver();
$resolver->addConnection('default', $conn);
$resolver->setDefaultConnection('default');
\Illuminate\Database\Eloquent\Model::setConnectionResolver($resolver);


/************************ INCLUDE ALL MODELS *********************************/
$sFolder = __DIR__ .'/src/models';
$oIterator = new DirectoryIterator($sFolder);
foreach ($oIterator as $oFileInfo) {
    if ($oFileInfo->isFile()) {
        include $sFolder . '/' . $oFileInfo->getFilename();
    }
}
/************************ REQUIRE ALL CONTROLLERS *********************************/
$sFolder = __DIR__ .'/src/controllers';
$oIterator = new DirectoryIterator($sFolder);
foreach ($oIterator as $oFileInfo) {
    if ($oFileInfo->isFile()) {
        require $sFolder . '/' . $oFileInfo->getFilename();
    }
}

require __DIR__ . '/src/routes.php';



// Run app
$app->run();
