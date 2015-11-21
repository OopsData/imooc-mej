$(function() {
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
