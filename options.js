$(function(){
    function set(key, val){
        chrome.storage.sync.set({key: val}, function() {
            console.log("Settings saved");
        });
    }

    chrome.storage.sync.get(defaults, function(data){
        console.log(data);

        function get(key){
            return data[key];
        }

        // Load current settings
        $('#workplace').val(get('workplace'));
        $('input[name="mode"]').filter('[value="' + get('mode') +'"]').prop('checked', true);
        $('input[name="time_type"]').filter('[value="' + get('time_type') + '"]').prop('checked', true);
        $('#time').val(get('time'));
        $('#day').val(get('day'));
    });


    $('#save').click(function(){
       set('workplace', $('#workplace').val());
       set('mode', $('input[name="mode"]:checked').val());
       set('time_type', $('input[name="time_type"]:checked').val());
       set('time', $('#time').val());
       set('day', $('#day').val());
    });

});
