package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.Xiaoxian.dao.addBasket;
import cn.Xiaoxian.dao.impl.addBasketImpl;

@WebServlet("/addBasketServlet")
public class addBasketServlet extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		addBasket add = new addBasketImpl();
		String name = request.getParameter("name");
		Double price = Double.parseDouble(request.getParameter("price"));
		add.addPro("果篮" + "(" + name + ")", "" + name, price, "guolan.jpg");
		int id = add.getId();
		out.print(id);
	}

}
