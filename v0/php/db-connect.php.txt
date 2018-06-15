<?php
// CONEXÃO COM BANCO DE DADOS MYSQL
  $host = 'localhost';
  $user = 'root';
  $pass = 'abcd1234';
  $db = 'controle_picklists';

  $conn = mysqli_connect($host, $user, $pass, $db);
  
  if(! $conn ) {
     die('Could not connect: ' . mysqli_error());
  }

?>