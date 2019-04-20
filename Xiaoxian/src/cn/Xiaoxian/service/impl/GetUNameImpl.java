package cn.Xiaoxian.service.impl;

import java.util.List;

import cn.Xiaoxian.dao.GetName;
import cn.Xiaoxian.dao.impl.GetNameImpl;
import cn.Xiaoxian.entity.User;
import cn.Xiaoxian.service.GetUName;

public class GetUNameImpl implements GetUName {

	@Override
	public List<User> getName() {
		GetName g = new GetNameImpl();
		return g.getName();
	}

}
