package cn.Xiaoxian.entity;

import java.util.List;
/**
 * 产品信息
 * @author 赖某某
 *
 */
public class Product {
	private int id;
	private String name; //产品名称
	private String subTitle; //小标题
	private double originalPrice; //原始价格
	private double promotePrice; //优惠价格
	private int stock; //库存
	private String createDate; //创建日期
	private int star;
	public int getStar() {
		return star;
	}

	public void setStar(int star) {
		this.star = star;
	}

	//private String categoryName; // 分类
	private List<property> property; //属性
	private String type; //详情
	private List<Review> review;//评价
	private String imgUrl;//图片地址ַ

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSubTitle() {
		return subTitle;
	}

	public void setSubTitle(String subTitle) {
		this.subTitle = subTitle;
	}

	public double getOriginalPrice() {
		return originalPrice;
	}

	public void setOriginalPrice(double originalPrice) {
		this.originalPrice = originalPrice;
	}

	public double getPromotePrice() {
		return promotePrice;
	}

	public void setPromotePrice(double promotePrice) {
		this.promotePrice = promotePrice;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	/*public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}*/

	public List<property> getProperty() {
		return property;
	}

	public void setProperty(List<property> property) {
		this.property = property;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<Review> getReview() {
		return review;
	}

	public void setReview(List<Review> review) {
		this.review = review;
	}

	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

}
