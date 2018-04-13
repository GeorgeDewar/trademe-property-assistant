chrome.storage.sync.get(defaults, function(settings){

    var address = getAttributesRowByTitle('Location:')
        .siblings('td').html().trim().replace(/<br>/g, ', ');

    // Quit if there in no address
    if(!address) return;

    getTravelTime(address, settings);

    var windowVariables = retrieveWindowVariables(['propertyAddress', 'propertySuburb'])


});

function retrieveWindowVariables(variables) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n"
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = $("body").attr("tmp_" + currVariable);
        $("body").removeAttr("tmp_" + currVariable);
    }

    $("#tmpScript").remove();

    return ret;
}

function getAttributesRowByTitle(title){
    return $('table#ListingAttributes > tbody > tr > th')
        .filter(function(ix, el) { return el.innerHTML.trim() == title })
}