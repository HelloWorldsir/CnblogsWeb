IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = N'cnblogs')
CREATE USER [cnblogs] FOR LOGIN [cnblogs] WITH DEFAULT_SCHEMA=[dbo]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[article]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[article](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[articleID] [int] NOT NULL,
	[articleContent] [nvarchar](max) NULL,
 CONSTRAINT [PK_article] PRIMARY KEY CLUSTERED 
(
	[ID] ASC,
	[articleID] ASC
)WITH (PAD_INDEX  = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Pagination]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'Create PROCEDURE [dbo].[Pagination]

@Page int = 1,      -- 当前页码

@PageSize int = 20,     -- 每页记录条数(页面大小)

@Table nvarchar(500),    -- 表名或视图名，甚至可以是嵌套SQL：(Select * From Tab Where ID>1000) Tab

@Field nvarchar(200) = ''*'',   -- 返回记录集字段名，","隔开，默认是"*"

@OrderBy nvarchar(100) = ''ID ASC'', -- 排序规则

@Filter nvarchar(500),    -- 过滤条件

@MaxPage smallint output,   -- 执行结果 -1 error, 0 false, maxpage true

@TotalRow int output,    -- 记录总数 /* 2007-07-12 22:11:00 update */

@Descript varchar(100) output  -- 结果描述

AS

BEGIN

Set ROWCOUNT @PageSize;



Set @Descript = ''successful'';

-------------------参数检测----------------

IF LEN(RTRIM(LTRIM(@Table))) !> 0

Begin

  Set @MaxPage = 0;

  Set @Descript = ''table name is empty'';

  Return;

End



IF LEN(RTRIM(LTRIM(@OrderBy))) !> 0

Begin

  Set @MaxPage = 0;

  Set @Descript = ''order is empty'';

  Return;

End



IF ISNULL(@PageSize,0) <= 0

Begin

  Set @MaxPage = 0;

  Set @Descript = ''page size error'';

  Return;

End



IF ISNULL(@Page,0) <= 0

Begin

  Set @MaxPage = 0;

  Set @Descript = ''page error'';

  Return;

End

-------------------检测结束----------------



Begin Try

  -- 整合SQL

  Declare @SQL nvarchar(4000), @Portion nvarchar(4000);



  Set @Portion = '' ROW_NUMBER() OVER (ORDER BY '' + @OrderBy + '') AS ROWNUM FROM '' + @Table;



  Set @Portion = @Portion + (CASE WHEN LEN(@Filter) >= 1 THEN ('' Where '' + @Filter + '') AS tab'') ELSE ('') AS tab'') END);



  Set @SQL = ''Select TOP('' + CAST(@PageSize AS nvarchar(8)) + '') '' + @Field + '' FROM (Select '' + @Field + '','' + @Portion;



  Set @SQL = @SQL + '' Where tab.ROWNUM > '' + CAST((@Page-1)*@PageSize AS nvarchar(8));



  -- 执行SQL, 取当前页记录集

  Execute(@SQL);

  --------------------------------------------------------------------



  -- 整合SQL

  Set @SQL = ''Set @Rows = (Select MAX(ROWNUM) FROM (Select'' + @Portion + '')'';



  -- 执行SQL, 取最大页码

  Execute sp_executesql @SQL, N''@Rows int output'', @TotalRow output;

  Set @MaxPage = (CASE WHEN (@TotalRow % @PageSize)<>0 THEN (@TotalRow / @PageSize + 1) ELSE (@TotalRow / @PageSize) END);

End Try

Begin Catch

  -- 捕捉错误

  Set @MaxPage = -1;

  Set @Descript = ''error line: '' + CAST(ERROR_LINE() AS varchar(8)) + '', error number: '' + CAST(ERROR_NUMBER() AS varchar(8)) + '', error message: '' + ERROR_MESSAGE();

  Return;

End Catch;



-- 执行成功

Return;

END' 
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[cnblogs]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[cnblogs](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](500) NOT NULL,
	[url] [nvarchar](max) NULL,
	[content] [nvarchar](max) NULL,
	[comments] [int] NULL CONSTRAINT [DF_cnblogs_comments]  DEFAULT ((0)),
	[owner] [nvarchar](50) NULL,
	[describe] [nvarchar](max) NULL,
	[Published_time] [datetime] NULL,
	[reader] [int] NULL,
 CONSTRAINT [PK_cnblogs] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
END
