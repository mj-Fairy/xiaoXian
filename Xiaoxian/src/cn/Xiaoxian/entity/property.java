package cn.Xiaoxian.entity;
/**
 * 产品属性表
 * @author 赖某某
 *
 */
public class property {
	private int id;//属性id
	private int pid;//产品id
	private String pName;//属性名
	private String pValue;//属性值ֵ
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getPid() {
		return pid;
	}
	public void setPid(int pid) {
		this.pid = pid;
	}
	public String getpName() {
		return pName;
	}
	public void setpName(String pName) {
		this.pName = pName;
	}
	public String getpValue() {
		return pValue;
	}
	public void setpValue(String pValue) {
		this.pValue = pValue;
	}
}
