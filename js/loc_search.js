$(function() {
    $( "#adresse_search" ).keypress(function (e) {
        var key = e.which;
        if(key == 13 && $("#adresse_search").val()){
            $("#adresse_search_result").hide();
            $("#adresse_search_result").empty();
            var search = $("#adresse_search").val();
            $.get(LocationPicker.url_spw_geolocalisation + encodeURIComponent(search), function(data) {
                if(data.errorCode==0){

                    var content = "<table class='table table-bordered table-sm table-responsive'><tbody>";
                    var pos = rue = loc = com = true;
                    var max_i=3;
                    var i=0
                    for (var val in data.resultats) {
                        if(data.resultats[val].type=="POSITION" && pos){
                            i=max_i;
                            pos=false;
                            content += '<tr class="table-active"><th>ADRESSE</th></tr>';
                            content += '<tr><td class="adresse_tab" x="'+data.resultats[val].x+'" y="'+data.resultats[val].y+'">'+data.resultats[val].adresse+'</td></tr>';
                            if(data.resultats[parseInt(val)+1] && data.resultats[parseInt(val)+1].type=="POSITION"){
                                content += '<tr><td class="itemSeparator"></td></tr>';
                            }
                        }
                        else if (data.resultats[val].type=="POSITION" && i) {
                            i--;
                            content += '<tr><td class="adresse_tab" x="'+data.resultats[val].x+'" y="'+data.resultats[val].y+'">'+data.resultats[val].adresse+'</td></tr>';
                            if(data.resultats[parseInt(val)+1] && data.resultats[parseInt(val)+1].type=="POSITION"){
                                content += '<tr><td class="itemSeparator"></td></tr>';
                            }
                        }
                        else if (data.resultats[val].type=="RUE" && rue) {
                            i=max_i;
                            rue=false;
                            content += '<tr class="table-active"><th>ROUTE</th></tr>';
                            content += '<tr><td class="adresse_tab" xmax="'+data.resultats[val].xMax+'" xmin="'+data.resultats[val].xMin+'" ymax="'+data.resultats[val].yMax+'" ymin="'+data.resultats[val].yMin+'">'+data.resultats[val].nom+' ('+data.resultats[val].commune+')</td></tr>';
                            if(data.resultats[parseInt(val)+1] && data.resultats[parseInt(val)+1].type=="RUE"){
                                content += '<tr><td class="itemSeparator"></td></tr>';
                            }
                        }
                        else if (data.resultats[val].type=="RUE" && i) {
                            i--;
                            content += '<tr><td class="adresse_tab" xmax="'+data.resultats[val].xMax+'" xmin="'+data.resultats[val].xMin+'" ymax="'+data.resultats[val].yMax+'" ymin="'+data.resultats[val].yMin+'">'+data.resultats[val].nom+' ('+data.resultats[val].commune+')</td></tr>';
                            if(data.resultats[parseInt(val)+1] && data.resultats[parseInt(val)+1].type=="RUE"){
                                content += '<tr><td class="itemSeparator"></td></tr>';
                            }
                        }
                        else if (data.resultats[val].type=="LOCALITE" && loc) {
                            i=max_i;
                            loc=false;
                            content += '<tr class="table-active"><th>LOCALITÉ</th></tr>';
                            content += '<tr><td class="adresse_tab" xmax="'+data.resultats[val].xMax+'" xmin="'+data.resultats[val].xMin+'" ymax="'+data.resultats[val].yMax+'" ymin="'+data.resultats[val].yMin+'">'+data.resultats[val].nom+' ('+data.resultats[val].cps.toString()+')</td></tr>';
                            if(data.resultats[parseInt(val)+1] && data.resultats[parseInt(val)+1].type=="LOCALITE"){
                                content += '<tr><td class="itemSeparator"></td></tr>';
                            }
                        }
                        else if (data.resultats[val].type=="LOCALITE" && i) {
                            i--;
                            content += '<tr><td class="adresse_tab" xmax="'+data.resultats[val].xMax+'" xmin="'+data.resultats[val].xMin+'" ymax="'+data.resultats[val].yMax+'" ymin="'+data.resultats[val].yMin+'">'+data.resultats[val].nom+' ('+data.resultats[val].cps.toString()+')</td></tr>';
                            if(data.resultats[parseInt(val)+1] && data.resultats[parseInt(val)+1].type=="LOCALITE"){
                                content += '<tr><td class="itemSeparator"></td></tr>';
                            }
                        }
                        else if (data.resultats[val].type=="COMMUNE" && com) {
                            i=max_i;
                            com=false;
                            content += '<tr class="table-active"><th>COMMUNE</th></tr>';
                            content += '<tr><td class="adresse_tab" xmax="'+data.resultats[val].xMax+'" xmin="'+data.resultats[val].xMin+'" ymax="'+data.resultats[val].yMax+'" ymin="'+data.resultats[val].yMin+'">'+data.resultats[val].nom+' ('+data.resultats[val].cps.toString()+')</td></tr>';
                            if(data.resultats[parseInt(val)+1] && data.resultats[parseInt(val)+1].type=="COMMUNE"){
                                content += '<tr><td class="itemSeparator"></td></tr>';
                            }
                        }
                        else if (data.resultats[val].type=="COMMUNE" && i) {
                            i--;
                            content += '<tr><td class="adresse_tab" xmax="'+data.resultats[val].xMax+'" xmin="'+data.resultats[val].xMin+'" ymax="'+data.resultats[val].yMax+'" ymin="'+data.resultats[val].yMin+'">'+data.resultats[val].nom+' ('+data.resultats[val].cps.toString()+')</td></tr>';
                            if(data.resultats[parseInt(val)+1] && data.resultats[parseInt(val)+1].type=="COMMUNE"){
                                content += '<tr><td class="itemSeparator"></td></tr>';
                            }
                        }
                    }
                    content += "</tbody></table>";
                    $('#adresse_search_result').append(content);

                    $('.adresse_tab').click(function() {
                        if(this.getAttribute('x')){
                            var x = parseFloat(this.getAttribute('x'));
                            var y = parseFloat(this.getAttribute('y'));
                            LocationPicker.view.animate({
                                center: [x,y],
                                zoom:8
                            });
                        }else if(this.getAttribute('xmax')){
                            var x = parseFloat(this.getAttribute('xmin'))+((parseFloat(this.getAttribute('xmax'))-parseFloat(this.getAttribute('xmin')))/2);
                            var y = parseFloat(this.getAttribute('ymin'))+((parseFloat(this.getAttribute('ymax'))-parseFloat(this.getAttribute('ymin')))/2);
                            LocationPicker.view.animate({
                                center: [x,y],
                                zoom:5
                            });
                        }
                        $("#adresse_search").val(this.textContent);
                    });
                }else{
                    $("#adresse_search_result").html(data.errorMsg);
                }
            }).fail(function() {
                $("#adresse_search_result").html("Erreur de connexion");
            }).always(function() {
                $("#adresse_search_result").show();
            });
        }
    });
});
