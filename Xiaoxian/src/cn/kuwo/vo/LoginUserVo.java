package cn.kuwo.vo;

import java.util.HashMap;

import javax.enterprise.inject.New;

public class LoginUserVo {
	//存储用户信息集合，key为uuid,value为用户信息
	private static HashMap<String, UserVo> loginUserMap = new HashMap<String, UserVo>();	
	
	private static LoginUserVo loginUserVo;
	
	public static LoginUserVo getVo(){
		if(loginUserVo == null){
			loginUserVo = new LoginUserVo();
		}
		return loginUserVo;
	}
	public static HashMap<String, UserVo> getLoginUserMap() {
		return loginUserMap;
	}	
	
	//存储用户扫码状态，已扫/未扫，uuid为键
	private static HashMap<String, String> issm=new HashMap<String, String>();
	
	public static HashMap<String , String> getIssm(){
		return issm;
	}
}
