<?php
    include 'db-connect.php';

    //verificando atributos passados com GET
    //EXEMPLO: http://localhost/controle-picklists/php/getdata.php?pkl=465567&dateFrom=2018-01-01&dateTo=2018-01-23
    $pkl = isset( $_GET['pkl'] ) ? intval( $_GET['pkl'] ) : null ;
    $dtFrom = isset( $_GET['dateFrom']) ? $_GET['dateFrom'] : null;
    $dtTo = isset( $_GET['dateTo']) ? $_GET['dateTo'] : null;

    $q = 'select id_registro, nome_estoque, num_picklist, data_hora from saida_picklist, estoque where saida_picklist.id_estoque = estoque.id_estoque';

    if ($pkl) { $q .= " and num_picklist = '$pkl'";  }

    if ($dtFrom && $dtTo){ $q .= " and data_hora between '$dtFrom 00:00:00' and '$dtTo 23:59:59'"; }
    elseif($dtFrom){ $q .= " and data_hora between '$dtFrom 00:00:00' and '$dtFrom 23:59:59'"; }
    // var_dump($q);    //test line

    $arr_res = array();
    $res = $conn->query($q);

    foreach ($res as $key => $item) {
        array_push( $arr_res, $item);
    }

    // var_dump($arr_res);  //test line
    echo json_encode($arr_res);


?>