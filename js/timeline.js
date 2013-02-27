window.onload = function() {
/*    // Enable cross domain
    $.support.cors = true;
    // Ajax call to get events
    $.ajax({
        type: 'GET',
        url: 'http://evening-sands-2459.herokuapp.com/v1/events', //proxy.php?url=
        dataType: 'jsonp',
//        async: false,
        contentType: 'application/json',
        crossdomain: true,
        xhrFields: {
            withCredentials: true
        },
        cache: false,
        success: function(data) {
            console.log('SUCCESS');
            //get_events(data);
        },
        error: function(error) {
            console.log('ERROR');
            console.log(error);
        }
    });
*/
    get_list('events');
    get_list('timeline');

    $('#events_list, #timeline_list').sortable({
        connectWith: "#events_list, #timeline_list",
        beforeStop: function(event, ui){
            
        },
        receive: function(event, ui) {
            if($(this)[0].id == 'timeline_list') { //ui.item.parent()[0].id
                $.post('http://evening-sands-2459.herokuapp.com/v1/timeline', {id: ui.item[0].id})
                .done(function() {console.log('DONE')})
                .fail(function() {console.log('ERROR')});
            }
        }
    }).disableSelection();

    $().click(function() {
    })

}

function get_list(name) {
    $.getJSON('http://evening-sands-2459.herokuapp.com/v1/' + name + "?callback=?", null, function(data) {
        if(data == []) {
            $('#' + name + '> .empty').style('display: block;');
        } else {
            fill_list(data, name);
        }
    });
}

function fill_list(data, list_id) {
    $.each(data,function(i, element){
        $('#' + list_id + '_list').append(
            $('<li></li>', {
                'class': 'list_element',
                id: element._id['$oid']
            }).text(element.name)
        );
    });
}
