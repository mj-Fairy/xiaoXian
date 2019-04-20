package cn.Xiaoxian.dao;

public interface addBasket {
	public int addPro(String name,String subTitle,Double promotePrice,String imgUrl);
	public int addImg(int id, String imgUrl);
	public int getId();
}
