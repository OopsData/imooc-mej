$(function() {
    $('.del').click(function(e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)

        $.ajax({
                type: 'DELETE',
                url: '/admin/list?id=' + id
            })
            .done(function(results) {
                if (results.success === 1) {
                    if (tr.length > 0) {
                        tr.remove()
                    }
                }
            })
    })
    // each item in movies
    //     tr(class="item-id-#{item._id}")
    //         td #{item.name}
    //         td #{item.playCount}
    //         td #{item.duration}
    //         td #{item.upCount}
    //         td #{item.downCount}
    //         td #{item.imageUrl}
    $('.search').click(function() {
        var target = $('.resource').val()

        $.ajax({
                type: 'GET',
                url: '/admin/list_target?name=' + target
            })
            .done(function(results) {
                if (results.success === 1) {
                    // console.log(results.movie);
                    var movie = results.movie
                    var html = ''
                             + '<tr class="item-id-"' + movie._id + '>'
                             + '<td>' + movie.name + '</td>'
                             + '<td>' + movie.playCount + '</td>'
                             + '<td>' + movie.duration + '</td>'
                             + '<td>' + movie.upCount + '</td>'
                             + '<td>' + movie.downCount + '</td>'
                             + '<td>' + movie.imageUrl + '</td>'
                    $('.myTable tbody').html(html)
                }
            })
    })

})
