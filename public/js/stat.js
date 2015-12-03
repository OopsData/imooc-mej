$(function() {
    $('.close')
        .click(function() {
            // $(".alert").removeClass("show").addClass("hide");
            // $('.alert >span').html('')
        })
    $('.del')
        .click(function(e) {
            var target = $(e.target)
            var id = target.data('id')
            var tr = $('.item-id-' + id)

            $.ajax({
                    type: 'DELETE',
                    url: '/admin/stat/list?id=' + id
                })
                .done(function(results) {
                    if (results.success === 1) {
                        if (tr.length > 0) {
                            tr.remove()
                        }
                    }
                })
        })
    //分页功能
    var options = {
        currentPage: 2,
        totalPages: 5,
        numberOfPages: 5,
        bootstrapMajorVersion: 3
    }
    $('.page-stat').bootstrapPaginator(options)
})
