package cn.Xiaoxian.Util;

import java.io.Serializable;

/**
 * 购物车类
 * @author 赖某某
 *
 */
public class ShoppingCar implements Serializable {
		
	private int proid;	//商品id
	private int num;	//商品数量
	private int userid;	//用户id
	private String name; //产品名称
	private double promotePrice; //优惠价格
	private String imgUrl;//图片地址
	private String orderCode;	//订单号
	
	public String getOrderCode() {
		return orderCode;
	}
	public void setOrderCode(String orderCode) {
		this.orderCode = orderCode;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getPromotePrice() {
		return promotePrice;
	}
	public void setPromotePrice(double promotePrice) {
		this.promotePrice = promotePrice;
	}
	public String getImgUrl() {
		return imgUrl;
	}
	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}
	
	public int getProid() {
		return proid;
	}
	public void setProid(int proid) {
		this.proid = proid;
	}
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
}	
