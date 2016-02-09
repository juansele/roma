var romaApp = angular.module('romaApp', ['ngMaterial', 'ui-leaflet', 'chart.js', 'angucomplete-alt']);

romaApp.controller('mainController', function($scope, $http, leafletData){
    // limpiadores de autocomplete
    $scope.limpiar_input = function(id_input){
        $scope.$broadcast('angucomplete-alt:clearInput', id_input);
        $scope.roma.current_selection[id_input] = false;
    };
    
    // me invento la data
    var relacionados = [];
    //for (var i = 0; i < 0.2*78*17; i++) {
    //    var indicador = Math.floor(78*Math.random());
    //    var ods = Math.floor(17*Math.random());
    //    relacionados.push([indicador,ods]);
    //}
    relacionados = [[0,0],[0,1],[0,2],[0,3],[0,7],[0,10],[1,0],[1,7],[1,9],[1,10],[2,0],[2,1],[2,4],[2,9],[2,10],[3,0],[4,0],[4,1],[4,2],[5,1],[6,2],[6,4],[7,2],[8,2],[9,2],[10,2],[10,11],[11,2],[11,8],[11,10],[12,2],[12,10],[13,2],[14,2],[15,2],[16,2],[17,2],[17,10],[18,3],[19,3],[19,4],[20,3],[20,4],[21,3],[22,3],[22,4],[23,3],[23,4],[24,3],[24,4],[24,7],[25,3],[26,3],[27,3],[27,4],[28,1],[28,2],[28,3],[28,7],[28,9],[28,10],[29,3],[30,3],[31,3],[32,2],[32,4],[33,1],[33,4],[33,7],[33,9],[33,10],[34,4],[35,0],[35,1],[35,2],[35,5],[35,8],[35,10],[36,5],[37,1],[37,2],[37,3],[37,5],[37,7],[37,10],[37,12],[38,0],[38,1],[38,2],[38,5],[38,8],[38,10],[39,5],[40,5],[41,5],[42,5],[43,5],[44,5],[45,5],[46,5],[47,5],[48,5],[49,5],[50,5],[51,5],[52,5],[53,5],[54,5],[55,6],[56,6],[57,7],[58,1],[58,8],[58,10],[58,16],[59,8],[60,0],[60,7],[60,9],[61,10],[61,12],[61,16],[62,12],[63,12],[64,12],[65,12],[66,12],[67,12],[68,12],[69,12],[70,12],[71,12],[72,1],[72,11],[72,12],[72,14],[73,14],[74,2],[74,4],[74,10],[74,15],[75,15],[75,16],[76,15],[77,16]];
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
            tileLayer: "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
            tileLayerOptions: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            },
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

                    var propiedad = {mapa_1: 'interes', mapa_2: 'inversion'};
                    for (var i=1; i<=2; i++){
                        leafletData.getMap('mapa_'+String(i)).then(function(map) {
                            map.eachLayer(function (layer) {
                                if (layer.feature){
                                    layer.setStyle({
                                        color: response.data.color,
                                        fillColor: response.data.color, 
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
                                layer.setStyle({
                                    color: color, 
                                    weight: 2,
                                    opacity: 1,
                                    fillOpacity: $scope.roma.data.indicadores_region[layer.feature.properties.id]
                                });
                                layer.bindPopup(layer.feature.properties.nombre);
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


    $scope.labels = ['ODS1', 'ODS2', 'ODS3', 'ODS4', 'ODS5', 'ODS6', 'ODS7', 'ODS8', 'ODS9', 'ODS10', 'ODS11', 'ODS12', 'ODS13', 'ODS15', 'ODS16', 'ODS17'];
    $scope.series = ['Interes', 'Inversión'];
    $scope.colours = ['#ffc107','#607d8b']
});