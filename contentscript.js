$(function(){
    // Quit if there in no address
    //if(!mapState.userEnteredLocation) return;

    //var address = mapState.userEnteredLocation + ', ' + mapState.structuredLocation;
    var address = $('table#ListingAttributes > tbody > tr > th')
        .filter(function(ix, el) { return el.innerHTML.trim() == 'Location:' })
        .siblings('td').html().trim().replace(/<br>/g, ', ');
    if(!address) return;

    var workplace = 'Wellington Railway Station';
    var mode = 'transit';
    var arrival_time = '1407832200';

    var url = 'http://maps.googleapis.com/maps/api/directions/json?origin='
        + address + '&destination=' + workplace + '&mode=' + mode + '&arrival_time=' + arrival_time;

    console.log(url);

    $.get(url, function(data){
        console.log(data);
        var duration = data.routes[0].legs[0].duration.text;
        $('table#ListingAttributes > tbody').append('<tr><th>Travel Time:</th><td>' + duration + '</td></tr>');
    });


});
