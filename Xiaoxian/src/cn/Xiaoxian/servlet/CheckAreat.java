package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.dao.CheckAdd;
import cn.Xiaoxian.dao.impl.CheckAddImpl;

@WebServlet("/CheckAreat")
public class CheckAreat extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		int parent_id = Integer.parseInt(request.getParameter("parent_id"));
		CheckAdd ch = new CheckAddImpl();
		String pString = JSON.toJSONString(ch.getAdd(parent_id));
		out.print(pString);
		out.close();
	}

}
