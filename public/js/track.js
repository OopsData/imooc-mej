$(function() {
    $('.start-track')
        .click(function() {
            var target = $('.resource').text()
            
            $('.start-track').addClass('active')
            $('.stop-track').removeClass('active')

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
            var target = $('.resource').text()

            $('.stop-track').addClass('active')
            $('.start-track').removeClass('active')

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
