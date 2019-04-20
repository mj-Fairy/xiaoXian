package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.Xiaoxian.Util.SendMessage;

@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		SendMessage s = new SendMessage();
		response.setContentType("text/html;charset=UTF-8");
		String phone = request.getParameter("phone");
		int num = (int) ((Math.random() * 9 + 1) * 1000);
		String con = "验证码:" + num;
		String result = s.sendNum(phone, con);
		PrintWriter out = response.getWriter();
		// request.getSession().setAttribute("message", num);
		out.print(num);
		out.close();
	}

}
