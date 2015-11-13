$(function() {
    $('.del').click(function(e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)

        $.ajax({
                type: 'DELETE',
                url: '/admin/movie/list?id=' + id
            })
            .done(function(results) {
                if (results.success === 1) {
                    if (tr.length > 0) {
                        tr.remove()
                    }
                }
            })
    })

    $('.search').click(function() {
        var target = $('.resource').val()

        $.ajax({
            type: 'GET',
            url: '/admin/movie/crawl?url=' + target
            })
            .done(function(results) {
                if (results.success === 1) {
                    console.log(results);
                }
            })

        $.ajax({
                type: 'GET',
                url: '/admin/movie/list_target?url=' + target
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
