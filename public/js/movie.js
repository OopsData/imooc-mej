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

            // $('.alert >span').html("已经开始跟踪 " + target)
            // $(".alert").removeClass("hide").addClass("show");

            $.ajax({
                    type: 'get',
                    url: '/admin/movie/add' +
                        '?q=' + target
                })
                .done(function(data) {
                    // console.log(data);

                })
        })
    $('.start-track')
        .click(function() {
            var tr = $(this).parent()
            var target = tr.siblings('input[name="url"]').val()
            tr.siblings().eq(3).text('进行中')

            $(this).attr('disabled', true)
            $(this).siblings('.stop-track').attr('disabled', false)

            $.ajax({
                    type: 'get',
                    url: '/admin/movie/track' +
                        '?url=' + target +
                        '&state=1'
                })
                .done(function(data) {
                    // console.log(data);

                })
        })
    $('.stop-track')
        .click(function() {
            var tr = $(this).parent()
            var target = tr.siblings('input[name="url"]').val()
            tr.siblings().eq(3).text('已停止')

            $(this).attr('disabled', true)
            $(this).siblings('.start-track').attr('disabled', false)

            $.ajax({
                    type: 'get',
                    url: '/admin/movie/track' +
                        '?url=' + target +
                        '&state=0'
                })
                .done(function(data) {
                    // console.log(data);

                })
        })
})
