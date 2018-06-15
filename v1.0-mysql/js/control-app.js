var ControlApp = angular.module('ControlApp', []);

//função para acesso a objetos da actrl.pklicação
ControlApp.run( function ($rootScope) {
    // $rootScope define o scope geral para o app
    $rootScope.titulo = "Controle de Picklists";
})

//CONTROLLER DE REGISTRO
ControlApp.controller('RegistraCtrl', function($scope, $http, $filter, $timeout){
    var reg = $scope;
    reg.erro = false;
    reg.ok = false;
    reg.datahora = new Date(); // $filter('date')(new Date(), "dd-MMM-yyyy HH:mm:ss"); //filtrando em formato string
    reg.estoque = "AERO";
    reg.idEstoque = null;
    // reg.picklist = '123';
    
    reg.limparCampos = function(){
        reg.datahora = new Date(); // $filter('date')(new Date(), "dd-MMM-yyyy HH:mm:ss"); //filtrando em formato string
        reg.estoque = "AERO";
        reg.idEstoque = null;
        reg.picklist = '';        
    }

    reg.postData = function(){        
        if (reg.picklist.length > 0) {
            reg.datahora = new Date();
            
            switch(reg.estoque){
                case "AERO":
                    reg.idEstoque = 1;
                break;
            }
            console.log("Variaveis: ", reg.picklist, ", ", $filter('date')(reg.datahora, "yyyy-MM-dd HH:mm:ss"), ", ", reg.idEstoque);            

            $http({
                method: 'POST',
                url: '../php/post-mapa.php',
                data: {
                    'picklist': reg.picklist.trim(),
                    'datahora': $filter('date')(reg.datahora, "yyyy-MM-dd HH:mm:ss") ,
                    'idestoque': reg.idEstoque
                }
            }).then(
                //success
                function(response){
                    //response.data = "" significa ter conseguido postar no banco de dados
                    if (response.data = ""){
                        reg.ok = true;
                        reg.limparCampos();
                        console.log("Post OK: ", response);
                        $timeout(function(){reg.ok=false}, 2000);
                        // alert("Picklist inserido com sucesso!");
                    }
                    //response.data != "" é o retorno c/ o erro ao postar no database
                    else{
                        reg.erro = true;
                        reg.limparCampos();
                        console.log("Post NÃO-OK: ", response);
                        $timeout(function(){reg.erro=false}, 2000);                        
                    }
                },
                //falha
                function (response){
                    reg.erro = true;
                    reg.limparCampos();
                    console.log("Post ERRO: ", response);
                    $timeout(function(){reg.erro=false}, 2000);
                    // alert("ERRO!");
                }
            );
        }
    }
});

//CONTROLLER DE CONSULTA
ControlApp.controller('ConsultaCtrl', function($scope, $http, $filter, $timeout){
    var ctrl = $scope;
    
    ctrl.erroBusca = false; //esconde aviso de erro, controla form
    ctrl.pkl = '';
    ctrl.dateFrom = '';
    ctrl.dateTo = '';
    ctrl.lista = []; //guarda o resultado da pesquisa
    ctrl.count = null;

    ctrl.limparCampos = function(){
        ctrl.erroBusca = false;        
        ctrl.pkl = '';
        ctrl.dateFrom = '';
        ctrl.dateTo = '';
        ctrl.lista = []; 
    };

    ctrl.buscaMapa = function(){
        var url = "../php/get-mapa.php?";        
        url += ctrl.pkl.length > 0 ? "picklist=" + ctrl.pkl : "";    
        
        if (ctrl.pkl.length > 0 && ctrl.dateFrom != "" && ctrl.dateFrom != null) { url += "&"; }
        url += ctrl.dateFrom != "" && ctrl.dateFrom != null ? "dateFrom=" + $filter('date')(ctrl.dateFrom, "yyyy-MM-dd") : "";
        
        if (ctrl.dateFrom != "" && ctrl.dateFrom != null && ctrl.dateTo != "" && ctrl.dateTo != null) { url += "&"; }
        url += ctrl.dateTo != "" && ctrl.dateTo != null && ctrl.dateFrom != "" && ctrl.dateFrom != null ? "dateTo=" + $filter('date')(ctrl.dateTo, "yyyy-MM-dd") : "";
        
        // console.log(url); //test line

        if (url != "../php/get-mapa.php?"){
            $http.get(url)
            .then(function(resposta){
                if (resposta.data.length == 0) {
                    // console.log("Get 0: ", resposta); //test line        
                    ctrl.lista = [];
                    ctrl.erroBusca = true;
                    $timeout(ctrl.limparCampos, 2000); //limpar campos em 3 seg
                }else{
                    console.log("Get OK: ", resposta); //test line        
                    ctrl.erroBusca = false;
                    ctrl.count = resposta.data.length;
                    ctrl.lista = resposta.data;
                }
            }, function(resposta){
                console.log("Get ERRO: ", resposta); //test line      
                ctrl.erroBusca = true;
                $timeout(ctrl.limparCampos, 2000); //limpar campos em 3 seg              
            });
        }
        else{
            console.log(url);
        }
    }; //fim buscaMapa

});


/**
retorno item.datahora 2018-01-26 19:23:00.000
*/