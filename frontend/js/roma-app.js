var romaApp = angular.module('romaApp', ['ngMaterial', 'ui-leaflet', 'chart.js']);

romaApp.controller('mainController', function($scope){
    // me invento la data
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
    
    // inicializo la directiva
    $scope.data = data;
    $scope.config = {
        center_r: 50,
        sector_r: 10
    };
    $scope.scan = {};
    $scope.selection = {};
    
    // una funcion para jugar con la directiva
    $scope.select_obj = function(obj){
        $scope.selection['obj'] = obj;
        $scope.selection['ind'] = false;
    };

 
    angular.extend($scope, {bogota: {lat: 4.63802334398948, lng: -74.09042358398438, zoom: 8 }});

    $scope.labels = ['ODS1', 'ODS2', 'ODS3', 'ODS4', 'ODS5', 'ODS6', 'ODS7', 'ODS8', 'ODS9', 'ODS10', 'ODS11', 'ODS12', 'ODS13', 'ODS14', 'ODS15', 'ODS16', 'ODS17'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data_bar = [
        [0.65, 0.59, 0.80, 0.81, 0.56, 0.55, 0.40, 0.59, 0.80, 0.81, 0.56, 0.55, 0.40, 0.59, 0.80, 0.81, 0.56],
        [0.28, 0.48, 0.40, 0.19, 0.86, 0.27, 0.90, 0.48, 0.40, 0.19, 0.86, 0.27, 0.90, 0.48, 0.40, 0.19, 0.86]
    ];
});