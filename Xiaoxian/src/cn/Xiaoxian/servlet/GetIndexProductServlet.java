package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.Xiaoxian.dao.GetProducts;
import cn.Xiaoxian.dao.impl.GetProductsImpl;
import cn.Xiaoxian.entity.Product;

public class GetIndexProductServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		GetProducts gp = new GetProductsImpl();
		String caoz = req.getParameter("cz");
		List<Product> pdlist = null;
		PrintWriter out = resp.getWriter();
		String str = "";
		//int mokuai = 1;
		// 获取数据
		if (caoz.equals("shuc")) {
			pdlist = gp.getFourVegetables();
		} else if (caoz.equals("shuig")) {
			pdlist = gp.getFreshFruitTea();
		} else if (caoz.equals("guog")) {
			pdlist = gp.getFourDriedFruit();
		}else{
			pdlist=gp.getProducts();
		}
		//将评价与属性填充进集合
		for (int i = 0; i < pdlist.size(); i++) {
			pdlist.get(i).setReview(gp.getReviews(pdlist.get(i).getId()));
			pdlist.get(i).setProperty(gp.getProperty(pdlist.get(i).getId()));
		}
	/*	switch (mokuai) {
		case 1:*/
			//生成的商品点击事件应该用小辉的那方法
			for (int i = 0; i < pdlist.size(); i++) {
				str += "<li class='item col-md-3 col-sm-4 col-xs-12'><div class='item-inner''><div class='item-img'><div class='item-img-info'><a class='product-image' title='"
						+ pdlist.get(i).getName() + "'   href='product_detail.html?id=" + pdlist.get(i).getId()
						+ "&imgUrl="+pdlist.get(i).getImgUrl()+"'><img alt='" + pdlist.get(i).getName() + "' src='products-images/"
						+ pdlist.get(i).getImgUrl() 															
						+ "'></a><div class='box-hover'><ul class='add-to-links'><li><a class='link-quickview' proid='"+pdlist.get(i).getId()+"'"
						 +">快速浏览</a></li><li><a class='link-wishlist coll' pid='"+pdlist.get(i).getId()+"' >收藏</a></li><li><a class='link-compare' href='compare.html?id="
						+ pdlist.get(i).getId()
						+ "'>相似</a></li</ul></div></div></div><div class='item-info'><div class='info-inner'><div class='item-title'><a title='"
						+ pdlist.get(i).getName() + "' href='product_detail.html?id=" + pdlist.get(i).getId() + "'>"
						+ pdlist.get(i).getName()
						+ "</a></div>	<div class='item-content'>	<div class='rating'><div class='ratings'><div class='rating-box'><div class='rating width80'></div></div><p class='rating-links'><a href='#'>"
						+ pdlist.get(i).getReview().size()
						+ "条评论</a><span class='separator'>|</span><a href='#'>添加评论</a></p></div></div><div class='item-price'><div class='price-box'><span class='regular-price'><span  class='price'>"
						+ pdlist.get(i).getPromotePrice()														//这里一个点击加入购物车
						+ "</span></span></div></div><div class='action'><button class='button btn-cart click_cart'  type='button'><input type='hidden' value='"+pdlist.get(i).getId()+"' /><span>添加到购物车</span></button></div>	</div>	</div>	</div>	</div></li>";
			}
			/* break;
		case 2:
			for (int i = 0; i < pdlist.size(); i++) {									
				str += "<div class='item'><div class='item-inner'><div class='item-img'><div class='item-img-info'><a class='product-image' title='"
						+ pdlist.get(i).getName() + "' href='product_detail.html?id=" + pdlist.get(i).getId()
						+ "'><img alt='" + pdlist.get(i).getName() + "' src='products-images/"
						+ pdlist.get(i).getImgUrl()
						+ "'></a><div class='box-hover'><ul class='add-to-links'><li><a class='ink-quickview' href='quick_view.html?id="
						+ pdlist.get(i).getId() + "'>快速浏览</a></li><li><a class='link-wishlist' href='wishlist.html?id="
						+ pdlist.get(i).getId() + "'>愿望清单</a></li><li><a class='link-compare' href='compare.html?id="
						+ pdlist.get(i).getId()
						+ "'>Compare</a></li></ul></div></div></div><div class='item-info'><div class='info-inner'><div class='item-title'><a title='Retis lapen casen' href='product_detail.html?id="
						+ pdlist.get(i).getId() + "'>" + pdlist.get(i).getName()
						+ "</a></div><div class='rating'>	<div class='ratings'><div class='rating-box'><div class='rating width80'></div></div><p class='rating-links'><a href='#'>"
						+ pdlist.get(i).getReview().size()
						+ "条评价</a><span class='separator'>|</span><a href='#'>添加评论</a></p></div></div><div class='item-content'><div class='item-price'><div class='price-box'><span class='regular-price'><span class='price'>"
						+ pdlist.get(i).getOriginalPrice()
						+ "</span></span></div></div><div class='action'><button class='button btn-cart' type='button'><span>加入购物车</span></button></div></div></div></div></div></div>";								
			}
			break;
		case 3:

			break;

		default:
			break;
		}*/

		out.print(str);
		out.close();
	}
}
