package cn.Xiaoxian.dao;

import java.util.List;

import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.entity.Review;
import cn.Xiaoxian.entity.property;

public interface GetProducts {
	public List<Product> getFruits();

	public List<Product> getVegetables();

	public List<Product> getProducts();
	
	public List<Product> getDriedFruit();
	
	/**
	 * 查询蔬菜4个
	 */
	public List<Product> getFourVegetables();
	/**
	 * 查询水果4个
	 */
	public List<Product> getFreshFruitTea();
	/**
	 * 查询果干4个
	 */
	public List<Product> getFourDriedFruit();
	/**
	 * 查询最畅销7个
	 */
	public List<Product> getBestSeller();
	/**
	 * 查询特色产品7个
	 */
	public List<Product> getFeaturedProducts();
	/**
	 * 
	 */
	public List<property> getProperty(int id);
	/**
	 * 
	 */
	public List<Review> getReviews(int id) ;
	
	public List<Product> getProductsbyName(String sql);

}
