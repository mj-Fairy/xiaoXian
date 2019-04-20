package cn.Xiaoxian.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import cn.Xiaoxian.dao.checkAddress;
import cn.Xiaoxian.dao.impl.checkAddressImpl;
import cn.kuwo.vo.UserVo;

@WebServlet("/cheAdderss")
public class cheAdderss extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		checkAddress c = new checkAddressImpl();
		UserVo u = (UserVo)request.getSession().getAttribute("user");
		if(u!=null){
			int uid = u.getId();
			String pString = JSON.toJSONString(c.checkAdd(uid));
			out.print(pString);			
		}
		out.close();
	}

}
