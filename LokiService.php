<?php
require_once 'DBService.php';

class LokiService {

  private $lokiName;

  private $stringData;

  private $changes;

  public function __construct($lokiName, $stringData = null, $changes = null) {
    $this->lokiName = $lokiName;
    $this->stringData = $stringData;
    $this->changes = $changes;
  }

  public function getLokiAsString() {
    $result = $this->stringData;
    if ($this->changes != null) {
      $this->stringData = $this->loadLoki();
      $result = applyChanges();
    }
    return $result;
  }

  private function applyChanges() {
    if ($this->stringData != null) {
      $lokiAsObj = json_decode($this->stringData);
      $collections = $lokiAsObj->collections;
      $changesObj = json_decode($this->changes);
      $this->updateCollections($lokiAsObj, $collections, $changesObj);
      
      return json_encode($lokiAsObj);
    }
    return null;
  }

  public function saveLoki($str = null) {
    $str = $str == null ? $this->getLokiAsString() : $str;
    if ($str != null) {
      $db = new DBService();
      $conn = $db->createPDOConnection();
      
      $sql = $sql = "SELECT name FROM lokidbs WHERE name=?";
      $query = $conn->prepare($sql);
      $query->execute(array($this->lokiName));
      
      if ($query->rowCount() > 0) {
        // update
        $sql = "UPDATE lokidbs SET data = ? WHERE name = ?";
        $query = $conn->prepare($sql);
        $query->execute(array($str,$this->lokiName));
      } else {
        // insert
        $sql = "INSERT INTO lokidbs (data, name) VALUES (?, ?)";
        $query = $conn->prepare($sql);
        $query->execute(array($str,$this->lokiName));
      }
    }
  }

  public function loadLoki() {
    $db = new DBService();
    $conn = $db->createPDOConnection();
    
    $sql = "SELECT data FROM lokidbs where name = ?";
    $query = $conn->prepare($sql);
    $query->execute(array($this->lokiName));
    
    if ($query->rowCount() > 0) {
      $row = $query->fetch(PDO::FETCH_ASSOC);
      $str = $row["data"];
      return $str;
    } else {
      return null;
    }
  }

  private function findCollection($arr, $name) {
    foreach ($arr as $coll) {
      if ($coll->name == $name) {
        return $coll;
      }
    }
    return null;
  }

  private function updateDocument(&$data, $obj) {
    for ($i = 0; $i < count($data); $i ++) {
      $docLokiId = $data[$i]->{'$loki'};
      $objLokiId = $obj->{'$loki'};
      if ($docLokiId == $objLokiId) {
        $data[$i] = $obj;
        return;
      }
    }
  }

  private function removeDocument(&$data, $objLokiId) {
    for ($i = 0; $i < count($data); $i ++) {
      $docLokiId = $data[$i]->{'$loki'};
      if ($docLokiId == $objLokiId) {
        array_splice($data, $i, 1);
        return;
      }
    }
  }

  private function updateCollections(&$db, &$collections, $changes) {
    foreach ($changes as $change) {
      echo "<br>";
      $coll = $this->findCollection($collections, $change->name);
      if ($coll != null) {
        
        if ($change->operation == "I") {
          array_push($coll->data, $change->obj);
          $lokiId = $change->obj->{'$loki'};
          $coll->maxId = $lokiId;
          array_push($coll->idIndex, $lokiId);
        } elseif ($change->operation == "U") {
          $lokiId = $change->obj->{'$loki'};
          
          $this->updateDocument($coll->data, $change->obj);
        } elseif ($change->operation == "R") {
          $lokiId = $change->obj;
          $this->removeDocument($coll->data, $lokiId);
          
          for ($i = 0; $i < count($coll->idIndex); $i ++) {
            if ($coll->idIndex[$i] == $lokiId) {
              array_splice($coll->idIndex, $i, 1);
              break;
            }
          }
        }
      }
    }
  }
}


