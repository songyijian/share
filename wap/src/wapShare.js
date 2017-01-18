/*
	fenxiangfn()  移动端分享——函数！微信&易信&163新闻客户端    注意：这值是一个常规的函数
	作者：songyijian 
	发布：201.7.20
	
	微信分享一定更要引  jweixin-1.0.0.js 文件（这是js前端一定更要处理的东西）
	
	API
		fenxiangfn({
			'image': "分享图片 （无）",
		    'link' : "分享连接 （无）" || window.location.href,
		    'title': "分享题目 （无）",
		    'desc' : "分享内容 （无）",
		    'wxPYQ': "朋友圈内容 （无）",	
		    'callBack': function(){}
		})

*/


//新闻客户端
!function(){
	var fxDiv=document.createElement('div');
		fxDiv.style.display='none';
		fxDiv.id='newsappShareDiv';
		document.body.appendChild(fxDiv);
}();
function newsappShare(shareObj){	//重置内容
	var yjFxText='<div id="__newsapp_sharetext">'+shareObj.desc+'</div>'
				+'<div id="__newsapp_sharephotourl">'+shareObj.image+'</div>'
				+'<div id="__newsapp_sharewxtitle">'+shareObj.title+'</div>'
				+'<div id="__newsapp_sharewxtext">'+shareObj.desc+'</div>'
				+'<div id="__newsapp_sharewxurl">'+shareObj.link+'</div>'
				+'<div id="__newsapp_sharewxthumburl">'+shareObj.image+'</div>';
	document.getElementById('newsappShareDiv').innerHTML=yjFxText;
};
function __newsapp_share_done(){ shareObj.callBack() }; //客户端分享回调


//易信
function yixinfx(shareObj){
	document.addEventListener('YixinJSBridgeReady', function() {    	
	    // 分享到朋友圈;
    	YixinJSBridge.on('menu:share:timeline', function(argv) {
	        YixinJSBridge.invoke('shareTimeline', {  	
	            'img_url': shareObj.image,
	            'img_width': '150',
	            'img_height': '150',
	            'link': shareObj.link,
	            'desc': shareObj.desc,
	            'title': shareObj.title
	        }, function() { shareObj.callBack();});
	    });
	    // 发送给好友;
	    YixinJSBridge.on('menu:share:appmessage', function(argv) {
	        YixinJSBridge.invoke('sendAppMessage', {
	            'img_url': shareObj.image,
	            'link': shareObj.link,
	            'desc': shareObj.desc,
	            'title': shareObj.title
	        }, function() { shareObj.callBack(); });
	    });
	    // 发送到微博;
	    YixinJSBridge.on('menu:share:weibo', function(argv) {
	        YixinJSBridge.invoke('shareWeibo', {
	            'desc': shareObj.desc,
	            'url': shareObj.link
	        }, function() { shareObj.callBack(); });
	    });
	}, false);
};


//微信 
function weixinfx(shareObj){
	wx.config({
	    debug: false,//这里是开启测试，如果设置为true，则打开每个步骤，都会有提示，是否成功或者失败
	    //appId: 'wx82c4c4edc2a46bc7',
	    // timestamp: '14999923234',//这个一定要与上面的php代码里的一样。
	    //nonceStr: '14999923234',//这个一定要与上面的php代码里的一样。
	    //signature: '<?=jssdk();?>',
	    jsApiList: [  //所有要调用的 API 都要加到这个列表中
	        'onMenuShareTimeline',
	        'onMenuShareAppMessage',
	        'onMenuShareQQ',
	        'onMenuShareWeibo'
	    ]
	});
	wx.ready(function () {
		//朋友圈
	    wx.onMenuShareTimeline({
	        title:shareObj.wxPYQ,
	        link:shareObj.link,
	        imgUrl:shareObj.image,
	        success:function () { shareObj.callBack() },
	        cancel: function () {}
	    });
		//朋友
	    wx.onMenuShareAppMessage({
	        title: shareObj .title,
	        desc: shareObj .desc,
	        link: shareObj .link, 	
	        imgUrl: shareObj.image, 
	        type: '', 				
	        dataUrl: '', 			
	        success: function () {  shareObj.callBack() },
	        cancel: function () {}
	    });
	    wx.onMenuShareQQ({
	        title: shareObj .title, 
	        desc: shareObj.desc , 
	        link: shareObj.link, 
	        imgUrl:shareObj.image,
	        success: function () { shareObj.callBack() },
	        cancel: function () {}
	    });
	    wx.onMenuShareWeibo({ 
	        title: shareObj.title,
	        desc: shareObj.desc, 
	        link: shareObj.link,
	        imgUrl:shareObj.image,
	        success: function () { shareObj.callBack() },
	        cancel: function () {}
	    });
	});
};


function fenxiangfn(data){
	var shareObj = {
	    'image': "分享图片 （无）",
	    'link' : window.location.href,
	    'title': "分享题目 （无）",
	    'desc' : "分享内容 （无）",
	    'wxPYQ': "朋友圈内容 （无）",		//标题默认内容
	    'callBack': function(){}
	};
	for(var i in data){shareObj[i]=data[i];}
	
	weixinfx(shareObj);
	yixinfx(shareObj);
	newsappShare(shareObj)
};


// 所有的回调都要为全局函数;
//判断是否在客户端 
/*function if163(){
	if(navigator.userAgent.indexOf("NewsApp")>=0){ return true; }else{ return false; };	
}*/


/*//获取登录信息
if(if163()){ window.location="userinfo://"; } 
//判断登录回调
var isLogin = false;
function __newsapp_userinfo_done(info){
	if(info!==undefined){ isLogin = true;	
	}else{isLogin = false; }//没登录
};
//location.href="login://";//没有登录点击调用登录框
//登录成功后的回调 
function __newsapp_login_done(info){
//	oD3.innerHTML='帐号：'+info.name;
}*/
/* __newsapp_userinfo_done(info) 获取信息的回调，
 * 当获info==undefined 时候也就说明没有登录，
 *
 * __newsapp_login_done(info) 登录成功的回调，
 * 如果无需获取信息，就无需加info
 */