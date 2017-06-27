/**
 * Created by banquo on 27/06/17.
 */
$(document).ready(function () {
    $('#search').click(function(event) {
        event.preventDefault();
        var departure = $('#departure').val();
        var arrival = $('#arrival').val();
        let now = new Date();
        var appendable_text = "<h1>Heure de départ des trois prochains bus à destination de " + arrival + " : </h1>" +
            "<ul>";
        $.getJSON('https://raw.githubusercontent.com/robinBanquo/otokar/master/data/Mende-Clermont_Ferrand.json', function (data) {

            var schedule_array = data[departure] ;
            console.log(schedule_array);
            var counter = 0 ;
            schedule_array.each(function (shedule) {
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
            });
            appendable_text += "</ul>";

            $('#content').innerHTML = appendable_text;

        });
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
