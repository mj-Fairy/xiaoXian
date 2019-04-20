package cn.kuwo.alipayconfig;

import java.io.FileWriter;
import java.io.IOException;

/* *
 *类名：AlipayConfig
 *功能：基础配置类
 *详细：设置帐户有关信息及返回路径
 *修改日期：2017-04-05
 *说明：
 *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

public class AlipayConfig {
	
//↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

	// 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
	public static String app_id = "2016091400512178";
	
	// 商户私钥，您的PKCS8格式RSA2私钥
    public static String merchant_private_key = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCb0gYBFihR/grYt62Qzx72UGRUMHuAcPbdoc3+LDNyF21+Aok48txDiR7zRyUH9i/w5DNA9w+erYV07k0SrRRNKdLhpPhUef+MgUosajgVKzJnEq3Q17iAiKiWNw6AEBHeM92L67CUOYV7x3qMBkGa0Jd4+S3c9dbJK20wC3x1fUODryk7IcUsBd+9VROMVm5/XvI8t7u079Y98xn+x4Q6NBpqM7ici5kKUKfe04s5FY+J8pHxkFgnJ3HrUEpj91ikTAM/838jOxo0AwzNdKMDcYFCqzBP/iefMGi85j6lDbxkrpCyQFRBw/hYd3AhPeG/0SuyTHQBDyvmuGMBLnc/AgMBAAECggEAAwbUWQcOJ3GQ0l7W/z4WsuAi4sPCUl9fXDS9ZJeFNE0iMlVoRvPotWMfd8hE/t+YVMyJ9lQWOJXURs4uLxOvlkQetYVX0YRBI4CLaUty5W5eX0QsnibijZSZ+bj+DhzBzBgj0Ij2eBqZ7iqUxc2FTrWIi7ADZQxdbLDsQQeoFjwdvluo4++gOsSTa54YWiPchn8M5l+QQlQZZ5Yp7jMeogr9/oa3pN45AYLh4E8z6WwK9wTxQljSgLPO242oav9mLfJb/jgGC1rfOvbThgbc6zqhvWj+vdJFiiitur0TA2WfS0vpx9gD0+KB2vC23kCV/jGULMj9ejld32TjPNTyCQKBgQDz/CNQccSdRikt6CWYeBh8lwHavgUXBj7ZiDxIsIPMvuoTDt5gWnwwG03dtgSRb8pKEHgRcQlX2dBXpBzoz3JG9KTA6FAslP3HLA3v9GSa2sRflpRJQ5qPxX4fmQcuVFSC2mWoOK0I6KSRJ95dhz2yv1u4QTUSKdq2wTO7mJvpxQKBgQCjfmpqD9iZCbJtBIqVxy2FpOEieF7bzjEkMEVLGV19u7drZnOtNJ0CbR94Enh1VkYqg8DUtGULqMc0Jbbn++v/HYvr9EqVpZV9S4P/HVvbfwnYQysu4L9sU4TcD2YNND2cS+b0/fCrsfEAVn3C+QeTMZz+VBmKnu2mqkrPr1KhMwKBgQDmO5DLcX/6dWGYe0820GUy9ICAfP1qm68lMQTKBx9oTuOtdkNsIxa7gph41jD7WMVIHMBgnQ0XBGgwu6G4I0GQKX1quA4n87SChVTlkPZ6lmPmW760YAHzF4cLpCj9lABntlVlZ44JMRdSDpAsK9mR2jdf6NB+wlYsTKZXqQu/jQKBgAhHADA6eSbWXNg0IKgQm3dmr5dFLNhICijg4ME6mYciF9kyKK0eOszCpZM4rCyUn5zLatnaADuk4eD7/9Si5oHWBx19EsGczoK3bglefSYRunfefrMy4b4kRFe319zXRj9BgIHq0WJ/8cmol1llrkJ/golFzL096p5DhOIa6D4NAoGAJdB+fzzNjAAuNLfxJGTtkcOYHqnkP+/Jpip0xOyUl1SEDsYRTSHE9lTfexfyAedOZ/JroC1EZ2uzvcbOpM9pQtgBDa8B/uG6fluDA/3LqTbAwtKkrvmYiYDbqEl7UWbQ+ZHF9LXLvHvu4bCxxxnnDDdKwden2jlUw6IhI1GpWsQ=";
	
	// 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
    public static String alipay_public_key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm9IGARYoUf4K2LetkM8e9lBkVDB7gHD23aHN/iwzchdtfgKJOPLcQ4ke80clB/Yv8OQzQPcPnq2FdO5NEq0UTSnS4aT4VHn/jIFKLGo4FSsyZxKt0Ne4gIioljcOgBAR3jPdi+uwlDmFe8d6jAZBmtCXePkt3PXWySttMAt8dX1Dg68pOyHFLAXfvVUTjFZuf17yPLe7tO/WPfMZ/seEOjQaajO4nIuZClCn3tOLORWPifKR8ZBYJydx61BKY/dYpEwDP/N/IzsaNAMMzXSjA3GBQqswT/4nnzBovOY+pQ28ZK6QskBUQcP4WHdwIT3hv9Erskx0AQ8r5rhjAS53PwIDAQAB";

	// 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String notify_url = "http://localhost:8080/Xiaoxian/index.html";

	// 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String return_url = "http://localhost:8080/Xiaoxian/index.html";

	// 签名方式
	public static String sign_type = "RSA2";
	
	// 字符编码格式
	public static String charset = "utf-8";
	
	// 支付宝网关
	public static String gatewayUrl = "https://openapi.alipaydev.com/gateway.do";
	
	// 支付宝网关
	public static String log_path = "C:\\";


//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    /** 
     * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
     * @param sWord 要写入日志里的文本内容
     */
    public static void logResult(String sWord) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(log_path + "alipay_log_" + System.currentTimeMillis()+".txt");
            writer.write(sWord);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

