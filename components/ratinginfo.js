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
                var page = $(data);

                var valuation = page.find('ul.valuation li:first em').html().replace(' K', ',000');
                createOrCompareField('Rateable value (RV):', valuation);

                var floorArea = findWatchMyStreetAttribute(page, 'Floor Area');
                createOrCompareField('Floor area:', floorArea);

                var landArea = findWatchMyStreetAttribute(page, 'Land Area');
                createOrCompareField('Land area:', landArea);

                var buildingAge = findWatchMyStreetAttribute(page, 'Building Age');
                createOrCompareField('Building age:', buildingAge);

            });
        }
    });
}

function createOrCompareField(title, value){
    var field = findOrCreateRow(title);
    if(field.html().length > 0){
        // Compare user-provided value with official value
        if(field.text().trim() == value){
            field.append(' TICK [W]');
        }
        else {
            field.append(' ! [W] - Watch My Street says ' + value);
        }
    }
    else{
        // Add the field
        field.html(value + ' [W]');
    }
}

function findOrCreateRow(title){
    var row = getAttributesRowByTitle(title);
    if(row.length == 0){
        $('table#ListingAttributes > tbody').append('<tr><th>' + title + '</th><td></td></tr>');
        row = getAttributesRowByTitle(title);
    }
    return row.siblings('td');
}

function findWatchMyStreetAttribute(page, title){
    return page.find('.details > table > tbody > tr > th')
        .filter(function(ix, el) { return el.innerHTML.trim() == title }).siblings('td').text().trim();
}
