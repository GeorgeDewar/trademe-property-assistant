var WATCH_MY_STREET_ICON = '<img src="' + chrome.extension.getURL('img/watch-my-street-green.png') + '" width="20" valign="middle" title="This information has been retrieved from Watch My Street" />';
var TICK_ICON = '<img src="' + chrome.extension.getURL('img/tick2.gif') + '" width="20" valign="middle" title="3rd party information matches what has been provided" />';

var order = ['Property type:', 'Building age:', 'Floor area:', 'Land area:', 'Rateable value (RV):', 'Price'];

function getRatingInfo(address, settings){
    $('table#ListingAttributes > tbody').append('<tr><th>Additional Information:</th><td id="links">Loading...</td></tr>');

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
                data = data.replace(/<img\b[^>]*>/ig, '');
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
            field.append(' ' + TICK_ICON + WATCH_MY_STREET_ICON);
        }
        else {
            field.append(' ! ' + WATCH_MY_STREET_ICON + ' - Watch My Street says ' + value);
        }
    }
    else{
        // Add the field
        field.html(value + ' ' + WATCH_MY_STREET_ICON);
    }
}

function findOrCreateRow(title){
    var row = getAttributesRowByTitle(title);
    if(row.length == 0){
        createRow(title);
        row = getAttributesRowByTitle(title);
    }
    return row.siblings('td');
}

function createRow(title){
    var position = order.indexOf(title);
    for(var i = position - 1; i >= 0; i--){
        console.log('' + i + ' ' + order[i]);
        if(getAttributesRowByTitle(order[i]).length > 0){
            $('<tr><th>' + title + '</th><td></td></tr>').insertAfter(getAttributesRowByTitle(order[i]).parent());
            return;
        }
    }
    console.log('Failed to find suitable position to insert ' + title);
    $('table#ListingAttributes > tbody').append('<tr><th>' + title + '</th><td></td></tr>');
}

function findWatchMyStreetAttribute(page, title){
    return page.find('.details > table > tbody > tr > th')
        .filter(function(ix, el) { return el.innerHTML.trim() == title }).siblings('td').text().trim();
}
