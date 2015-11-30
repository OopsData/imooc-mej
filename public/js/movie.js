/**
 * jquery 需要1.6以上
 */
$(function() {
    // 删除跟踪任务
    $('.del')
        .click(function(e) {
            var target = $(e.target)
            var id = target.data('id')
            var tr

            if (id !== undefined) {
                tr = $('.item-id-' + id)
            } else {
                var ids = []
                var trs = []
                $("input[name='subBox']")
                    .each(function() {
                        if ($(this).prop('checked') === true) {
                            var item = $(this)
                                        .parents('tr')
                                        .attr('class')
                                        .replace(/item-id-/, '')
                            ids.push(item)
                            trs.push($('.item-id-' + item))
                        }
                    })
            }
            id = id || ids.join(',')
            tr = tr || trs
            $.ajax({
                    type: 'DELETE',
                    url: '/admin/movie/list?id=' + id
                })
                .done(function(results) {
                    if (tr.length > 0) {
                        $.each(tr, function(index, ele) {
                            $(ele).remove()
                        })
                    }
                })
        })
    // 加入到跟踪列表
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
    // 开始跟踪
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
    // 停止跟踪
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
    // 批量操作
    $('.all')
        .click(function() {
            var checked = $(this).children().prop('checked')
            // input有属性时，用双引号，其他内部没有的用单引号
            $("input[name='subBox']").each(function() {
                $(this).prop('checked', checked)
            })
        })
    var $subBox = $("input[name='subBox']")
    $subBox
        .click(function() {
            $('.all')
                .prop('checked', $subBox.length == $("input[name='subBox']:checked").length ? true : false)
        })
})
