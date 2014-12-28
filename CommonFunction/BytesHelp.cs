using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CommonFunction
{
    public class BytesHelp
    {
        /// <summary>
        /// 将字符串转成二进制
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string bianma(string s)
        {
            if (s == null)
                return "";
            byte[] data = Encoding.Unicode.GetBytes(s);
            StringBuilder result = new StringBuilder(data.Length * 8);

            foreach (byte b in data)
            {
                result.Append(Convert.ToString(b, 2).PadLeft(8, '0'));
            }
            return result.ToString();
        }
        /// <summary>
        /// 将二进制转成字符串
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string jiema(string s)
        {
            if (s == null)
                return "";
            System.Text.RegularExpressions.CaptureCollection cs =
                System.Text.RegularExpressions.Regex.Match(s, @"([01]{8})+").Groups[1].Captures;
            byte[] data = new byte[cs.Count];
            for (int i = 0; i < cs.Count; i++)
            {
                data[i] = Convert.ToByte(cs[i].Value, 2);
            }
            return Encoding.Unicode.GetString(data, 0, data.Length);
        }
    }
}
