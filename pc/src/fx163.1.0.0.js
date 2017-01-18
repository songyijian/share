/*
	pc分享函数  1.0.0 	 
	作者：songyijian 
	发布：2017.1.13
	    
	API
        onclick="fx163(this,event)"

        class="share-component share-theme1" 
        data-title="分享 title"  
        data-desc="分享描述" 
        data-source="网易健康" 
        data-url="http://jiankang.163.com/15/1116/17/B8IDUFO300380014.html" 
        data-QR_Code="http://jiankang.163.com/"
        data-pic=""

	说明：	
		通过获取当前DOM对应属性，控制分享内容
		
*/
!function(){
	function fx163(o,ev){
		var data={
			title: encodeURIComponent(o.getAttribute("data-title")||document.title),/*分享标题 */
			url : encodeURIComponent(o.getAttribute("data-url")|| window.location),	/*地址*/
			source: encodeURIComponent(o.getAttribute("data-source")||"网易科技"),	/*分享源*/
			desc : encodeURIComponent(o.getAttribute("data-desc")||document.getElementsByName("description")[0].getAttribute('content')||''),	/*描述*/
			pic: encodeURIComponent(o.getAttribute("data-pic")),				/*分享的图片*/
			QR_Code:encodeURIComponent(o.getAttribute("data-QR_Code")||this.url),	//二维码
			charset:"UTF-8",	/*编码 Lofter需要提供*/
			appkey:"",			/*新浪微博来源 */
			ralateUid:""		/*新浪微博关注ID*/
		};
		var ent=ev||window.event;
		var tget=ent.srcElement||ent.target;
		var type=tget.getAttribute('data-share-type');
		function getStyle(obj, name){
			if(obj.currentStyle){ return obj.currentStyle[name];
			}else{ return getComputedStyle(obj, false)[name];}
		};
		//二维码壳的位置，top=页面滚入的高度+（鼠标离视口位置-鼠标按钮离父级距离）+分享按钮高度 
		var ooH=parseInt(getStyle(o,'height'));	//元素的高度
		var ooT=document.body.scrollTop||document.documentElement.scrollTop; //卷人的位置 chrom||ff ie
		var ooX=ent.clientX-ent.offsetX;			//x=鼠标离视口位置-鼠标点按钮离父级的位置
		var ooY=ent.clientY-ent.offsetY;			//Y=鼠标离视口位置-鼠标点按钮离父级的位置
		var documentH=document.documentElement.clientHeight;
		if(type=='yixin'){	
			window.open("https://open.yixin.im/share?appkey=yxb7d5da84ca9642ab97d73cd6301664ad&type=webpage&title="+data.title+"&url="+data.QR_Code||data.url+"&pic="+data.pic+"&desc="+data.desc)
		}else if(type=='lofter'){
			window.open("http://www.lofter.com/sharetext/?from=163&title="+data.title+"&source="+data.source+"&sourceUrl="+data.url+"&charset="+data.charset+"&content="+data.desc)
		}else if(type=='weixin'){
			var wixinImg='<img style="-webkit-user-select: none;" src="'+'https://chart.googleapis.com/chart?cht=qr&chs=140x140&choe=UTF-8&chld=L|0&chl='+data.QR_Code+'" width="130" height="130">'
			wxI(wixinImg);
		}else if(type=='qzone'){
			window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+data.url+"&title="+data.title+"&summary="+data.desc);
		}else if(type=='sina'){
			window.open("http://v.t.sina.com.cn/share/share.php?title=" + data.title +"&appkey=3628156158&url=" + data.url+ "&pic=" + data.pic);
		}else if(type=='renren'){
			window.open("http://widget.renren.com/dialog/share?resourceUrl=" + data.url +"&title=" + data.title + "&images=" + data.pic+"&description="+data.desc);      
		}else if(type=='youdao'){
			window.open("http://note.youdao.com/memory/?url=" +data.url + "&title=" + data.title);      
		}else if(type=="qq"){
			window.open("http://connect.qq.com/widget/shareqq/index.html?url="+data.url +"&showcount=2&desc=&summary="+data.desc+"&title="+data.title+"&site="+data.source+"&pics="+data.pic);
		}else if(type=="tqq"){
			window.open("http://share.v.t.qq.com/index.php?c=share&a=index&title="+data.title+"&url="+data.url +"&appkey=&site="+data.source+"&pic="+data.pic);
		}else if(type=="douban"){
			window.open("https://www.douban.com/share/service?name=&amp;href="+data.url+"&amp;image="+data.pic+"&amp;updated=&amp;bm=&amp;text="+data.desc+"&amp;title="+data.title);
		}else if(type=="tieba"){
			window.open("http://tieba.baidu.com/f/commit/share/openShareApi?url="+data.url+"&title="+data.title);
		};
		function wxI(wxM){
			var wxpopboxOnOff = document.getElementById("nt-weixin-barcode-pop-id");
			if (wxpopboxOnOff) {
				document.body.removeChild(wxpopboxOnOff)
			}
			var wxpopbox=document.createElement('div');
				wxpopbox.className="nt-weixin-barcode-pop";
				wxpopbox.id = "nt-weixin-barcode-pop-id";
				wxpopbox.style.position='absolute';
				wxpopbox.style.left=ooX+'px';
				wxpopbox.innerHTML='<div class="nt-weixin-pic" >'+wxM+'</div><div class="nt-weixin-text">用微信扫描二维码<br>分享至好友和朋友圈</div>';
			var	ntwx2dcodeclose=document.createElement('a');
				ntwx2dcodeclose.className='nt-weixin-close';
				ntwx2dcodeclose.href="javascript:;";
				ntwx2dcodeclose.target="_self";
				ntwx2dcodeclose.innerHTML="x";
				if(documentH-ooY-ooH>160){//下面可以装下
					wxpopbox.style.top=ooY+ooH+ooT+8+'px';
				}else{
					wxpopbox.style.top=(ooY+ooT-168)+'px';
				}
			wxpopbox.appendChild(ntwx2dcodeclose);
			document.body.appendChild(wxpopbox);   
			wxpopbox.onclick=function(){
				document.body.removeChild(wxpopbox);
			};
		};
	};

	window.fx163 = fx163;
}();