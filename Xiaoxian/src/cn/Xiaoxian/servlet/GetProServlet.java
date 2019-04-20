package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.service.GetProduct;
import cn.Xiaoxian.service.impl.GetProductImpl;

@WebServlet("/GetProServlet")
public class GetProServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		int id = Integer.parseInt(request.getParameter("id")); 
		GetProduct g = new GetProductImpl();
		List<Product> pros =  g.getProducts();
		Product p = new Product();
		for (int i = 0; i < pros.size(); i++) {
			if (id==pros.get(i).getId()) {
				p = pros.get(i);
				break;
			}
		}
		String pString = JSON.toJSONString(p);
		out.print(pString);
		out.close();
	}

}
