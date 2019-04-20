package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.dao.ProductDao;
import cn.Xiaoxian.daoImpl.ProdectDaoImpl;
import cn.Xiaoxian.entity.CategoryTwo;
import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.entity.property;

public class ProductServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		PrintWriter out=resp.getWriter();
		String str="";
		int id=Integer.parseInt(req.getParameter("id"));
		ProductDao pd=new ProdectDaoImpl();
		//读取二级菜单	
		List<CategoryTwo> ctlist= pd.getTwoMenu(id);	
		//二三级菜单信息 key为二级菜单名  value为二级菜单下的三级菜单集合
		Map<String, List<Product>> spmap=new HashMap<String, List<Product>>();
		for (CategoryTwo ct : ctlist) {
			List<Product> pdlist=pd.getProduct(ct.getId());			
			spmap.put(ct.getName(), pdlist);
		}		
		str=JSON.toJSONString(spmap);	
		out.print(str);
		out.flush();
		out.close();
	}
}
