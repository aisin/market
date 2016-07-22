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
            $id = self.data('id'),
            s = self.find('s'),
            num = parseInt(s.text());

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
                    if (data.success) {
                        if (data.like) {
                            s.text(++num);
                            self.addClass('did');
                        } else {
                            s.text(--num);
                            self.removeClass('did');
                        }
                    } else {
                        Message(data.message);
                    }
                    self.removeClass('disabled');
                }
            });
        }
    });

    /**
     * Topic Collect
     */

    $('.J_TopicCollect').on('click', function(){
        var self = $(this),
            $id = self.data('id');

        if (!self.hasClass('disabled')) {
            self.addClass('disabled');
            $.ajax({
                url: '/t/collect',
                dataType: 'json',
                type: 'post',
                data: {
                    id: $id,
                    _csrf: G._csrf
                },
                success: function (data) {
                    if (data.success) {
                        if (data.collect) {
                            self.addClass('did');
                        } else {
                            self.removeClass('did');
                        }
                    } else {
                        Message(data.message);
                    }
                    self.removeClass('disabled');
                }
            });
        }
    });

    /**
     * Comment Like
     */

    $(document).on('click', '.J_CommentLike', function () {
        var self = $(this);
        $id = self.data('id'),
        s = self.find('s'),
        num = parseInt(s.text());

        console.log($id);

        if (!self.hasClass('disabled')) {
            self.addClass('disabled');
            $.ajax({
                url: '/comment/like',
                dataType: 'json',
                type: 'post',
                data: {
                    id: $id,
                    _csrf: G._csrf
                },
                success: function (data) {
                    if (data.success) {
                        if (data.like) {
                            s.text(++num);
                            self.addClass('did');
                        } else {
                            s.text(--num);
                            self.removeClass('did');
                        }
                    } else {
                        Message(data.message);
                    }
                    self.removeClass('disabled');
                }
            });
        }
    });
});