/**
 * Created by banquo on 27/06/17.
 */
$(document).ready(function () {
    $('#search').click(function(event) {
        var departure = $('#departure').val();
        var arrival = $('#arrival').val();
        let now = new Date();
        var appendable_text = "<h1>Heure de départ des trois prochains bus à destination de " + arrival + " : </h1>" +
            "<ul>";
        $.getJSON('data/Mende-Clermont_Ferrand.json', function (data) {
            var schedule_array = data['Mende-Clermont_Ferrand'][departure] ;
            var counter = 0 ;
            for (var i=0; i<schedule_array.length; i++) {
                shedule = schedule_array[i];
                if (counter < 3 ){
                    if(shedule.substr(0,2) == now.getHours()){
                        if(shedule.substr(3,2) > now.getMinutes()) {
                            appendable_text += "<li>" + shedule + "</li> ";
                            counter++;
                        }
                    }else if (shedule.substr(0,2) > now.getHours()){
                        appendable_text += "<li>" + shedule + "</li> ";
                        counter++;
                    }
                }
            }
            appendable_text += "</ul>";

            $('#content').empty().append(appendable_text);

        });
        event.preventDefault();
    });

    var options = {
    	url: "./data/arret_liste.json",
        listLocation: "arrets",
    	list: {
    		match: {
    			enabled: true
    		}
    	}
    };

    $("#departure").easyAutocomplete(options);
    $("#arrival").easyAutocomplete(options);
});
