package cn.kuwo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.kuwo.vo.LoginUserVo;
import cn.kuwo.vo.UserVo;

public class LongConnectionCheckServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html;charset=UTF-8");
		
		String uuid = req.getParameter("uuid");
    	String jsonStr = "";
		System.out.println("in");
		System.out.println("uuid:" + uuid);
		long inTime = new Date().getTime();
		Boolean bool = true;
		while (bool) {
			try {
				Thread.sleep(2000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			//����¼
			UserVo userVo = LoginUserVo.getLoginUserMap().get(uuid);
			System.out.println("userVo:" + userVo);
			
			String str=LoginUserVo.getIssm().get(uuid);
			if(str != null){
				jsonStr="已扫";
				LoginUserVo.getIssm().remove(uuid);
			}
			
			if(userVo != null){
				bool = false;
				HttpSession session=req.getSession();
				session.setAttribute("user", userVo);	//保存用户名
				jsonStr = "{\"uname\":\""+userVo.getUname()+"\"}";
				LoginUserVo.getLoginUserMap().remove(uuid);
			}else{
				if(new Date().getTime() - inTime > 5000){
					bool = false;
				}
			}						
		}
		System.out.println("login ok : " + jsonStr);
		PrintWriter out = resp.getWriter();
		out.write(jsonStr);
		jsonStr="";
		out.flush();
		out.close();
	}
	
	
}
