
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Text;

namespace FizzlerWeb.Common
{
      public  class WebDownloader
    {
          private static WebDownloader mwebdl = new WebDownloader();
          /// <summary>
          /// 获取HTML
          /// </summary>
          /// <param name="url">网址</param>
          /// <param name="Code">字符串编码</param>
          /// <returns></returns>
          public static string GetHtml(string url, Encoding Code)
          {
              return mwebdl.GetPageByHttpWebRequest(url ,Code);
          }
          public string GetPageByHttpWebRequest(string url, Encoding encoding)
          {
              Stream sr = null;
              StreamReader sReader = null;
              try
              {
                  HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                  request.Method = "Get";
                  request.Timeout = 30000;

                  HttpWebResponse response = request.GetResponse() as HttpWebResponse;
                  if (response.ContentEncoding.ToLower() == "gzip")//如果使用了GZip则先解压
                  {
                      sr = new GZipStream(response.GetResponseStream(), CompressionMode.Decompress);
                  }
                  else
                  {
                      sr = response.GetResponseStream();
                  }
                  sReader = new StreamReader(sr, encoding);
                  return sReader.ReadToEnd();
              }
              catch
              {
                  return null;
              }
              finally
              {
                  if (sReader != null)
                      sReader.Close();
                  if (sr != null)
                      sr.Close();
              }
          }
          /// <summary>
          /// 获取相应的标签内容
          /// </summary>
          /// <param name="Url">链接</param>
          /// <param name="CSSLoad">CSS路径</param>
          /// <param name="Code">字符集</param>
          /// <returns></returns>
          public static IEnumerable<HtmlNode> GetUrlInfo(string Url, string CSSLoad, Encoding Code)
          {
              HtmlDocument htmlDoc = new HtmlDocument
              {
                  OptionAddDebuggingAttributes = false,
                  OptionAutoCloseOnEnd = true,
                  OptionFixNestedTags = true,
                  OptionReadEncoding = true
              };

              htmlDoc.LoadHtml(GetHtml(Url, Code));
              IEnumerable<HtmlNode> NodesMainContent = htmlDoc.DocumentNode.AncestorsAndSelf(CSSLoad);//查询的路径
              return NodesMainContent;
          }

          /// <summary>
          /// 获取相应的标签内容
          /// </summary>
          /// <param name="html">html内容</param>
          /// <param name="CSSLoad">CSS路径</param>
          /// <returns></returns>
          public static IEnumerable<HtmlNode> GetHtmlInfo(string html, string CSSLoad)
          {
              HtmlAgilityPack.HtmlDocument htmlDoc = new HtmlAgilityPack.HtmlDocument
              {
                  OptionAddDebuggingAttributes = false,
                  OptionAutoCloseOnEnd = true,
                  OptionFixNestedTags = true,
                  OptionReadEncoding = true
              };

              htmlDoc.LoadHtml(html);
              IEnumerable<HtmlNode> NodesMainContent = htmlDoc.DocumentNode.Ancestors(CSSLoad);//查询的路径
              return NodesMainContent;
          }

      }
}
