package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.Xiaoxian.service.ShoppingCarService;
import cn.Xiaoxian.service.impl.ShoppingCarimpl;
import cn.kuwo.vo.UserVo;

public class ShopUpdeleDelServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		int id=Integer.parseInt(req.getParameter("id"));		//商品id
		
		HttpSession session=req.getSession();		
		UserVo  uv=(UserVo)session.getAttribute("user");		//用户id
		
		PrintWriter out=resp.getWriter();
		String caoz=req.getParameter("cz");
		ShoppingCarService scs=new ShoppingCarimpl();
		int count=0;
		//执行删除操作
		if(caoz.equals("del")){
			count=scs.delProduct(id,uv.getId());		//返回受影响行数
			if(count>0){
				out.print("true");
			}else{
				out.print("false");
			}
		}else if(caoz.equals("upnum")){
			int num=Integer.parseInt(req.getParameter("num"));	
			count=scs.updShopCar(id, uv.getId(), num);
			if(count>0){
				out.print("true");
			}else{
				out.print("false");
			}
		}
		out.flush();
		out.close();
		
		
	}
}
