/**
 * Created by banquo on 27/06/17.
 */
$(document).ready(function () {
    $('#submit').click(function() {
        var departure = $('#departure').val();
        var arrival = $('#arrival').val();
        var now = new Date();
        $.getJSON('https://raw.githubusercontent.com/robinBanquo/otokar/master/data/Mende-Clermont_Ferrand.json', function (data) {
            var shedule_array = data[departure] ;
            shedule_array.each(function (shedule) {
                if(shedule.substr(0,2) == now.getHours()){
                    if(shedule.substr(0,2) > now.getHours());
                    
                }else if (shedule.substr(0,2) > now.getHours()){

                }
            })
        });
    });
});
