<?php
// "pkl="+ reg.picklist +
// "datahora="+ reg.datahora +
// "estoque="+ reg.estoque


$pkl = isset( $_POST['pkl']) ? $_POST['pkl'] : null;
$dthr = isset( $_POST['datahora']) ? $_POST['datahora'] : null;
$stk = isset( $_POST['estoque']) ? $_POST['estoque'] : null;


var_dump($pkl);
var_dump($dthr);
var_dump($stk);
// exit();

?>