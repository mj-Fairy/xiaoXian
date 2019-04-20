package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.kuwo.vo.UserVo;
/**
 * 判断用户是否登录
 * @author 赖某某
 *
 */
public class IsUserLogin extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		HttpSession session=req.getSession();				
		UserVo uv = (UserVo)req.getSession().getAttribute("user");
		PrintWriter out=resp.getWriter();
		if(uv!=null){
			out.print(uv.getUname());
		}else{
			out.print("");
		}
	}
	
}
