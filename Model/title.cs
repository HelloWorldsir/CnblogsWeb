using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class titleModel
    {
        public int ID { get; set; }
        /// <summary>
        /// 标题
        /// </summary>
        public string title{get;set;}
        /// <summary>
        /// 连接
        /// </summary>
        public string url{get;set;}
        /// <summary>
        /// 评论数
        /// </summary>
        public int comments { get; set; }
        /// <summary>
        /// 作者
        /// </summary>
        public string owner { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string describe { get; set; }
        /// <summary>
        /// 发表时间
        /// </summary>
        public DateTime Published_time { get; set; }
        /// <summary>
        /// 阅读数
        /// </summary>
        public int reader { get; set; }
    }
}
