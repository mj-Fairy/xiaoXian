package cn.Xiaoxian.dao;

import java.util.List;

import cn.Xiaoxian.entity.CategoryTwo;
import cn.Xiaoxian.entity.Product;

public interface ProductDao {

	/**
	 * 按一级菜单id读取二级菜单
	 */
	public List<CategoryTwo> getTwoMenu(int id);
	/**
	 * 按二级菜单id读取三级菜单
	 */
	public List<Product> getProduct(int id);
}
