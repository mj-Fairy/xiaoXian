/**
 * 解决加载时使用ajax加载出来的数据在跳转页面后数据丢失的问题 js
 * 使用方法，将此代码引入到需要实现ajax重新加载的页面，通过设置commonReload=true;即可触发该操作
 */

//是否在物理返回、前进时重新加载页面或数据
var commonReload = true;

$(document).ready(function() {

	if (!!(window.history && history.pushState)){

		var hisNum = localStorage.getItem("historyNum");

		//保存最新的历史记录数量

		localStorage.setItem("historyNum", history.length);

		//本地存储的历史记录数量跟当前数量相同时表示刷新或前进、后退等操作

		if(history.length > 0 && hisNum == history.length){

			var params = new URLSearchParams(location.search.slice(1));//URL参数

			//historyR：本地存储的key，把URL中的参数r保存在本地用于对比

			var hisR = localStorage.getItem("historyR");

			//当前URL的r参数，与本地存储的参数作对比

			var curR = params.get("r");

			//生成新的r

			var r = new Date().getTime();

			//保存新的r参数进本地

			localStorage.setItem("historyR", r);

			//当本地存储的r参数与URL中的r参数不同时刷新页面或作其他处理

			if(commonReload && (hisR == null || hisR != curR)){

				//保存新的r参数进本地

				localStorage.setItem("historyR", new Date().getTime());

				//替换URL中的r参数

				params.set("r", r);

				//最简单的处理，直接刷新页面重新加载数据

				window.location.href = window.location.href.split("?")[0] + "?" + params;

			}

		}

	} else {

		console.log("不支持History API");

	}

});
