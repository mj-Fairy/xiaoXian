package cn.Xiaoxian.dao;

import cn.Xiaoxian.entity.User;
import cn.kuwo.vo.UserVo;

public interface UserLoginDao {
	/**
	 * 用户登录
	 */
	UserVo userLogin(User us);
}
