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
