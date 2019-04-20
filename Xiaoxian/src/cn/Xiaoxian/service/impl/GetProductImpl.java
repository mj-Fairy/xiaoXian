package cn.Xiaoxian.service.impl;

import java.util.List;

import cn.Xiaoxian.dao.GetProducts;
import cn.Xiaoxian.dao.impl.GetProductsImpl;
import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.entity.Review;
import cn.Xiaoxian.entity.property;
import cn.Xiaoxian.service.GetProduct;


public class GetProductImpl implements GetProduct {

	//GetProduct g = new GetProductImpl();
	GetProducts g = new GetProductsImpl();


	@Override
	public List<Product> getFruits() {
		return g.getFruits();
	}

	@Override
	public List<Product> getVegetables() {
		return g.getVegetables();
	}

	@Override
	public List<Product> getProducts() {
		return g.getProducts();
	}
	
	public List<Product> getDriedFruit(){
		return g.getDriedFruit();
	}

	@Override
	public List<Review> getReviews(int id) {
		return g.getReviews(id);
	}

	@Override
	public List<property> getProperty(int id) {
		return g.getProperty(id);
	}

	@Override
	public List<Product> getProductsbyName(String sql) {
		return g.getProductsbyName(sql);
	}

}
