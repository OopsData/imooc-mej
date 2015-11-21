$(function() {
    $('.search')
        .click(function() {
            var target = $('.resource').val()

            $.ajax({
                    type: 'GET',
                    url: '/admin/movie/search?url=' + target
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
    $('.add-track')
        .click(function() {
            var target = $('.resource').val()

            $('.alert >span').html("已经开始跟踪 " + target)
            $(".alert").removeClass("hide").addClass("show");

            $.ajax({
                    type: 'get',
                    url: '/admin/trackable' +
                        '?url=' + target +
                        '&trackable=1'
                })
                .done(function(data) {
                    // console.log(data);

                })
        })
    $('.close')
        .click(function() {
            $(".alert").removeClass("show").addClass("hide");
            $('.alert >span').html('')
        })
    
})
