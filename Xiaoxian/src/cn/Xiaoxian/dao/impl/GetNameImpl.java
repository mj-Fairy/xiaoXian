package cn.Xiaoxian.dao.impl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.GetName;
import cn.Xiaoxian.entity.User;

public class GetNameImpl extends BaseDao implements GetName {

	@Override
	public List<User> getName() {
		try {
			String sql = "select name,id from 	user";
			rs = Query(sql);
			List<User> lis = new ArrayList<User>();
			while (rs.next()) {
				User user  = new User();
				user.setName(rs.getString("name"));
				user.setId(rs.getInt("id"));
				lis.add(user);
			}
			return lis;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

}
