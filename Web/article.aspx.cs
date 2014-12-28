using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Dapper;

namespace Web
{
    public partial class article : System.Web.UI.Page
    {
        static readonly string strconn = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        
        public string context;
        protected void Page_Load(object sender, EventArgs e)
        {
            string ID = Request.QueryString["id"];
            BadData(ID);
            GetData(ID);
        }
        private void BadData(string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                context = "Bad Data";
                return;
            }
        }
        private void GetData(string ID)
        {
            Model.article articleModel = SelectColumnCats(ID);
            if (articleModel == null)
            {
                context = "Bad Data";
            }
            else
            {
                context =CommonFunction.Base64Help.DecodingString( articleModel.articleContent);
               // context = CommonFunction.BytesHelp.jiema(articleModel.articleContent);
            }
        }
        public SqlConnection OpenConnection()
        {
            SqlConnection connection = new SqlConnection(strconn);
            connection.Open();
            return connection;
        }
        public Model.article SelectColumnCats(string articleID)
        {
            using (IDbConnection conn = OpenConnection())
            {
                 string query =string.Format( "select * from article where articleID={0}",articleID);

                return conn.Query<Model.article>(query,  null).Single<Model.article>();
            }
        }
        public void getDataBySQL(string ID)
        {
            using (SqlConnection sqlconn = new SqlConnection(strconn))
            {
                sqlconn.Open();
                string sql = "select * from article where articleID=" + ID;
                SqlDataAdapter da = new SqlDataAdapter(sql, sqlconn);
                DataSet ds = new DataSet();
                da.Fill(ds);
                DataTable dt = ds.Tables[0];
                //CommonFunction.Base64Help basehelp = new CommonFunction.Base64Help();
                BadData(dt.Rows[0]["articleContent"].ToString());
                context = CommonFunction.Base64Help.DecodingString(dt.Rows[0]["articleContent"].ToString());
                //context = dt.Rows[0]["articleContent"].ToString();

            };
        }
    }
}