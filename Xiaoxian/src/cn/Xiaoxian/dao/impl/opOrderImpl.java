package cn.Xiaoxian.dao.impl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.opOrder;
import cn.Xiaoxian.entity.Address;
import cn.Xiaoxian.entity.Order;

public class opOrderImpl extends BaseDao implements opOrder {

	@Override
	public int addOrder(String orderCode, int aid, int pid, int number) {
		try {
			String sql = "INSERT into `order` (orderCode,aid,pid,number) VALUES (?,?,?,?)";
			return Update(sql, orderCode, aid, pid, number);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return -1;
	}

	@Override
	public int removeOrder(int id) {
		try {
			String sql = "delete from `order` where id = ?";
			return Update(sql, id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return -1;

	}

	@Override
	public List<Order> checkOrder(int uid) {
		try {
			String sql = " select * from `order`,address where `order`.aid = address.id  and address.uid = ?";
			rs = Query(sql, uid);
			List<Order> orders = new ArrayList<Order>();
			while (rs.next()) {
				Order o = new Order();
				o.setAid(rs.getInt("aid"));
				o.setCreateDate(rs.getString("createDate"));
				o.setId(rs.getInt("id"));
				o.setStates(rs.getInt("status"));
				o.setOrderCode(rs.getString("orderCode"));
				o.setUserMessage(rs.getString("userMessae"));
				o.setPid(rs.getInt("pid"));
				o.setNumber(rs.getInt("number"));
				orders.add(o);
			}			
			return orders;
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

}
