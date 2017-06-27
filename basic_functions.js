/**
 * Created by banquo on 27/06/17.
 */
$(document).ready(function () {
    $('#submit').click(function() {
        var start = $('#start').val();
        var finish = $('#finish').val();
        $.getJSON('data/Mende-Clermont_Ferrand.json', function () {
            $.each(data , function ( stand_name ,  shedule_array) {
                
            }
        });
    });
});
