/**
 * joinCart(id)为要添加到购物车的商品id
 */
//替换joinCart(id)，功能一致，一般生成的代码使用该方法
$('body').on('click','.click_cart',function(e){
	var id=$(this).children(":hidden").val();
	 $.post("ShoppingCarServlet",{"id":id,"num":1},function(data){
		 new TipBox({
				type : 'success',
				str : '加入购物车成功',
				hasBtn : true
			});
		//清空购物车列表
		 $("#cart-sidebar").empty();
		 //动态构建购物车列表
		//将加入到购物车的商品显示出来	 
		 var str="";
		 var money=0;
		 for(var i=0;i<data.length;i++){
			 str+="<li class='item' shoppid="+data[i].proid+"><div class='item-inner'><a class='product-image' title='"+data[i].name+"' href='shopping_cart.html?id="+data[i].id+"'><img alt='Retis lapen casen'  src='products-images/"+data[i].imgUrl+"'></a><div class='product-details'><div class='access'><a class='btn-remove1' title='Remove This Item' href='#'>删除</a><a class='btn-edit' title='Edit item' href='#'><i class='fa fa-pencil'></i><span class='hidden'>编辑</span></a></div><strong>"+data[i].num+"</strong>x <span class='price'>"+data[i].promotePrice+"</span><p class='product-name'><a href='shopping_cart.html"+data[i].id+"'>"+data[i].name+"</a></p></div></div></li>";
			 money+=data[i].num*data[i].promotePrice;
		 }
		 $("#cart-sidebar").html(str);
		 var len= $("#cart-sidebar").children().length;
		 $(".cart_count").text(len);		//购物车商品个数
		 $(".cart-title").next().text("￥"+money.toFixed(2));		//总价格
		 window.sessionStorage.setItem("pull-right",$(".pull-right").html());
	 },"JSON")
})
/*function joinCart(id){
	 $.post("ShoppingCarServlet",{"id":id,"num":1},function(data){
		 alert("加入购物车成功"+data);		 
		//清空购物车列表
		 $("#cart-sidebar").empty();
		 //动态构建购物车列表
		//将加入到购物车的商品显示出来	 
		 var str="";
		 var money=0;
		 for(var i=0;i<data.length;i++){
			 str+="<li class='item'><div class='item-inner'><a class='product-image' title='"+data[i].name+"' href='shopping_cart.html?id="+data[i].id+"'><img alt='Retis lapen casen'  src='products-images/"+data[i].imgUrl+"'></a><div class='product-details'><div class='access'><a class='btn-remove1' title='Remove This Item' href='#'>删除</a><a class='btn-edit' title='Edit item' href='#'><i class='fa fa-pencil'></i><span class='hidden'>编辑</span></a></div><strong>"+data[i].num+"</strong>x <span class='price'>"+data[i].promotePrice+"</span><p class='product-name'><a href='shopping_cart.html"+data[i].id+"'>"+data[i].name+"</a></p></div></div></li>";
			 money+=data[i].num*data[i].promotePrice;
		 }
		 $("#cart-sidebar").html(str);
		 var len= $("#cart-sidebar").children().length;
		 $(".cart_count").text(len);		//购物车商品个数
		 $(".cart-title").next().text("￥"+money.toFixed(2));		//总价格
		 window.sessionStorage.setItem("pull-right",$(".pull-right").html());
	 },"JSON")
}*/
//mini-car迷你购物车删除点击事件
/*$('body').on('click','.btn-remove1',function(){
	var id=$(this).parents(".item").attr("shoppid");	//获得要删除的购物车商品id	
	$.post("ShopUpdeleDelServlet","cz=del&id="+id,function(data1){
	if(data1 == "true"){			
		new TipBox({
			type : 'success',
			str : '删除成功',
			hasBtn : true
		});
		//数据库已经成功删除，将当前商品对应的html()删除
		//$(this).parent(".item").
		//$(".shopproInfo .protr"+id+"").remove();					
		//将上方的购物车信息刷新
		//构建购物车信息
		$.post("UserLoginServlet","cz=getshopcar",function(data){	
			if(data.toString().trim() == ""){
				var str="";
				str+="<li class='item'><div class='item-inner'><a class='product-image' title='购物车' href=javascript:void(0)><img alt='Retis lapen casen' src='images/emptyShopping.jpg'></a><div class='product-details'><div class='access'><!-- <a class='btn-remove1' title='Remove This Item' href='#'>删除</a><a class='btn-edit' title='Edit item' href='#'><i class='fa fa-pencil'></i><span class='hidden'>编辑</span></a> --></div><strong>购物车还没有商品</strong><p class='product-name'><a href='shopping_cart.html'>快去添加吧...</a></p></div></div></li>";
				$("#cart-sidebar").html(str);
				$(".cart_count").text(0);		//购物车商品个数
				$(".cart-title").next().text("￥0.00");		//总价格
				window.sessionStorage.setItem("pull-right",$(".pull-right").html());						 
			}else{
				var str="";
				var money=0;
				for(var i=0;i<data.length;i++){
					str+="<li class='item'  shoppid="+data[i].proid+"><div class='item-inner'><a class='product-image' title='"+data[i].name+"' href='shopping_cart.html?id="+data[i].id+"'><img alt='Retis lapen casen'  src='products-images/"+data[i].imgUrl+"'></a><div class='product-details'><div class='access'><a class='btn-remove1' title='Remove This Item' href='#'>删除</a><a class='btn-edit' title='Edit item' href='#'><i class='fa fa-pencil'></i><span class='hidden'>编辑</span></a></div><strong>"+data[i].num+"</strong>x <span class='price'>"+data[i].promotePrice+"</span><p class='product-name'><a href='shopping_cart.html"+data[i].id+"'>"+data[i].name+"</a></p></div></div></li>";
					money+=data[i].num*data[i].promotePrice;
				}
				$("#cart-sidebar").html(str);
				var len= $("#cart-sidebar").children().length;
				$(".cart_count").text(len);		//购物车商品个数
				$(".cart-title").next().text("￥"+money.toFixed(2));		//总价格
				window.sessionStorage.setItem("pull-right",$(".pull-right").html());
			}
		},"JSON")
	}else{
		alert("删除失败");
	}
})
})*/



//单击结算按钮
$('body').on('click','.jiesuan',function(){
	//判断用户是否登录		
	var url="shaddredd.html";
	isLogin(url);	
})

//单击查看购物车按钮
$('body').on('click','.chakanchar',function(){
	var url="shopping_cart.html";
	isLogin(url);
})

//判断用户是否登录
function isLogin(url){
	$(".top-cart-content>p").remove();
	$.post("UserLoginServlet","cz=islogin",function(data){
		if(data.toString().trim() == ""){		
			var $p="<p style='background:#fffdee;'>还未登录<a style='background:#c81623;color:#fff;padding:1px 6px;margin:0px 3px;' href='login.html'>登录<a></p>";
			$(".top-cart-content").prepend($p);
		}else{
			window.location.href=url;
		}		
	})
}