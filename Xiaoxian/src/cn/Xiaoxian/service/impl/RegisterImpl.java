package cn.Xiaoxian.service.impl;

import cn.Xiaoxian.dao.UserRegister;
import cn.Xiaoxian.dao.impl.UserRegisterImpl;
import cn.Xiaoxian.service.Register;

public class RegisterImpl implements Register {
	UserRegister u = new UserRegisterImpl();

	@Override
	public int register(String name, String password, String phone, String id_card, int access,String realName) {
		return u.register(name, password, phone, id_card, access,realName);
	}

}
