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

@WebServlet("/CheckServlet")
public class CheckServlet extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		if(request.getParameter("id")!=null){
			int id = Integer.parseInt(request.getParameter("id"));
			PrintWriter out = response.getWriter();
			GetProduct g = new GetProductImpl();
			List<Product> products = g.getProducts();
			Product pro = new Product();
			for (Product p : products) {
				if (p.getId()==id) {
					pro = p;
					pro.setReview(g.getReviews(p.getId()));
					pro.setProperty(g.getProperty(p.getId()));				
					break;
				}
				
			}
			String pString =  JSON.toJSONString(pro);
			out.print(pString);
			out.close();
			
		}
	}

}
