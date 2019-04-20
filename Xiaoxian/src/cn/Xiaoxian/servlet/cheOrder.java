package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.service.seOpOrder;
import cn.Xiaoxian.service.impl.seOpOderImpl;
import cn.kuwo.vo.UserVo;

@WebServlet("/cheOrder")
public class cheOrder extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		UserVo u = (UserVo)request.getSession().getAttribute("user");
		int uid = u.getId();
		seOpOrder se = new seOpOderImpl();
		String pString = JSON.toJSONString(se.checkOrder(uid));
		out.print(pString);
		out.close();
	}

}
