/**
 * Created by banquo on 27/06/17.
 */
 function compareTime(before, after) {
     return before.substr(0, 2) < after.substr(0, 2) ||
     (before.substr(0, 2) == after.substr(0, 2) &&
     before.substr(3, 2) < after.substr(3, 2))
 }

$(document).ready(function () {
    $('#search').click(function(event) {
        //on empeche la page de s'actualiser
        event.preventDefault();
        //on récupere les inputs
        var departure = $('#departure').val();
        var arrival = $('#arrival').val();
        //on chope la date actuelle
        let now = new Date();

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
                var appendable_text = "<div class='panel'> <div class='panel-heading'><h3>Autobus pour " + arrival + " : </h3>" +
                    "</div><div class='panel-body'><table class='table'>" +
                    "<tr>" +
                    "<th>départs</th>" +
                    "<th>arrivées</th>" +
                    "</tr>";
                //on definit un compteur pour avoir un nombre max de réponses
                var counter = 0 ;
                //on boucle sur les horaires de départs
                var last_sched = null
                for (var i=0; i<departure_schedule_array.length; i++) {
                    var schedule = departure_schedule_array[i];
                    //si on est en dessous de la limite d'horaires a renvoyer

                    if (counter < 3 ) {
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
                appendable_text += "</table> </div> </div>" +
                    "<button class='btn btn-standart retour'><i class='glyphicon glyphicon-chevron-left'></i></a>";
                //et on remplit la div avec notre texte html de résultat
                var page1 = $('#content').innerHTML ;

                $('#content').empty().append(appendable_text);
                if (counter == 0) {
                    $('#content .panel-body').empty().append('<p>Il n\'y a plus de bus à cette horraire.</p>');
                }

                $('.retour').click(function () {
                    $('#content').empty().append(page1);
                });
            });
        });
    });
});
