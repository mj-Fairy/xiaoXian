package cn.Xiaoxian.dao.impl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.GetProducts;
import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.entity.Review;
import cn.Xiaoxian.entity.property;

public class GetProductsImpl extends BaseDao implements GetProducts {
	/**
	 * 查询全部水果
	 */
	@Override
	public List<Product> getFruits() {
		try {
			String sql = "select * from product,productimage WHERE product.id in (select id from product where two_id in ( select id from category_two where cid = 3))and product.id = productimage.pid AND productimage.`id`!=154";
			rs = Query(sql);
			List<Product> fruits = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				fruits.add(p);
			}
			/*
			 * for (int i = 0; i < fruits.size(); i++) {
			 * fruits.get(i).setProperty(getProperty(fruits.get(i).getId()));
			 * fruits.get(i).setReview(getReviews(fruits.get(i).getId())); }
			 */
			return fruits;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/**
	 * 评论集合
	 * 
	 * @param id
	 * @return
	 */
	public List<Review> getReviews(int id) {
		try {
			String sql = "select * from review where pid = ?";
			rs = Query(sql, id);
			List<Review> reviews = new ArrayList<Review>();
			while (rs.next()) {
				Review r = new Review();
				r.setId(rs.getInt(1));
				r.setPid(rs.getInt(3));
				r.setUid(rs.getInt(2));
				r.setDescribeStar(rs.getInt(8));
				r.setCreateDate(rs.getString(6));
				r.setLogisticsStar(rs.getInt(4));
				r.setContent(rs.getString(5));
				r.setServeStar(rs.getInt(7));
				reviews.add(r);
			}
			return reviews;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);

		}
		return null;
	}

	/**
	 * 属性集合
	 * 
	 * @param id
	 * @return
	 */
	public List<property> getProperty(int id) {
		try {
			String sql = "select * from property where pid = ?";
			rs = Query(sql, id);
			List<property> properties = new ArrayList<property>();
			while (rs.next()) {
				property property = new property();
				property.setId(rs.getInt(1));
				property.setpName(rs.getString(3));
				property.setpValue(rs.getString(4));
				properties.add(property);
			}
			return properties;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/**
	 * 获取全部蔬菜
	 */
	@Override
	public List<Product> getVegetables() {
		try {
			String sql = "SELECT * FROM product,productimage WHERE product.id IN (SELECT id FROM product WHERE two_id IN ( SELECT id FROM category_two WHERE cid = 2))AND product.id = productimage.pid AND productimage.id!=15 ";
			rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/**
	 * 获取全部商品
	 */
	@Override
	public List<Product> getProducts() {
		try {
			String sql = "select * from product,productimage WHERE product.id = productimage.pid";
			rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/**
	 * 查询所有干果
	 */
	public List<Product> getDriedFruit() {
		try {
			String sql = "select * from product,productimage WHERE product.id in (select id from product where two_id in ( select id from category_two where cid = 5))and product.id = productimage.pid";
			rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/*	*//**
			 * 公用方法
			 * 
			 * @param sql
			 * @return
			 *//*
			 * public List<Product> getPublicProducts(String sql){ try { rs =
			 * Query(sql); List<Product> vegetables = new ArrayList<Product>();
			 * while (rs.next()) { Product p = new Product();
			 * p.setCreateDate(rs.getString(7)); p.setId(rs.getInt(1));
			 * p.setImgUrl(rs.getString(14)); p.setName(rs.getString(2));
			 * p.setOriginalPrice(rs.getDouble("originalPrice"));
			 * p.setSubTitle(rs.getString(3));
			 * p.setPromotePrice(rs.getDouble("promotePrice"));
			 * p.setStock(rs.getInt(6)); p.setType(rs.getString(13));
			 * p.setProperty(getProperty(p.getId()));
			 * p.setReview(getReviews(p.getId())); p.setStar(rs.getInt(10));
			 * vegetables.add(p); } return vegetables; } catch (Exception e) {
			 * // TODO: handle exception e.printStackTrace(); } return null; }
			 */

	/**
	 * 查询蔬菜4个
	 */
	@Override
	public List<Product> getFourVegetables() {
		try {
			String sql = "SELECT * FROM product,productimage WHERE product.id IN (SELECT id FROM product WHERE two_id IN ( SELECT id FROM category_two WHERE cid = 2))AND product.id = productimage.pid AND imgUrl LIKE '%product%' LIMIT 4";
			rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/**
	 * 查询新鲜水果4个
	 */
	@Override
	public List<Product> getFreshFruitTea() {
		try {
			String sql = "SELECT * FROM product,productimage WHERE product.id IN (SELECT id FROM product WHERE two_id IN ( SELECT id FROM category_two WHERE cid = 3))AND product.id = productimage.pid AND imgUrl LIKE '%product%' LIMIT 4";
			rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/**
	 * 查询果干4个 该图片不规范
	 */
	@Override
	public List<Product> getFourDriedFruit() {
		try {
			String sql = "SELECT * FROM product,productimage WHERE product.id IN (291,292,293,294)AND product.id = productimage.pid ";
			rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/**
	 * 查询最畅销7个 为与蔬菜、水果显示图片不重复，这里则指定商品id查询
	 */
	public List<Product> getBestSeller() {
		try {
			String sql = "SELECT * FROM product,productimage WHERE productimage.id IN (6,8,9,11,12,13,16)AND product.id = productimage.pid AND imgUrl LIKE '%product%'";
			rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	/**
	 * 查询特色产品7个
	 */

	public List<Product> getFeaturedProducts() {
		try {
			String sql = "SELECT * FROM product,productimage WHERE productimage.id IN (17,18,19,20,21,22,23)AND product.id = productimage.pid AND imgUrl LIKE '%product%'";
			rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	@Override
	public List<Product> getProductsbyName(String sql) {
		try {
				rs = Query(sql);
			List<Product> vegetables = new ArrayList<Product>();
			while (rs.next()) {
				Product p = new Product();
				p.setCreateDate(rs.getString(7));
				p.setId(rs.getInt(1));
				p.setImgUrl(rs.getString(14));
				p.setName(rs.getString(2));
				p.setOriginalPrice(rs.getDouble("originalPrice"));
				p.setSubTitle(rs.getString(3));
				p.setPromotePrice(rs.getDouble("promotePrice"));
				p.setStock(rs.getInt(6));
				p.setType(rs.getString(13));
				p.setStar(rs.getInt(10));
				/*
				 * p.setProperty(getProperty(p.getId()));
				 * p.setReview(getReviews(p.getId()));
				 */
				vegetables.add(p);
			}
			/*
			 * for (int i = 0; i < vegetables.size(); i++) {
			 * vegetables.get(i).setProperty(getProperty(vegetables.get(i).getId
			 * ()));
			 * vegetables.get(i).setReview(getReviews(vegetables.get(i).getId())
			 * ); }
			 */
			return vegetables;
		} catch (Exception e) {
			// TODO: handle exception
		} finally {
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

}
