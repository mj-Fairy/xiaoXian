package cn.Xiaoxian.dao;

import java.util.List;

import cn.Xiaoxian.entity.Securitycode;

public interface GetAllLetter {
	public List<Securitycode> getAllLetter();
	
	public List<String> getAllImg(int id);
}
