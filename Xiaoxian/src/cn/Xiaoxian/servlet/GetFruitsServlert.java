package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.service.GetProduct;
import cn.Xiaoxian.service.impl.GetProductImpl;

@WebServlet("/GetFruitsServlert")
public class GetFruitsServlert extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		request.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		String cz = request.getParameter("cz");
		String shitu = request.getParameter("shitu");
		GetProduct g = new GetProductImpl();
		List<Product> fruits = null;
		if (cz.equals("shucai")) {
			fruits = g.getVegetables();
		} else if (cz.equals("shuiguo")) {
			fruits = g.getFruits();
		} else if (cz.equals("ganguo")) {
			fruits = g.getDriedFruit();
		}else{
			fruits=g.getProducts();
		}
		
		//将评价与属性填充进集合
		if(fruits !=null){
			for (int i = 0; i < fruits.size(); i++) {
				fruits.get(i).setReview(g.getReviews(fruits.get(i).getId()));
				fruits.get(i).setProperty(g.getProperty(fruits.get(i).getId()));
			}			
		}
		String ht = "";
		if (fruits != null) {
			if (shitu.equals("liebiao")) {
				for (int i = 0; i < fruits.size(); i++) {
					ht += "<li class='item col-lg-4 col-md-4 col-sm-4 col-xs-6'><div class='item-inner'><div class='item-img'><div class='item-img-info'><a href='product_detail.html?id="
							+ fruits.get(i).getId() + "&imgUrl="+fruits.get(i).getImgUrl()+"' title='" + fruits.get(i).getName()
							+ "'class='product-image'><img src='products-images/" + fruits.get(i).getImgUrl() + "'alt='"
							+ fruits.get(i).getName()
							// 这里设置图片宽高
							+ "'></a><div class='box-hover'><ul class='add-to-links'><li><a class='link-quickview' href='quick_view.html?id="
							+ fruits.get(i).getId()
							+ "'>快速浏览</a></li><li><a class='link-wishlist' href='wishlist.html?id="
							+ fruits.get(i).getId()
							+ "'>愿望清单</a></li><li><a class='link-compare' href='compare.html?id="
							+ fruits.get(i).getId()
							+ "'>相似</a></li></ul></div></div></div><div class='item-info'><div class='info-inner'><div class='item-title'><a title='"
							+ fruits.get(i).getName() + "' href='product_detail.html?id=" + fruits.get(i).getId() + "&imgUrl="+fruits.get(i).getImgUrl()+"'>"
							+ fruits.get(i).getName()
							+ "</a></div><div class='item-content'><div class='rating'><div class='ratings'><div class='rating-box'><div class='rating width80'></div></div><p class='rating-links'><a href='#'>"
							+ fruits.get(i).getReview().size()
							+ "</a><span class='separator'>|</span><a href='#'>添加评论</a></p></div></div><div class='item-price'><div class='price-box'><p class='old-price'><span class='price-label'>原价:</span><span class='price'>"
							+ fruits.get(i).getOriginalPrice()
							+ "</span></p><p class='special-price'><span class='price-label'>优惠价</span><span class='price'>"
							+ fruits.get(i).getPromotePrice()
							+ "</span></p></div></div><div class='action'><button class='button btn-cart click_cart' type='button'><input type='hidden' value="+fruits.get(i).getId()+" /><span>加入购物车</span></button></div></div></div></div></div></li>";
				}
			} else if (shitu.equals("xiangqing")) {
				for (int i = 0; i < fruits.size(); i++) {
					ht += "<li class='item'><div class='product-image'><a href='product_detail.html?id="
							+ fruits.get(i).getId() + "&imgUrl="+fruits.get(i).getImgUrl()+"' title='" + fruits.get(i).getName()
							+ "'><img  class='small-image' src='products-images/" + fruits.get(i).getImgUrl()
							+ "' alt='" + fruits.get(i).getName()
							+ "'></a></div><div class='product-shop'><h2 class='product-name'> <a href='product_detail.html?id="
							+ fruits.get(i).getId() + "&imgUrl="+fruits.get(i).getImgUrl()+" ' title='" + fruits.get(i).getName()+fruits.get(i).getId()
							+ "'>"+fruits.get(i).getName()+"</a></h2><div class='ratings'><div class='rating-box'><div class='rating width60'></div></div><p class='rating-links'><a href='#'>"
							+ fruits.get(i).getReview().size()
							+ "条评论</a><span class='separator'>|</span><a href='#review-form'>添加您的评论</a></p></div><div class='desc std'><p></p><p>"+fruits.get(i).getSubTitle()+"... <a class='link-learn' href='product_detail.html?id="
							+ fruits.get(i).getId()
							+ "'>了解更多</a></p></div><div class='price-box'><p class='old-price'><span class='price-label'></span><span class='price'>"
							+ fruits.get(i).getOriginalPrice()
							+ "</span></p><p class='special-price'><span class='price-label'></span><span class='price'>"
							+ fruits.get(i).getPromotePrice()
							+ "</span></p></div><div class='actions'><button class='button btn-cart click_cart' title='加入到购物车' type='button'><input type='hidden' value="+fruits.get(i).getId()+" /><span>加入购物车</span></button><span class='add-to-links'><a title='Add to Wishlist' title='Add to Compare' class='button link-compare' href='compare.html?id="
							+ fruits.get(i).getId()
							+ "'><i class='fa fa-signal'></i><span>加入对比</span></a></span></div></div></li>";
				}
			}
		}
		System.out.println(ht);
		out.print(ht);
		out.flush();
		out.close();
	}

}
