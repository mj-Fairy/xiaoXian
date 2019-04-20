package cn.Xiaoxian.service;

import java.util.List;

import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.entity.Review;
import cn.Xiaoxian.entity.property;

public interface GetProduct {
	public List<Product> getFruits();

	public List<Product> getVegetables();

	public List<Product> getProducts();
	
	public List<Product> getDriedFruit();
	
	public List<Review> getReviews(int id);
	
	public List<property> getProperty(int id);
	
	public List<Product> getProductsbyName(String sql);

}
