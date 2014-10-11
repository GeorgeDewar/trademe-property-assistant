function getRatingInfo(address, settings){
    $('table#ListingAttributes > tbody').append('<tr><th>Rating Info:</th><td id="ratinginfo">Loading...</td></tr>');
    $('table#ListingAttributes > tbody').append('<tr><th>Links:</th><td id="links">Loading...</td></tr>');

    // Watch My Street
    var lookupUrl = 'http://www.watchmystreet.co.nz/cities.json?q=' + address;
    console.log(lookupUrl);
    $.get(lookupUrl, function(data){
        console.log(data);
        if(data.length == 0){
            $('#ratinginfo').html('Property not found');
            $('#links').html('');
            return;
        }
        else if(data.length > 1){
            $('#ratinginfo').html('Multiple matches found');
            $('#links').html('');
            return;
        }
        else{
            path = data[0].metadata.path;
            dataUrl = 'http://www.watchmystreet.co.nz' + path;
            console.log(dataUrl);

            $('#links').html('<a href="' + dataUrl + '">Watch My Street</a>');

            $.get(dataUrl, function(data){
                page = $(data);

                valuation = page.find('ul.valuation li:first em').html();
                $('#ratinginfo').html(valuation);

            });
        }
    });



}
