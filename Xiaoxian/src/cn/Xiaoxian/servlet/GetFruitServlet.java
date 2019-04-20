package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.crypto.Data;

import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.service.GetProduct;
import cn.Xiaoxian.service.impl.GetProductImpl;

@WebServlet("/GetFruitServlet")
public class GetFruitServlet extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		GetProduct g = new GetProductImpl();
		List<Product> fruits = g.getFruits();
		//将评价与属性填充进集合
				if(fruits !=null){
					for (int i = 0; i < fruits.size(); i++) {
						fruits.get(i).setReview(g.getReviews(fruits.get(i).getId()));
						fruits.get(i).setProperty(g.getProperty(fruits.get(i).getId()));
					}			
				}
		String ht = "";
		for (int i = 0; i < fruits.size(); i++) {
			ht += "<li class='item col-lg-4 col-md-4 col-sm-4 col-xs-6'><div class='item-inner'><div class='item-img'><div class='item-img-info'><a href='product_detail.html?id="
					+ fruits.get(i).getId() + "' title='" + fruits.get(i).getName()
					+ "'class='product-image'><img src='products-images/" + fruits.get(i).getImgUrl() + "'alt='"
					+ fruits.get(i).getName()
					+ "'></a><div class='new-label new-top-left'>New</div><div class='box-hover'><ul class='add-to-links'><li><a class='link-quickview' href='quick_view.html?id="
					+ fruits.get(i).getId() + "'>快速浏览</a></li><li><a class='link-wishlist' href='wishlist.html?id="
					+ fruits.get(i).getId() + "'>收藏</a></li><li><a class='link-compare' href='compare.html?id="
					+ fruits.get(i).getId()
					+ "'>比较</a></li></ul></div></div></div><div class='item-info'><div class='info-inner'><div class='item-title'><a title='"
					+ fruits.get(i).getName() + "' href='product_detail.html?id=" + fruits.get(i).getId() + "'>"
					+ fruits.get(i).getName()
					+ "</a></div><div class='item-content'><div class='rating'><div class='ratings'><div class='rating-box'><div class='rating width80'></div></div><p class='rating-links'><a href='#'>"
					+ fruits.get(i).getReview().size()
					+ "</a><span class='separator'>|</span><a href='#'>添加您的评论</a></p></div></div><div class='item-price'><div class='price-box'><p class='old-price'><span class='price-label'>����۸�:</span><span class='price'>"
					+ fruits.get(i).getOriginalPrice()
					+ "</span></p><p class='special-price'><span class='price-label'>特价</span><span class='price'>"
					+ fruits.get(i).getPromotePrice()
					+ "</span></p></div></div><div class='action'><button class='button btn-cart' type='button'><span id="+fruits.get(i).getId()+">添加到果篮</span></button></div></div></div></div></div></li>";
		}
		out.print(ht);
		out.close();
	}
}
