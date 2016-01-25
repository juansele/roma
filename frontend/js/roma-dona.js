romaApp.directive('romaDona', ['$timeout', function(timer) {
    return {
        restrict: 'C',
        scope: {
            scan: '=',
            selection: '=',
            config: '=',
            data: '='
        },
        link: function(scope, element, attr) {
            var startCanvas = function(){
                scope.ctx = element[0].getContext('2d');
                scope.ctx.translate(element[0].width/2,element[0].height/2);
                paint_chart();
                scope.ready = true;
            };
            
            // function to paint a single sector
            var paint_sector = function(obj,ind){
                var center_r = scope.config.center_r;
                var sector_r = scope.config.sector_r;
                var num_ind = Object.keys(scope.data.ind).length;
                
                var radio_1 = center_r + obj * sector_r;
                var radio_2 = center_r + (obj + 1) * sector_r;
                var angle_1 = ind * 2*Math.PI/num_ind;
                var angle_2 = (ind+1) * 2*Math.PI/num_ind;
                
                scope.ctx.moveTo(-radio_1*Math.sin(-angle_1), -radio_1*Math.cos(-angle_1));
                scope.ctx.lineTo(-radio_2*Math.sin(-angle_1), -radio_2*Math.cos(-angle_1));
                scope.ctx.arc(0,0,radio_2,angle_1-Math.PI/2,angle_2-Math.PI/2,false);
                scope.ctx.lineTo(-radio_1*Math.sin(-angle_2), -radio_1*Math.cos(-angle_2));
                scope.ctx.arc(0,0,radio_1,angle_2-Math.PI/2,angle_1-Math.PI/2,true);
            };
            
            var paint_marks = function() {
                var num_ind = Object.keys(scope.data.ind).length;
                var num_obj = Object.keys(scope.data.obj).length;
                
                // paints mouse scanning
                scope.ctx.fillStyle = "rgba(189, 195, 199,0.7)";
                scope.ctx.beginPath();
                if (scope.scan.obj !== false && scope.scan.obj !== undefined) {
                    for (var i = 0; i < num_ind; i++) {
                        paint_sector(scope.scan.obj,num_ind-i);
                        if (scope.data.obj[scope.scan.obj].indexOf(i) != -1) {
                            paint_sector(num_obj+1,i);
                        }
                    }
                }
                if (scope.scan.ind !== false) {
                    for (var i = 0; i < num_obj+2; i++) {
                        paint_sector(i,scope.scan.ind);
                    }
                }
                scope.ctx.fill();
                
                // paints general selection
                scope.ctx.fillStyle = "rgba(211, 84, 0,0.7)";
                scope.ctx.beginPath();
                if (scope.selection.obj !== false && scope.selection.obj !== undefined) {
                    for (var i = 0; i < num_ind; i++) {
                        paint_sector(scope.selection.obj,num_ind-i);
                        if (scope.data.obj[scope.selection.obj].indexOf(i) != -1) {
                            paint_sector(num_obj,i);
                        }
                    }
                }
                if (scope.selection.ind !== false) {
                    for (var i = 0; i < num_obj+2; i++) {
                        paint_sector(i,scope.selection.ind);
                    }
                }
                scope.ctx.fill();
            };
            
            var paint_bg = function(){
                var center_r = scope.config.center_r;
                var sector_r = scope.config.sector_r;
                var num_ind = Object.keys(scope.data.ind).length;
                var num_obj = Object.keys(scope.data.obj).length;
                
                scope.ctx.beginPath();
                scope.ctx.strokeStyle = "rgba(0,0,0,0.10)";
                scope.ctx.fillStyle = "rgba(0,0,0,0.5)";
                scope.ctx.textAlign = "center";
                scope.ctx.textBaseline = "middle";
                
                for (var i = 0; i < num_obj+1; i++) {
                    var radio = center_r + i*sector_r;
                    scope.ctx.moveTo(radio, 0);
                    scope.ctx.arc(0,0,radio,0,Math.PI*2,true);
                }
                for (var i = 0; i < num_ind; i++) {
                    var radio_i = -center_r;
                    var radio_f = -center_r - num_obj*sector_r;
                    var radio_text = -center_r - (num_obj+1)*sector_r;
                    var angulo = -i * 2*Math.PI/(num_ind);
                    var angulo_text = -(i+0.5) * 2*Math.PI/(num_ind);
                    
                    scope.ctx.moveTo(radio_i*Math.sin(angulo), radio_i*Math.cos(angulo));
                    scope.ctx.lineTo(radio_f*Math.sin(angulo), radio_f*Math.cos(angulo));
                    scope.ctx.fillText(String(i+1), radio_text*Math.sin(angulo_text), radio_text*Math.cos(angulo_text));
                }
                scope.ctx.stroke();
                
                        // para pintar los limites de las dimensiones        
                        //ctx.beginPath();
                        //ctx.strokeStyle = "rgba(44, 62, 80,0.7)";
                        //ctx.moveTo(-(50-2*10)*Math.sin(-2*0*Math.PI/68), -(50-2*10)*Math.cos(-2*0*Math.PI/68));
                        //ctx.lineTo(-(50+19*10)*Math.sin(-2*0*Math.PI/68), -(50+19*10)*Math.cos(-2*0*Math.PI/68));
                        //ctx.moveTo(-(50-2*10)*Math.sin(-2*25*Math.PI/68), -(50-2*10)*Math.cos(-2*25*Math.PI/68));
                        //ctx.lineTo(-(50+19*10)*Math.sin(-2*25*Math.PI/68), -(50+19*10)*Math.cos(-2*25*Math.PI/68));
                        //ctx.moveTo(-(50-2*10)*Math.sin(-2*48*Math.PI/68), -(50-2*10)*Math.cos(-2*48*Math.PI/68));
                        //ctx.lineTo(-(50+19*10)*Math.sin(-2*48*Math.PI/68), -(50+19*10)*Math.cos(-2*48*Math.PI/68));
                        //ctx.stroke();
            };
            
            // limites de dimensiones hardcodeados
            var paint_relation = function(){
                for (var obj in scope.data.obj) {
                    for (var ind_index = 0; ind_index < scope.data.obj[obj].length; ++ind_index) {
                        var obj_int = parseInt(obj);
                        var ind_int = parseInt(scope.data.obj[obj][ind_index]);
                        
                        scope.ctx.fillStyle = "rgba(142, 68, 173,0.7)";
                        if (ind_int <= 24) {
                            scope.ctx.fillStyle = "rgba(241, 196, 15,0.7)";
                        } else if (ind_int <= 47) {
                            scope.ctx.fillStyle = "rgba(39, 174, 96,0.7)";
                        }
                        
                        scope.ctx.beginPath();
                        paint_sector(obj_int, ind_int);
                        scope.ctx.fill();
                    }
                }
            };
            
            var paint_chart = function() {
                scope.ctx.clearRect(-element[0].width/2, -element[0].height/2, element[0].width, element[0].height);
                paint_marks();
                paint_bg();
                paint_relation();
            };
            
            scope.$watchCollection('scan', function(newValue, oldValue) {
                if (scope.ready && newValue != oldValue) {paint_chart();}
            });
            
            scope.$watchCollection('selection', function(newValue, oldValue) {
                if (scope.ready) {paint_chart();}
            });
            
            var click_sector = function(evt){
                var center_r = scope.config.center_r;
                var sector_r = scope.config.sector_r;
                var num_ind = Object.keys(scope.data.ind).length;
                
                var rect = element[0].getBoundingClientRect();
                var mouse_position = {
                    x: Math.floor((evt.clientX-rect.left)/(rect.right-rect.left)*element[0].width),
                    y: Math.floor((evt.clientY-rect.top)/(rect.bottom-rect.top)*element[0].height)
                };
                
                // obj
                var magnitud = Math.sqrt(Math.pow(mouse_position.x-element[0].width/2,2)+Math.pow(mouse_position.y-element[0].height/2,2));
                var obj = Math.floor((magnitud-center_r)/sector_r);
                // ind
                var angulo = Math.asin(-(mouse_position.y-element[0].height/2)/magnitud) - Math.PI/2;
                var ind = Math.floor(-angulo/(2*Math.PI/num_ind));
                if (mouse_position.x-element[0].width/2 < 0) {
                    ind = num_ind - ind - 1;
                }
                
                return [obj,ind];
            };
            
            var update_marks = function(evt){
                var sector = click_sector(evt);
                var num_obj = Object.keys(scope.data.obj).length;
                var array = {};
                
                if (evt.type == "mousemove") {
                    array = scope.scan;
                } else if (evt.type == "mousedown") {
                    array = scope.selection;
                }
                
                if (0 <= sector[0] && sector[0] < num_obj) {
                    array.obj = sector[0];
                    array.ind = sector[1];
                } else if (num_obj <= sector[0] && sector[0] < num_obj+2) {
                    array.obj = false;
                    array.ind = sector[1];
                } else {
                    array.obj = false;
                    array.ind = false;
                }
                scope.$apply();
            };
            
            element.on('mousemove', function(evt) {
                update_marks(evt);
            });
            
            element.on('mousedown', function(evt) {
                update_marks(evt);
            });
            
            timer(startCanvas, 0);
        }
    };
}]);