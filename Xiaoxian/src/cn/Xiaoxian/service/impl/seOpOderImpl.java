package cn.Xiaoxian.service.impl;

import java.util.List;

import cn.Xiaoxian.dao.opOrder;
import cn.Xiaoxian.dao.impl.opOrderImpl;
import cn.Xiaoxian.entity.Order;
import cn.Xiaoxian.service.seOpOrder;

public class seOpOderImpl implements seOpOrder{
	opOrder o = new opOrderImpl();
	@Override
	public int addOrder(String orderCode, int aid, int pid, int number) {
		return o.addOrder(orderCode, aid, pid, number);
	}

	@Override
	public int removeOrder(int id) {
		return o.removeOrder(id);
	}

	@Override
	public List<Order> checkOrder(int uid) {
		return o.checkOrder(uid);
	}

}
