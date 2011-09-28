// ==UserScript==
// @name           b3rClick
// @namespace      b3rClick
// @description    ブラウザ三国志ベースのアプリケーションの右クリックを拡張するプログラムです。 This script is an right-click extension, browser-3gokushi based applications 
// @include        http://*.3gokushi.jp/*
// @include        http://*.1kibaku.jp/*
// @include        http://*.17pk.com.tw/*
// @include        http://*.landsandlegends.com/*
// @include        http://*.sdsam.nexon.com/*
// @include        http://*.lordsofdynasty.com/*
// @include        http://*.sangokushi.in.th/*
// @author         su-zan
// @maintainer     romer
// @version        1.1.3.3
// ==/UserScript==
(function () {
   var NAMESPACE = 'b3rClick',
    crossBrowserUtility = initCrossBrowserSupport(),
    systemMessages = {
        '_3gokushi.jp' : {
            'LordName' : '\u541b\u4e3b\u540d',
            'Flatland' : '\u5e73\u5730'
        },
        '_1kibaku.jp' : {
            'LordName' : '\u982d\u9996\u540d',
            'Flatland' : '\u5e73\u5730'
        },
        '_landsandlegends.com' : {
            'LordName' : 'Lord',
            'Flatland' : 'Flatland'
        },
        '_17pk.com.tw' : {
            'LordName' : '\u541b\u4e3b\u540d',
            'Flatland' : '\u5e73\u5730'
        },
        '_sdsam.nexon.com' : {
            'LordName' : '\uad70\uc8fc\uc774\ub984',
            'Flatland' : '\ud3c9\uc9c0'
        },
        '_lordsofdynasty.com' : {
            'LordName' : 'Seigneur',
            'Flatland' : 'Plaines'
        },
        '_sangokushi.in.th' : {
            'LordName' : '\u0e0a\u0e37\u0e48\u0e2d\u0e40\u0e08\u0e49\u0e32\u0e40\u0e21\u0e37\u0e2d\u0e07',
            'Flatland' : '\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e23\u0e32\u0e1a'
        }
    },
    localeMessages = {
        '_ja' : {
            'LordName' : '\u541b\u4e3b\u540d',
            'Flatland' : '\u5e73\u5730',
            'Infomation' : '\u60c5\u5831',
            'Deploy' : '\u51fa\u5175',
            'CenterMap' : '\u4e2d\u592e\u306b\u8868\u793a\u3059\u308b',
            'ConvertToVillage' : '\u3053\u306e\u9818\u5730\u3092\u6751\u306b\u3059\u308b',
            'ConvertToFort' : '\u3053\u306e\u9818\u5730\u3092\u7826\u306b\u3059\u308b',
            'LvUpTerritory' : '\u3053\u306e\u9818\u5730\u3092\u30ec\u30d9\u30eb\u30a2\u30c3\u30d7',
            'DiscardTerritory' : '\u3053\u306e\u9818\u5730\u3092\u7834\u68c4\u3059\u308b',
            'LvUp' : '\u30ec\u30d9\u30eb\u30a2\u30c3\u30d7',
            'LvUpx2' : '\u30ec\u30d9\u30eb\u30a2\u30c3\u30d7x2',
            'Building' : '\u5efa\u7bc9\u00A0>>',
            'CityField' : '\u90fd\u5e02\u753b\u9762',
            'MapField' : '\u5730\u56f3\u753b\u9762',
            'GovernorField' : '\u5185\u653f\u753b\u9762'
        },
        '_en' : {
            'LordName' : 'Lord',
            'Flatland' : 'Flatland',
            'Infomation' : 'infomation',
            'Deploy' : 'deploy',
            'CenterMap' : 'Center on map',
            'ConvertToVillage' : 'Convert To Village',
            'ConvertToFort' : 'Convert To Fort',
            'LvUpTerritory' : 'Level Up Territory',
            'DiscardTerritory' : 'Discard Territory',
            'LvUp' : 'Level Up',
            'LvUpx2' : 'Level Up x2',
            'Building' : 'Building\u00A0>>',
            'CityField' : 'City Field',
            'MapField' : 'Map Field',
            'GovernorField' : 'Governor Field'
        },
        '_zh' : {
            'LordName' : '\u541b\u4e3b\u540d',
            'Flatland' : '\u5e73\u5730',
            'Infomation' : '\u4fe1\u606f',
            'Deploy' : '\u51fa\u5175',
            'CenterMap' : '\u986f\u793a\u6b64\u8655\u70ba\u4e2d\u5fc3',
            'ConvertToVillage' : '\u8f49\u63db\u00A0\u6751\u838a',
            'ConvertToFort' : '\u8f49\u63db\u00A0\u57ce\u5be8',
            'LvUpTerritory' : '\u9818\u5730\u7684\u5347\u7d1a',
            'DiscardTerritory' : '\u6368\u68c4\u6b64\u9818\u5730',
            'LvUp' : '\u4e0a\u6607\u7b49\u7d1a',
            'LvUpx2' : '\u4e0a\u6607\u7b49\u7d1ax2',
            'Building' : '\u5efa\u9020\u00A0>>',
            'CityField' : '\u90fd\u5e02\u753b\u9762',
            'MapField' : '\u5730\u5716\u753b\u9762',
            'GovernorField' : '\u5167\u653f\u753b\u9762'
        }
    },
    __ = (function () {
       var LC = '_'+navigator.language.toLowerCase ().substring(0,2),
           DOMAIN = '_'+location.hostname.toLowerCase ().replace(/^[^.]+\./i, ''),
           DEF_LC = '_en',
           DEF_DOMAIN = '_3gokushi.jp',
           result = function (messagesList) {
                      if (arguments.callee !== this.constructor) {
                          return new arguments.callee(messagesList);
                      }
                      var messages = messagesList[LC] || messagesList[DEF_LC] || messagesList[DOMAIN] || messagesList[DEF_DOMAIN];
                      this.text = function () {
                          return function (message) {
                              return messages[message] || message;
                          };
                      };
                      this.key = function () {
                          return function (message) {
                              for (var messageKey in messages) {
                                  if (messages[messageKey] === message) {
                                      return messageKey;
                                  }
                              }
                              return message;
                          };
                      };
                   };
       return function (messageList) {
           return new result(messageList);
       };
   })(),
    _l = __(localeMessages).text(),
    _s = __(systemMessages).text(),
    _sl = (function () {
        var findKey = __(systemMessages).key();
        return function (message) {
            return _l(findKey(message));
        };
    })(),
    
    $ = function (id,pd) {return pd ? pd.getElementById(id) : document.getElementById(id);},
    /**
     * $x
     * @description 以前の$a xpathを評価し結果を配列で返す
     * @param {String} xp
     * @param {HTMLElement|HTMLDocument} dc
     * @returns {Array}
     * @throws
     * @function
     */
    $x = function (xp, dc) {function c (f) {var g = '';if (typeof f == 'string') {g = f;}var h = function (a) {var b = document.implementation.createHTMLDocument('');var c = b.createRange();c.selectNodeContents(b.documentElement);c.deleteContents();b.documentElement.appendChild(c.createContextualFragment(a));return b;};if (0 <= navigator.userAgent.toLowerCase().indexOf('firefox')) {h = function (a) {var b = document.implementation.createDocumentType('html', '-//W3C//DTD HTML 4.01//EN', 'http://www.w3.org/TR/html4/strict.dtd');var c = document.implementation.createDocument(null, 'html', b);var d = document.createRange();d.selectNodeContents(document.documentElement);var e = c.adoptNode(d.createContextualFragment(a));c.documentElement.appendChild(e);return c;};}return h(g);}var m = [], r = null, n = null;var o = dc || document.documentElement;var p = o.ownerDocument;if (typeof dc == 'object' && typeof dc.nodeType == 'number') {if (dc.nodeType == 1 && dc.nodeName.toUpperCase() == 'HTML') {o = c(dc.innerHTML);p = o;}else if (dc.nodeType == 9) {o = dc.documentElement;p = dc;}}else if (typeof dc == 'string') {o = c(dc);p = o;}try {r = p.evaluate(xp, o, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);for ( var i = 0, l = r.snapshotLength; i < l; i++)m.push(r.snapshotItem(i));}catch (e) {try {var q = p.evaluate(xp, o, null, XPathResult.ANY_TYPE, null);switch (q.resultType) {case XPathResult.NUMBER_TYPE:m.push(Number(q.numberValue));break;case XPathResult.STRING_TYPE:m.push(String(q.stringValue));break;case XPathResult.BOOLEAN_TYPE:m.push(Boolean(q.booleanValue));break;case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:while (n = q.iterateNext()) {m.push(n);}break;}}catch (e) {throw new Error(e.message);}}return m;},
    
    /**
     * $s
     * @description 以前の$x xpathを評価し1つの結果を返す
     * @param {String} xp
     * @param {HTMLElement|HTMLDocument} dc
     * @returns {Node}
     * @throws
     * @see $x
     * @function
     */
    $s = function(xp, dc) { return $x(xp,dc).shift();},
    
    /**
     * $e
     * @param {HTMLElement|HTMLDocument|Window} doc
     * @param {String|Object} event string or event.click=f or event.click=[f,f,f]
     * @param {Function} event handler
     * @param {Boolean} [useCapture=false]
     * @function
     */
    $e = function(doc, event, func, useCapture) {var eventList = event;var eType = null;var capture = useCapture || false;if (typeof event == 'string') {eventList = {};eventList[event] = [func];} else {for (eType in eventList) {if (typeof eventList[eType] == 'object'&& eventList[eType] instanceof Array) {continue;}eventList[eType] = [ event[eType] ];}}for (eType in eventList) {var eventName = eType;for ( var i = 0; i < eventList[eType].length; i++) {doc.addEventListener(eventName, eventList[eType][i], capture);}}},
    
    //初期設定
    menuWarp = createElement('div'),
    mainMenu = createElement('div', {
        'attribute' : {
            'class' : 'rMenu'
        },
        'css' : {
            'padding': '3px',
            'opacity': 0.8,
            'font-size': 'small',
            'color': '#333333',
            'background-color': '#000000',
            'border': '1px solid #7777FF',
            'position': 'absolute',
            'z-index': 10000,
            'cursor': 'pointer',
            'display': 'none',
            'min-width': '75px'
        },
        'innerText' : 'none'
    }),
    
    subMenu = mainMenu.cloneNode(false);
    
    subMenu.setAttribute('ready','false');
    subMenu.innerHTML = '<ul><li>testdayo</li></ul>';
    
    document.body.appendChild(menuWarp);
    
    menuWarp.appendChild(mainMenu);
    menuWarp.appendChild(subMenu);
    
    $e(mainMenu, {
        'mouseover' : function(e){
            mainMenu.style.display = 'block';
        },
        'mouseout' : function(e){
            mainMenu.style.display = 'none';
        }
    });
    
    $e(subMenu, {
        'mouseover' : function(e){
            mainMenu.style.display = 'block';
            subMenu.style.display = 'block';
        },
        'mouseout' : function(e){
            mainMenu.style.display = 'none';
            subMenu.style.display = 'none';
        }
    });
    
    
    subMenu.innerHTML = '<ul><li>testdayo</li></ul>';
    
    
    var nowTime = +new Date(),
        userNameKey = NAMESPACE+'/'+location.hostname+'/UserName',
        userName = GM_getValue(userNameKey,null),
        preCheckTimeKey = NAMESPACE+'/'+location.hostname+'/UserName_PreCheckTime',
        preCheckTime = GM_getValue(preCheckTimeKey,nowTime);

    if (userName === null || (preCheckTime + 24*60*60*1000) <= nowTime) {
        var getUserName = function(){
            GM_xmlhttpRequest({
                url:location.protocol + '//' + location.host+'/user/'+location.search,
                method : 'GET',
                onload : function(res){
                    var dom = document.createElement('html');
                    dom.innerHTML = res.responseText;
                    var ret = $x('//table[contains(concat(" ",normalize-space(@class)," "), " commonTables ")]//tr[2]/td[2]',dom);
                    ret.forEach(function(self){
                        userName = self.innerHTML;
                        GM_setValue(userNameKey,userName);
                        GM_setValue(preCheckTimeKey,+new Date());
                    });
                    if (userName === null || userName.length === 0) {
                        setTimeout(getUserName,100);
                    }
                }
            });
        };
        setTimeout(getUserName,0);
    }
    
    // 右クリック時の動作
    
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
    
            var mFunc = function(event){
                var resultMenu = callee.evaluate.apply(callee,arguments);
                if(resultMenu != false && event.button == '2'){
                    if (typeof resultMenu.ready == 'function') {
                        resultMenu.ready(event);
                    }
    
                    var addWarp = document.createElement('UL');
                    for(var n=0;n < resultMenu.items.length;n++){
                        var addDoc = null;
                        var item = resultMenu.items[n];
                        var name = callee.getValue(item,'name',arguments);
                        if (!name) {
                            continue;;
                        }
                        switch(item.type){
                            case 'link':
                                var match = null;
                                var href = callee.getValue(item,'href',arguments);
                                addDoc = document.createElement('A');
                                if (0 < href.length) {
                                    if (href.lastIndexOf('&') == (href.length - 1)) {
                                        href = href.slice(0,-1);
                                    }
                                    if ((match = event.target.href.match(/[\?|&](([x|y]|SSID)=[\w,-]+)/ig)) != null) {
                                        if (href.lastIndexOf('?') != (href.length - 1)) {
                                            href += '&';
                                        }
                                        href += match.join('').replace('?','');
                                    }
                                    $e(addDoc,'click',function() {
                                        subMenu.style.display = 'none';
                                        mainMenu.style.display = 'none';
                                    });
                                }
                                else {
                                    href = 'javascript:void(0);';
                                }
    
                                addDoc.href = href;
                                addDoc.appendChild(document.createTextNode(name));
                                break;
                            case 'text':
                                addDoc = document.createElement('SPAN');
                                addDoc.innerHTML = name;
                                break;
                        }
    
                        if (typeof item.events == 'object') {
                            $e(addDoc,item.events);
                        }
    
                        var li = document.createElement('LI');
                        li.appendChild(addDoc);
                        addWarp.appendChild(li);
    
                    }
    
                    mainMenu.replaceChild(addWarp,mainMenu.firstChild);
    
                    mainMenu.style.display = 'block';
                    mainMenu.style.top = event.pageY - 5 + 'px';
                    mainMenu.style.left = event.pageX - 5  + 'px';
    
                    var warpWidth = parseFloat(document.defaultView.getComputedStyle(addWarp, '').width);
                    var bodyWidth = parseFloat(document.defaultView.getComputedStyle(mainMenu.parentNode, '').width);
    
                    if (bodyWidth < (event.pageX + warpWidth + 10)) {
                        mainMenu.style.left = (bodyWidth - warpWidth - 15) + 'px';
                    }
    
                } else {
                    mainMenu.style.display = 'none';
                }
    
                event.preventDefault();
                return false;
            };

            [
                '(id("mapOverlayMap") | id("map51-content")//div)/*[contains("aAareaAREA",name(.))][@href]',
                '//div[contains(concat(" ",normalize-space(@class)," "), " sideBoxInner ") and contains(concat(" ",normalize-space(@class)," "), " basename ")]//li/a',
                'id("lodgment")/div[contains(concat(" ",normalize-space(@class)," "), " floatInner ")]//li/a[not(contains(concat(" ",normalize-space(@class)," "), " map-basing "))]'
            ].forEach(function(xpath){
                $x(xpath).forEach(function(self){
                    $e(self,'contextmenu',mFunc);
                 });
            });
        },
        evaluate : function (event) {
            for (var n=0;n<this.ruleList.length;n++) {
                if (this.ruleList[n].type != 'cond') {
                    if (event.target[this.ruleList[n].type] == this.ruleList[n].value) {
                        return this.menu[this.ruleList[n].menu];
                    }
                } else {
                 if(this.ruleList[n].value(event)){
                        return this.menu[this.ruleList[n].menu];
                    }
                }
            }
            return false;
        },
        getValue : function(item,prop,orgArguments) {
            switch (typeof item[prop]) {
                case 'function':
                    return item[prop].apply(item,orgArguments);
                case 'string':
                    return item[prop];
            }
            return '';
        }
    };
    
    // ***************************メニューオブジェクト*********************
    var mapMenu = {
        items:[
        {
            name:function(e){
                var name = '<b>';
                if (e.target.nodeName.toUpperCase() == 'A') {
                    $x('@onmouseover',e.target).forEach(function(mouseover){
                        var doc = mouseover.value.replace(/^[^']+'|'[^']+$/g,'');
                        name += $s('//dt[contains(concat(" ",normalize-space(@class)," "), " bigmap-caption ")]/text()',doc).data;
                    });
                }
                else {
                    name += e.target.alt;
                }
                return name + '</b>';
            },
            type:'text'
        },
        {
            name: _l('Infomation'),
            type:'link',
            href:'land.php?'
        },
        {
            name:_l('Deploy'),
            type:'link',
            href:'facility/castle_send_troop.php?'
        },
        {
            name:_l('CenterMap'),
            type:'link',
            href:'map.php?'
        },
        {
            name: function(e){
                return mapMenu.canCreateFacility(e) ? _l('ConvertToVillage') : null;
            },
            type:'link',
            href:'facility/select_type.php?mode=build&type=220'
        },
        {
            name: function(e){
                return mapMenu.canCreateFacility(e) ? _l('ConvertToFort') : null;
            },
            type:'link',
            href:'facility/select_type.php?mode=build&type=222'
        },
        {
            name: function(e){
                return mapMenu.isMyTerritory(e) ? _l('LvUpTerritory') : null;
            },
            type:'link',
            href:'territory_proc.php?mode=lvup'
        },
        {
            name:function(e){
                return mapMenu.isMyTerritory(e) ? _l('DiscardTerritory') : null;
            },
            type:'link',
            href:'territory_proc.php?mode=remove'
        }
        ],
        canCreateFacility : (function () {
            var oldEvent = null,
                status = false,
                _canCreateFacility = (function () {
                                    var facilityCount = $x('count(id("lodgment")/div[contains(concat(" ",normalize-space(@class)," "), " floatInner ")]//li)')[0],
                                        maxFame = +$x('id("status_left")//img[contains(@src,"ico_fame")]/following-sibling::text()[1]')[0].nodeValue.match(/\d+\s*\/\s*(\d+)/)[1],
                                        canCreate = false;
                                    [0,17, 35, 54, 80, 112, 150, 195, 248, 310].forEach(function (fame,index) {
                                        if (fame <= maxFame && facilityCount <= index) {
                                            canCreate = true;
                                        }
                                    });
                                    return canCreate;
                                })();
            return function (e) {
                if (e === oldEvent) {
                    return status;
                }
                oldEvent = e,status = false;
                if (mapMenu.isMyTerritory(e) === true && _canCreateFacility === true) {
                    status = true;
                }
                return status;
            };
        })(),
        isMyTerritory : (function () {
            var oldEvent = null,status = false;
            return function (e) {
                if (e === oldEvent) {
                    return status;
                }
                oldEvent = e,status = false;
                if (e.target.nodeName.toUpperCase() == 'A') {
                    $x('@onmouseover',e.target).forEach(function(mouseover){
                        var doc = mouseover.value.replace(/^[^']+'|'[^']+$/g,'');
                        var text = $s('//dt[contains(text(),"'+_s('LordName')+'")]/following-sibling::dd[1]/text()',doc);
                        if (text && text.data == userName) {
                            status = true;
                        }
                    });
                }
                else {
                    status = new RegExp("'[^']+'[^']+'"+userName+"'",'i').test(e.target.getAttribute('onmouseover'));
                }
                return status;
            };
        })()
    };
    
    var villageMenu = {
        items:[
        {
            name:function(event){
                return '<b>' + _sl(event.target.alt) + '</b>';
            },
            type:'text'
        },
        {
            name: _l('Infomation'),
            type:'link',
            href:'facility/select_facility.php?'
        },
        {
            name:function(event){
                if (event.target.alt == _s('Flatland')) {
                    return null;
                }
                return _l('LvUp');
            },
            type:'link',
            href:'facility/build.php?'
        },
        {
            name:function(event){
                if (event.target.alt == _s('Flatland')) {
                    return null;
                }
                return _l('LvUpx2');
            },
            type:'link',
            href:'facility/build.php?',
            events : {
                click : function (event) {
                    subMenu.style.display = 'none';
                    mainMenu.style.display = 'none';
                    GM_xmlhttpRequest({url:event.target.href, method : 'GET'});
                    GM_xmlhttpRequest({
                        url:event.target.href,
                        method : 'GET',
                        onload:function(res){
                            location.reload();
                        }
                    });
                    event.preventDefault();
                    return false;
                }
            }
        },
        {
            name:function(event){
                if (event.target.alt == _s('Flatland')) {
                    return _l('Building');
                }
                return '';
            },
            type:'link',
            href:'',
            events : {
                mouseover : function(event) {
                    var enabled = function() {
                        if (subMenu.getAttribute('ready') == 'false') {
                            setTimeout(enabled,200);
                            return;
                        };
                        var left = parseFloat(mainMenu.style.left) + ((mainMenu.clientWidth < 75) ? 75 : mainMenu.clientWidth) - 15;
                        subMenu.style.display = 'block';
                        subMenu.style.top = event.pageY + 'px';
                        subMenu.style.left = left + 'px';
                    };
                    enabled();
                },
                mouseout: function(e) {
                    subMenu.style.display = 'none';
                },
                click : function (e) {
                    e.preventDefault();
                    return false;
                }
            }
        }
        ],
        ready : function(event) {
            var baseUrl = location.protocol + '//'+location.hostname+'/';
            subMenu.setAttribute('ready','false');
            GM_xmlhttpRequest({
                url:event.target.href,
                method : 'GET',
                onload:function(respons){
                    subMenu.innerHTML = '';
                    var addWarp = document.createElement('UL');
                    subMenu.appendChild(addWarp);
                    var dom = document.createElement('html');
                    dom.innerHTML = respons.responseText;
                    $x('//table[@summary="object"]',dom).forEach(function(self){
                        var addDocWarp = document.createElement('LI');
                        var addDoc = document.createElement('A');
                        $x('.//th[contains(concat(" ",normalize-space(@class)," "), " mainTtl ")]',self).forEach(function(th){
                            addDoc.innerHTML = _sl(th.innerHTML);
                        });
                        $x('.//div[contains(concat(" ",normalize-space(@class)," "), " lvupFacility ")]/p[contains(concat(" ",normalize-space(@class)," "), " main ")]/a',self).forEach(function(a){
                            addDoc.href = baseUrl + '/facility/' + (a.getAttribute('href').replace(baseUrl,''));
                        });
                        $e(addDoc,'click',function(e){subMenu.style.display = 'none';mainMenu.style.display = 'none';});
                        addDocWarp.appendChild(addDoc);
                        addWarp.appendChild(addDocWarp);
                    });
                    subMenu.setAttribute('ready','true');
                }
            });
        }
    };
    
    var sidebarVillageMenu = {
        items:[
        {
            name:function(event){
                return '<b>' + event.target.title + '</b>';
            },
            type:'text'
        },
        {
            name: _l('CityField'),
            type:'link',
            href:function(event){
                var res = null;
                var query = '';
                if((res = event.target.href.match(/village_id=([^&]*)/i)) != null){
                    query = res[1];
                }
                return '/village_change.php?page=%2Fvillage.php&village_id=' + query;
            }
        },
        {
            name:_l('MapField'),
            type:'link',
            href:function(event){
                var res = null;
                var query = '';
                if((res = event.target.href.match(/village_id=([^&]*)/i)) != null){
                    query = res[1];
                }
                return '/village_change.php?page=%2Fmap.php&village_id=' + query;
            }
        },
        {
            name:_l('GovernorField'),
            type:'link',
            href:function(event){
                var res = null;
                var query = '';
                if((res = event.target.href.match(/village_id=([^&]*)/i)) != null){
                    query = res[1];
                }
                return '/village_change.php?page=%2Fcard%2Fdomestic_setting.php&village_id=' + query;
            }
        }
        ]
    };
    
    // ***************************メニューオブジェクトここまで***************
    
    // **************************全体*************************
    var rMenu = new rightClickMenu();
    rMenu.setListener();
    
    rMenu.addMenu('sidebarVillageMenu');
    rMenu.addRule('cond',function(event){
        if(event.target.href != 'undefined' && event.target.href.match(/village_change.php/i)){
            return true;
        }
    },'sidebarVillageMenu');
    
    // **************************地図画面*************************
    if(document.URL.match(/(?:big_)?map\.php/i)){
        rMenu.addMenu('mapMenu');
        rMenu.addRule('tagName','AREA','mapMenu');
        rMenu.addRule('tagName','A','mapMenu');
    }
    
    // **************************都市画面*************************
    if(document.URL.match(/village.php/i)){
        rMenu.addMenu('villageMenu');
        rMenu.addRule('tagName','AREA','villageMenu');
    }
    
    
    
    
    GM_addStyle([
                    '.rMenu li b{ color:#FFAAAA;list-style :none outside none;white-space: nowrap;}',
                    '.rMenu li{ color:#FFFFFF;list-style :none outside none;white-space: nowrap;}',
                    '.rMenu a:link{text-decoration:none;padding-right:2px;padding-left:1px}',
                    '.rMenu a:visited {text-decoration:none;padding-right:2px;padding-left:1px}',
                    '.rMenu a:hover {background-color:#DDDDDD;color:#333333;text-decoration:none;}',
                    '.rMenu a:active {background-color:#DDDDDD;color:#333333;text-decoration:none;}',
                    '.rMenu a {display: block;width: 98%;margin-right: 1px;}',
                    '#headerArea{ display:none; }',
                    ].join('\n')
                );
    
    
    /**
    *
    * @param {String} text
    * @returns {Element}
    */
    function createText(text) {
       return document.createTextNode(text);
    }
    
    /**
    * Function createElement
    *
    * @param {String} elementName
    * @param {Object} [option]
    * @param {HTMLDocument} [doc]
    * @returns {Element}
    */
    function createElement(elementName, option, doc) {
       var pageDocument = doc ? doc : document;
       var retElement = elementName == 'img' ? new Image() : pageDocument
               .createElement(elementName);
    
       if (typeof option == 'object') {
           if (typeof option.attribute == 'object') {
               for ( var attrName in option.attribute) {
                   retElement.setAttribute(attrName, option.attribute[attrName]);
               }
           }
           if (typeof option.events == 'object') {
               $e(retElement, option.events);
           }
           if (typeof option.innerText == 'string') {
               retElement.appendChild(pageDocument.createTextNode(option.innerText));
           }
           if (typeof option.css == 'object') {
               var cssString = '';
               for ( var cssProp in option.css) {
                   retElement.style.setProperty(cssProp, option.css[cssProp], '');
               }
           } else if (option.css == 'string') {
               retElement.style.cssText = option.css;
           }
       }
       return retElement;
    }
    
    
    /**
     * initGMFunctions
     * @description GM関数初期化
     */
    function initGMFunctions() {
        var hasGM = (function () {
            var result = {},
                notSupportReg = /not\s*support/i,
                existsAPI = function (func) {
                    return typeof func === 'function' && (Object.prototype.hasOwnProperty.call(func, 'prototype') === false || notSupportReg.test(String(func)) === false);
                };
            
            [
                    'GM_getValue', 'GM_setValue', 'GM_listValues', 'GM_deleteValue',
                    'GM_addStyle', 'GM_log', 'GM_xmlhttpRequest', 'GM_openInTab', 'GM_getResourceURL',
                    'GM_getResourceText', 'GM_registerMenuCommand'
            ].forEach(function (methodName) {
                var resName = methodName.substr(3),that = Function('return this')();
                result[resName] = false;
                // window != Greasemonkey window
                if (Object.prototype.hasOwnProperty.call(that, methodName) && existsAPI(that[methodName])) {
                    result[resName] = true;
                }
            });
            return result;
        })();
    
        /**
         * GM_addStyle
         * @param {String} css css text
         * @function
         */
        if (hasGM.addStyle === false) {
            GM_addStyle = function(css) {
                var style = document.evaluate('//head/style[not(@src) and last()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                style = style && style.singleNodeValue || document.createElement('style');
                style.type = 'text/css';
                style.appendChild(document.createTextNode(css));
                if (!(style.parentNode || style.parentElement)) {
                    document.getElementsByTagName('head')[0].appendChild(style);
                }
            };
        }
        
        /**
         * GM_setValue
         * @param {String} name storage key
         * @param {String|Number|Boolean} value storage saved object
         * @throws {TypeError}
         * @see localStorage
         * @function
         */
        if (hasGM.setValue === false) {
            GM_setValue = function(name, value) {
                switch (typeof value) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        break;
                    default:
                        throw new TypeError();
                }
    
                value = (typeof value)[0] + value;
                localStorage.setItem(name, value);
            };
        }
    
        /**
         * GM_getValue
         * @param {String} key storage key
         * @param {Object} [defaultValue] any Object
         * @returns {Object}
         * @see localStorage
         * @function
         */
        if (hasGM.getValue === false) {
            GM_getValue = function(key, defaultValue) {
                var value = localStorage.getItem(key);
                if (!value) {
                    return defaultValue;
                }
                var type = value[0];
                value = value.substring(1);
                switch (type) {
                    case 'b':
                        return value == 'true';
                    case 'n':
                        return Number(value);
                    default:
                        return value;
                }
            };
        }
    
        /**
         * GM_deleteValue
         * @param {String} key storage key
         * @see localStorage
         * @function
         */
        if (hasGM.deleteValue === false) {
            GM_deleteValue = function(key) {
                localStorage.removeItem(key);
            };
        }
    
        /**
         * GM_listValues
         * @returns {Array}
         * @see localStorage
         * @function
         */
        if (hasGM.listValues === false) {
            GM_listValues = function() {
                var len = localStorage.length;
                var res = [];
                var key = '';
                for ( var i = 0; i < len; i++) {
                    key = localStorage.key(i);
                    res[key] = key;
                }
                return res;
            };
        }
    
        /**
         * GM_log
         * @param {Object} message any Object
         * @function
         * @see console
         */
        if (hasGM.log === false) {
            GM_log = function(message) {
                if (typeof console === 'object' && Object.prototype.hasOwnProperty.call(console, 'log')) {
                    console.log(message);
                }
                else if (typeof opera == 'object' && Object.prototype.hasOwnProperty.call(opera, 'postError')) {
                    opera.postError(message);
                }
                else {
                    window.alert(message);
                }
            };
        }
    
        /**
         * function GM_registerMenuCommand
         * @param {String} caption
         * @param {Function} commandFunc
         * @param {String} [accelKey]
         * @param {String} [accelModifiers]
         * @param {String} [accessKey]
         * @function
         */
        if (hasGM.registerMenuCommand === false) {
            GM_registerMenuCommand = function(caption, commandFunc, accelKey, accelModifiers, accessKey) {
                throw new Error('not supported');
            };
        }
    
        /**
         * GM_openInTab
         * @param {String} url uri strings
         * @function
         */
        if (hasGM.openInTab === false) {
            GM_openInTab = function(uri) {
                window.open(uri, '');
            };
        }
    
        /**
         * GM_xmlhttpRequest
         * @param requestParam Object request parameter settings
         * @param requestParam.url request url string
         * @param [requestParam.method="GET"] request method. default is GET
         * @param [requestParam.data] request data
         * @param [requestParam.headers] request headers object
         * @param [requestParam.onload] request complite event handler
         * @param [requestParam.onerror] request error event handler
         * @param [requestParam.onreadystatechange] request readystatechange event handler
         * @returns {XMLHttpRequest}
         */
        if (hasGM.xmlhttpRequest === false) {
            GM_xmlhttpRequest = function(requestParam) {
                var xhr;
                if (typeof XMLHttpRequest == 'function') {
                    xhr = XMLHttpRequest;
                }
                else {
                    return null;
                }
                var req = new xhr();
                [
                        'onload', 'onerror', 'onreadystatechange'
                ].forEach(function(event) {
                    if ((event in requestParam) == false) {
                        return;
                    }
                    req[event] = function() {
                        var isComplete = (req.readyState == 4);
                        var responseState = {
                            responseText : req.responseText,
                            readyState : req.readyState,
                            responseHeaders : isComplete ? req.getAllResponseHeaders() : '',
                            status : isComplete ? req.status : 0,
                            statusText : isComplete ? req.statusText : '',
                            finalUrl : isComplete ? requestParam.url : ''
                        };
                        requestParam[event](responseState);
                    };
                });
        
                try {
                    req.open(requestParam.method ? requestParam.method : 'GET', requestParam.url, true);
                }
                catch (e) {
                    if (requestParam.onerror) {
                        requestParam.onerror({
                            readyState : 4,
                            responseHeaders : '',
                            responseText : '',
                            status : 403,
                            statusText : 'Forbidden',
                            finalUrl : ''
                        });
                    }
                    return null;
                }
        
                if ('headers' in requestParam && typeof requestParam.headers == 'object') {
                    for ( var name in requestParam.headers) {
                        req.setRequestHeader(name, requestParam.headers[name]);
                    }
                }
        
                req.send(('data' in requestParam) ? requestParam.data : null);
                return req;
            };
        }
    
    }
    
    /**
     * initJSON
     * @description JSONがない場合とprototype.jsとJSONオブジェクトの衝突回避用(forOpera)
     * @returns {Object}
     */
    function initJSON() {
        var myJSON = function() {
            if (typeof JSON !== 'object' || typeof Prototype === 'object') {
                this.__proto__ = (function() {
                    // parser and stringify from json.js https://github.com/douglascrockford/JSON-js
                    
                    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        gap,
                        indent,
                        meta = {
                            '\b' : '\\b',
                            '\t' : '\\t',
                            '\n' : '\\n',
                            '\f' : '\\f',
                            '\r' : '\\r',
                            '"' : '\\"',
                            '\\' : '\\\\'
                        },
                        rep,result = {};
    
                    function quote(string) {
                        escapable.lastIndex = 0;
                        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                            var c = meta[a];
                            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        }) + '"' : '"' + string + '"';
                    }
                    
                    function str(key, holder) {
                        var i, k, v, length, mind = gap, partial, value = holder[key];
                        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                            value = value.toJSON(key);
                        }
                        if (typeof rep === 'function') {
                            value = rep.call(holder, key, value);
                        }
                        switch (typeof value) {
                            case 'string':
                                return quote(value);
                            case 'number':
                                return isFinite(value) ? String(value) : 'null';
                            case 'boolean':
                            case 'null':
                                return String(value);
                            case 'object':
                                if (!value) {
                                    return 'null';
                                }
                                gap += indent;
                                partial = [];
                                if (Object.prototype.toString.apply(value) === '[object Array]') {
                                    length = value.length;
                                    for (i = 0; i < length; i += 1) {
                                        partial[i] = str(i, value) || 'null';
                                    }
                                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                                    gap = mind;
                                    return v;
                                }
                                if (rep && typeof rep === 'object') {
                                    length = rep.length;
                                    for (i = 0; i < length; i += 1) {
                                        if (typeof rep[i] === 'string') {
                                            k = rep[i];
                                            v = str(k, value);
                                            if (v) {
                                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (k in value) {
                                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                                            v = str(k, value);
                                            if (v) {
                                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                            }
                                        }
                                    }
                                }
                                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                                gap = mind;
                                return v;
                        }
                    }
                    result.stringify = function(value, replacer, space) {
                        var i;
                        gap = '';
                        indent = '';
                        if (typeof space === 'number') {
                            for (i = 0; i < space; i += 1) {
                                indent += ' ';
                            }
                        }
                        else if (typeof space === 'string') {
                            indent = space;
                        }
                        rep = replacer;
                        if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                            throw new Error('JSON.stringify');
                        }
                        return str('', { '' : value });
                    };
                    
                    result.parse = (function() {
                        var at, ch, escapee = {
                                '"' : '"',
                                '\\' : '\\',
                                '/' : '/',
                                b : 'b',
                                f : '\f',
                                n : '\n',
                                r : '\r',
                                t : '\t'
                            }, text, error = function(m) {
                                throw {
                                    name : 'SyntaxError',
                                    message : m,
                                    at : at,
                                    text : text
                                };
                            }, next = function(c) {
                                if (c && c !== ch) {
                                    error("Expected '" + c + "' instead of '" + ch + "'");
                                }
                                ch = text.charAt(at);
                                at += 1;
                                return ch;
                            }, number = function() {
                                var num, str = '';
                                if (ch === '-') {
                                    str = '-';
                                    next('-');
                                }
                                while (ch >= '0' && ch <= '9') {
                                    str += ch;
                                    next();
                                }
                                if (ch === '.') {
                                    str += '.';
                                    while (next() && ch >= '0' && ch <= '9') {
                                        str += ch;
                                    }
                                }
                                if (ch === 'e' || ch === 'E') {
                                    str += ch;
                                    next();
                                    if (ch === '-' || ch === '+') {
                                        str += ch;
                                        next();
                                    }
                                    while (ch >= '0' && ch <= '9') {
                                        str += ch;
                                        next();
                                    }
                                }
                                num = +str;
                                if (isNaN(num)) {
                                    error("Bad number");
                                }
                                else {
                                    return num;
                                }
                            }, string = function() {
                                var hex, i, str = '', uffff;
                                if (ch === '"') {
                                    while (next()) {
                                        if (ch === '"') {
                                            next();
                                            return str;
                                        }
                                        else if (ch === '\\') {
                                            next();
                                            if (ch === 'u') {
                                                uffff = 0;
                                                for (i = 0; i < 4; i += 1) {
                                                    hex = parseInt(next(), 16);
                                                    if (!isFinite(hex)) {
                                                        break;
                                                    }
                                                    uffff = uffff * 16 + hex;
                                                }
                                                str += String.fromCharCode(uffff);
                                            }
                                            else if (typeof escapee[ch] === 'string') {
                                                str += escapee[ch];
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                        else {
                                            str += ch;
                                        }
                                    }
                                }
                                error("Bad string");
                            }, white = function() {
                                while (ch && ch <= ' ') {
                                    next();
                                }
                            }, word = function() {
                                switch (ch) {
                                    case 't':
                                        next('t');
                                        next('r');
                                        next('u');
                                        next('e');
                                        return true;
                                    case 'f':
                                        next('f');
                                        next('a');
                                        next('l');
                                        next('s');
                                        next('e');
                                        return false;
                                    case 'n':
                                        next('n');
                                        next('u');
                                        next('l');
                                        next('l');
                                        return null;
                                }
                                error("Unexpected '" + ch + "'");
                            }, value, array = function() {
                                var ary = [];
                                if (ch === '[') {
                                    next('[');
                                    white();
                                    if (ch === ']') {
                                        next(']');
                                        return ary;
                                    }
                                    while (ch) {
                                        ary.push(value());
                                        white();
                                        if (ch === ']') {
                                            next(']');
                                            return ary;
                                        }
                                        next(',');
                                        white();
                                    }
                                }
                                error("Bad array");
                            }, object = function() {
                                var key, obj = {};
                                if (ch === '{') {
                                    next('{');
                                    white();
                                    if (ch === '}') {
                                        next('}');
                                        return obj;
                                    }
                                    while (ch) {
                                        key = string();
                                        white();
                                        next(':');
                                        obj[key] = value();
                                        white();
                                        if (ch === '}') {
                                            next('}');
                                            return obj;
                                        }
                                        next(',');
                                        white();
                                    }
                                }
                                error("Bad object");
                            };
                            value = function() {
                                white();
                                switch (ch) {
                                    case '{':
                                        return object();
                                    case '[':
                                        return array();
                                    case '"':
                                        return string();
                                    case '-':
                                        return number();
                                    default:
                                        return ch >= '0' && ch <= '9' ? number() : word();
                                }
                            };
                        return function(source, reviver) {
                            var res;
                            text = source;
                            at = 0;
                            ch = ' ';
                            res = value();
                            white();
                            if (ch) {
                                error("Syntax error");
                            }
                            
                            return typeof reviver === 'function' ? function (holder, key) {
                                var k, v, val = holder[key];
                                if (val && typeof val === 'object') {
                                    for (k in val) {
                                        if (Object.hasOwnProperty.call(val, k)) {
                                            v = arguments.callee(val, k);
                                            if (v !== undefined) {
                                                val[k] = v;
                                            }
                                            else {
                                                delete val[k];
                                            }
                                        }
                                    }
                                }
                                return reviver.call(holder, key, val);
                            }({ '' : res }, '') : res;
                        };
                    })();
                    return result;
                })();
            }
        };
        if (typeof JSON == 'object') {
            myJSON.prototype = JSON;
        }
        return new myJSON();
    }
    
    /**
     * initCrossBrowserSupport
     * @returns {Object}
     */
    function initCrossBrowserSupport() {
        var crossBrowserUtility = {'JSON':null};
        // 配列のindexOf対策 from MDC
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(elt /*, from*/) {
                var len = this.length;
    
                var from = Number(arguments[1]) || 0;
                from = (from < 0) ? Math.ceil(from) : Math.floor(from);
                if (from < 0) {
                    from += len;
                }
    
                for (; from < len; from++) {
                    if (from in this && this[from] === elt) {
                        return from;
                    }
                }
    
                return -1;
            };
        }
        // ArrayのforEach対策 from MDC
        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function(fun /*, thisp*/) {
                var len = this.length;
                if (typeof fun != 'function') {
                    throw new TypeError();
                }
    
                var thisp = arguments[1];
                for (var i = 0; i < len; i++) {
                    if (i in this) {
                        fun.call(thisp, this[i], i, this);
                    }
                }
            };
        }
    
        // JSONのサポート
        crossBrowserUtility.JSON = initJSON();
    
        // GM関数の初期化
        initGMFunctions();
    
        return crossBrowserUtility;
    }
})();
