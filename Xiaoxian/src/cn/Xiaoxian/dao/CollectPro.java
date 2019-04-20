package cn.Xiaoxian.dao;

import java.util.List;

import cn.Xiaoxian.Util.ShoppingCar;
import cn.Xiaoxian.entity.Collect;

public interface CollectPro {
	public int collect(int uid, int pid);

	public List<Collect> checkColl(int uid);

	public int removeColl(int uid, int pid);

	public int updateColl(int uid, int pid, int number);
	
	//根据商品id，用户id读取购物车信息，并加入订单表
	public int getshop(int uid, String[] pid);
	
	//根据用户id，读取订单信息
	public List<ShoppingCar> getOrder(int uid);
	
	//根据订单号，修改订单状态
	public  int updateStatus(String[] ids);
	
	
}
