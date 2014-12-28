using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Fizzler;
using Fizzler.Systems.HtmlAgilityPack;
using HtmlAgilityPack;
using FizzlerWeb.Common;
using Model;
using System.Text.RegularExpressions;
using System.Data.SqlClient;
using System.Data;
using System.Threading;
using System.Diagnostics;
using Dapper;

namespace FizzlerWeb
{
   
    class Program
    {
        private static Stopwatch stw = new Stopwatch();
        private static Stopwatch stw2 = new Stopwatch();
        //static string strconn = "Data Source = .\\SQLEXPRESS;Initial Catalog = cnblogsDB;Integrated Security=True";
       static CommonFunction.SqlHelp sqlhelp = new CommonFunction.SqlHelp();
        static void Main(string[] args)
        {
            Thread thread = new Thread(new ThreadStart(SimulateCopyFile));
            thread.Start();
             
        }
        private static void SimulateCopyFile()
        {
            //休眠3秒
            
             InTitleContent();
            
             InDbContent();
             Thread.Sleep(3000);
           
        }
        private static void InDbContent()
        {
            //WebDownloader.GetHtml(url, Encoding.UTF8)
            Console.WriteLine("------------------------content start------------------------");
            stw.Start();
            using(IDbConnection conn=CommonFunction.SqlHelp.OpenConnection()){
                const string query = "select * from cnblogs order by ID";
                List<Model.titleModel> list = conn.Query<Model.titleModel>(query, null).ToList<Model.titleModel>();
                foreach (Model.titleModel mo in list)
                {
                    article ar = new article();
                    ar.articleID = Convert.ToInt32(mo.ID);
                    //存入二进制
                    //string content =CommonFunction.BytesHelp.bianma( WebDownloader.GetHtml(mo.url, Encoding.UTF8));
                    ar.articleContent = CommonFunction.Base64Help.EncodingString(WebDownloader.GetHtml(mo.url, Encoding.UTF8)); ;
                    //CommonFunction.ar.articleContent = CommonFunction.Base64Help.EncodingString(WebDownloader.GetHtml(mo.hrefString, Encoding.UTF8));
                    // const string query = "select * from cnblogs order by ID";判断表中是否有
                     string articleExit = string.Format("select * from article where articleID={0}", ar.articleID);
                     List<Model.titleModel> list_title = conn.Query<Model.titleModel>(articleExit, null).ToList<Model.titleModel>();
                     if (list_title.Count == 0)
                     {
                         string InsertSql = "insert into article(articleID,articleContent) values(" + ar.articleID + ",'" + ar.articleContent + "')";
                         conn.Execute(InsertSql);
                     }

                }
            }
            //using (SqlConnection sqlconn = new SqlConnection(strconn)) {
            //    sqlconn.Open();
            //    string sql = "select * from cnblogs order by ID";
            //    SqlDataAdapter dap = new SqlDataAdapter(sql, sqlconn);
            //    DataSet ds = new DataSet();
            //    dap.Fill(ds);
            //    DataTable dt = ds.Tables[0];
            //    StringBuilder sb = new StringBuilder();
            //    for (int i = 0; i < dt.Rows.Count; i++)
            //    {
            //        article ar = new article();
            //        ar.articleID=Convert.ToInt32(dt.Rows[i]["ID"]);
            //        ar.articleContent = CommonFunction.Base64Help.EncodingString(WebDownloader.GetHtml(dt.Rows[i]["url"].ToString(), Encoding.UTF8));
            //        sb.Append("insert into article(articleID,articleContent) values("+ar.articleID+",'"+ar.articleContent+"')");
            //        SqlCommand com = new SqlCommand(sb.ToString(), sqlconn);
            //        com.ExecuteNonQuery();
            //        sb = new StringBuilder();   
            //    }
            //   // CommonFunction.Base64Help.EncodingString();
            //    //SqlCommand com = new SqlCommand(sb.ToString(), sqlconn);
            //   // com.ExecuteNonQuery();
            //    stw.Stop();
            //    Console.WriteLine("------------------------content end "+stw.Elapsed+"------------------------");
            //}
            stw.Stop();
            Console.WriteLine("------------------------content end " + stw.Elapsed + "------------------------");
            Console.ReadKey();
        }
        private static void InTitleContent()
        {
            Console.WriteLine("------------------------title start------------------------");
            stw2.Start();
            List<titleModel> titleList = new List<titleModel>();
            for (int i = 0; i < 200; i++)
            {
                if (i == 0)
                {
                    titleList.AddRange(getdata("http://www.cnblogs.com"));
                }
                else
                {
                    titleList.AddRange(getdata("http://www.cnblogs.com/sitehome/p/" + i));
                }
            }
            using (IDbConnection connSql = CommonFunction.SqlHelp.OpenConnection())
            {
                //StringBuilder strSql = new StringBuilder();
                foreach (titleModel t in titleList)
                {
                    string cnblogsExit = string.Format("select * from cnblogs where title='{0}' and url='{1}'", t.title, t.url);
                    List<Model.titleModel> list_title = connSql.Query<Model.titleModel>(cnblogsExit, null).ToList<Model.titleModel>();
                    if (list_title.Count == 0)
                    {
                        string sql = "INSERT INTO [dbo].[cnblogs]([title] ,[url],[content] ,[comments],[owner] ,[describe] ,[Published_time],[reader])VALUES('" + t.title + "' ,'" + t.url + "' ,''," + t.comments + ",'" + t.owner + "','" + t.describe + "','" + DateTime.Now + "'," + t.reader + ")";
                        connSql.Execute(sql, null);
                        //strSql.Append("INSERT INTO [dbo].[cnblogs]([title] ,[url],[content] ,[comments],[owner] ,[describe] ,[Published_time],[reader])VALUES('" + t.titleString + "' ,'" + t.hrefString + "' ,''," + t.comments + ",'" + t.owner + "','" + t.describe + "','" + DateTime.Now + "'," + t.reader + ")");
                    }
                }
                
            }
            //SqlConnection conn = new SqlConnection(strconn);
            //try
            //{
            //    conn.Open();
            //    StringBuilder strSql = new StringBuilder();
            //    foreach (title t in titleList)
            //    {
            //        strSql.Append("INSERT INTO [dbo].[cnblogs]([title] ,[url],[content] ,[comments],[owner] ,[describe] ,[Published_time],[reader])VALUES('" + t.titleString + "' ,'" + t.hrefString + "' ,''," + t.comments + ",'" + t.owner + "','" + t.describe + "','" + DateTime.Now + "'," + t.reader + ")");
            //    }
               
            //    SqlCommand com = new SqlCommand(strSql.ToString(), conn);
            //    com.ExecuteNonQuery();
            //}
            //catch
            //{
            //    conn.Close();
            //}
            //finally
            //{
            //    if (conn.State == ConnectionState.Open)
            //        conn.Close();
            //}
            Console.WriteLine("------------------------title end" + stw2.Elapsed + "------------------------");
        }
        private static List<titleModel> getdata(string url)
        {
            string htmlstring = WebDownloader.GetHtml(url, Encoding.UTF8);
            List<titleModel> titleList = getTag(htmlstring, "");
            return titleList; 
        }
        private static List<titleModel> getTag(string html, string TagName)
        {
            HtmlAgilityPack.HtmlDocument doc = new HtmlDocument
            {
                OptionAddDebuggingAttributes = false,
                OptionAutoCloseOnEnd = true,
                OptionFixNestedTags = true,
                OptionReadEncoding = true
            };
            doc.LoadHtml(html);
            HtmlNode rootnode = doc.DocumentNode;    
            //XPath路径表达式，这里表示选取所有span节点中的font最后一个子节点，其中span节点的class属性值为num
            string path = "//div[@class='post_item_body']/h3";
            HtmlNodeCollection collection = rootnode.SelectNodes(path);
            string path_p = "//div[@class='post_item_body']/p";
            HtmlNodeCollection collection_p = rootnode.SelectNodes(path_p);
            string path_foot = "//div[@class='post_item_body']/div[@class='post_item_foot']/a";
            HtmlNodeCollection collection_foot = rootnode.SelectNodes(path_foot);

            string path_foot_time = "//div[@class='post_item_body']/div[@class='post_item_foot']";
            HtmlNodeCollection collection_foot_time = rootnode.SelectNodes(path_foot_time);

            string article_comment = "//div[@class='post_item_body']/div[@class='post_item_foot']/span[@class='article_comment']/a";
            HtmlNodeCollection collection_foot_article_comment = rootnode.SelectNodes(article_comment);

            string path_foot_article_view = "//div[@class='post_item_body']/div[@class='post_item_foot']/span[@class='article_view']/a";
            HtmlNodeCollection collection_foot_article_view = rootnode.SelectNodes(path_foot_article_view);
            int j = 0;
            List<titleModel> titleList;
            titleList = new List<titleModel>();
            for (int i = 0; i < collection.Count; i++)
            {
                titleModel t = new titleModel();
                t.title = collection[i].InnerText;
                t.url =getUrl( collection[i].InnerHtml)[0];
                t.describe = collection_p[i].InnerText;
                t.owner = collection_foot[i].InnerText;

                if (int.TryParse(GetNumbers(collection_foot_article_comment[i].InnerText), out j))
                {
                    t.comments = Convert.ToInt32(GetNumbers(collection_foot_article_comment[i].InnerText));
                }
                else
                {
                    t.comments = 0;
                }
                t.reader = Convert.ToInt32(GetNumbers(collection_foot_article_view[i].InnerText));
                //t.Published_time = Convert.ToDateTime(getDtime(collection_foot_time[i].InnerText));
                titleList.Add(t);
            }
            return titleList;
        }
        private static List<String> getUrl(string html)
        {
            List<String> links = new List<String>();
            MatchCollection matches = Regex.Matches(html, "<a(?:\\s+.+?)*?\\s+href=\"([^\"]*?)\".+>(.*?)</a>", RegexOptions.IgnoreCase);
            foreach (Match match in matches)
            {
                string s = match.Groups[1].Value;
                links.Add(s);
            }
            return links;
        }
        private static string getNum(string data)
        {
          return  Regex.Replace(data, "[0-9]", "", RegexOptions.IgnoreCase); 

        }
        ///   <summary>   
        ///   从字符串中提取所有数字   
        ///     Returns：所有数字   
        ///   </summary>     
        ///   <param   name   =   "p_str">   需要提取的字符串   </param>   
        ///   <returns>   所有数字   </returns>   
        public static string GetNumbers(string p_str)
        {
           p_str= p_str.Trim();
            p_str = p_str.Replace("/r/n", "");
            string strReturn = string.Empty;
            if (p_str == null || p_str.Trim() == "")
            {
                strReturn = "";
            }

            foreach (char chrTemp in p_str)
            {
                if (Char.IsNumber(chrTemp))
                {
                    strReturn += chrTemp.ToString();
                }
            }
            return strReturn;
        }
        public static string getDtime(string str)
        {
            string[] str_arry= str.Split(' ');
           
            return str_arry[30]+" "+str_arry[31];
        }
        private static DataTable Createcnblogs()
        {
            DataTable dt=new DataTable();
            return dt;
        }
        private static DataTable Createarticle()
        {
            DataTable dt=new DataTable();
            return dt;
        }
        private static string getContent(string html)
        {
            HtmlAgilityPack.HtmlDocument doc1 = new HtmlDocument
            {
                OptionAddDebuggingAttributes = false,
                OptionAutoCloseOnEnd = true,
                OptionFixNestedTags = true,
                OptionReadEncoding = true
            };
            doc1.LoadHtml(html);
            HtmlNode rootnode1 = doc1.DocumentNode;
            //XPath路径表达式，这里表示选取所有span节点中的font最后一个子节点，其中span节点的class属性值为num
            string path1 = "//div[@class='post']";
            HtmlNodeCollection collection1 = rootnode1.SelectNodes(path1);
            //collection1[0].InnerText;
            return rootnode1.InnerText;
                
        }
       
    }
}
