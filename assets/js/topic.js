$(function () {

    typeof $.fn.select2 !== 'undefined' && $("#category").select2();

    typeof Simditor !== 'undefined' && new Simditor({
        textarea: $('#content'),
        placeholder: '文明上网，文明发言',
        defaultImage: 'images/image.png'
    });

    $('form#newTopic').on('submit', function (event) {

        // event.preventDefault();
        var title = $.trim($('#title').val());
        var content = $.trim($('#content').val());
        var category = $('#category').val();

        // if(!title) return Message('title!!!!!');

        if (!title) {
            Message('请输入标题');
            return false;
        } else if (!content) {
            Message('请输入内容');
            return false;
        } else if (!category) {
            Message('请选择一个节点');
            return false;
        }
        return true;
    });

    /**
     * Topic Like
     */

    $('.J_TopicLike').on('click', function () {
        var self = $(this),
            $id = self.data('id');

        if (!self.hasClass('disabled')) {
            self.addClass('disabled');
            $.ajax({
                url: '/t/like',
                dataType: 'json',
                type: 'post',
                data: {
                    id: $id,
                    _csrf: G._csrf
                },
                success: function (data) {
                    console.log(data);
                    if(data.success){
                        
                    }
                    Message(data.message);
                    self.removeClass('disabled');
                }
            });
        }
    });
});