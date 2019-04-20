package cn.Xiaoxian.entity;
/**
 * 用户评价
 * @author 赖某某
 *
 */
public class Review {
	private int id;// id
	private int uid; //用户id
	private int pid;//产品id
	private String content;//内容
	private String createDate;//创建日期
	private int logisticsStar;//物流星级
	private int serveStar;// 服务星级
	private int describeStar;//描述星级

	public int getDescribeStar() {
		return describeStar;
	}

	public void setDescribeStar(int describeStar) {
		this.describeStar = describeStar;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public int getPid() {
		return pid;
	}

	public void setPid(int pid) {
		this.pid = pid;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public int getLogisticsStar() {
		return logisticsStar;
	}

	public void setLogisticsStar(int logisticsStar) {
		this.logisticsStar = logisticsStar;
	}

	public int getServeStar() {
		return serveStar;
	}

	public void setServeStar(int serveStar) {
		this.serveStar = serveStar;
	}
}
