var romaApp = angular.module('romaApp', []);

romaApp.controller('mainController', function($scope){
    
    var relacionados = [];
    for (var i = 0; i < 0.2*68*17; i++) {
        var indicador = Math.floor(68*Math.random());
        var ods = Math.floor(17*Math.random());
        relacionados.push([indicador,ods]);
    }
    var data = {
        obj: {},
        ind: {},
        dim: []
    };
    for (var i = 0; i < 68; i++) {
        data.ind[i] = [];
    }
    for (var i = 0; i < 17; i++) {
        data.obj[i] = [];
    }
    for (var i = 0; i < relacionados.length; ++i){
        data.obj[relacionados[i][1]].push(relacionados[i][0]);
        data.ind[relacionados[i][0]].push(relacionados[i][1]);
    }
    $scope.data = data;
    
    $scope.config = {
        center_r: 50,
        sector_r: 10
    };
    
    $scope.scan = {};
    $scope.selection = {};
    
    $scope.select_obj = function(obj){
        $scope.selection['obj'] = obj;
        $scope.selection['ind'] = false;
    };
});