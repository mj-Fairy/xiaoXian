package cn.Xiaoxian.dao.impl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.GetAllLetter;
import cn.Xiaoxian.entity.Securitycode;

public class GetAllLetterImpl extends BaseDao implements GetAllLetter {

	@Override
	public List<Securitycode> getAllLetter() {
		try {
			String sql = "select * from securitycode";
			rs = Query(sql);
			List<Securitycode> ses = new ArrayList<Securitycode>();
			while (rs.next()) {
				Securitycode s = new Securitycode();
				s.setId(rs.getInt(1));
				s.setLetter(rs.getString(2));
				s.setImgUrl(rs.getString(3));
				ses.add(s);
			}
			return ses;
		} catch (Exception e) {
			// TODO: handle exception
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

	@Override
	public List<String> getAllImg(int id) {
		try {
			String sql = "select * from particularsimg where pid = ?";
			rs = Query(sql,id);
			List<String> imgs = new ArrayList<String>();
			while (rs.next()) {
				imgs.add(rs.getString("imgUrl"));
			}
			return imgs;
			
		} catch (Exception e) {
			// TODO: handle exception
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

}
