<?php

class DBService {

  public $servername = "localhost";

  public $username = "yourusername";

  public $password = "passwordgoeshere";

  public $dbname = "felt";

  public function __construct() {
    $arr = parse_ini_file("db.ini");
    $this->servername = $arr["servername"];
    $this->dbname = $arr["dbname"];
    $this->username = $arr["username"];
    $this->password = $arr["password"];
  }
  
  // Create connection
  public function createConnection() {
    return new mysqli($this->servername, $this->username, $this->password, $this->db);
  }

  public function createPDOConnection() {
    $conn = new PDO('mysql:host=' . $this->servername . ';dbname=' . $this->dbname . ';charset=UTF8', $this->username, 
      $this->password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
  }
}

?>