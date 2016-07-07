$(function(){
    $("#nodes").select2();

    var editor = new Simditor({
        textarea: $('#content'),
        placeholder: '文明上网，文明发言',
        defaultImage: 'images/image.png'
    });
});