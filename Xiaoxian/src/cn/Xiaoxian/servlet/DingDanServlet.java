package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.Util.ShoppingCar;
import cn.Xiaoxian.dao.AddAddress;
import cn.Xiaoxian.dao.CollectPro;
import cn.Xiaoxian.dao.GetAddressDao;
import cn.Xiaoxian.dao.impl.AddAddressImpl;
import cn.Xiaoxian.dao.impl.CollectProImpl;
import cn.Xiaoxian.dao.impl.GetAddressImpl;
import cn.Xiaoxian.entity.Address;
import cn.kuwo.vo.UserVo;

public class DingDanServlet extends HttpServlet {
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html;charset=UTF-8");
		req.setCharacterEncoding("UTF-8");
		HttpSession session = req.getSession();
		UserVo uv = (UserVo) session.getAttribute("user");
		int uid = 1;/* uv.getId(); */
		PrintWriter out = resp.getWriter();
		String caoz = req.getParameter("cz");
		CollectPro cp = new CollectProImpl();
		// 查找默認地址
		if (caoz.equals("getaddress")) {
			GetAddressDao gd = new GetAddressImpl();
			// 读取用户默认地址
			List<Address> addlist = gd.getAddress(uid); // 用户id暂定未1,记得修改
			System.out.println(addlist.size());
			String str = JSON.toJSONString(addlist);
			out.print(str);
			// 添加地址
		} else if (caoz.equals("adddizhi")) {
			// 暂定
			System.out.println("sss");
			AddAddress as = new AddAddressImpl();
			String postcode = req.getParameter("postcode");
			String province = req.getParameter("province");
			String city = req.getParameter("city");
			String county = req.getParameter("county");
			String detaileAddress = req.getParameter("detaileAddress");
			String name = req.getParameter("name");
			String phone = req.getParameter("phone");

			int resqu = as.AddAddress(uid, phone, postcode, province, city, county, detaileAddress, name);
			out.print(resqu);
			// 根據商品id，用户id，读出购物车信息添加到订单表，然后删除这些商品信息
		} else if (caoz.equals("getProduct")) {
			if (req.getParameter("ids") != null) {
				/*int pid = Integer.parseInt(req.getParameter("id"));
				int count = cp.getshop(uid, pid); // 用户id暂定未1,记得修改
				System.out.println(count);
				out.print(count);*/
				String[] ids=req.getParameterValues("ids");
				int count = cp.getshop(uid, ids); // 用户id暂定未1,记得修改				
				out.print(count);
			}
			// 读取用户订单信息显示 ,读取订单状态为0的商品
		} else if (caoz.equals("getOrder")) {
			List<ShoppingCar> sclist = cp.getOrder(uid);// 获取订单的商品信息
			String str = JSON.toJSONString(sclist);
			System.out.println(str);
			out.print(str);
			// 用户已点击提交，修改订单状态0-1，根据商品id
		} else if (caoz.equals("updaStatus")) {
			String[] id = req.getParameterValues("id");
			int count=cp.updateStatus(id);
			out.print(count);
		}
		out.close();
	}
}
