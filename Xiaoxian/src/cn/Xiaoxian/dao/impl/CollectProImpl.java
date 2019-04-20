package cn.Xiaoxian.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.Util.ShoppingCar;
import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.CollectPro;
import cn.Xiaoxian.entity.Collect;
import cn.Xiaoxian.entity.Order;

public class CollectProImpl extends BaseDao implements CollectPro {

	@Override
	public int collect(int uid,int pid) {
		try {
			String sql = "insert into collect (uid,pid) values (?,?)";
			return Update(sql, uid,pid);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();			
		}
		return -1;
	}

	@Override
	public List<Collect> checkColl(int uid) {
		try {
			String sql = "select * from collect where uid = ?";
			rs = Query(sql, uid);
			List<Collect> collects = new ArrayList<Collect>();
			while (rs.next()) {
				Collect c = new Collect();
				c.setNumber(rs.getInt("number"));
				c.setPid(rs.getInt("pid"));
				c.setUid(rs.getInt("uid"));
				collects.add(c);
			}
			CloseS(conn, rs, pstmt);
			return collects;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public int removeColl(int uid, int pid) {
		try {
			String sql = "delete from collect where uid = ? and pid = ?";
			return Update(sql, uid,pid);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return -1;
	}

	@Override
	public int updateColl(int uid, int pid, int number) {
		try {
			String sql = "update collect set number = ? where uid = ? and pid = ?";
			return Update(sql,number, uid,pid);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return -1;
	}
	/**
	 * 获得购物车商品数量，将信息插入订单表，再删除购物车表，返回受影响行数
	 */
	@Override
	public int getshop(int uid, String[] pid) {
		int count2=0;
		for (int i = 0; i < pid.length; i++) {
			String sql="SELECT number FROM shopping_car WHERE uid=? AND pid=?";
			Object[] objs={uid,pid[i]};
			rs=Query(sql, objs);
			ShoppingCar sc=null;
			String orderCode="";
			try {
				while(rs.next()){
					sc=new ShoppingCar();
					sc.setNum(rs.getInt("number"));				
				}
				if(sc!=null){
					//生成11位订单号
					orderCode="2019012"+(int)(Math.random()*(9999-1000)*1000);
					String sql1="insert into `order`(orderCode,pid,number,uid) values(?,?,?,?)";
					Object[] objs1={orderCode,pid[i],sc.getNum(),uid};
					int count1=Update(sql1, objs1);			
					if(count1>0){
						String sql2="DELETE FROM shopping_car WHERE uid=? AND pid=?";
						Object[] objs2={uid,pid[i]};
						count2=Update(sql2, objs2);					
					}
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} finally{
				CloseS(conn, rs, pstmt);
			}			
		}		
		return count2;
	}
	/**
	 * 读取用户刚生成的订单，订单状态为0,返回订单集合
	 */
	@Override
	public List<ShoppingCar> getOrder(int uid) {
		String sql="SELECT od.pid,pr.name,od.number,pim.imgUrl,`user`.id,pr.promotePrice,od.orderCode FROM `order` od INNER JOIN product pr  ON od.pid=pr.id INNER JOIN productimage pim ON od.pid=pim.pid INNER JOIN `user` ON `user`.`id`=od.uid WHERE `status`=0 AND od.uid=?";
		Object[] objs={uid};
		rs=Query(sql, objs);
		List<ShoppingCar> sclist=new ArrayList<ShoppingCar>();
		try {
			while(rs.next()){									
				ShoppingCar sc=new ShoppingCar();
				sc.setProid(rs.getInt("pid"));
				sc.setUserid(rs.getInt("id"));
				sc.setNum(rs.getInt("number"));
				sc.setImgUrl(rs.getString("imgUrl"));
				sc.setName(rs.getString("name"));
				sc.setPromotePrice(rs.getDouble("promotePrice"));
				sc.setOrderCode(rs.getString("orderCode"));
				sclist.add(sc);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return sclist;
	}

	@Override
	public int updateStatus(String[] ids) {
		int count=0;
		try {
			String sql="UPDATE `order` SET `status`=1 WHERE orderCode=?";
			for (int i = 0; i < ids.length; i++) {
				count++;
				Update(sql, ids[i]);
			}			
		} catch (Exception e) {
			// TODO: handle exception
		}
		return count;
	}

}
