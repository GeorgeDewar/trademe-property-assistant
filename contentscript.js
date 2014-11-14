chrome.storage.sync.get(defaults, function(settings){

    var address = getAttributesRowByTitle('Location:')
        .siblings('td').html().trim().replace(/<br>/g, ', ');
    var addressLines = address.split(', ');

    // Quit if there in no address
    if(!address) return;

    getTravelTime(address, settings);
    getRatingInfo(addressLines[0], addressLines[1], addressLines[2], settings);

});

function getAttributesRowByTitle(title){
    return $('table#ListingAttributes > tbody > tr > th')
        .filter(function(ix, el) { return el.innerHTML.trim() == title })
}