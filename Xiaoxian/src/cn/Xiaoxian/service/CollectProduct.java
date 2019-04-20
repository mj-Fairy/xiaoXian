package cn.Xiaoxian.service;

import java.util.List;

import cn.Xiaoxian.entity.Collect;

public interface CollectProduct {
	public int collect(int uid, int pid);

	public List<Collect> checkColl(int uid);

	public int removeColl(int uid, int pid);

	public int updateColl(int uid, int pid, int number);
}
