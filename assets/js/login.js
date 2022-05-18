$(function(){
  $('#link_reg').on('click',()=>{
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#link_login').on('click',()=>{
    $('.login-box').show()
    $('.reg-box').hide()
  })
 // 通过layui获取form对象
 let form =layui.form
//  获取layer对象
let layer =layui.layer
 // 获取form的verify方法自定义校验规则
 form.verify({
  //  自定义了一个叫pwd的校验规则
   pwd:[
     /^[\S]{6,12}$/
     ,'密码必须6到12位，且不能出现空格'
   ] 
   ,repwd:function(value){
    //  通过形参获取重复密码的value
    let repwd =value
    // 在获取密码的value
    let pwd=$('.reg-box [name=password]').val()
    // 然后进行依次判断，看这两个的值是否完全相等
    if(pwd !== repwd) return '两次输入密码不一致'
    // 如果不相等，就return一个错误信息
   }
 })

//  注册表单的提交
//  监听提交事件
 $('#form-reg').on('submit',function(e){
  //  阻止form表单的默认提交时间
  e.preventDefault()
  // 发起post请求
  $.post('/api/reguser',
  {
    username:$('#form-reg [name=username]').val(),password:$('#form-reg [name=password]').val()
  },function(res){
    if(res.status!==0){
      return layer.msg(res.message)
    }
    layer.msg('注册成功')
    $('#link_login').click()
  })
 })

//  登录表单的提交
// 监听提交时间
$('#form-login').on('submit',function(e){
  // 组织form表单的默认推荐行为
  e.preventDefault()
  // 发起登录请求
  $.post('/api/login',{
    username:$('#form-login [name=username]').val(),password:$('#form-login [name=password]').val()
  },function(res){
    if(res.status!==0){
      return layer.msg(res.message)
    }
    layer.msg('登陆成功')
    // 登陆成功后得到的字符串，保存到locakStorage中
    localStorage.setItem('token',res.token)
    // 跳转到index主页
    location.href='/index.html'
  })
})
})
 