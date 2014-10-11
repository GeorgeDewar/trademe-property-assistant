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
                rvBox = findOrCreateRow('Rateable value (RV):');
                if(rvBox.html().length > 0){
                    // Compare user-provided value with official value
                    if(rvBox.html().trim() == valuation){
                        rvBox.append(' TICK [W]');
                    }
                    else {
                        rvBox.append(' ! [W] - Watch My Street says ' + valuation);
                    }
                }
                else{
                    // Add the field
                    rvBox.html(valuation + ' [W]');
                }

            });
        }
    });



}

function findOrCreateRow(title){
    var row = getAttributesRowByTitle(title);
    if(row.length == 0){
        $('table#ListingAttributes > tbody').append('<tr><th>' + title + '</th><td></td></tr>');
        row = getAttributesRowByTitle(title);
    }
    return row.siblings('td');
}