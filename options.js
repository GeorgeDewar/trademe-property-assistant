$(function(){
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
        chrome.storage.sync.set({
            workplace: $('#workplace').val(),
            mode: $('input[name="mode"]:checked').val(),
            time_type: $('input[name="time_type"]:checked').val(),
            time: $('#time').val(),
            day: $('#day').val()
        }, function() {
            console.log("Settings saved");
        });
    });

    $('input[name="mode"]').click(function(){
        if($('input[name="mode"]:checked').val() == 'transit'){
            $('#timing').show();
        }
        else{
            $('#timing').hide();
        }
    });

});
