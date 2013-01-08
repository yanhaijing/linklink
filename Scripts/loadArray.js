(function(){
	"use strict";
    var loadPhotos = function(){
        //url address
        var i = 0,
        j = 0,
        root = './',
        len = 0,
        imgs = [],
        images = ['images/llk_0.gif',
                      'images/llk_1.gif',
                      'images/llk_2.gif',
                      'images/llk_3.gif',
                      'images/llk_4.gif',
                      'images/llk_5.gif',
                      'images/llk_6.gif',
                      'images/llk_7.gif',
                      'images/llk_8.gif',
                      'images/llk_9.gif',
                      'images/llk_10.gif',
                      'images/llk_11.gif',
                      'images/llk_12.gif',
                      'images/llk_13.gif',
                      'images/llk_14.gif',
                      'images/llk_15.gif',
                      'images/llk_16.gif',
                      'images/llk_17.gif',
                      'images/llk_18.gif',
                      'images/llk_19.gif',
                      'images/llk_20.gif',
                      'images/llk_21.gif',
                      'images/llk_22.gif',
                      'images/llk_23.gif',
                      'images/llk_24.gif',
                      'images/llk_25.gif',
                      'images/llk_26.gif',
                      'images/llk_27.gif',
                      'images/llk_28.gif',
                      'images/llk_29.gif',
                      'images/llk_30.gif',
                      'images/llk_31.gif'];
		
		len = images.length;
		for(i=0; i < len; i = i + 1){//初始化imgs存放图片路径			
			imgs[j] = 'url(' + images[i] + ')';
			imgs[j+1] = 'url(' + images[i] + ')';
			imgs[j+2] = 'url(' + images[i] + ')';
			imgs[j+3] = 'url(' + images[i] + ')';
			j=j+4;
		}    
		
		return imgs;                  
    };
    window.linklink = window.linklink || {};
    window.linklink.loadPhotos = window.linklink.loadPhotos || loadPhotos;
    window.imgs = loadPhotos();
}());
