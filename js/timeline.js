window.onload = function() {

    // Setup lists
    $.getJSON('http://evening-sands-2459.herokuapp.com/v1/timeline?callback=?', null, function(timeline) {
        if(timeline.length == 0) {
            $('#timeline > .empty').css('display', 'block');
        } else {
            fill_list(timeline, 'timeline');
        }
        total();
        $('#timeline > .load').hide();
        get_events(timeline);
    });

    // Drag&Drop
    $('#events_list, #timeline_list').sortable({
        connectWith: "#timeline_list",
        beforeStop: function(event, ui) {
        },
        receive: function(event, ui) {
            if($(this)[0].id == 'timeline_list') { //ui.item.parent()[0].id
//                $.post('http://evening-sands-2459.herokuapp.com/v1/timeline', {id: ui.item[0].id})
  //              .done(function() {console.log('DONE')})
    //            .fail(function() {console.log('ERROR')});
                post_event(ui.item[0].id);
            }
            order_list('events');
            order_list('timeline');
            total();
            $('#timeline > .empty').hide();
            if($('#events_list > li').length == 0) {
                $('#events > .empty').show();
            }
            if($('#timeline_list > li').length == 0) {
                $('#timeline > .empty').show();
            }
        }
    }).disableSelection();

    // Clear button trigger
    $('#delete').click(function() {
/*        $.ajax({
            type: "DELETE",
            url: 'http://evening-sands-2459.herokuapp.com/v1/timeline',
    //        dataType: "jsonp",
      //      jsonp: "callbackname",
            crossDomain : true,
            success: function(result) {
 */               $('#timeline_list').empty();
                $('#timeline > .empty').show();
                $('#events_list').empty();
                $('#events > .load').show();
                get_events([]);
/*            },
            error: function(data) {
                //console.log('ERROR');
            }
        });*/
    });

}

// Request for events
function get_events(except) {
    $.getJSON('http://evening-sands-2459.herokuapp.com/v1/events?callback=?', null, function(events) {
        if(events.length == 0) {
            $('#events > .empty').show();
        } else {
            fill_list(events, 'events', except);
        }
        $('#events > .load').hide();
    });
}

// Generate list
function fill_list(data, list_id, except) {
    $.each(data,function(i, element){
        if($.inArray(element, except) == -1) {
            $('#' + list_id + '_list').append(
                $('<li></li>', {
                    'class': 'list_element',
                    id: element._id['$oid'],
                    'data-time': element.duration
                })
                .append($('<span></span>', {
                    'class': 'name'
                }).text(element.name))
                .append($('<span></span>', {
                    'class': 'time'
                }).text(parseInt(element.duration).toHHMMSS()))
            );
        }
    });
    order_list(list_id);
}

// Order list by duration
function order_list(list) {
    var elems = $('#' + list + '_list').children('li').remove();
    elems.sort(function(a,b){
        return ((parseInt($(b).attr('data-time')) > parseInt($(a).attr('data-time'))) || (parseInt($(b).attr('data-time')) - parseInt($(a).attr('data-time'))));
    });
    $('#' + list + '_list').append(elems);
}

// Calculate list total time
function total() {
    var tot= 0;
    $('#timeline_list > li').each(function(index) {
        tot += parseInt($(this).attr('data-time'));
    });
    $('#timeline > .duration').html('Total duration: ' + tot.toHHMMSS());
}

// Format time
Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
        hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

// POST request - FIX
function post_event(event_id) {
    $.ajax({
        type: "POST",
        url: 'http://evening-sands-2459.herokuapp.com/v1/timeline',
//        dataType: "jsonp",
  //      jsonp: "callbackname",
        crossDomain : true,
        data: {
            id: event_id
        },
        success: function(result) {
            //console.log('SUCCESS');
        },
        error: function(data) {
            //console.log('ERROR');
        }
    });
}
