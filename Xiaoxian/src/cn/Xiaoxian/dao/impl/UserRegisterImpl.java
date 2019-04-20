package cn.Xiaoxian.dao.impl;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.UserRegister;

public class UserRegisterImpl extends BaseDao implements UserRegister {

	@Override
	public int register(String name, String password, String phone, String id_card, int access, String realName) {
		String sql = "insert into user (name,password,access,phone,id_card,realName) values (?,?,?,?,?,?)";
		Object[] pas = { name, password, access, phone, id_card, realName };
		int request = Update(sql, pas);
		return request;
	}

}
