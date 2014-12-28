using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace CommonFunction
{
    public class SqlHelp
    {
        static readonly string strconn = "Data Source = .\\SQLEXPRESS;Initial Catalog = cnblogsDB;Integrated Security=True";
        public static SqlConnection OpenConnection()
        {
            SqlConnection connection = new SqlConnection(strconn);
            if (connection.State == ConnectionState.Closed)
            {
                connection.Open();
            }
            return connection;
        }
    }
}
