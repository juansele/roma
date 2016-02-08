var romaApp = angular.module('romaApp', ['ngMaterial', 'ui-leaflet', 'chart.js', 'angucomplete-alt']);

romaApp.controller('mainController', function($scope, $http, leafletData){
    // limpiadores de autocomplete
    $scope.limpiar_input = function(id_input){
        $scope.$broadcast('angucomplete-alt:clearInput', id_input);
        $scope.roma.current_selection[id_input] = false;
    };
    
    // me invento la data
    var relacionados = [];
    for (var i = 0; i < 0.2*78*17; i++) {
        var indicador = Math.floor(78*Math.random());
        var ods = Math.floor(17*Math.random());
        relacionados.push([indicador,ods]);
    }
    var data = {
        obj: {},
        ind: {},
        dim: []
    };
    for (var i = 0; i < 78; i++) {
        data.ind[i] = [];
    }
    for (var i = 0; i < 17; i++) {
        data.obj[i] = [];
    }
    for (var i = 0; i < relacionados.length; ++i){
        data.obj[relacionados[i][1]].push(relacionados[i][0]);
        data.ind[relacionados[i][0]].push(relacionados[i][1]);
    }
    
    // inicializo la dona
    $scope.dona = {
        data: data,
        config: {
            center_r: 50,
            sector_r: 10
        }
    };
    
    // inicializo los mapas
    $scope.mapas = {
        center: {
            lat: 5.0108,
            lng: -74.4741, 
            zoom: 9
        },
        defaults: {
            scrollWheelZoom: false
        }
    };

    // mainObject
    $scope.roma = {
        data: {
            dict_municipios: {},
            dict_objetivos: {},
            dict_indicadores: {},
            lista_municipios: [],
            lista_objetivos: [],
            lista_indicadores: [],
            geojson: {
                data: [],
                style: {
                    color: '#ff7800',
                    weight: 0, 
                    fillOpacity: 0.5
                }
            },
            municipio: {
                grafica: []
            }
        },
        current_selection: {
            obj: false,
            ind: false,
            mun: false
        },
        current_hover: {
            obj: false,
            ind: false,
            mun: false
        }
    };
 
    // municipios
    $http({
        method: 'GET',
        url: 'http://roma.mett.com.co/api/v1/municipios'
        }).then(function successCallback(response) {
            $scope.roma.data.dict_municipios = response.data;
            Object.keys(response.data).forEach(function(key) {
                $scope.roma.data.lista_municipios.push(response.data[key]);
            });
        }, function errorCallback(response) {
            console.log('sometin wong');
    });
    // objetivos
    $http({
        method: 'GET',
        url: 'http://roma.mett.com.co/api/v1/objetivos'
        }).then(function successCallback(response) {
            $scope.roma.data.dict_objetivos = response.data;
            Object.keys(response.data).forEach(function(key) {
                $scope.roma.data.lista_objetivos.push(response.data[key]);
            });
        }, function errorCallback(response) {
            console.log('sometin wong');
    });
    // indicadores
    $http({
        method: 'GET',
        url: 'http://roma.mett.com.co/api/v1/indicadores'
        }).then(function successCallback(response) {
            $scope.roma.data.dict_indicadores = response.data;
            Object.keys(response.data).forEach(function(key) {
                $scope.roma.data.lista_indicadores.push(response.data[key]);
            });
        }, function errorCallback(response) {
            console.log('sometin wong');
    });
    // poligonos municipios
    $http({
        method: 'GET',
        url: 'http://roma.mett.com.co/api/v1/municipios.geojson'
        }).then(function successCallback(response) {
            $scope.roma.data.geojson.data = response.data.municipios;
        }, function errorCallback(response) {
            console.log('sometin wong');
    });
    
    
    // watchers
    $scope.$watchCollection('roma.current_selection', function(newValue, oldValue) {
        if (newValue.obj !== oldValue.obj && newValue.obj !== false) {
            $scope.$broadcast('angucomplete-alt:changeInput', 'objetivo', $scope.roma.data.dict_objetivos[parseInt(newValue.obj)+1]);
            $http({
                method: 'GET',
                url: 'http://roma.mett.com.co/api/v1/objetivos/' + String(newValue.obj + 1)
                }).then(function successCallback(response) {
                    $scope.roma.data.objetivos_region = response.data.municipios;

                    var propiedad = {mapa_1: 'interes', mapa_2: 'inversion', mapa_3: 'indicador'};
                    for (var i=1; i<=2; i++){
                        leafletData.getMap('mapa_'+String(i)).then(function(map) {
                            var color = '#'+Math.floor(Math.random()*16777215).toString(16);
                            map.eachLayer(function (layer) {
                                if (layer.feature){
                                    layer.setStyle({
                                        color: color, 
                                        weight: 2,
                                        opacity: 1,
                                        fillOpacity: $scope.roma.data.objetivos_region[layer.feature.properties.id][propiedad[map.getContainer().id]]
                                    });
                                    layer.bindPopup(layer.feature.properties.nombre);
                                }
                            });
                            map.invalidateSize();
                        });
                    }
                }, function errorCallback(response) {
                    console.log('sometin wong');
            });
        } else if (newValue.obj === false){
            $scope.$broadcast('angucomplete-alt:clearInput', 'objetivo');
        }
        
        if (newValue.ind !== oldValue.ind && newValue.ind !== false) {
            $scope.$broadcast('angucomplete-alt:changeInput', 'indicador', $scope.roma.data.dict_indicadores[parseInt(newValue.ind)+1]);
            $http({
                method: 'GET',
                url: 'http://roma.mett.com.co/api/v1/indicadores/' + String(newValue.ind + 1)
                }).then(function successCallback(response) {
                    $scope.roma.data.indicadores_region = response.data.municipios;

                    leafletData.getMap('mapa_3').then(function(map) {
                        var color = '#'+Math.floor(Math.random()*16777215).toString(16);
                        map.eachLayer(function (layer) {
                            if (layer.feature){
                                layer.setStyle({color: color, weight: 0, fillOpacity: $scope.roma.data.indicadores_region[layer.feature.properties.id]});
                            }
                        });
                        map.invalidateSize();
                    });
                    
                }, function errorCallback(response) {
                    console.log('sometin wong');
            });
        } else if (newValue.ind === false){
            $scope.$broadcast('angucomplete-alt:clearInput', 'indicador');
        }
        
        if (newValue.mun !== oldValue.mun && newValue.mun !== false) {
            $scope.$broadcast('angucomplete-alt:changeInput', 'municipio', $scope.roma.data.dict_municipios[parseInt(newValue.mun)]);
            $http({
                method: 'GET',
                url: 'http://roma.mett.com.co/api/v1/municipios/' + String(newValue.mun)
                }).then(function successCallback(response) {
                    $scope.roma.data.municipio.grafica[0] = response.data.interes;
                    $scope.roma.data.municipio.grafica[1] = response.data.inversion;
                    $scope.roma.data.municipio.tabla = response.data.indicador;
                }, function errorCallback(response) {
                    console.log('sometin wong');
            });
        } else if (newValue.mun === false){
            $scope.$broadcast('angucomplete-alt:clearInput', 'municipio');
        }
    });
    
    $scope.$watch('roma.current_selection.municipio', function(newValue, oldValue){
        if (newValue === false) {
            $scope.roma.current_selection.mun = false;
        } else if (newValue != oldValue && newValue) {
            $scope.roma.current_selection.mun = newValue.originalObject['id'];
        }
    });
    $scope.$watch('roma.current_selection.objetivo', function(newValue, oldValue){
        if (newValue === false) {
            $scope.roma.current_selection.obj = false;
        } else if (newValue != oldValue && newValue) {
            $scope.roma.current_selection.obj = newValue.originalObject['id'] - 1;
        }
    });
    $scope.$watch('roma.current_selection.indicador', function(newValue, oldValue){
        if (newValue === false) {
            $scope.roma.current_selection.ind = false;
        } else if (newValue != oldValue && newValue) {
            $scope.roma.current_selection.ind = newValue.originalObject['id'] - 1;
        }
    });


    $scope.labels = ['ODS1', 'ODS2', 'ODS3', 'ODS4', 'ODS5', 'ODS6', 'ODS7', 'ODS8', 'ODS9', 'ODS10', 'ODS11', 'ODS12', 'ODS13', 'ODS14', 'ODS15', 'ODS16', 'ODS17'];
    $scope.series = ['Interes', 'Inversión'];
});