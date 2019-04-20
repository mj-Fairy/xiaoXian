package cn.Xiaoxian.Util;

import javax.security.auth.message.callback.PrivateKeyCallback.Request;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;

public class SendMessage {
	public String sendNum(String phone,String content) {
		
		try {
			HttpClient client = new HttpClient();
			PostMethod post = new PostMethod("http://sms.webchinese.cn/web_api/");
			post.addRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=gbk");// ��ͷ�ļ�������ת��
			NameValuePair[] data = {
					new NameValuePair("Uid", "啊实打实"), // ע����û���	
					new NameValuePair("Key", "d41d8cd98f00b204e980"), // ע��ɹ���,��¼��վʹ�õ���Կ
					new NameValuePair("smsMob", phone), // �ֻ�����
					new NameValuePair("smsText", content) };//���ö�������
			post.setRequestBody(data);
			client.executeMethod(post);
			int statusCode = post.getStatusCode();
			String result = new String(post.getResponseBodyAsString().getBytes("gbk"));  //���ñ����ʽ
			post.releaseConnection();
			System.out.println(result);
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			return "-1";
		}
	}
}
