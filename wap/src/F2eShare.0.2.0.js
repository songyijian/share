/*
	网易f2e移动端分享类  0.2.0 	 
	
	作者：songyijian 
	
	发布：2017.1.13
	
	API
		该函数为类	new创建		new F2eShare（接收一个json对象）
		
		new F2eShare({
			MsgImg:'',  										//string 分享图片
		    link: json.link || window.location.href,    		//string 分享链接，默认当前连接
		    title:json.title || window.document.title,   		//string 分享标题，默认title
		    desc:json.desc || '',    							//string 分享描述，默认""
		    fText:json.fText || window.document.fText,    		//string 分享朋友圈
		    initFn:json.initFn||function(_this){},				//fn 初始化回调,(_this)=>{_this === this， 可取到自身所有的属性和方法}
		    callback:json.callback||function(_this){}			//fn 回调函数
		})
		
		FN:	
			.upData(json)			//接收一个 json对象，函数自行修改 对应的 key -> value
			.evShare(fn,noSina)     //事件（按钮）触发分享  ，	等于  ==  NeteaseShare, function (popupCallBack,noSina)
			
		ATTR：【 打点使用】
			.typeApp		//属于什么平台	isYiXin ，isNewsApp ，isCloudMusic ，isWeiXin ，isRead 
			.updataState	//这个属性是用来判断是不是 updata 触发的init回调

	注意：
		
		该分享还处于试用阶段，如遇到问题请整理反馈
		
		已经集合了分享检测，无需再引用  http://go.163.com/2015/0211/encore/js/share.js
		
		
*/


!function(){
	function F2eShare(json){
		this.shareData={
			MsgImg: json.MsgImg||'',  										//string 分享图片
		    link: json.link || window.location.href,    		//string 分享链接，默认当前连接
		    title:json.title || window.document.title,   		//string 分享标题，默认title
		    desc:json.desc || '',    							//string 分享描述，默认title
		    fText:json.fText || window.document.fText,    		//string 分享朋友圈
		    initFn:json.initFn||function(){},
		    callback:json.callback||function(){}				//fn 回调函数
		};
		
		this.typeApp = {
			isYiXin : window.navigator.userAgent.search(/YiXin/)>=0,
			isNewsApp : window.navigator.userAgent.search(/NewsApp/)>=0,
			isCloudMusic : window.location.search.search(/from=cloudmusic/)>=0,
			isWeiXin : window.navigator.userAgent.search(/MicroMessenger/)>=0,
			isRead : window.navigator.userAgent.toUpperCase().search(/PRIS/)>=0		
		}
		
		this.updataState = false;
		var _this = this;
		
		this.share_survey = function (share){
		    var loc = window.location;
		    var na = window.navigator.userAgent;
		    if(loc.host.search(/163\.com/)<0)return false;
		    var code = 'init';
		    var shareName = "";
		    var keywords = "";
		    var ua = window.navigator.userAgent;
		    if(ua.search(/NewsApp/)>=0){
		        code = 'newopen';
		        keywords = "newsapp";
		        shareName = "新闻客户端分享";
		    }else if(ua.search(/MicroMessenger/)>=0){
		        code = 'weixinopen';
		        keywords = "weixin";
		        shareName = "微信分享";
		    }else if(ua.search(/YiXin/)>=0){
		        code = 'yixinopen';
		        keywords = "yixin";
		        shareName = "易信分享";
		    }else if(ua.search(/weibo/)>=0){
		        code = 'weiboopen';
		        keywords = "weibo";
		        shareName = "微博分享";
		    }
		    if(na.search(/iPhone|iPad|Touch|Android|Windows Phone/i)<0){
		        code = 'pc';
		        shareName = "其他";
		        keywords = "qita";
		    }
		    if(share){
		        code +='_share';
		        neteaseTracker(false,'http://minisite.click.163.com'+location.pathname.replace(/\/(go|auto)|[\w-]+\.[\w]+/g,"")+keywords,shareName,'minisiteclick');
		    }
		    code = encodeURIComponent(code);
		    var url = encodeURIComponent(loc.href);
		    var updata_ele = new Image();
		    updata_ele.src = "http://go.163.com/common/shareh5.php?act=share&t="+code+'&url='+url;
		};
		
		this.init()
		this.share_survey()
	}
	

	F2eShare.prototype.upData = function(json,fn){
		this.updataState = true;
		for(var i in json){
			this.shareData[i] = json[i];
		}
		this.init()
	}
	
	F2eShare.prototype.evShare = function (fn,noSina){
	    if(this.typeApp.isYiXin){
	        if(fn)fn(this);
	    }else if(this.typeApp.isNewsApp){
	        window.location='share://';
	    }else if(this.typeApp.isCloudMusic){
	        window.open(this.shareData.music);
	    }else if(this.typeApp.isWeiXin){
	        if(fn)fn(this);
	    }else if(this.typeApp.isRead){
	        window.open(this.shareData.yuedu);
	    }else{
	        if(noSina){
	            if(fn)fn(this);
	        }else{
	            window.open(this.shareData.sina);
	        }
	    }
	}
	
	
	F2eShare.prototype.init = function(){
		var _this = this;
		//易信
		this.NeteasesShareInit_yixin = function (){
			window.shareData={};
		    //分享图片
		    window.shareData.imgUrl=_this.shareData.MsgImg;//图片链接
		    window.shareData.tImgUrl=this.shareData.MsgImg;//分享到朋友圈的图片
		    window.shareData.fImgUrl=this.shareData.MsgImg;//分享给好友的图片
		    window.shareData.wImgUrl=_this.shareData.MsgImg;//分享到微博的图片
		    //分享链接
		    window.shareData.timeLineLink=_this.shareData.link;//分享到微博的图片
		    window.shareData.sendFriendLink=_this.shareData.link;//分享给好友的链接
		    window.shareData.weiboLink=_this.shareData.link;//分享到微博的连接
		    //分享标题
		    window.shareData.tTitle=_this.shareData.fText;//分享到朋友圈的标题
		    window.shareData.fTitle=_this.shareData.title;//分享给好友的标题
		    //分享内容
		    window.shareData.tContent=_this.shareData.fText;//分享到朋友圈的描述
		    window.shareData.fContent=_this.shareData.desc;//分享给好友的描述
		    window.shareData.wContent=_this.shareData.desc;//分享到微博的内容
		    
		}
		//云阅读
		this.NeteasesShareInit_yuedu = function (){
		    // data.data必须随便传一个值,否则安卓无法回调
		    this.shareData.yuedu ="web:getclientsharemodule;data="+encodeURIComponent("{\"activityId\":\"" + (this.shareData.activityId||'') + "\",\"moduleType\":\"['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qzone']\",\"site\":\"网易云阅读官方网站\","+"\"url\":\"" + this.shareData.link + "\",\"title\":\"" + this.shareData.title + "\",\"pics\":\"" + this.shareData.MsgImg + "\","+"\"summary\":\"" + this.shareData.desc + "\",\"shareType\":\"1\",\"data\":{\"activityId\":\"" + (this.shareData.activityId||'') + "\"}}");
		    if(window.active){
		    	window.active.shareCompleted = function(){
															_this.shareData.callback(this);
															_this.share_survey(true); 
														};
		    }
		}
		//云音乐
		this.NeteasesShareInit_music = function (){
		    this.shareData.music='orpheus://share/';
		    this.shareData.music += encodeURIComponent(this.shareData.title)+'/';
		    this.shareData.music += encodeURIComponent(this.shareData.MsgImg)+'/';
		    this.shareData.music += encodeURIComponent(this.shareData.link)+'/';
		    this.shareData.music += encodeURIComponent(this.shareData.title)+'/';
		    this.shareData.music += encodeURIComponent(this.shareData.desc);
		}
		//新闻客户端
		this.NeteasesShareInit_news = function (){
		    if(document.getElementById('__newsapp_sharetext')){
		        document.getElementById('__newsapp_sharetext').innerHTML=this.shareData.desc+this.shareData.link;
		        document.getElementById('__newsapp_sharephotourl').innerHTML=this.shareData.MsgImg;
		        document.getElementById('__newsapp_sharewxtitle').innerHTML=this.shareData.title;
		        document.getElementById('__newsapp_sharewxtext').innerHTML=this.shareData.desc;
		        document.getElementById('__newsapp_sharewxurl').innerHTML=this.shareData.link;
		        document.getElementById('__newsapp_sharewxthumburl').innerHTML=this.shareData.MsgImg;
		    }else{
		        var div = document.createElement('div');
		        div.style.display='none';
		        var __newsapp_sharetext= document.createElement('code');
		        __newsapp_sharetext.innerHTML= this.shareData.desc+this.shareData.link;
		        __newsapp_sharetext.id= '__newsapp_sharetext';
		        div.appendChild(__newsapp_sharetext);
		        var __newsapp_sharephotourl= document.createElement('code');
		        __newsapp_sharephotourl.innerHTML= this.shareData.MsgImg;
		        __newsapp_sharephotourl.id= '__newsapp_sharephotourl';
		        div.appendChild(__newsapp_sharephotourl);
		        var __newsapp_sharewxtitle= document.createElement('code');
		        __newsapp_sharewxtitle.innerHTML= this.shareData.title;
		        __newsapp_sharewxtitle.id= '__newsapp_sharewxtitle';
		        div.appendChild(__newsapp_sharewxtitle);
		        var __newsapp_sharewxtext= document.createElement('code');
		        __newsapp_sharewxtext.innerHTML= this.shareData.desc;
		        __newsapp_sharewxtext.id= '__newsapp_sharewxtext';
		        div.appendChild(__newsapp_sharewxtext);
		        var __newsapp_sharewxurl= document.createElement('code');
		        __newsapp_sharewxurl.innerHTML= this.shareData.link;
		        __newsapp_sharewxurl.id= '__newsapp_sharewxurl';
		        div.appendChild(__newsapp_sharewxurl);
		        var __newsapp_sharewxthumburl= document.createElement('code');
		        __newsapp_sharewxthumburl.innerHTML= this.shareData.MsgImg;
		        __newsapp_sharewxthumburl.id= '__newsapp_sharewxthumburl';
		        div.appendChild(__newsapp_sharewxthumburl);
		        document.body.appendChild(div);
		    }
		    window.__newsapp_share_done = function(){
											console.log(_this.shareData)
											_this.shareData.callback(this);
											_this.share_survey(true); 
										}
		}
		//微信
		this.NeteasesShareInit_weixin = function (){
		    var onBridgeReady=function(){
		        WeixinJSBridge.call('showOptionMenu');
		        WeixinJSBridge.call('hideToolbar');
		        // 发送给好友;
		        WeixinJSBridge.on('menu:share:appmessage', function(argv){
		            WeixinJSBridge.invoke('sendAppMessage',{
		                "appid":_this.shareData.appId,
		                "img_url":_this.shareData.MsgImg,
		                "img_width":"120",
		                "img_height":"120",
		                "link":_this.shareData.link,
		                "desc":_this.shareData.desc,
		                "title":_this.shareData.title
		            }, function(){
							_this.shareData.callback(this);
							_this.share_survey(true); 
						}
		            );
		        });
		        // 分享到朋友圈;
		        WeixinJSBridge.on('menu:share:timeline', function(argv){
		            //(_this.callback)();
		            WeixinJSBridge.invoke('shareTimeline',{
		                "img_url":_this.shareData.MsgImg,
		                "img_width":"120",
		                "img_height":"120",
		                "link":_this.shareData.link,
		                "desc":_this.shareData.fText,
		                "title":_this.shareData.fText
		            },function(){
							_this.shareData.callback(this);
							_this.share_survey(true); 
						}
		            );
		        });
		    };
		    if(document.addEventListener){
		        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		    }else if(document.attachEvent){
		        document.attachEvent('WeixinJSBridgeReady'   , onBridgeReady);
		        document.attachEvent('onWeixinJSBridgeReady' , onBridgeReady);
		    }
		}
		//新浪
		this.NeteasesShareInit_sina = function (){_this.shareData.sina="http://v.t.sina.com.cn/share/share.php?url="+encodeURIComponent(_this.shareData.link)+"&title="+encodeURIComponent(_this.shareData.fText)+"&content=utf8&pic="+encodeURIComponent(_this.shareData.MsgImg);
		}
		
		
		this.shareData.initFn(this);
	
		if(this.typeApp.isYiXin){ this.NeteasesShareInit_yixin(); return }
	    if(this.typeApp.isRead){ this.NeteasesShareInit_yuedu() ;return}
	    if(this.typeApp.isCloudMusic){ this.NeteasesShareInit_music();return}
	    if(this.typeApp.isWeiXin){ this.NeteasesShareInit_weixin(); return}
	    if(this.typeApp.isNewsApp){ this.NeteasesShareInit_news();return}
		this.NeteasesShareInit_sina();
	};
	
	window.F2eShare = F2eShare;
}();