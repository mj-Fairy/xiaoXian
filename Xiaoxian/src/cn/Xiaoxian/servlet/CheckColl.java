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

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.entity.Collect;
import cn.Xiaoxian.service.CollectProduct;
import cn.Xiaoxian.service.impl.CollectProductImpl;
import cn.kuwo.vo.UserVo;

@WebServlet("/CheckColl")
public class CheckColl extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		
		HttpSession session=request.getSession();				
		UserVo uv = (UserVo)request.getSession().getAttribute("user");
		PrintWriter out = response.getWriter();
		if(uv == null){
			out.print(uv);
		}else{			
			int uid = uv.getId();
			String pr = request.getParameter("pr");
			CollectProduct c = new CollectProductImpl();
			int pid = -1;
			switch (pr) {
			case "check":
				List<Collect> cs = c.checkColl(uid); // us.getId()
				String jString = JSON.toJSONString(cs);
				out.print(jString);
				break;
			case "remove":
				pid = Integer.parseInt(request.getParameter("pid"));
				int in = c.removeColl(uid, pid);// us.getId()
				out.print(in);
				break;
			case "update":
				pid = Integer.parseInt(request.getParameter("pid"));
				int number = Integer.parseInt(request.getParameter("num"));
				int io = c.updateColl(uid, pid, number);// us.getId()
				out.print(io);
				break;
			default:
				break;
			}
		}
		out.close();
	}

}
