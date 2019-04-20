package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.Xiaoxian.service.GetLetter;
import cn.Xiaoxian.service.impl.GetLetterImpl;
import cn.Xiaoxian.service.impl.*;

@WebServlet("/CheckImg")
public class CheckImg extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		
		GetLetter g=new GetLetterImpl();
		int id = Integer.parseInt(request.getParameter("id"));
		List<String> imgs = g.getAllImg(id);
		String ht = "";
		if (imgs==null) {
			return;
		}
		for (int i = 0; i < imgs.size(); i++) {
			ht +="<img src=products-images/"+imgs.get(i)+">";
		}
		out.print(ht);
		out.close();
	}

}
