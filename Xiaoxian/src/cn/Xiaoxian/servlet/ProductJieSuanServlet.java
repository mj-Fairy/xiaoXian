package cn.Xiaoxian.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.kuwo.vo.UserVo;

/**
 * 商品结算
 * @author 赖某某
 *
 */
public class ProductJieSuanServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		/*//获得要结算的商品id
		int id=Integer.parseInt(req.getParameter("id"));
		//获得用户id
	 	HttpSession session=req.getSession();
	 	UserVo  uv=(UserVo)session.getAttribute("user");
		
	 	//将信息存入订单表
*/	 	
	}
}
