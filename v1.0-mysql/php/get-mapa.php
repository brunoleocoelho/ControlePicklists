<?php
    include 'MapaDB.php';
    include 'db-connect.php';

    //ATRIBUTOS ESPERADO DO GET: picklist, dataFrom, dataTo
    //verificando atributos passados com GET
    //EXEMPLO: http://localhost/controle-picklists/php/get-mapa.php?picklist=463899&dateFrom=2018-01-01&dateTo=2018-01-23
    $picklist = isset( $_GET['picklist'] ) ? intval( $_GET['picklist'] ) : null ;
    $dateFrom = isset( $_GET['dateFrom']) ? $_GET['dateFrom'] : null;
    $dateTo = isset( $_GET['dateTo']) ? $_GET['dateTo'] : null;

    $conn = new MapaDB($serverName, $db, $user, $pw);

    return $conn->getMapa($picklist, $dateFrom, $dateTo);

?>