package cn.Xiaoxian.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class BaseDao {
	protected Connection conn=null;
	protected ResultSet rs=null;
	protected PreparedStatement pstmt=null;
		
	//建立连接
		public Connection getConn(){
			try {
				Context ctx=new InitialContext();			
				DataSource ds=(DataSource)ctx.lookup("java:comp/env/jdbc/e-commerce");
				conn=ds.getConnection();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NamingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}		
			return conn;		
		}
		//执行增删改
		public int Update(String sql,Object...objs){
			int count=0;
			conn=getConn();
			try {
				pstmt=conn.prepareStatement(sql);
				if(objs!=null){
					for (int i = 0; i < objs.length; i++) {
						pstmt.setObject((i+1), objs[i]);
					}
				}
				count=pstmt.executeUpdate();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				count=-1;
			} finally{
				CloseS(conn, rs, pstmt);
			}		
			return count;
		}
		//执行查询
		public  ResultSet Query(String sql,Object...objs) {
			conn=getConn();
			try {
				pstmt=conn.prepareStatement(sql);
				if(objs!=null){
					for (int i = 0; i < objs.length; i++) {
						pstmt.setObject((i+1), objs[i]);
					}
				}
				rs=pstmt.executeQuery();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}		//查询时调用处记得关闭		
			return rs;
		}
		//关闭连接
		public void CloseS(Connection conn,ResultSet rs,PreparedStatement pstmt){
			if(rs!=null){
				try {
					rs.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(pstmt!=null){
				try {
					pstmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(conn!=null){
				try {
					conn.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
}
