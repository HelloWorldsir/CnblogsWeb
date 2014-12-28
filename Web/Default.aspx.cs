using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Web
{
    public partial class Default : System.Web.UI.Page
    {
        static string strconn = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        public List<Model.titleModel> list;
        public DataTable dt;
        private static int i = 1;
        protected void Page_Load(object sender, EventArgs e)
        {
            string page = Request.QueryString["page"];
            if (page == null || page == "")
            {
                getResult(1);
            }
            else if(int.Parse(page)==0)
            {
                i = i + 1;
                getResult(i);
            }
            else if (int.Parse(page) == 1)
            {
                i = i - 1;
                getResult(i);
            }
           
        }


        public List<T> GetList<T>(DataTable table)
        {
            List<T> list = new List<T>();
            T t = default(T);
            PropertyInfo[] propertypes = null;
            string tempName = string.Empty;
            foreach (DataRow row in table.Rows)
            {
                t = Activator.CreateInstance<T>();
                propertypes = t.GetType().GetProperties();
                foreach (PropertyInfo pro in propertypes)
                {
                    tempName = pro.Name;
                    if (table.Columns.Contains(tempName))
                    {
                        object value = row[tempName];
                        if (!value.ToString().Equals(""))
                        {
                            pro.SetValue(t, value, null);
                        }
                    }
                }
                list.Add(t);
            }
            return list.Count == 0 ? null : list;
        }
        private void getResult(int page)
        {
            if (page==0)
            {
                page = 1;
            }
            using (SqlConnection sqlconn = new SqlConnection(strconn))
            {
                sqlconn.Open();
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = sqlconn;
                cmd.CommandText = "Pagination";
                cmd.CommandType = CommandType.StoredProcedure;

                // 创建参数
                IDataParameter[] parameters = {
                new SqlParameter("@Page", SqlDbType.Int,4) ,
                new SqlParameter("@Table", SqlDbType.NVarChar,500) ,
                new SqlParameter("@Filter", SqlDbType.NVarChar,200) ,
                new SqlParameter("@MaxPage", SqlDbType.SmallInt) ,
                new SqlParameter("@TotalRow", SqlDbType.Int) ,
                new SqlParameter("@Descript", SqlDbType.NVarChar,100) ,
               
            };
                // 设置参数类型
                parameters[0].Value = page;
                parameters[1].Value = "cnblogs";
                parameters[2].Value = "ID>0";
                parameters[3].Value = 0;
                parameters[4].Value = 20;
                parameters[5].Value = "result";   
                // 添加参数
                cmd.Parameters.Add(parameters[0]);
                cmd.Parameters.Add(parameters[1]);
                cmd.Parameters.Add(parameters[2]);
                cmd.Parameters.Add(parameters[3]);
                cmd.Parameters.Add(parameters[4]);
                cmd.Parameters.Add(parameters[5]);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                da.Fill(ds);
                dt = ds.Tables[0];
                //list= GetList<Model.title>(dt);

            };
        }
				
    }
}