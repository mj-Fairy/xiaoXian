package cn.Xiaoxian.dao;

import java.util.List;

import cn.Xiaoxian.entity.Address;

public interface GetAddressDao {
	public List<Address> getAddress(int uid);
	
	public int addAddress(Address ad);
}
