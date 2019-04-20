/**
 * 头部js
 */
$(document).ready(function(){
	var menus=new Array(2,3,5);		//导航栏对应id
	for(var i=0;i<menus.length;i++){
		getMenu(menus[i]);
	}
	//心愿单判断是否登录
	$(".fa-heart").click(function(){
		$.post("IsUserLogin","",function(data){
			if(data.toString().trim() == ""){
				
			}else{
				location.href="wishlist.html";
			}
		},"text")
	})
	//登录按钮判断是否登录
	$(".clicklogin").click(function(){
		$.post("IsUserLogin","",function(data){
			if(data.toString().trim() == ""){
				location.href="login.html";				
			}else{
				
			}
		},"text")
	})
	
	$.post("UserLoginServlet","cz=islogin",function(datawelcome){
		if(datawelcome.toString().trim() == ""){
			//则未登录		
			$(".welcome-msg").text("欢迎来到小鲜");		
			 window.sessionStorage.setItem("pull-right",$(".pull-right").html());	//未登录时保存购物车信息
		}else{
			//已登录
			$(".welcome-msg").text("欢迎您:"+datawelcome);					
			//清空购物车列表
			 $("#cart-sidebar").empty();
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
						 str+="<li class='item' shoppid="+data[i].proid+"><div class='item-inner'><a class='product-image' title='"+data[i].name+"' href='shopping_cart.html?id="+data[i].id+"'><img alt='Retis lapen casen'  src='products-images/"+data[i].imgUrl+"'></a><div class='product-details'><div class='access'><a class='btn-remove1' title='Remove This Item' href='#'>删除</a><a class='btn-edit' title='Edit item' href='#'><i class='fa fa-pencil'></i><span class='hidden'>编辑</span></a></div><strong>"+data[i].num+"</strong>x <span class='price'>"+data[i].promotePrice+"</span><p class='product-name'><a href='shopping_cart.html"+data[i].proid+"'>"+data[i].name+"</a></p></div></div></li>";
						 money+=parseInt(data[i].num)* parseFloat(data[i].promotePrice);
					 }
					 $("#cart-sidebar").html(str);
					 var len= $("#cart-sidebar").children().length;
					 $(".cart_count").text(len);		//购物车商品个数
					 $(".cart-title").next().text("￥"+money.toFixed(2));		//总价格
					 window.sessionStorage.setItem("pull-right",$(".pull-right").html());		//保存登录后的购物车信息					
				 }
			 },"JSON")
		}
		
	})
})

//根据一级菜单id读取二级菜单和三级菜单
function getMenu(id){	//生成二三级菜单
	$.getJSON("ProductServlet","id="+id,function(data){		
		$ul=$(".product-memu"+id);
		var str="";
		for(var pro in data){
			str+="<li class='level3 parent item'><a href='grid.html'><span>"+pro+"</span></a><ul class='level1'>";
			var dataval=data[pro];
			for(var proval in dataval){
				if(id == 4 || id==5){
					str+="<li class='level2'><a href='product_detail.html?id="+dataval[proval].id+"'><span>"+dataval[proval].name+"</span></a></li>";				
				}else{
					str+="<li><a href='product_detail.html?id="+dataval[proval].id+"'><span>"+dataval[proval].name+"</span></a></li>";									
				}
			}
			str+="</ul></li>";	//将二三级菜单放入里面
			window.sessionStorage.setItem("product-memu"+id,str);
			$ul.html(str);
		/*	$ul.append(str);*/
		}
	})
}
getSessionStorage();
//内容恢复
function getSessionStorage(){
	 //读取sessionStorage对象中的内容			//三个菜单的子菜单选
		var sc2= window.sessionStorage.getItem("product-memu2");
		var sg3=window.sessionStorage.getItem("product-memu3");
		var gg5=window.sessionStorage.getItem("product-memu5");		
		
		var makcart= window.sessionStorage.getItem("pull-right");		//插入购物车信息
				
	//不为空表示是返回上一步进入该页面的。
		if(sc2!=null){
		 	//将sessionStorage对象中保存的页面添加到页面中
			$(".product-memu2").html(sc2);			
			$(".product-memu3").html(sg3);		
			$(".product-memu5").html(gg5);	
		}		
		if(makcart!=null){
			$(".pull-right").html(makcart);	
		}
}

