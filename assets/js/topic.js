$(function(){
    $("#category").select2();

    var editor = new Simditor({
        textarea: $('#content'),
        placeholder: '文明上网，文明发言',
        defaultImage: 'images/image.png'
    });

    $('form#newTopic').on('submit', function(event){

        // event.preventDefault();
        var title = $.trim($('#title').val());
        var content = $.trim($('#content').val());
        var category = $('#category').val();

        // if(!title) return Message('title!!!!!');

        if(!title){
            Message('请输入标题');
            return false;
        }else if(!content){
            Message('请输入内容');
            return false;
        }else if(!category){
            Message('请选择一个节点');
            return false;
        }
        return true;
    });
});