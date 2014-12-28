<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Web.Default" %>

<!DOCTYPE html>

<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="description" content="Search for Bower packages. Bower is a package manager for the web.">
		<meta name="author" content="The Bower team">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<title>博客园</title>
		<link href="dist/app.css" rel="stylesheet">
		<style>
			[ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
				display: none !important;
			}
		</style>
	</head>
	<body ng-app="BowerSearch" ng-controller="IndexController">
		<header>
			<div class="container">
				<div class="row">
					<div class="logo">
						<a href="http://bower.io/" target="_self">
							<img src="images/bower-logo.png" alt="bower logo">
						</a>
					</div>
					<h1 class="hidden-xs">搜索</h1>
				</div>
				<div class="row">
					<input id="q" type="search" results="5" autofocus="autofocus" ng-model="q" ng-change="search()" class="form-control" placeholder="请输入您搜索的内容！">
				</div>
			</div>
		</header>
		<section ng-cloak>
			<div class="container">
				<div class="row">
					<div ng-show="hasResults" class="col-md-12">
						<table class="table table-hover search-results">
							<thead>
								<th><a ng-click="sortResults('name')">标题</a></th>
								<th class="hidden-xs"><a ng-click="sortResults('owner')">作者</a></th>
								<th class="hidden-xs"><a ng-click="sortResults('stars')">评论数</a></th>
								<th class="hidden-xs"><a ng-click="sortResults('updated')">阅读数</a></th>
                                
							</thead>
							<tbody>
                                <%if (dt != null) {
                                      for (int i = 0; i < dt.Rows.Count; i++)
                                      {%>
                                          <tr>
                                    <td class="name">
										<h4>
											<a href="javascript:void(0)" onclick="javascript:gotourl(<%=dt.Rows[i]["ID"] %>)"><%=dt.Rows[i]["title"]%></a>
                                           
										</h4>
										<p class="description"><%=dt.Rows[i]["describe"]%></p>
										<p class="visible-xs">
											<span class="label" bind-once="'Owner: ' + result.owner"></span>
											<span class="label" bind-once="'Stars: ' + result.stars"></span>
											<span class="label" bind-once="'Updated: ' + (result.updated | formatDate)"></span>
										</p>
									</td>
									<td class="hidden-xs owner" ><%=dt.Rows[i]["owner"]%></td>
									<td class="hidden-xs stars" ><%=dt.Rows[i]["comments"]%></td>
									<td class="hidden-xs updated"><%=dt.Rows[i]["reader"]%></td>
                                    
                                </tr>

                                     <% }
                                  } %>
							</tbody>
						</table>
					</div>
					<ul ng-show="hasResults" class="pager">
                       
						<li><a  href="javascript:void(0)" onclick="javascript:getpage('mou')">&larr; Previous</a></li>
						<li><a href="javascript:void(0)" onclick="javascript:getpage('add')">Next &rarr;</a></li>
					</ul>
					<div ng-show="hasResults" class="pager-info">
						{{count}} matched results. Showing page {{page}} of {{pagesCount}}.
					</div>
					<div ng-show="!loading && !results.length" class="col-md-12">
						<div class="alert alert-warning">
							You search didn't return any results. Please try a different keyword.
						</div>
					</div>
					<div ng-show="loading" class="spinner">
						<div class="bounce1"></div>
						<div class="bounce2"></div>
						<div class="bounce3"></div>
					</div>
					<div ng-show="loadingError" class="col-md-12">
						<div class="alert alert-danger">
							Couldn't fetch packages list from the registry. Please try refreshing the browser again.
						</div>
					</div>
				</div>
			</div>
		</section>
		<a class="hidden-xs" href="https://github.com/bower/search"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>

		<script src="dist/app.js"></script>
        <script type="text/javascript">
           
            function gotourl(id)
            {
                window.location.href = "article.aspx?id="+id;
            }
            function getpage(method)
            {
                if (method == "add") {
                    window.location.href = "Default.aspx?page=" + 0;

                }
                else {
                    window.location.href = "Default.aspx?page=" + 1;
                   
                }
                
            }
        </script>
	</body>
</html>
