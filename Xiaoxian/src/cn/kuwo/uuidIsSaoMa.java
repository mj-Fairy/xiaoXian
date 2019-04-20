package cn.kuwo;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.kuwo.vo.LoginUserVo;
import cn.kuwo.vo.UserVo;

public class uuidIsSaoMa extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doPost(req, resp);
	}
	
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException ,IOException {		
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		String uuid=req.getParameter("uuid");		
		String str = LoginUserVo.getIssm().get(uuid);
		if(str == null){			
			LoginUserVo.getIssm().put(uuid, "已扫");
		}
	};
	
}
