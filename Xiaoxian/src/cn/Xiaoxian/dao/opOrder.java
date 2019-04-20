package cn.Xiaoxian.dao;

import java.util.List;

import cn.Xiaoxian.entity.Order;

public interface opOrder {
	public int addOrder(String orderCode,int aid,int pid,int number);
	public int removeOrder(int id);
	public List<Order> checkOrder(int uid);
}
