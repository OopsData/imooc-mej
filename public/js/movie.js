/**
 * jquery 需要1.6以上
 */
$(function() {
    // 删除跟踪任务
    $('.del')
        .click(function() {
            var id = $(this).data('id')
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
                if (ids.length == 0) {
                    alert('请选择！')
                    return false
                }
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

            if (target != undefined) {
                tr.siblings('.state').text('进行中')
                $(this).attr('disabled', true)
                $(this).siblings('.stop-track').attr('disabled', false)
            } else {
                var targets = []
                $("input[name='subBox']")
                    .each(function() {
                        if ($(this).prop('checked') === true) {
                            var _tr = $(this).parent().parent()
                            _tr.siblings('.state').text('进行中')
                            _tr.siblings('.op').children('.start-track').attr('disabled', true)
                            _tr.siblings('.op').children('.stop-track').attr('disabled', false)
                            var item = _tr.siblings('input').val()
                            targets.push(item)
                        }
                    })

                if (targets.length == 0) {
                    alert('请选择！')
                    return false
                }
            }

            target = target || targets.join(',')
            $.ajax({
                    type: 'post',
                    url: '/admin/movie/track',
                    data: {
                        'url': target,
                        'state': 1
                    }
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

            if (target != undefined) {
                tr.siblings('.state').text('已停止')
                $(this).attr('disabled', true)
                $(this).siblings('.start-track').attr('disabled', false)
            } else {
                var targets = []
                $("input[name='subBox']")
                    .each(function() {
                        if ($(this).prop('checked') === true) {
                            var _tr = $(this).parent().parent()
                            _tr.siblings('.state').text('已停止')
                            _tr.siblings('.op').children('.start-track').attr('disabled', false)
                            _tr.siblings('.op').children('.stop-track').attr('disabled', true)
                            var item = $(this).parent().parent().siblings('input').val()
                            targets.push(item)
                        }
                    })
                if (targets.length == 0) {
                    alert('请选择！')
                    return false
                }
            }

            target = target || targets.join(',')

            $.ajax({
                    type: 'post',
                    url: '/admin/movie/track',
                    data: {
                        'url': target,
                        'state': 0
                    }
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
    // 分页功能
    var options = {
        currentPage: 2,
        totalPages: 5,
        numberOfPages: 5,
        bootstrapMajorVersion: 3
    }
    $('.page-movie').bootstrapPaginator(options)
})
