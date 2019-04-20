package cn.Xiaoxian.service;

import java.util.List;

import cn.Xiaoxian.entity.Securitycode;

public interface GetLetter {
	
	public List<Securitycode> getAllLetter();
	
	public List<String> getAllImg(int id);
}
