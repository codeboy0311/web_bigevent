$(function(){
    let layer = layui.layer
    let form =layui.form
    initArtData()
    function initArtData(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
               
               let dataStr= template('mobanStr',res)
               $('tbody').html(dataStr)
            }
        })
    }
     let indexnum=null
    $('#btnAdd').on('click',function(){
      indexnum=  layer.open({
            type:1,
            area:['500px','250px'],
            title: '添加文章分类'
            ,content: $('#dialog-add').html()
          })
    })
    $('body').on('submit','#form-dialog',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST'
            ,url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
               
                if(res.status!==0){
                    return layer.msg('新增分类失败')
                }
                initArtData() 
                layer.msg('新增分类成功')
                layer.close(indexnum)
            }  
        })
    })
    let indexedit=null
    $('body').on('click','#btn-edit',function(){
      indexedit=  layer.open({
            type:1,
            area:['500px','250px'],
            title: '修改文章分类'
            ,content: $('#dialog-edit').html()
          })
          let id = $(this).attr('data-Id')
        //   发起ajax请求
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
            success:function(res){
               form.val('form-edit',res.data)
            }
        })
    })


    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('修改分类数据失败')
                }
                initArtData()
                layer.close(indexedit)
                layer.msg('修改分类数据成功')
            }
        })
    })
    // 通过代理的形式，为删除分类的表单绑定事件
    $('body').on('click','.btn-delete',function(){
        let id =$(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    
                   if(res.status!==0){
                    return   layer.msg('删除分类失败')
                   }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtData()
                }
            })
            
        })  
    })
    
       
})