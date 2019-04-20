package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.service.GetProduct;
import cn.Xiaoxian.service.impl.GetProductImpl;

@WebServlet("/GetAllProServlet")
public class GetAllProServlet extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		GetProduct g = new GetProductImpl();
		String pString = JSON.toJSONString(g.getProducts());
		out.print(pString);
		out.close();
	}

}
