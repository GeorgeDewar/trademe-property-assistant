function getRatingInfo(address, settings){
    $('table#ListingAttributes > tbody').append('<tr><th>Additional Information:</th><td id="links">Loading...</td></tr>');

    // 'Floor Area:'
    // 'Land Area:'
    // 'Rateable value (RV):'

    // Plan: If it's not there, add it (and say)
    // If it is, verify it

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

                valuation = page.find('ul.valuation li:first em').html().replace(' K', ',000');
                rvBox = getAttributesRowByTitle('Rateable value (RV):');
                if(rvBox.length == 1){
                    // Compare user-provided value with official value
                    if(rvBox.siblings('td').html().trim() == valuation){
                        rvBox.siblings('td').append(' TICK [W]');
                    }
                    else {
                        rvBox.siblings('td').append(' ! [W] - Watch My Street says ' + valuation);
                    }
                }
                else{
                    // Add the field
                    $('table#ListingAttributes > tbody').append('<tr><th>Rateable value (RV):</th><td>' + valuation + ' [W]</td></tr>');
                }

            });
        }
    });



}
