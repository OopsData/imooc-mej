$(function() {
    $('.del')
        .click(function(e) {
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

    $('.search')
        .click(function() {
            var target = $('.resource').val()

            $.ajax({
                    type: 'GET',
                    url: '/admin/movie/list_target?url=' + target
                })
                .done(function(results) {
                    if (results.success === 1) {
                        var html = ''
                        if (results.movie) {
                            var movie = results.movie
                            for (var i=0; i<movie.length; i++) {
                                html += '<tr class="item-id-"' + movie[i]._id + '>'
                                     +  '<td>' + movie[i].subtitle + '</td>'
                                     +  '<td>' + movie[i].playCount + '</td>'
                                     +  '<td>' + movie[i].duration + '</td>'
                                     +  '<td>' + movie[i].upCount + '</td>'
                                     +  '<td>' + movie[i].downCount + '</td>'
                                     +  '<td>' + movie[i].commentCount + '</td>'
                                     +  '<td>' + movie[i].shareCount + '</td>'
                                     +  '<td>' + movie[i].score + '</td>'
                            }
                        }
                    }
                    $('.myTable tbody').html(html) 
                })
        })

    $('.track')
        .click(function() {
            var target = $('.resource').val()

            $.ajax({
                type: 'GET',
                url: '/admin/movie/crawl?url=' + target
                })
                .done(function(results) {
                    if (results.success === 1) {
                        console.log(results.data);
                    } else {
                        // if not signed in, return to signin page
                        location.href = '/signin'
                    }
                })
        })
})
