chrome.storage.sync.get(defaults, function(settings){

    var address = $('table#ListingAttributes > tbody > tr > th')
        .filter(function(ix, el) { return el.innerHTML.trim() == 'Location:' })
        .siblings('td').html().trim().replace(/<br>/g, ', ');

    // Quit if there in no address
    if(!address) return;

    getTravelTime(address, settings);

});
