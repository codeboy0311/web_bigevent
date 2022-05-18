$(function(){
    getUserInfo()
    // 点击按钮实现推出的行为
    const layer = layui.layer
    $('.layui-nav-item').on('click',function(){
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 第一件要清空本地存储中的 token
            localStorage.removeItem('token')
            // 第二件事重新跳转到登录页
            location.href='/login.html'
            // 关闭confirm询问窗
            layer.close(index);
          });
    })
    
})

// 发起ajax请求
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers就是请求头的配置对象
        // headers:{
        //     Authorization: localStorage.getItem('token')||''
        // },
        success:function(res){
            if(res.status!==0) return console.log(res.message)
           renderAvant(res.data)
          
        },
        // // 无论请求是成功还是失败都会执行complete函数
        // complete:function(res){
        //    if(res.responseJSON.status===1&&res.responseJSON
        //     .message==='身份认证失败！'){
        //         // 强制清空token
        //         localStorage.removeItem('token')
        //     // 强制跳转到登录页面
        //     location.href='/login.html'
        // }
        // }
            
    })
}
// 渲染用户的头像函数
 function renderAvant(user){
    // 第一步获取用户名称
    let name= user.nickname|| user.username 
    // 设置欢迎文本
    $('.welcome').html('欢迎'+name)
    // 按需渲染用户的头像
    if(user.user_pic!==null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avater').hide()
    }else{
        $('.layui-nav-img').hide()
        let first =name[0]
        $('.text-avater').html(first).show()
    }

 }