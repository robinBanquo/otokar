/**
 * Created by banquo on 27/06/17.
 */
$(document).ready(function () {
    $('#search').click(function(event) {
        var departure = $('#departure').val();
        var arrival = $('#arrival').val();
        let now = new Date();
        var appendable_text = "<h1>Autobus pour " + arrival + " : </h1>" +
            "<table>" +
            "<tr>" +
            "<th>départs</th>" +
            "<th>arrivées</th>" +
            "</tr>";
        $.getJSON('data/Mende-Clermont_Ferrand.json', function (data) {
            var departure_schedule_array = data['Mende-Clermont_Ferrand'][departure] ;
            var arrival_schedule_array = data['Mende-Clermont_Ferrand'][arrival] ;
            var counter = 0 ;
            for (var i=0; i<departure_schedule_array.length; i++) {
                var schedule = departure_schedule_array[i];
                if (counter < 3 ){
                    if(schedule.substr(0,2) == now.getHours()){
                        if(schedule.substr(3,2) > now.getMinutes()) {
                            appendable_text += "<tr>" +
                                "<td>" + schedule + "</td>" +
                                "<td>" + arrival_schedule_array[i] + "</td>" +
                                "</tr>";
                            counter++;
                        }
                    }else if (schedule.substr(0,2) > now.getHours()){
                        appendable_text += "<tr>" +
                            "<td>" + schedule + "</td>" +
                            "<td>" + arrival_schedule_array[i] + "</td>" +
                            "</tr>";
                        counter++;
                    }
                }
            }
            appendable_text += "</table>";

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