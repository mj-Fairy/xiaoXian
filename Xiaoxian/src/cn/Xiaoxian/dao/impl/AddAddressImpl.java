package cn.Xiaoxian.dao.impl;

import cn.Xiaoxian.dao.AddAddress;
import cn.Xiaoxian.dao.BaseDao;

public class AddAddressImpl extends BaseDao implements AddAddress {

	@Override
	public int AddAddress(int uid, String phone, String postcode, String province, String city, String county,
			String detaileAddress, String name) {
		try {
			String sql  = "insert into address (uid,phone,postcode,province,city,county,detaileAddress,name) values (?,?,?,?,?,?,?,?)";
			Object[] pas = {uid,phone,postcode,province,city,county,detaileAddress,name};
			return Update(sql, pas);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return -1;
	}

	

}
