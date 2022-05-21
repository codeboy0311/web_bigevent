$(function(){
    let layer = layui.layer
    let form = layui.form
    let laypage =layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt =new Date(date)

        let y =dt.getFullYear()
        let m =  padZero(dt.getMonth()+1)
        let d =  padZero(dt.getDate())
        let hh =  padZero(dt.getHours())
        let mm =  padZero(dt.getMinutes())
        let ss =  padZero(dt.getSeconds())
        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss
    }
    // 定义补零的函数
    function padZero(n){
       return n>9?n:'0'+n
    }
    // 定义一个查询的参数对象，将来请求服务器的时候
    // 需要将请求参数对象提交到服务器
    var q={
        pagenum:1, //页码值,默认请求第一页的数据
        pagesize:2,//每页显示几行数据,默认每页显示两行
        cate_id:'',//文章分类的id
        state:''//文章的发布状态
    }
    initTable()
    initCate()
 function initTable(){
    // 发起Ajax请求
    $.ajax({
        method:'GET',
        url:'/my/article/list',
        data:q,
        success:function(res){
           
            
            if(res.status!==0){
                return layer.msg('获取文章列表失败')
            }
            let htmlStr=template('tpl-table',res)
            $('tbody').html(htmlStr)
            renderPage(res.total)

        }
    })
 }
    


//  初始化文章分类的方法
function initCate(){
    $.ajax({
        method:'GET',
        url:'/my/article/cates',
        success:function(res){
           
            if(res.status !==0){
                return layer.msg('获取文章分类数据失败')
            }
            // 调用模板引擎渲染分类的可选项
          $('[name=cate-id]').html(template('tpl-cate',res))
        //   通知layui重新渲染表单结构
          form.render()
        }
    })
}
// 选中form表单阻止提交事件
$('#form-search').on('submit',function(e){
    e.preventDefault()
    // 获取下拉框的值
   let cate_id= $('[name=cate-id]').val()
   let state = $('[name=state]').val()
//    修改P的值
    q.cate_id=cate_id
    q.state=state
    initTable()
})

// 定义一个渲染分页的方法
function renderPage(total){
    
        //执行一个laypage实例
        laypage.render({
          elem: 'pageBox' //分页容器的id
          ,count: total, //数据总数，从服务端得到
          limit:q.pagesize,//每页显示几条数据
          curr:q.pagenum,//设置默认被选中的分页
          layout:['count','limit','prev','page','next','skip'],
          limits:[2,3,5,10],
          jump:function(obj,first){
             q.pagenum=obj.curr//把最新的页码值复制到Q的查询对象中
             q.pagesize=obj.limit
            //  根据最新的Q获取对应的数据表格，并渲染列表
            if(!first){
                initTable()
            }
          }
        })
    
}

// 通过代理的方式，为删除按钮绑定点击事件处理函数
$('tbody').on('click','.btn-delete',function(){
    // 获取所有的删除按钮对的个数
    let len = $('.btn-delete').length
    
    let id =$(this).attr('data-id')
  
    // 提示用户是否要删除
    layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
        $.ajax({
            method:'GET',
            url:'/my/article/delete/'+id,
            success:function(res){
                
                
               if(res.status!==0){
                return   layer.msg('删除分类失败')
               }
                layer.msg('删除分类成功')
            //    当数据删除完成之后，需要判断当前这一页中，是否还有剩余的数据
            // 如果没有剩余的数据了，则让页码值-1之后，
            // 再重新调用initable()方法
            if(len ===1){
                // 如果页码值等于1，证明删除完之后，页面上就没有任何数据了
                // 页码值最小必须是1
                q.pagenum=q.pagenum===1?1:q.pagenum-1
                
            }
            initTable()  
            }
        })
        layer.close(index);
    })  
  })


  // 为编辑按钮委托一个点击事件
  $('tbody').on('click','.btn-edit',function(){
    let id =$(this).attr('data-id')
    location.href='/article/art-edit.html?'+id
   

  })
})
 
 