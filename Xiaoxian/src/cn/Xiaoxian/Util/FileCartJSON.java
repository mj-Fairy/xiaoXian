package cn.Xiaoxian.Util;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class FileCartJSON {
	FileWriter fw=null;
	BufferedWriter bw=null;
	public void wriCartFile(String str){
		try {
			fw=new FileWriter("D:/Tomcat/apache-tomcat-9.0.13/webapps/Xiaoxian/data/cartData.json");
			bw=new BufferedWriter(fw);
			bw.write(str);
			bw.flush();
			System.out.println("写入文件");
		} catch (Exception e) {
			// TODO: handle exception
		} finally{
			if(bw!=null){
				try {
					bw.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(fw!=null)
				try {
					fw.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
			}		
			
		}
	}
}
