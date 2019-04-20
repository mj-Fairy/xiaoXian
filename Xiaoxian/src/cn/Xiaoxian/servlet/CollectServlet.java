package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.Xiaoxian.entity.Collect;
import cn.Xiaoxian.service.CollectProduct;
import cn.Xiaoxian.service.impl.CollectProductImpl;
import cn.kuwo.vo.UserVo;

@WebServlet("/CollectServlet")
public class CollectServlet extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		
		HttpSession session=request.getSession();				
		UserVo  uv=(UserVo)session.getAttribute("user");	
		if(uv == null){
			System.out.println("未登录");	
			out.print(-5);
		}else{
			int uid =uv.getId();
			int pid = Integer.parseInt(request.getParameter("pid"));
			CollectProduct g = new CollectProductImpl();
			List<Collect> cs = g.checkColl(uid);
			boolean flag=true;
			for (int i = 0; i < cs.size(); i++) {
				if (cs.get(i).getPid() == pid) {
					flag=false;
					break;
				}
			}
			if(flag){
				out.print(g.collect(uid, pid));			
			}else{
				out.print(-1);
			}						
			}	
		out.close();
	}

}
