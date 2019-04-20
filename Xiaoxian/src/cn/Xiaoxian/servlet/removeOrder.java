package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.Xiaoxian.service.seOpOrder;
import cn.Xiaoxian.service.impl.seOpOderImpl;

@WebServlet("/removeOrder")
public class removeOrder extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		seOpOrder se = new seOpOderImpl();
		int id = Integer.parseInt(request.getParameter("oid"));
		out.print(se.removeOrder(id));
		out.close();
	}

}
