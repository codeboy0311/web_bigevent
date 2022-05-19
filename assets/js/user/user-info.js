$(function(){
    let form = layui.form
   
    form.verify({
        nickname:function(value){
         if(value.length>=6){
             return '昵称必须在1~6个字符之间'
         }
        }
    })
    initUserInfo()
    let layer =layui.layer
function initUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function(res){
            if(res.status!==0){
                return layer.msg('获取用户信息失败')
            }
            form.val('userinfo-form',res.data)
        }
    })
}
  
// 重置按钮
$('#resetBtn').on('click',function(e){
    e.preventDefault()
    initUserInfo()
})


// 修改用户个人资料
$('.layui-form').on('submit',function(e){
    e.preventDefault()
    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        data:$(this).serialize(),
        success:function(res){
            if(res.status!==0){
                return layer.msg('用户信息修改失败！')

            }
            layer.msg('用户信息修改成功')
            // 调用父页面的方法，重新渲染用户名和头像信息
            window.parent.getUserInfo()

        }
    })
})
})

