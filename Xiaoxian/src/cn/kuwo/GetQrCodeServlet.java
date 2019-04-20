package cn.kuwo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.kuwo.util.TwoDimensionCode;

public class GetQrCodeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}
	
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException ,IOException {		
				
		PrintWriter out = resp.getWriter();
		
		//����ΨһID
		int uuid = (int) (Math.random() * 100000);
		//��ά������	http://192.168.43.8:8080/Xiaoxian/Demo.jsp
		String content = "http://192.168.43.8:8080/Xiaoxian/pclogin.html?uuid=" + uuid;
		//���ɶ�ά��
		String imgName =  uuid + "_" + (int) (new Date().getTime() / 1000) + ".png";
		
		String imgPath = "D:/Tomcat/apache-tomcat-9.0.13/webapps/Xiaoxian/images/" + imgName;
		TwoDimensionCode handler = new TwoDimensionCode();
		handler.encoderQRCode(content, imgPath, "png");
		
		//���ɵ�ͼƬ���ʵ�ַ
		String qrCodeImg = "images/" + imgName;
		String jsonStr = "{\"uuid\":" + uuid + ",\"qrCodeImg\":\"" + qrCodeImg + "\"}";
		out.print(jsonStr);
		out.flush();
		out.close();
	};
}
