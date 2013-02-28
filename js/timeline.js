window.onload = function() {
//    get_list('events');
  //  get_list('timeline');

    $.getJSON('http://evening-sands-2459.herokuapp.com/v1/timeline?callback=?', null, function(timeline) {
        if(timeline == []) {
            $('#timeline > .empty').style('display: block;');
        } else {
            fill_list(timeline, 'timeline');
        }
        total();
        $.getJSON('http://evening-sands-2459.herokuapp.com/v1/events?callback=?', null, function(events) {
            if(events == []) {
                $('#events > .empty').style('display: block;');
            } else {
                fill_list(events, 'events', timeline);
            }
        });
    });

    $('#events_list, #timeline_list').sortable({
        connectWith: "#events_list, #timeline_list",
        beforeStop: function(event, ui) {
        },
        receive: function(event, ui) {
            if($(this)[0].id == 'timeline_list') { //ui.item.parent()[0].id
//                $.post('http://evening-sands-2459.herokuapp.com/v1/timeline', {id: ui.item[0].id})
  //              .done(function() {console.log('DONE')})
    //            .fail(function() {console.log('ERROR')});
                //post_event(ui.item[0].id);
            }
            order_list('events');
            order_list('timeline');
            total();
        }
    }).disableSelection();

    $('#delete').click(function() {
        $.ajax({
            type: "DELETE",
            url: 'http://evening-sands-2459.herokuapp.com/v1/timeline',
    //        dataType: "jsonp",
      //      jsonp: "callbackname",
            crossDomain : true,
            success: function(result) {
                $('#timeline_list').empty();
            },
            error: function(data) {
                //console.log('ERROR');
            }
        });
    });

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

function fill_list(data, list_id, except) {
    $.each(data,function(i, element){
        if($.inArray(element, except) == -1) {
            $('#' + list_id + '_list').append(
                $('<li></li>', {
                    'class': 'list_element',
                    id: element._id['$oid'],
                    'data-time': element.duration
                }).text(element.name + ' - ' + element.duration)
            );
        }
    });
    order_list(list_id);
}

function order_list(list) {
    var elems = $('#' + list + '_list').children('li').remove();
    elems.sort(function(a,b){
        return ((parseInt($(b).attr('data-time')) > parseInt($(a).attr('data-time'))) || (parseInt($(b).attr('data-time')) - parseInt($(a).attr('data-time'))));
    });
    $('#' + list + '_list').append(elems);
}

function total() {
    var tot= 0;
    $('#timeline_list > li').each(function(index) {
        tot += parseInt($(this).attr('data-time'));
    });
    $('#timeline > .duration').html('Total duration: ' + tot);
}

/*
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
*/
