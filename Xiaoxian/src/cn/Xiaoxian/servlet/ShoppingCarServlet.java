package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import cn.Xiaoxian.Util.ShoppingCar;
import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.service.ShoppingCarService;
import cn.Xiaoxian.service.impl.ShoppingCarimpl;
import cn.kuwo.vo.UserVo;


public class ShoppingCarServlet extends HttpServlet  {
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		PrintWriter out=resp.getWriter();
		//这里的问题是，当我点击加入购物车时才会触发，但是当我没登陆时，加入session中时，再登录成功后不会刷新，需再点击加入购物车才会刷新
		HttpSession session=req.getSession();		
		
		UserVo  uv=(UserVo)session.getAttribute("user");			
		
		int id=Integer.parseInt(req.getParameter("id")); //获得要购买的商品id
		
		int num=Integer.parseInt(req.getParameter("num")); //获得要购买的商品数量	
		
		ShoppingCarService scs=new ShoppingCarimpl();		//购物车业务实现类
		
		@SuppressWarnings("unchecked")
		List<ShoppingCar> sclist=(List<ShoppingCar>)session.getAttribute("shopcart");			//获取session中的购物车信息		
		if(uv == null){
			//说明未登录,将购物车信息保存在session中
			//要考虑session中有没有商品，有商品时要哦判断有没有重复商品，有就数量加1
			//因为没有用户id，所以这里只保存商品id和数量
			if(sclist == null){		//当购物车为空时创建一个购物车,并将用户要加入的商品id及数量集合存储进购物车
				sclist=new ArrayList<ShoppingCar>();
				ShoppingCar sc=new ShoppingCar();
				sc.setProid(id);
				sc.setNum(num);
				sclist.add(sc);
				session.setAttribute("shopcart", sclist);
			}else{
				//当购物车中有商品信息时
				//判断有没有重复商品，有则商品数量+购买数量，没有则添加一个商品信息
				/*for (ShoppingCar sc : sclist) {
					if(sc.getProid()==id){
						sc.setNum(sc.getNum()+num);
					}else{
						ShoppingCar sc1=new ShoppingCar();
						sc1.setProid(id);
						sc1.setNum(num);	
						sclist.add(sc1);
					}
				}*/
				boolean flag=true;
				for (int i = 0; i < sclist.size(); i++) {
					if(sclist.get(i).getProid()==id){
						sclist.get(i).setNum(sclist.get(i).getNum()+num);
						flag=false;
					}
				}				
				if(flag){
					ShoppingCar sc1=new ShoppingCar();
					sc1.setProid(id);
					sc1.setNum(num);	
					sclist.add(sc1);
				}
				session.setAttribute("shopcart", sclist);				
			}
			//未登录时展示购物车
			//ShoppingCarServlet scs=new ShoppingCarimpl();
			List<Product> plist=new ArrayList<Product>();
			for (ShoppingCar sc : sclist) {
				//根据购物车的商品id查找商品信息显示在购物车
				Product pd=scs.getProduct(sc.getProid());		
				sc.setName(pd.getName());
				sc.setImgUrl(pd.getImgUrl());
				sc.setPromotePrice(pd.getPromotePrice());
			}		
			String scstr=JSON.toJSONString(sclist);
			out.print(scstr);		//返回商品集合
		}else{
			//说明已登录,获得用户id，将要加到购物车的商品添加到数据库	
			//查询session中是否有未登录时添加的数据，有则添加到数据库
			//从数据库读取购物车信息  购物车信息有商品id，用户id，商品数量，再根据商品id获取商品信息
			//再返回给页面展示		
			//记得将刚刚添加的商品也加进数据库
			int uid=uv.getId();
			List<ShoppingCar> spclist= scs.getShopInfo(uid);		//获得该用户数据库的购物车信息,后续添加的购物车信息也放在这，然后再存进去
			//根据id查找数据库的购物车信息，用于判断有没有重复商品
			if(sclist == null){		//判断登录前是否有购物车信息
				//直接从数据库读取数据,读取完然后再判断是否有重复商品
				if(spclist ==null){		//再判断数据库有没有商品信息
					//直接将该商品添加进购物车
					ShoppingCar sc1=new ShoppingCar();
					sc1.setUserid(uid);
					sc1.setProid(id);
					sc1.setNum(num);	
					int count=scs.addShoppingCar(sc1);
					if(count>0){
						//添加成功
						System.out.println("添加成功");
					}else{
						System.out.println("有异常");
					}
				}else{	//用户购物车不空的话要判断有没有该商品，有则商品数量++
					boolean isysp =true;
					for (int i = 0; i < spclist.size(); i++) {
						if(spclist.get(i).getProid()==id){		//当存在重复商品时
							spclist.get(i).setNum(spclist.get(i).getNum()+num);	
							isysp=false;
							int count=scs.UpdateProNum(spclist.get(i));
							if(count>0){
								//修改数量成功
								System.out.println("修改成功");
							}else{
								System.out.println("有异常");
							}
						}
					}
					if(isysp){
						ShoppingCar sc1=new ShoppingCar();
						sc1.setUserid(uid);
						sc1.setProid(id);
						sc1.setNum(num);	
						int count=scs.addShoppingCar(sc1);
						if(count>0){
							//添加成功
							System.out.println("添加成功1");
						}else{
							System.out.println("有异常");
						}
					}
				}
			}else{
				//说明session中有数据,将session中的数据添加到数据库
				if(spclist == null){		//还要判断用户购物车是否有信息
					//1直接将session中的数据添加进去并删除session中的数据
					for (int i = 0; i < sclist.size(); i++) {		
						ShoppingCar sc=new ShoppingCar();
						sc.setUserid(uid);
						sc.setProid(sclist.get(i).getProid());
						sc.setNum(sclist.get(i).getNum());
						scs.addShoppingCar(sc);
						
					}
					session.removeAttribute("shopcart");
				}else{
					//用户购物车有信息，session中也有信息
					//判断数据库购物车与session的购物车是否有一样的商品，找出一样的商品修改数量
					boolean iscf=true;
					for (int i = 0; i < spclist.size(); i++) {
						//将session中的商品与数据库中商品比对
						for (int j = 0; j < sclist.size(); j++) {
							if(spclist.get(i).getProid()==sclist.get(j).getProid()){	//有一样的商品
								spclist.get(i).setNum(spclist.get(i).getNum()+sclist.get(j).getNum());
								ShoppingCar sc2=spclist.get(i);
								scs.UpdateProNum(sc2);		//加完数量后修改数据库数量
								sclist.remove(j);		//session中与数据库一样的商品信息已将商品上了加上，所以可用删除掉session中的该商品信息
								j--;				//因为list删除完一个集合后下标自动前移，所以要减一个
							}
						}
						if(spclist.get(i).getProid()==id){		//将要添加的商品与数据库商品比对
							spclist.get(i).setNum(spclist.get(i).getNum()+num);
							scs.UpdateProNum(spclist.get(i));
							iscf=false;
						}
					}
					//这里就是都不一样的商品了，直接将所有session中的信息加到数据库
					//然后将刚添加的商品也加到数据库
					//最后再读取该用户的数据库购物车信息展示出来
					for (int i = 0; i < sclist.size(); i++) {				
						ShoppingCar sc=new ShoppingCar();
						sc.setUserid(uid);
						sc.setProid(sclist.get(i).getProid());
						sc.setNum(sclist.get(i).getNum());
						scs.addShoppingCar(sc);
						
					}
					if(iscf){
						ShoppingCar sc3=new ShoppingCar();
						sc3.setUserid(uid);
						sc3.setProid(id);
						sc3.setNum(num);
						scs.addShoppingCar(sc3);						
					}
					session.removeAttribute("shopcart");
				}				
			}			
			//已登录时展示数据  从数据库读取
			List<ShoppingCar> getsclist= scs.getShopInfo(uid);			
			for (int i = 0; i < getsclist.size(); i++) {
				Product pd=scs.getProduct(getsclist.get(i).getProid());	
				getsclist.get(i).setImgUrl(pd.getImgUrl());
				getsclist.get(i).setName(pd.getName());				
				getsclist.get(i).setPromotePrice(pd.getPromotePrice());				
			}
			String scstr=JSON.toJSONString(getsclist);
			out.print(scstr);		//返回商品集合
		}						
		out.flush();
		out.close();
	}	
}
