$(function() {
    $('.del')
        .click(function(e) {
            var target = $(e.target)
            var id = target.data('id')
            var tr = $('.item-id-' + id)

            $.ajax({
                    type: 'DELETE',
                    url: '/admin/trackable/list?id=' + id
                })
                .done(function(results) {
                    if (results.success === 1) {
                        if (tr.length > 0) {
                            tr.remove()
                        }
                    }
                })
        })
    $('.start-track')
        .click(function() {
            var tr = $(this).parent()
            var target = tr.siblings('.resource').text()
            tr.siblings().eq(1).text('进行中')

            $(this).addClass('active btn-disabled')
            $(this).siblings('.stop-track').removeClass('active btn-disabled')

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
    $('.stop-track')
        .click(function() {
            var tr = $(this).parent()
            var target = tr.siblings('.resource').text()
            tr.siblings().eq(1).text('已停止')

            $(this).addClass('active btn-disabled')
            $(this).siblings('.start-track').removeClass('active btn-disabled')

            $.ajax({
                    type: 'get',
                    url: '/admin/trackable' +
                        '?url=' + target +
                        '&trackable=0'
                })
                .done(function(data) {
                    // console.log(data);

                })
        })
})
