package cn.Xiaoxian.service;

import java.util.List;

import cn.Xiaoxian.Util.ShoppingCar;
import cn.Xiaoxian.entity.Product;

public interface ShoppingCarService {
/**
 * 根据id查找商品信息
 */
	public Product getProduct(int id);
	
	/**
	 * 根据用户id查找数据库的购物车信息
	 */
	public List<ShoppingCar> getShopInfo(int id);
	/**
	 * 将要加入购物车的商品写入数据库
	 */
	public int addShoppingCar(ShoppingCar sc);
	/**
	 * 修改商品数量
	 */
	public int UpdateProNum(ShoppingCar sc);
	/**
	 * 根据商品id,用户id删除商品
	 */
	public int delProduct(int id ,int uid);
	/**
	 * 根据用户id,商品id，以及商品数量，修改购物车信息
	 */
	public int updShopCar(int id,int uid,int num);
}
