package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.Xiaoxian.service.Register;
import cn.Xiaoxian.service.impl.RegisterImpl;

@WebServlet("/SubRegisterServlet")
public class SubRegisterServlet extends HttpServlet {
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
			doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		Register re = new RegisterImpl();
		String name = request.getParameter("name");
		String password = request.getParameter("password");
		String phone = request.getParameter("phone");
		String id_card = request.getParameter("id_card");
		int access = 1;
		String realName = request.getParameter("realName");
		re.register(name, password, phone, id_card, access,realName);
	}

}
