package cn.Xiaoxian.dao.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.GetAddressDao;
import cn.Xiaoxian.entity.Address;

public class GetAddressImpl extends BaseDao implements GetAddressDao {
	/**
	 * 根据用户id读取用户默认地址
	 */
	@Override
	public List<Address> getAddress(int uid) {
		String sql="SELECT * FROM address where uid=?";
		Object[] objs={uid};
		rs=Query(sql, objs);
		List<Address> addlist=new ArrayList<Address>();
		try {
			while(rs.next()){
				Address ad=new Address();
				ad.setId(rs.getInt("id"));
				ad.setPhone(rs.getString("phone"));
				ad.setPostcode(rs.getString("postcode"));
				ad.setProvince(rs.getString("province"));
				ad.setCity(rs.getString("city"));
				ad.setCounty(rs.getString("county"));
				ad.setDetailedAddress(rs.getString("detaileAddress"));
				ad.setName(rs.getString("name"));
				addlist.add(ad);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return addlist;
	}
	/**
	 * 新增地址信息
	 */
	@Override
	public int addAddress(Address ad) {
		String sql="INSERT INTO address(uid,phone,postcode,province,city,county,detaileAddress,`name`) VALUES(?,?,?,?,?,?,?,?)";
		Object[] objs={ad.getUid(),ad.getPhone(),ad.getPostcode(),ad.getProvince(),ad.getCity(),ad.getCounty(),ad.getDetailedAddress(),ad.getName()};
		return Update(sql, objs);
	}

}
