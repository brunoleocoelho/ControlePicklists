<?php

    class MapaDB extends PDO
    {
        //METODO CONSTRUTOR 
        function __construct($servidor, $banco, $usuario, $senha) {
            try{
                parent::__construct("sqlsrv:Server=$servidor;Database=$banco", $usuario, $senha);
            }
            catch (Exception $e){
                die( print_r( $e->getMessage() ) );
            }            
            // Opção de uso com sqlsrv_connect() em modo procedural e não orientado a objeto
            // $connectionInfo = array("Database" => $banco, "UID" => $usuario, "PWD" => $senha); // "UID" => $user, "PWD" => $pw
            // $conn = sqlsrv_connect( $servidor, $connectionInfo);
        }

        //METODOS DA CLASSE
        /**
         * Retorna os picklists entre determinadas datas inicial e final. Parametro nulo é ignorado na formação da query
         * <params>$pkl: numero do picklist
         * <params>$dtFrom: data inicial
         * <params>$dtTo: data final
         * 
         * QUERY SELECIONAR REGISTROS DO BD
         * select id_registro, nome_estoque, num_picklist, data_hora
         * from saida_picklist, estoque
         * where saida_picklist.id_estoque = estoque.id_estoque
         */
        public function getMapa($pkl, $dtFrom, $dtTo){
            $q = 'select distinct id_registro, nome_estoque, num_picklist, data_hora from saida_picklist, estoque where saida_picklist.id_estoque = estoque.id_estoque';

            if ($pkl || strlen($pkl)>0) { 
                $q .= " and num_picklist = '$pkl'";  
            }

            if ($dtFrom && $dtTo){ 
                $q .= " and data_hora between convert(datetime,'$dtFrom 00:00:00', 120) and convert(datetime,'$dtTo 23:59:59', 120)"; 
            }
            elseif($dtFrom){ 
                $q .= " and data_hora between convert(datetime,'$dtFrom 00:00:00', 120) and convert(datetime,'$dtFrom 23:59:59', 120)"; 
            } 
            
            $q .= " order by data_hora";
            // echo $q;
            
            $arr_res = array();
            $q_res = parent::query( $q );
            $res = $q_res->fetchAll(PDO::FETCH_ASSOC);
            // var_dump($res);

            if( count($res)>0 ){                
                foreach ($res as $item) {
                    array_push( $arr_res, $item);
                }
            } 
            // var_dump($arr_res);  //test line
            echo json_encode($arr_res);
        }

        /**
         * Posta no database a saida de um picklist. Parametro nulo não é aceito.
         * <params>$pkl: numero do picklist
         * <params>$dthr: data da saida, formato 'yyyy-MM-dd HH:mm:ss' tipo 120 datetime
         * <params>$stk: numero do estoque
         * 
         */
        public function postarMapa($pkl, $dthr, $stk){
            //insert into saida_picklist (num_picklist, data_hora, id_estoque) values ('456123', convert(datetime,'2018-01-26 18:52:29',120), 1)
            $q = "insert into saida_picklist (num_picklist, data_hora, id_estoque) values ('$pkl', convert(datetime,'$dthr',120), $stk)";
            parent::query( $q );

        }
        
    }
    
?>