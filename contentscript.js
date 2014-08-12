$(function(){
    chrome.storage.sync.get(defaults, function(settings){

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
            var duration = data.routes[0].legs[0].duration.text;
            $('table#ListingAttributes > tbody').append('<tr><th>Travel Time:</th><td>' + duration + '</td></tr>');
        });

    });
});
