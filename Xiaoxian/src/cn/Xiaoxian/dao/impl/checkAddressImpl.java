package cn.Xiaoxian.dao.impl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.checkAddress;
import cn.Xiaoxian.entity.Address;

public class checkAddressImpl extends BaseDao implements checkAddress {

	@Override
	public List<Address> checkAdd(int uid) {
		try {
			String sql = "select * from address where uid = ? ";
			rs = Query(sql, uid);
			List<Address> addresses = new ArrayList<Address>();
			while (rs.next()) {
				Address a = new Address();
				a.setCity(rs.getString("city"));
				a.setCounty(rs.getString("county"));
				a.setDetailedAddress(rs.getString("detaileAddress"));
				a.setId(rs.getInt("id"));
				a.setPhone(rs.getString("phone"));
				a.setPostcode(rs.getString("postcode"));
				a.setProvince(rs.getString("province"));
				a.setName(rs.getString("name"));
				a.setUid(uid);
				addresses.add(a);
			}
			CloseS(conn, rs, pstmt);
			return addresses;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
