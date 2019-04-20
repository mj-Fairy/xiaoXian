package cn.Xiaoxian.service.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.Util.ShoppingCar;
import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.entity.Product;
import cn.Xiaoxian.service.ShoppingCarService;

public class ShoppingCarimpl extends BaseDao implements ShoppingCarService {
	
	public Product getProduct(int id) {
		Object[] objs={id};
		String sql="SELECT product.id,product.`name`,product.`promotePrice`,productimage.`imgUrl`  FROM product,productimage  WHERE product.id=? AND product.id = productimage.pid";
		rs=Query(sql, objs);
		try {
			while(rs.next()){
				Product pd=new Product();
				pd.setId(rs.getInt("product.id"));
				pd.setName(rs.getString("name"));
				pd.setPromotePrice(rs.getDouble("promotePrice"));
				pd.setImgUrl(rs.getString("imgUrl"));		
				return pd;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	@Override
	public List<ShoppingCar> getShopInfo(int id) {
		String sql="SELECT * FROM shopping_car WHERE uid=?";
		Object[] objs={id};
		rs=Query(sql, objs);
		List<ShoppingCar> sclist=new ArrayList<ShoppingCar>();
		try {
			while(rs.next()){
				ShoppingCar sc=new ShoppingCar();
				sc.setUserid(rs.getInt("uid"));
				sc.setProid(rs.getInt("pid"));
				sc.setNum(rs.getInt("number"));
				sclist.add(sc);
			}
			return sclist;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return null;
	}
	/**
	 * 添加信息到购物车
	 */
	@Override
	public int addShoppingCar(ShoppingCar sc) {
		try {
			String sql="INSERT  INTO shopping_car(`uid`,`pid`,`number`) VALUE(?,?,?)";
			Object[] objs={sc.getUserid(),sc.getProid(),sc.getNum()};			
			return  Update(sql, objs);				
		} catch (Exception e) {
			// TODO: handle exception
			return -1;
		}
	}
	/**
	 * 修改商品数量
	 */
	public int UpdateProNum(ShoppingCar sc){
		try {
			String sql="UPDATE shopping_car SET number=? WHERE uid=? AND pid=?";
			Object[] objs={sc.getNum(),sc.getUserid(),sc.getProid()};
			return Update(sql, objs);
		} catch (Exception e) {
			// TODO: handle exception
			return -1;
		}			
	}
	/**
	 * 根据id删除商品
	 */
	@Override
	public int delProduct(int id,int uid) {
		int count=0;
		try {
			String sql="DELETE FROM shopping_car WHERE pid = ? and uid = ?";
			Object[] objs={id,uid};
			count=Update(sql, objs);
		} catch (Exception e) {
			// TODO: handle exception
		}
		return count;
	}

	@Override
	public int updShopCar(int id, int uid, int num) {
		try {
			String sql="UPDATE shopping_car SET number=? WHERE uid=? AND pid=?";
			Object[] objs={num,uid,id};
			return Update(sql, objs);		
		} catch (Exception e) {
			// TODO: handle exception			
		}
		return 0;
	}
	
}
