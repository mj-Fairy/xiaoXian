package cn.Xiaoxian.dao.impl;

import java.sql.ResultSet;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.addBasket;

public class addBasketImpl extends BaseDao implements addBasket {

	@Override
	public int addPro(String name, String subTitle, Double promotePrice, String imgUrl) {
		try {
			String sql = "insert into product (name,subTitle,promotePrice) values (?,?,?)";
			Update(sql, name,subTitle,promotePrice);
			return addImg(getId(), imgUrl);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;
	}

	@Override
	public int addImg(int id, String imgUrl) {
		try {
			String sql = "insert into productimage (pid,imgUrl) values (?,?)";
			return Update(sql, id, imgUrl);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return -1;
	}

	@Override
	public int getId() {
		try {
			String sql = "SELECT id from product  ORDER BY id desc LIMIT 1";
			 rs = Query(sql);
			int id = -1;
			while (rs.next()) {
				id = rs.getInt(1);
			}
			CloseS(conn, rs, pstmt);
			return id;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return -1;
	}

}
