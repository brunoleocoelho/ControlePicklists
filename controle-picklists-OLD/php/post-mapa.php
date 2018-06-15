<?php
    include 'MapaDB.php';
    include 'db-connect.php';

    $data = json_decode(file_get_contents("php://input"));
    // var_dump($data);

    $pkl = $data->picklist != null ? $data->picklist : null;
    $dthr = $data->datahora != null ? $data->datahora : null;
    $stk = $data->idestoque != null ? $data->idestoque  : null;

    $conn = new MapaDB($serverName, $db, $user, $pw);

    $conn->postarMapa($pkl, $dthr, $stk);

?>