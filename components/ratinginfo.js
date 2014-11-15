var TICK_ICON = '<img src="' + chrome.extension.getURL('img/tick2.gif') + '" width="20" valign="middle" title="3rd party information matches what has been provided" />';

var order = ['Property type:', 'Building age:', 'Floor area:', 'Land area:', 'Rateable value (RV):', 'Price'];

function getRatingInfo(address, suburb, city, settings){
    $('table#ListingAttributes > tbody').append('<tr><th>Additional Information:</th><td id="links">Loading...</td></tr>');

    // Plan: If it's not there, add it (and say)
    // If it is, verify it

    // Watch My Street
    var lookupUrl = 'http://rating.dewar.co.nz/search?address=' + address + '&suburb=' + suburb + '&city=' + city;
    console.log(lookupUrl);
    $.get(lookupUrl, function(data){
        console.log(data);
        if(data.error){
            var errorText;
            switch(data.error){
                case 'region_not_supported':
                    errorText = 'Region not supported';
                    break;
                case 'property_not_found':
                    errorText = 'Property not found';
                    break;
                case 'multiple_results':
                    errorText = 'Multiple properties found';
                    break;
            }
            $('#links').html(errorText);
            return;
        }
        else{
            $('#links').html('<a href="' + data.source_url + '">' + data.source_name + '</a>');

            var source = {
                name: data.source_name,
                iconUrl: 'http://rating.dewar.co.nz' + data.icon
            }

            if(data.valuation !== undefined) createOrCompareField(source, 'Rateable value (RV):', toCurrency(data.valuation));
            if(data.floor_area !== undefined) createOrCompareField(source, 'Floor area:', data.floor_area + 'm2');
            if(data.land_area !== undefined) createOrCompareField(source, 'Land area:', data.land_area + 'm2');
            if(data.building_age !== undefined) createOrCompareField(source, 'Building age:', data.building_age);

        }
    });
}

function toCurrency(amount){
    return amount.toLocaleString("en-NZ", {style: "currency", currency: "USD"})
}

function createOrCompareField(source, title, value){
    var field = findOrCreateRow(title);
    if(field.html().length > 0){
        // Compare user-provided value with official value
        if(field.text().trim() == value){
            field.append(' ' + TICK_ICON + generateIconImgTag(source));
        }
        else {
            field.append(' ! ' + generateIconImgTag(source) + ' - official data says ' + value);
        }
    }
    else{
        // Add the field
        field.html(value + ' ' + generateIconImgTag(source));
    }
}

function generateIconImgTag(source){
    return '<img src="' + source.iconUrl + '" width="20" valign="middle" title="This information has been retrieved from ' + source.name + '" />';
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
