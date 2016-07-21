/**
 * 全局消息提醒
 */

function Message (msg) {
    layer.msg(msg, {
        offset: 10,
        shift: 5
    });
}

(function ($) {

    this.Modal = function () {
        var self = this;
        self.starter = $('[data-toggle="modal"]');
        var target = self.starter.attr('data-target');
        self.target = $(target);

        self.load();
        self.close();
    };

    Modal.prototype.load = function () {
        var self = this;
        self.starter.click(function(e){
            e.preventDefault();
            self.target.show();
        });

        //close
        
    };

    Modal.prototype.close = function(){
        $('.modal').find('.hd > .close').click(function(){
            var $modal = $(this).parents('.modal');
            $modal.hide();
        });
    };

    new Modal();



} (jQuery));