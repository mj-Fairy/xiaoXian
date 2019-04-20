package cn.Xiaoxian.service.impl;

import java.util.List;

import cn.Xiaoxian.dao.CollectPro;
import cn.Xiaoxian.dao.impl.CollectProImpl;
import cn.Xiaoxian.entity.Collect;
import cn.Xiaoxian.service.CollectProduct;

public class CollectProductImpl implements CollectProduct {

	CollectPro g = new CollectProImpl();
	@Override
	public int collect(int uid, int pid) {
		return g.collect(uid, pid);
	}

	@Override
	public List<Collect> checkColl(int uid) {
		return g.checkColl(uid);
	}

	@Override
	public int removeColl(int uid, int pid) {
		return g.removeColl(uid, pid);
	}

	@Override
	public int updateColl(int uid, int pid, int number) {
		return g.updateColl(uid, pid, number);
	}
	
}
