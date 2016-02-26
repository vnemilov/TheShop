<?php
require_once 'LokiService.php';

$dbname = $_GET["dbname"];

$lokiService = new LokiService($dbname);

$stringData = $lokiService->loadLoki();
if ($stringData != null) {
  echo $stringData;
} else {
  echo "";
}

?>


