$('table#ListingAttributes > tbody').append('<tr><th>Travel Time:</th><td id="traveltime">Loading...</td></tr>');

chrome.storage.sync.get(defaults, function(settings){

    var DIR_FLAGS = {
        transit: 'r', walking: 'w', driving: 'd', bicycling: 'b'
    }

    var address = $('table#ListingAttributes > tbody > tr > th')
        .filter(function(ix, el) { return el.innerHTML.trim() == 'Location:' })
        .siblings('td').html().trim().replace(/<br>/g, ', ');

    // Quit if there in no address
    if(!address) return;

    var workplace = settings.workplace;
    var mode = settings.mode;
    var time_type = settings.time_type;
    var time = settings.time;
    var day = settings.day;

    var url = 'http://maps.googleapis.com/maps/api/directions/json?origin='
        + address + '&destination=' + workplace + '&mode=' + mode;
    if(mode == 'transit') {
        today = new Date();
        today.setDate(today.getDate() + ((today.getDay() + 7) % day));
        today.setHours(time.split(':')[0]);
        today.setMinutes(time.split(':')[1]);
        url += '&' + time_type + '=' + Math.round(today.getTime() / 1000);
    }

    console.log(url);

    $.get(url, function(data){
        console.log(data);
        var routes = data.routes.map(function(route){
            var duration = route.legs[0].duration.text;
            var arrivalTime = ', arriving at ' + route.legs[0].arrival_time.text;
            var modeText = '';
            if(mode == 'transit'){
                var vehicle = route.legs[0].steps.filter(function(x) { return x.travel_mode == 'TRANSIT' })[0].transit_details.line.vehicle;
                modeText = ' by ' + vehicle.name.toLowerCase();
            }
            return duration + modeText + arrivalTime;
        });

        $('#traveltime').html(
            '<a href="http://maps.google.com/?saddr=' + address + '&daddr=' + workplace + '&dirflg=' +
            DIR_FLAGS[mode] + '" target="_blank">' +
            routes.join('<br />') + '</a>');
    });

});
