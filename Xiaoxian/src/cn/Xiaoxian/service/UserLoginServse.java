package cn.Xiaoxian.service;

import java.sql.SQLException;

import cn.Xiaoxian.dao.BaseDao;
import cn.Xiaoxian.dao.UserLoginDao;
import cn.Xiaoxian.entity.User;
import cn.kuwo.vo.UserVo;

public class UserLoginServse extends BaseDao implements UserLoginDao {
	/**
	 * 用户登录
	 */
	
	public UserVo userLogin(User us) {
		String sql="SELECT * FROM `user` WHERE (`name`=? OR phone=?) AND PASSWORD=?";
		Object [] objs={us.getName(),us.getPhone(),us.getPassword()};
		rs=Query(sql, objs);
		try {
			if(rs.next()){
				UserVo uv=new UserVo();
				uv.setId(rs.getInt("id"));
				uv.setUname(rs.getString("name"));
				uv.setUpwd(rs.getString("password"));
				return uv;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			CloseS(conn, rs, pstmt);
		}
		return null;
	}

}
