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
                        $('.myTable tbody').html(html) 
                    } else {
                        location.href = '/signin'
                    }
                })
        })
    $('.close')
        .click(function() {
            $(".alert").removeClass("show").addClass("hide");
            $('.alert >span').html('')
        })
    $('.startTrack')
        .click(function() {
            var target = $('.resource').val()
            
            $('.alert >span').html("已经开始跟踪 " + target)
            $(".alert").removeClass("hide").addClass("show");
            
            $.ajax({
                type: 'get',
                url: '/admin/track' +
                     '?url=' + target +
                     '&trackable=1'
            })
            .done(function(data) {
                // console.log(data);
                
            })
        })
    $('.stopTrack')
        .click(function() {
            var target = $('.resource').val()
            
            $('.alert >span').html("不再跟踪 " + target)
            $(".alert").removeClass("hide").addClass("show");
            
            $.ajax({
                type: 'get',
                url: '/admin/track' +
                     '?url=' + target +
                     '&trackable=0'
            })
            .done(function(data) {
                // console.log(data);
                
            })
        })
})
