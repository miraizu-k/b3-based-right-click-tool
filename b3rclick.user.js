// ==UserScript==
// @name           b3rClick
// @description    su-zan
// @include   http://*.3gokushi.jp/*
// @author    su-zan
// @version   0.01.06
// ==/UserScript==

var menu = document.createElement('div');
with(menu.style){
    padding = '4px';
    opacity = 0.8;
    fontSize = 'small';
    color = '#333333';
    backgroundColor = '#000000';
    border = '1px solid #7777FF';
    position = 'fixed';
    zIndex = 1000;
    cursor = 'pointer';
    lineHeight = '140%';
}

    menu.innerHTML = 'test';
    menu.setAttribute("class","rMenu");

function rightClickMenu(){
    this.init.apply(this,arguments);
}

rightClickMenu.prototype = {
    init:function(){
        this.ruleList = new Array();
        this.ruleList.length = 0;
        this.menu = new Array();
        this.menu.length = 0;
    },
    addMenu:function(menuName){
        this.menu[menuName] = eval(menuName);
    },
    addRule:function(){
        this.ruleList[this.ruleList.length] = {
            type:arguments[0],
            value:arguments[1],
            menu:arguments[2]
        };
    },
    setListener:function(){
        var callee = this;
        document.addEventListener('click',function(event){

            var resultMenu = callee.loadMenu.apply(callee,arguments);
            if(resultMenu != false && event.button == '2'){
                for(var n=0,text='';n < resultMenu.items.length;n++){
                    switch(resultMenu.items[n].type){
                        case 'link':
                            if(resultMenu.items[n].queryType == 'value'){
                                var re = new RegExp(resultMenu.items[n].queryValue + "\=(.*)&","i");
                                if(event.target.href.match(re) != -1){
                                    var query = resultMenu.items[n].queryValue + "=" +RegExp.$1;
                                }

                            }else{
                                var match = event.target.href.match(/\?(.*)/i);
                                var query = RegExp.$1;
                            }

                            text += '<a href="' + resultMenu.items[n].href + query + '">' + resultMenu.items[n].name + "</a><br>";
                            break;
                        case 'text':
                            text += '<span>' + resultMenu.items[n].name + "</span><br>";
                            break;
                        case 'value':
                             var value = resultMenu.items[n].name.apply(this,arguments);
                             text += '<span>' + value + "</span><br>";
                            break;
                    }

                }

                menu.innerHTML = text;
                document.getElementsByTagName('body')[0].appendChild(menu);
                menu.style.display = 'block';

                menu.style.top = event.pageY - window.scrollY + 'px';
                menu.style.left = event.pageX    - window.scrollX + 'px';

            }else{
                menu.style.display = 'none';
            }
        },false);
    },
    loadMenu:function(event){
        for(var n=0;n<this.ruleList.length;n++){
            if(this.ruleList[n].type != 'cond'){
                if(eval("event.target." + this.ruleList[n].type) == this.ruleList[n].value){
                    return this.menu[this.ruleList[n].menu];
                }
            }else{
             if(this.ruleList[n].value(event)){
                    return this.menu[this.ruleList[n].menu];
                }
            }
        }
        return false;
    }
}

//***************************メニューオブジェクト*********************
var mapMenu = {
    items:[
    {
        name:function(event){
            return "<b>" + event.target.alt + "</b>";
        },
/*
        name:function(){
            return document.getElementById('x_y').innerHTML;
        },
*/
        type:"value",
    },
    {
        name:"情報",
        type:"link",
        href:"land.php?",
    },
    {
        name:"出兵",
        type:"link",
        href:"facility/castle_send_troop.php?",
    },
    {
        name:"この場所を中心に表示",
        type:"link",
        href:"map.php?",
    },
    {
        name:"この領地を拠点にする",
        type:"link",
        href:"facility/select_type.php?",
        execute:function(){
            alert('出兵');
        },
    },
    {
        name:"この領地をレベルアップ",
        type:"link",
        href:"territory_proc.php?",
    },
    {
        name:"この領地を破棄する",
        type:"link",
        href:"territory_proc.php?mode=remove&",
    }
    ]
}

var villageMenu = {
    items:[
    {
        name:function(event){
            return '<b>' + event.target.alt + "</b>";
        },
        type:"value",
    },
    {
        name:"情報",
        type:"link",
        href:"facility/select_facility.php?",
        query:"/\?(.*)/i",
    },
    {
        name:"レベルアップ",
        type:"link",
        href:"facility/build.php?",
    }
    ]
}

var sidebarVillageMenu = {
    items:[
    {
        name:function(event){
            return "<b>" + event.target.title + "</b>";
        },
        type:"value",
    },
    {
        name:"都市画面",
        type:"link",
        href:"http://" + location.host + "/village_change.php?page=%2Fvillage.php&",
        queryType:"value",
        queryValue:"village_id"
    },
    {
        name:"地図画面",
        type:"link",
        href:"http://" + location.host + "/village_change.php?page=%2Fmap.php&",
        queryType:"value",
        queryValue:"village_id"
    },
    {
        name:"内政画面",
        type:"link",
        href:"http://" + location.host + "/village_change.php?page=%2Fcard%2Fdomestic_setting.php&",
        queryType:"value",
        queryValue:"village_id"
    }
    ]
}

//***************************メニューオブジェクトここまで***************

var init = function(){
}

window.addEventListener('load',init,false);
var rMenu = new rightClickMenu();

document.addEventListener("contextmenu",function(event){
    event.preventDefault();
    return false;
},false);

rMenu.addMenu('sidebarVillageMenu');
rMenu.addRule("cond",function(event){
    if(event.target.href != undefined && event.target.href.match(/village_change.php/i)){
        return true;
    }
},'sidebarVillageMenu');

//**************************51×51地図画面*******************
if(document.URL.match(/big_map.php/i)){
    rMenu.addMenu('mapMenu');
    mapMenu.items[0] = {
        name:function(event){
            event.target.getAttribute("onmouseover").match(/dt.*?>(.*?)</i);
            return '<b>' + RegExp.$1 + "</b>";
        },
        type:"value",
    }
    rMenu.addRule("cond",function(event){
        if(event.target.parentNode.parentNode.className.match(/bg_/i))return true;
    },'mapMenu');
}
//**************************地図画面*************************
else if(document.URL.match(/map.php/i)){
    rMenu.addMenu('mapMenu');
    rMenu.addRule('tagName','AREA','mapMenu');
}


//**************************都市画面*************************
if(document.URL.match(/village.php/i)){
    rMenu.addMenu('villageMenu');
    rMenu.addRule('tagName','AREA','villageMenu');



}

//**************************デッキ画面***********************

var Deck = function(){
    this.init.apply(this,arguments);
}

Deck.prototype = {
    init:function(){
    }
}
/*******************一言掲示板********************/
if(document.URL.match(/chat_view.php/i)){
    var tr = document.getElementsByTagName('table')[1].getElementsByTagName('tr');
    for(var n=0;n<3;n++){
        tr[n].childNodes[1].setAttribute("colspan","3");
    }
    for(var n=3;n<tr.length-1;n=n+2){
        var time = document.createElement('td');
        time.innerHTML = tr[n].textContent;
        time.style.color="#0099CC";
        tr[n+1].appendChild(time);
        tr[n].style.display = 'none';
    }
}

rMenu.setListener();

var url = document.URL;

function urlQuery2Array(url){
    if(url.match(/\?(.*)/i)){
        var array = RegExp.$1.split("&");
        alert(array[1]);
    }
}



var style = document.createElement('style');
with(style){
    type = "text/css";
}

style.innerHTML =
    <><![CDATA[
        .rMenu span{
            color:#FFAAAA;
            padding:2px;
        }
        .rMenu a:link{color:#FFFFFF;text-decoration:none;padding:2px;}
        .rMenu a:visited {color:#FFFFFF;text-decoration:none;padding:2px;}
        .rMenu a:hover {background-color:#DDDDDD;color:#333333;text-decoration:none;}
        .rMenu a:active {background-color:#DDDDDD;color:#333333;text-decoration:none;}
        #headerArea{
            display:none;
        }
    ]]></>;

document.getElementsByTagName('head')[0].appendChild(style);
