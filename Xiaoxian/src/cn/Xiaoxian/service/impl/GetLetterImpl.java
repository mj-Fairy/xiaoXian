package cn.Xiaoxian.service.impl;

import java.util.List;

import cn.Xiaoxian.dao.GetAllLetter;
import cn.Xiaoxian.dao.impl.GetAllLetterImpl;
import cn.Xiaoxian.entity.Securitycode;
import cn.Xiaoxian.service.GetLetter;

public class GetLetterImpl implements GetLetter {
	GetAllLetter g = new GetAllLetterImpl();

	@Override
	public List<Securitycode> getAllLetter() {
		return g.getAllLetter();
	}

	@Override
	public List<String> getAllImg(int id) {
		// TODO Auto-generated method stub
		return g.getAllImg(id);
	}

}
