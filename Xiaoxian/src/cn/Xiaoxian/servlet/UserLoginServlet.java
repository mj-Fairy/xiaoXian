package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.Util.FileCartJSON;
import cn.Xiaoxian.Util.ShoppingCar;
import cn.Xiaoxian.dao.UserLoginDao;
import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.entity.User;
import cn.Xiaoxian.service.ShoppingCarService;
import cn.Xiaoxian.service.UserLoginServse;
import cn.Xiaoxian.service.impl.ShoppingCarimpl;
import cn.kuwo.vo.UserVo;

public class UserLoginServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		PrintWriter out=resp.getWriter();
		String caoz=req.getParameter("cz");
		HttpSession session=req.getSession();
		UserVo str=(UserVo)session.getAttribute("user");
		UserLoginDao uld=new UserLoginServse();
		ShoppingCarService scs=new ShoppingCarimpl();		//购物车业务实现类
		UserVo uv=null;
		//执行登录模块
		if(caoz.equals("login")){
			User us=new User();
			us.setName(req.getParameter("phone"));
			us.setPhone(req.getParameter("phone"));
			us.setPassword(req.getParameter("pass"));
			uv=uld.userLogin(us);			
			if(uv!=null){
				session.setAttribute("user", uv);	//保存用户名
				out.write(""+1);
			}else{
				out.write(""+0);
			}
			//判断是否登录
		}else if(caoz.equals("islogin")){		
				if(str!=null){
					out.print(str.getUname());
				}
				//登录成功读取用户购物车信息
				//再读取session中的信息将其一起加入购物车
		}else if(caoz.equals("getshopcar")){
			List<ShoppingCar> sclist=(List<ShoppingCar>)session.getAttribute("shopcart");
			if(sclist == null){		//当session中没数据时，没有操作,有数据时，将其加入购物车
				System.out.println("");
			}else{
				//有数据时
				List<ShoppingCar> spclist= scs.getShopInfo(str.getId());		//先获取用户购物车信息
				System.out.println(str.getId());
				if(spclist==null){			//用户数据库为空时将所有session中的信息插入
					for (int i = 0; i < sclist.size(); i++) {
						scs.addShoppingCar(spclist.get(i));						
					}
					session.removeAttribute("shopcart");
				}else{
					//两者都有信息
					for (int i = 0; i < spclist.size(); i++) {
						//将session中的商品与数据库中商品比对
						for (int j = 0; j < sclist.size(); j++) {
							if(spclist.get(i).getProid() == sclist.get(j).getProid()){	//有一样的商品
								spclist.get(i).setNum(spclist.get(i).getNum()+sclist.get(j).getNum());
								ShoppingCar sc2=spclist.get(i);
								scs.UpdateProNum(sc2);		//加完数量后修改数据库数量
								sclist.remove(j);		//session中与数据库一样的商品信息已将商品上了加上，所以可用删除掉session中的该商品信息
								j--;				//因为list删除完一个集合后下标自动前移，所以要减一个
							}
						}						
					}
					for (int i = 0; i < sclist.size(); i++) {
						ShoppingCar sc=new ShoppingCar();
						sc.setUserid(str.getId());
						sc.setProid(sclist.get(i).getProid());
						sc.setNum(sclist.get(i).getNum());
						scs.addShoppingCar(sc);
					}
					session.removeAttribute("shopcart");	//清除session中信息
				}
			}
			//读取用户购物车信息
			List<ShoppingCar> getsclist= scs.getShopInfo(str.getId());		
			for (int i = 0; i < getsclist.size(); i++) {
				Product pd=scs.getProduct(getsclist.get(i).getProid());	
				getsclist.get(i).setImgUrl(pd.getImgUrl());
				getsclist.get(i).setName(pd.getName());				
				getsclist.get(i).setPromotePrice(pd.getPromotePrice());				
			}
			String scstr=JSON.toJSONString(getsclist);
			out.print(scstr);		//该返回商品集合
		}else if(caoz.equals("getPro")){
			List<ShoppingCar> getsclist= scs.getShopInfo(str.getId());	
			for (int i = 0; i < getsclist.size(); i++) {
				Product pd=scs.getProduct(getsclist.get(i).getProid());	
				getsclist.get(i).setImgUrl(pd.getImgUrl());
				getsclist.get(i).setName(pd.getName());				
				getsclist.get(i).setPromotePrice(pd.getPromotePrice());				
			}
			String scstr=JSON.toJSONString(getsclist);
			out.print(scstr);		//该返回商品集合
		}
		out.flush();
		out.close();
	}

}
