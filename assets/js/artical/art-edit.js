$(function(){
    let layer=layui.layer
    let form = layui.form
//    / /  初始化文章分类的方法
initCate()
function initCate(){
    $.ajax({
        method:'GET',
        url:'/my/article/cates',
        success:function(res){
            if(res.status !==0){
                return layer.msg('获取文章分类数据失败')
            }
            
            // 调用模板引擎渲染分类的可选项
            $('[name=cate_id]').html(template('tpl-cate',res))
        //   通知layui重新渲染表单结构
          form.render()
        }
    })
}
initEditor()



// 图片的裁剪
  // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)
// 为选择封面的按钮，绑定带年纪事件处理函数
$('#btnChooseImg').on('click',function(){   

  $('#coverfile').click()
  })

 $('#coverfile').on('change',function(e){
  
  var files = e.target.files
  if(files.length===0){
    return
  }
 
  var newImgURL = URL.createObjectURL(files[0])
  $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  
 })
//  获取id
 let id= getRequest()
  
// 发起ajax请求
$.ajax({
    method:'GET',
    url:'/my/article/'+id,
    success:function(res){
      console.log(res)
       form.val('form-pub',res.data)
    }

})

//  定义文章发布的状态，默认是已发布
 let art_state='已发布'
//  存为草稿按钮，绑定点击事件处理函数
    $('#btn_save1').on('click',function(){
  art_state='草稿'
    })

    // 为form表单绑定submit提交事件
    $('#form-pub').on('submit',function(e){
      e.preventDefault()
      // 基于form表单快速创建一个FormData对象
      let fd= new FormData($(this)[0])
    //   为fd添加id属性
    fd.append('Id',id)
      // 3将文章对的发布状态，存到fd中
      fd.append('state',art_state)
      // 4将封面裁剪过后的图片输出为一个文件对象
      $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img',blob)
        
        //发起AJAX请求
        publishArtical(fd)
      })
      
    })

    //定义一个发布文章的方法
   function publishArtical(fd) {
     $.ajax({
       method:'POST',
       url:'/my/article/edit',
       data:fd,
      //  注意如果向服务器提交的是formdata格式的数据，必须添加以下两个配置项
      contentType:false,
      processData:false,
      success:function(res){
        console.log(res)
        if(res.status!==0){
          return layer.msg("文章更新失败")
        }
       
        location.href='/article/art-list.html'
        layer.msg('文章更新成功')
      }
     })
   }
  
 




//    接受参数
function getRequest(){
    let url = location.search//获取url中？后的字符串
    if(url.indexOf('?')!==-1){
        let str = url.substr(1)
       return str
    }
}
})