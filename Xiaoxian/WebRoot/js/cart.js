/**
 * 读取购物车信息
 */
$.post("UserLoginServlet", "cz=getPro", function(data) {
	var strhtml = ""
	for (var i = 0; i < data.length; i++) {
		strhtml += "<tr class='protr"+data[i].proid+"'><td style='width: 5%;'><input type='checkbox' class='checkInput' /><input type='hidden' value="+data[i].proid+"  /></td><td class='goods'><img src='products-images/" + data[i].imgUrl + "' class='goods-left'/><div class='goods-right'><p>" + data[i].name + "</p><p class='tip'>参数：<span style='margin-right: 5px;'></span></p></div></td><td>" + data[i].promotePrice + "</td><td class='num num"+data[i].proid+"'><a href=javaScript:void(0) onclick=shopNumJian("+data[i].proid+") >-</a>&nbsp;&nbsp;<input type='text' disabled value=" + data[i].num + " />&nbsp;&nbsp;<a href=javaScript:void(0) onclick=shopNumJia("+data[i].proid+")>+</a></td><td class='redcolor'>" + (data[i].promotePrice * data[i].num).toFixed(2) + "</td><td class='del'><a href=javaScript:void(0) onclick=delPro("+data[i].proid+")>删除</a><br/><a>移入收藏夹</a></td></tr>";
	}
	$(".shopproInfo").html(strhtml);
},
	"JSON")
//商品数量减
function shopNumJian(id){
	var count=parseInt($(".num"+id).children("input").val()) ;
	if(count>1){
		count--;
		$(".num"+id).children("input").val(count);
		var price=parseFloat($(".num"+id).prev().text());	//获得单价
		var money=(count*price).toFixed(2);		//取小数点后两位
		$(".num"+id).next().text(money);		//修改单一商品总价
		jsmoney();
	//还得数据库操作，因为上面的购物车信息还得变
	$.post("ShopUpdeleDelServlet","cz=upnum&id="+id+"&num="+count,function(data1){
		if(data1 == "true"){						
			//将上方的购物车信息刷新
			 //构建购物车信息
			 $.post("UserLoginServlet","cz=getshopcar",function(data){	
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
			 },"JSON")
		}else{
			alert("修改数量失败");
		}
	})
}
}
var ids=new Array();
//商品数量加
function shopNumJia(id){
	var count=parseInt($(".num"+id).children("input").val()) ;
	count++;
	$(".num"+id).children("input").val(count);
	var price=parseFloat($(".num"+id).prev().text());
	var money=(count*price).toFixed(2);
	$(".num"+id).next().text(money);
	jsmoney();
	//修改上方购物车信息
	$.post("ShopUpdeleDelServlet","cz=upnum&id="+id+"&num="+count,function(data1){
		if(data1 == "true"){						
			//将上方的购物车信息刷新
			 //构建购物车信息
			 $.post("UserLoginServlet","cz=getshopcar",function(data){	
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
			 },"JSON")
		}else{
			alert("修改数量失败");
		}
	})
	
}
$(document).ready(function(){
	//点击全选按钮
	$(".allcheck").click(function(){		
		if($(this).prop("checked")){	
			$(".shopproInfo :checkbox").prop("checked", true);		
			jsmoney();
		}else{
			$(".shopproInfo :checkbox").prop("checked", false);	
			jsmoney();
		}
	})
	
})
//计算商品总价
 function jsmoney() {		                	
	var produs=$(".checkInput");
	var money=0;    //价格总计
	produs.each(function(){
		if($(this).prop("checked")){
			money+=parseFloat($(this).parent().siblings(".redcolor").text()); ;
		}
	})
	 $(".footer td:last span").text(money.toFixed(2));
  }

//单一复选框点击
$('body').on('click','.checkInput',function(){
	//alert($(this).prop("checked"));	//正确
	jsmoney();
	var produs=$(".checkInput");	
	var len=$(".checkInput").length; //获得购物车商品个数
	var count=0;
	produs.each(function(){
		if($(this).prop("checked")){
			count++;
		}
	})
	if(count == len){			//当商品复选框长度选中的长度等于商品个数时,说明全部选中，则设置全选为选中
		$(".allcheck").prop("checked", true);
	}else{
		$(".allcheck").prop("checked", false);
	}	
})
//因为其他地方也需要用，准备放在头部调用的js(shopping-car.js)上面，实现共享
//删除点击事件	这里是生成的点击事件，也试试用on
function delPro(id){
	$.post("ShopUpdeleDelServlet","cz=del&id="+id,function(data1){
		if(data1 == "true"){			
			new TipBox({
				type : 'success',
				str : '删除成功',
				hasBtn : true
			});
			//数据库已经成功删除，将当前商品对应的html()删除
			$(".shopproInfo .protr"+id+"").remove();			
			jsmoney();
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
}
var str="";			
//结算点击事件
$(".btn").click(function(){
	//获得用户选中的商品
	var flag=false;
	var produs=$(".checkInput");
	//需判断用户是否选中商品
	produs.each(function(index){
		if($(this).prop("checked")){			
			//这就是用户选中的商品信息，直接显示在结算页面		
			var id=$(this).next().val(); //获得选中商品id	
			str+=id+",";
			flag=true;
		}
	})
	if(flag){
		location.href="order.html?ids="+str;				
	}else{
		new TipBox({
			type : 'success',
			str : '请选择结算商品',
			hasBtn : true
		});
	}
})


/*var vm=new Vue({
	el:"#app",
	data:{
		totalMoney:0,
		productList:[],
		checkAllFlag:false
	},
	filters:{
		formatMoney: function (value) {
			return "￥ "+value.toFixed(2);
		}
	},
	mounted:function(){
		this.cartView();
	},
	methods:{
		cartView:function () {
			var _this=this;
			//获取商品数据信息			
			this.$http.get("data/cartData.json").then(function (res) {
				_this.productList = res.body.result.list;
				
			})
		},
		//点击增加或减少商品数量按钮后修改对应金额
		changeMoney:function (product,way) {
			if (way>0) {
				product.productQuentity++;
			}else{
				product.productQuentity--;
				if (product.productQuentity<1) {
					product.productQuentity=1;
				}
			}
			this.getTotalMoney();
		},
		//单选框设置
		checkBox:function (item){
			var _this=this;
			var num=0;
			if (typeof item.check == "undefined") {
				this.$set(item,"check",true);
			}else{
				item.check = !item.check;
			}
			this.productList.forEach(function (item,value) {
				if (item.check) {
					num++;
				}
			})
			if (num==_this.productList.length) {
				this.checkAllFlag=true;
			}else{
				this.checkAllFlag=false;
			}
			this.getTotalMoney();
		},
		//全选按钮设置
		checkAll:function (){
			var _this=this;
			this.checkAllFlag = !this.checkAllFlag;
			this.productList.forEach(function(item,index){
				if (typeof item.check == "undefined") {
					_this.$set(item,"check",_this.checkAllFlag);
				}else{
					item.check = _this.checkAllFlag;
				}
			})
			this.getTotalMoney();
		},
		//总金额设置
		getTotalMoney:function () {
			var _this=this;
			this.totalMoney = 0;
			this.productList.forEach(function (item,index) {
				if (item.check) {
					_this.totalMoney += item.productQuentity*item.productPrice;
				}
			})
		},
		//删除商品
		del: function (item) {
			var index=this.productList.indexOf(item);
			this.productList.splice(index,1);
			this.getTotalMoney();
		}
	}
})*/