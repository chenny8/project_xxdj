const funcs = function (){}
let res ="";
funcs.ajaxReq = function ($, msg,data, url, callBack=null) {
    if(callBack===null){
        callBack = function(res){
            if(res.code === 0){
                layer.msg("处理成功！",{icon:1,time:1000});
            }else{
                layer.msg("处理失败！",{icon:2,time:1000});
            }
        }
    }
    layer.confirm(msg, {btn: ['确定', '取消'], title: "提示"}, function (index) {
        $.ajax({
            type: "post",
            url: url,
            data: data,
            dataType: "json",
            async: true,
            beforeSend: function () {
                layer.msg('处理中...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                })
            },
            success: callBack,
        });
    });
}