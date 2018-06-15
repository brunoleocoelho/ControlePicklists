var ControlApp = angular.module('ControlApp', []);

//função para acesso a objetos da actrl.pklicação
ControlApp.run( function ($rootScope) {
    // $rootScope define o scope geral para o app
    $rootScope.titulo = "Controle de Picklists";
})

// //SERVIÇO P/ TRAZER E LEVAR DADOS DO BD
// ControlApp.service('datadb', function($http, $q, $filter){
//     var serv = this;
      
// });

//CONTROLLER DE REGISTRO
ControlApp.controller('RegistraCtrl', function($scope, $http, $rootScope){
    var reg = $scope;
    reg.datahora = new Date();
    reg.picklist = '';
    reg.estoque = 1//'http://localhost/controle-picklist/estoque.txt';

    reg.postData = function(){
        if ( reg.picklist.length > 0 ){
            // var url = "http://localhost/controle-picklists/php/post-mapa.php"
            // console.log("URL POST: ", url);
            
            var res = $http({
                method: 'POST',
                url: 'http://localhost/controle-picklists/php/post-mapa.php',
                headers: {
                    'Content-Type': undefined
                },
                data: {
                    pkl: reg.picklist ,
                    datahora: reg.datahora ,
                    estoque: reg.estoque
                }
            });
            res.then(function(response){
                alert("Success: "+ response.data);
                console.log("POST success: ", response);
            }, function(reposta){
                console.log("POST error: ", response);            
            });
        }
    }
});

//CONTROLLER DE CONSULTA
ControlApp.controller('ConsultaCtrl', function($scope, $http, $filter){
    var ctrl = $scope;
    
    ctrl.pkl = '';
    ctrl.dateFrom = '';
    ctrl.dateTo = '';
    ctrl.lista = []; //guarda o resultado da pesquisa

    ctrl.buscaMapa = function(){
        var url = "http://localhost/controle-picklists/php/get-mapa.php?";        
        url += ctrl.pkl.length > 0 ? "pkl=" + ctrl.pkl : "";    
        if (ctrl.pkl.length > 0 && ctrl.dateFrom != "" && ctrl.dateTo != null) { url += "&"; }
        url += ctrl.dateFrom != "" && ctrl.dateFrom != null ? "dateFrom=" + $filter('date')(ctrl.dateFrom, "yyyy-MM-dd") : "";
        if (ctrl.dateFrom != "" && ctrl.dateTo != "" && ctrl.dateTo != null) { url += "&"; }
        url += ctrl.dateTo != "" && ctrl.dateTo != null ? "dateTo=" + $filter('date')(ctrl.dateTo, "yyyy-MM-dd") : "";
        console.log(url); //test line
        
        $http.get(url)
        .then(function(resposta){
            // console.log("then: ", resposta.data); //test line
            if (resposta.data.length == 0) {
                alert("Nenhum resultado encontrado!");
                ctrl.lista = [];
            }else{
                ctrl.lista = resposta.data;
            }
        }, function(resposta){
            console.log("reject: ", resposta); //test line        
        }).finally        
    }; //fim buscaMapa

    ctrl.$on('PostarPicklist', function(event, objPicklist){
        // ctrl.lista.push(objPicklist)
        console.log(objPicklist);
    })
});


/**

*/