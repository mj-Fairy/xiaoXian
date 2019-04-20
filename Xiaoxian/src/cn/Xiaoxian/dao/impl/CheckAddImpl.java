package cn.Xiaoxian.dao.impl;

import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.CheckAdd;
import cn.Xiaoxian.entity.CheAdd;

public class CheckAddImpl extends BaseDao implements CheckAdd {

	@Override
	public List<CheAdd> getAdd(int parent_id) {
		try {
			String sql = "select * from region where parent_id = ?";
			rs = Query(sql, parent_id);
			List<CheAdd> adds = new ArrayList<CheAdd>();
			while (rs.next()) {
				CheAdd c = new CheAdd();
				c.setId(rs.getInt("id"));
				c.setName(rs.getString("name"));
				c.setParent_id(rs.getInt("parent_id"));
				adds.add(c);
			}
			CloseS(conn, rs, pstmt);
			return adds;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
