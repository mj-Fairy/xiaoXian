package cn.Xiaoxian.daoImpl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.ProductDao;
import cn.Xiaoxian.entity.CategoryTwo;
import cn.Xiaoxian.entity.Product;

public class ProdectDaoImpl extends BaseDao implements ProductDao {
	/**
	 * 按一级菜单id读取二级
	 */
	@Override
	public List<CategoryTwo> getTwoMenu(int id) {
		String sql="SELECT * FROM category_two WHERE cid=?";
		Object[] objs={id};
		rs=Query(sql, objs);
		List<CategoryTwo> ctlist=new ArrayList<CategoryTwo>();
		try {
			while(rs.next()){
				CategoryTwo ct=new CategoryTwo();
				ct.setId(rs.getInt("id"));
				ct.setName(rs.getString("name"));
				ctlist.add(ct);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return ctlist;		
	}
	/**
	 * 按二级菜单id读取三级菜单信息
	 */
	public List<Product> getProduct(int id) {
		String sql="SELECT * FROM product WHERE two_id=? LIMIT 4";
		Object[] objs={id};
		rs=Query(sql, objs);
		List<Product> pdlist=new ArrayList<Product>();
		try {
			while(rs.next()){
				Product pd=new Product();
				pd.setId(rs.getInt("id"));
				pd.setName(rs.getString("name"));
				
				pdlist.add(pd);
			}
		} catch (Exception e) {
			// TODO: handle exception
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return pdlist;
	}

}
