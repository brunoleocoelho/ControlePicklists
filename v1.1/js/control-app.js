//v1.1 
var ControlApp = angular.module('ControlApp', ['ui.bootstrap']);

//função run para acesso a objetos da aplicação
ControlApp.run( function ($rootScope) {
    // $rootScope define o scope geral para o app
    $rootScope.titulo = "Controle de Picklists";
});

//SERVICE P/ TRAZER REGISTO DO SERVER
ControlApp.factory('Mapa', ['$http', '$q', function($http, $q){
    //chamada assincrona
    return{
        get: function(url){
            // console.log("URL: ", url); //test line
            return $http.get(url)
            .then(function(resposta){
                    return $q.resolve(resposta);
                })
            .catch(function(resposta){
                    return $q.reject(resposta);  
                }
            );
        }
    }
}])

//CONTROLLER DE REGISTRO
ControlApp.controller('RegistraCtrl', function($scope, $modal, $log, $http, $filter, $timeout,  Mapa){
    var reg = $scope;
    reg.erro = false;
    reg.ok = false;
    reg.configData = '';
    reg.datahora = new Date(); // $filter('date')(new Date(), "dd-MMM-yyyy HH:mm:ss"); //filtrando em formato string
    reg.estoque = "AERO";
    reg.idEstoque = null;
    // reg.picklist = '123';
    
    //responsavel por limpar os campos    
    reg.limparCampos = function(){
        reg.datahora = new Date(); // $filter('date')(new Date(), "dd-MMM-yyyy HH:mm:ss"); //filtrando em formato string
        reg.estoque = "AERO";
        reg.idEstoque = null;
        reg.picklist = '';        
    }

    //Verifcar se picklist já foi postado anteriormente
    reg.verificaPosta = function(){
        if (reg.picklist.length > 0) {
            var url = "php/get-mapa.php?picklist="+ reg.picklist;
            
            Mapa.get(url)
            .then(function(resposta){
                //SE NÃO EXISTE REGISTRO, POSTAR DIRETO
                if(resposta.data.length == 0){
                    reg.postData();  //posta o mapa
                }
                //SE JÁ HOUVEREM REGISTROS, PERGUNTAR AO USUÁRIO
                else{                             
                    reg.open(resposta.data); //abre modal               
                }
            })
            //EM CASO DE ERRO
            .catch(function(resposta){
                console.log("verificar ERRO: ", resposta); //test line      
            });
        }
    };

    //responsável por chamar controle do modal
    reg.open = function (dados) {

        var modalInstance = $modal.open({
            templateUrl: 'template/modal.html',
            controller: ModalInstanceCtrl,
            resolve: {
                mapas: function () {
                    return dados;
                }
            }
        });
    
        modalInstance.result.then(
            //OK
            function (decisao) {
                $log.info('Modal decisao: ', decisao);
                reg.postData();
            }, 
            //CANCEL
            function (decisao) {
                $log.info('Modal decisao: ', decisao);
                reg.limparCampos();
            }
        );
    
    };

    //responsavel por enviar o picklist para o server do database
    reg.postData = function(){
        
        reg.datahora = new Date();
        
        switch(reg.estoque){
            case "AERO":
                reg.idEstoque = 1
            break;
        }
        console.log("Variaveis: ", reg.picklist, ", ", $filter('date')(reg.datahora, "yyyy-MM-dd HH:mm:ss"), ", ", reg.idEstoque);            

        $http({
            method: 'POST',
            url: 'php/post-mapa.php',
            data: {
                'picklist': reg.picklist.trim(),
                'datahora': $filter('date')(reg.datahora, "yyyy-MM-dd HH:mm:ss") ,
                'idestoque': reg.idEstoque
            }
        }).then(
            //success
            function(response){
                reg.configData = response.config.data.picklist;                    
                reg.ok = true;
                // console.log(reg.erro, "Post OK: ", response); //test line
                $timeout(function(){
                    reg.ok=false;
                }, 1800);
                reg.limparCampos();
            },
            //falha
            function (response){
                reg.configData = response.config.data.picklist;
                reg.erro = true;
                // console.log(reg.erro, "Post ERRO: ", response);  //test line
                $timeout(function(){
                    reg.erro=false
                }, 1800);
                reg.limparCampos();
                // alert("ERRO!"); //test line
            }
        );
    }

});

//CONTROLLER DE CONSULTA
ControlApp.controller('ConsultaCtrl', function($scope, $http, $filter, $timeout, Mapa){
    var ctrl = $scope;
    
    ctrl.erroBusca = false; //esconde aviso de erro, controla form
    ctrl.pkl = '';
    ctrl.dateFrom = '';
    ctrl.dateTo = '';
    ctrl.lista = []; //guarda o resultado da pesquisa

    //responsavel por limpar os campos
    ctrl.limparCampos = function(){
        ctrl.erroBusca = false;        
        ctrl.pkl = '';
        ctrl.dateFrom = '';
        ctrl.dateTo = '';
        ctrl.lista = []; 
    };
    
    //responsavel por tratar a url e enviar requisição ao server do database
    ctrl.buscaMapa = function(){
        var url = "php/get-mapa.php?";        
        url += ctrl.pkl.length > 0 ? "picklist=" + ctrl.pkl : "";    
        
        if (ctrl.pkl.length > 0 && ctrl.dateFrom != "" && ctrl.dateFrom != null) { url += "&"; }
        url += ctrl.dateFrom != "" && ctrl.dateFrom != null ? "dateFrom=" + $filter('date')(ctrl.dateFrom, "yyyy-MM-dd") : "";
        
        if (ctrl.dateFrom != "" && ctrl.dateFrom != null && ctrl.dateTo != "" && ctrl.dateTo != null) { url += "&"; }
        url += ctrl.dateTo != "" && ctrl.dateTo != null && ctrl.dateFrom != "" && ctrl.dateFrom != null ? "dateTo=" + $filter('date')(ctrl.dateTo, "yyyy-MM-dd") : "";
        
        // console.log(url); //test line
        
        if (url != "php/get-mapa.php?"){
            
            Mapa.get(url)
            .then(function(resposta){
                if(resposta.data.length == 0){
                    ctrl.lista = [];
                    ctrl.erroBusca = true;
                    $timeout(ctrl.limparCampos, 3000); //limpar campos em 3 seg                      
                }else{
                    // console.log("Get OK: ", resposta); //test line        
                    ctrl.erroBusca = false;                
                    
                    //update v1.1
                    ctrl.lista = [];
                    angular.forEach(resposta.data, function(value, key) {
                        ctrl.lista.push({
                            id_reg : value.id_reg,
                            num_picklist : value.num_picklist,
                            data_hora : new Date(value.data_hora),
                            nome_estoque : value.nome_estoque
                        });
                        //console.log(key + " : " + value);  //test line
                    });                               
                }
                })
                .catch(function(resposta){
                    // console.log("Get ERRO: ", resposta); //test line      
                    ctrl.lista = [];
                    ctrl.erroBusca = true;
                    $timeout(ctrl.limparCampos, 3000); //limpar campos em 3 seg         
                });
        }
        else{
            console.log(url);
        }
    }; //fim buscaMapa

});

//CONTROLLER DO MODAL DE AVISO
var ModalInstanceCtrl = function ($scope, $modalInstance, mapas) {
    var ctrl = $scope;
    ctrl.items = [];
    angular.forEach(mapas, function(value, key) {
        ctrl.items.push({
            num_picklist : value.num_picklist,
            data_hora : new Date(value.data_hora),
            nome_estoque : value.nome_estoque
        });
    });                               
    
    //
    ctrl.ok = function () {
        $modalInstance.close('PostData');
    };
  
    ctrl.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
   