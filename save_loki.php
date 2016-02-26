<?php

require_once 'LokiService.php';

$stringData = isset ( $_POST ['data'] ) ? $_POST ["data"] : null;
$dbname = $_POST ["dbname"];
$changes = isset ( $_POST ['changes'] ) ? $_POST ["changes"] : null;


$lokiService = new LokiService($dbname, $stringData, $changes);

$lokiService->saveLoki();

?>