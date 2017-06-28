/**
 * Created by banquo on 27/06/17.
 */
 function compareTime(before, after) {
     return before.substr(0, 2) < after.substr(0, 2) ||
     (before.substr(0, 2) == after.substr(0, 2) &&
     before.substr(3, 2) < after.substr(3, 2))
 }

$(document).ready(function () {
    $('#result').hide();
    $('#search').click(function(event) {
        //on empeche la page de s'actualiser
        let now = new Date();
        event.preventDefault();
        //on récupere les inputs
        horaires(now);
    });
});

function horaires(now) {
    var departure = $('#departure').val();
    var arrival = $('#arrival').val();
    //on chope la date actuelle
    //on regarde sur quelles lignes l'arret de départ est située
    $.getJSON('data/arret_liste.json', function (data) {
        var arrets = data["arrets"] ;
        var departure_lines;
        var arrival_lines;
        $.each(arrets , function (key , value) {
            if(departure == key){
                departure_lines = value ;

            }
            else if(arrival == key){
                arrival_lines = value ;
            }
        });
        //notre ligne est celle qui recoupe les deux
        var line;
        for ( var i = 0 ; i < departure_lines.length ; i ++){
            for ( var j = 0 ; j < arrival_lines.length ; j ++) {
                if (departure_lines[i] == arrival_lines[j]){
                    line = data["lignes"][departure_lines[i]];
                }
            }
        }
        var schedule_url = 'data/' + line + '.json';
        //on récupere le json des horaires de la ligne
        $.getJSON(schedule_url , function (data) {
            //on récupère les horraires de passage a l'arivée et au départ
            var departure_schedule_array = data[departure] ;
            var arrival_schedule_array = data[arrival] ;
            //on crée une base d'html à inclure
            var appendable_text = "<div class='panel'> <div class='panel-heading'><h4 class='title'><div class='conteneur'><strong>Autobus pour " + arrival + "</strong></div></h4>" +
                "</div><div class='panel-body'><table class='table'>" +
                "<thead>" +
                "<tr>" +
                "<th class='title'>Départs</th>" +
                "<th class='title'>Arrivées</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>";
            //on definit un compteur pour avoir un nombre max de réponses
            var counter = 0 ;
            //on boucle sur les horaires de départs
            var last_sched = null;
            for (var i=0; i<departure_schedule_array.length; i++) {
                var schedule = departure_schedule_array[i];
                //si on est en dessous de la limite d'horaires a renvoyer

                if (counter < 4 ) {
                    //si c'est la meme heure que maintenant
                    if (schedule) {
                        console.log(schedule);
                        if (compareTime(now.getHours() + ':' + now.getMinutes(), schedule) &&
                            compareTime(schedule, arrival_schedule_array[i])) {
                            console.log('1');
                            appendable_text += "<tr>" +
                                "<td>" + schedule + "</td>" +
                                "<td>" + arrival_schedule_array[i] + "</td>" +
                                "</tr>";
                            counter++;
                        }
                        last_sched = schedule
                    }
                }

            }

            //on referme le tableau
            appendable_text += "</tbody></table></div>" +
                "<div class='btn-group btn-group-justified'>" +
                "<div class='btn-group'> <button class='btn btn-default btn-lg date-btn'><i class='glyphicon glyphicon-calendar'></i> Plus d'horaires</button></div>" +
                "<div class='btn-group'> <button class='btn btn-default btn-lg map-btn'><i class='glyphicon glyphicon-map-marker'></i> Map</button></div>" +
                "</div></div>" +
                "<button class='btn btn-standart retour'><i class='glyphicon glyphicon-chevron-left red'></i></a>";

            $('#result').empty().append(appendable_text);
            if (counter == 0) {
                $('#content .panel-body').empty().append('<p>Il n\'y a plus de bus à cette horraire.</p>');
            }
            $('#form').hide('slide', 200, function () {
                $('#result').show('slide', {direction:'right'});
            });

            $('.retour').click(function () {
                $('#result').hide('slide', {direction:'right'}, 200, function () {
                        $('#form').show('slide');
                    }
                );
            });

            $('.date-btn').click(function () {

                var form_date = "<form class='form-group'>" +
                    "<div class='input-group form-group-lg'>" +
                    "<label class='input-group-addon labelo'><i class='glyphicon glyphicon-calendar'></i> Date  </label>" +
                    "<input type='date' value='2017-06-28' class='form-control'>" +
                    "</div>" +
                    "<div class='input-group form-group-lg'>" +
                    "<label class='input-group-addon labelo'><i class='glyphicon glyphicon-time'></i> Départ</label>" +
                    '<select class="form-control"><option value="0">0h</option><option value="1">1h</option><option value="2">2h</option><option value="3">3h</option><option value="4">4h</option><option value="5">5h</option><option value="6">6h</option><option value="7" selected>7h</option><option value="8">8h</option><option value="9">9h</option><option value="10">10h</option><option value="11">11h</option><option value="12">12h</option><option value="13">13h</option><option value="14">14h</option><option value="15">15h</option><option value="16">16h</option><option value="17">17h</option><option value="18">18h</option><option value="19">19h</option><option value="20">20h</option><option value="21">21h</option><option value="22">22h</option><option value="23">23h</option></select>' +
                    "</div>" +
                    "<button type='submit' name='Rechercher' id='search-more' class='btn btn-default btn-block btn-lg'><i class='glyphicon glyphicon-search blue'></i></button>" +
                    "</form>";
                $('#content .panel-body').empty().append(form_date);
            });

            $('.map-btn').click(function () {
                $('#content .panel-body').empty().append('<div id="map"></div>');
                var map = L.map('map').setView([44.522039, 3.502283], 13);

                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                L.marker([44.522039, 3.502283]).addTo(map)
                .bindPopup('Mende (Gare SNCF)')
                .openPopup();
            });
        });
    });
}
