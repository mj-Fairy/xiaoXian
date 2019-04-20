package cn.kuwo;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.kuwo.vo.LoginUserVo;
import cn.kuwo.vo.UserVo;

public class PhoneLoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public PhoneLoginServlet(){
		super();
	}
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doPost(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String uuid = req.getParameter("uuid");
		String uname = req.getParameter("uname");
		String upwd = req.getParameter("upwd");
		int userid=Integer.parseInt(req.getParameter("userid"));
		System.out.println(uuid);
		System.out.println(uname);
		System.out.println(upwd);
		//TODO ��֤��¼
		boolean bool = true;
		if(bool){
			//����½��Ϣ����map
			UserVo userVo = LoginUserVo.getLoginUserMap().get(uuid);
			if(userVo == null){
				userVo = new UserVo();
				userVo.setUname(uname);
				userVo.setUpwd(upwd);
				userVo.setId(userid);
				LoginUserVo.getLoginUserMap().put(uuid, userVo);
			}
		}
		PrintWriter out = resp.getWriter();
		out.print(bool);
		out.flush();
		out.close();
	}
}
