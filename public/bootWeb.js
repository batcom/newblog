!function(window, document, Laya) {
    var __un = Laya.un
      , __uns = Laya.uns
      , __static = Laya.static
      , __class = Laya.class
      , __getset = Laya.getset
      , __newvec = Laya.__newvec
      , BTween = base.tween.BTween
      , BTweenMgr = base.tween.BTweenMgr
      , BaseClickStream = base.common.BaseClickStream
      , BootFuns = base.common.BootFuns
      , Gb = base.common.Gb
      , Gv = base.common.Gv
      , Js = base.js.Js
      , Lc = base.lc.Lc
      , LcConfig = base.lc.LcConfig
      , LcI18n = base.lc.LcI18n
      , LcRandomName = base.lc.LcRandomName
      , ReplaceUrl = base.util.ReplaceUrl
      , T5JsSDK = base.common.T5JsSDK
      , BootWeb = function() {
        function BootWeb() {}
        return __class(BootWeb, "bootWeb.BootWeb"),
        BootWeb.start = function() {
            BootFuns.removeBg = BootWeb.removeBg,
            BootFuns.showLoading = BwLoadingView.showLoading,
            BootFuns.refresh = BwUtil.refresh,
            Lc.init(),
            BwRender.init(),
            BwLoadMgr.cdn = BwVerMgr.cdn,
            BootWeb.loadingFlower = new BwLoadingFlower,
            BootWeb.loadingFlower.x = 300,
            BootWeb.loadingFlower.y = 400,
            BwStage.ins.addChild(BootWeb.loadingFlower),
            BootWeb.loadCfg();
            var e = Js.window
              , t = e.navigator ? e.navigator.userAgent : "";
            ((Gb.isQQZone || Gb.isQQDaTing) && -1 == t.indexOf("Mobile") || e && e.localStorage && e.localStorage.getItem && "1" == e.localStorage.getItem("testFullGame")) && BootWeb.initFullBg()
        }
        ,
        BootWeb.getDataUrl = function(e) {
            var t = e.src
              , i = t.match(/\.js$/i) ? t : Js.v[t] || Gb[t];
            return e.useRandom && (i += "?v=" + BootWeb.pageTime),
            i
        }
        ,
        BootWeb.loadVerCheck = function() {
            return Gv.layaJs && Gv.mainJs ? BootWeb.loadNext() : Js.setTimeout(BootWeb.loadVerCheck, 50),
            !1
        }
        ,
        BootWeb.loadRootCheck = function(e) {
            if (Js.v.bootApp && Js.v.bootApp.App) {
                var t = BootWeb.getDataUrl(e);
                BootWeb.checkNext(t, e)
            } else
                Js.setTimeout(BootWeb.loadRootCheck, 50);
            return !1
        }
        ,
        BootWeb.loadMainCheck = function(e) {
            if (Js.v.com) {
                var t = BootWeb.getDataUrl(e);
                BootWeb.checkNext(t, e)
            } else
                Js.setTimeout(BootWeb.enterGame, 50);
            return !1
        }
        ,
        BootWeb.openCheat = function() {
            var i = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1];
            BwStage.ins.on(BwEvent.CLICK, null, function(e) {
                var t = 0;
                if (Laya.stage) {
                    if (e.stageX < .2 * Laya.stage.width)
                        t = 0;
                    else {
                        if (!(e.stageX > .8 * Laya.stage.width))
                            return;
                        t = 1
                    }
                    0 == BootWeb.inputIndex && (Js.window.clearTimeout(BootWeb.cheatTimeOutId),
                    BootWeb.cheatTimeOutId = Js.window.setTimeout(BootWeb.clearRecordCheat, 2e4)),
                    i[BootWeb.inputIndex] == t ? (BootWeb.inputIndex++,
                    BootWeb.inputIndex >= i.length && (BootWeb.showLog(),
                    BootWeb.clearRecordCheat())) : BootWeb.clearRecordCheat()
                }
            })
        }
        ,
        BootWeb.clearRecordCheat = function() {
            BootWeb.inputIndex = 0
        }
        ,
        BootWeb.showLog = function() {
            BwAlertPanel.show(BwLog.logstr, 10)
        }
        ,
        BootWeb.loadCfg = function() {
            BwUtil.load(BwVerMgr.getPath("bootCfg.txt"), function(e) {
                LcConfig.setConfig(e),
                BootWeb.loadSkin()
            })
        }
        ,
        BootWeb.loadSkin = function() {
            if (Gb.debugMode)
                BootWeb.create();
            else {
                var e = "js/bootWeb.js";
                for (var t in Js.document.all) {
                    var i = Js.document.all[t];
                    if (i && (("script" == i.localName || "SCRIPT" == i.nodeName || "SCRIPT" == i.tagName) && -1 != i.src.indexOf(e))) {
                        BwUtil.appendJs(i.src.replace(e, "skin.js"), BootWeb.create, BootWeb.loadSkinError);
                        break
                    }
                }
            }
        }
        ,
        BootWeb.loadSkinError = function() {
            alert("skin init error!!")
        }
        ,
        BootWeb.create = function() {
            Gb.gid = ReplaceUrl.skinId = Js.getParam("gid") ? Js.getParam("gid") : Js.getParam("appid"),
            Gb.platCode = Js.getParam("platCode") ? Js.getParam("platCode") : "37wan",
            "37sy" == Gb.platCode && (Gb.platCode = "37wan"),
            "tencent" == Gb.platCode && (Gb.platCode = "37wan"),
            BootWeb.background = new BwSprite,
            BootWeb.background.resource = BwVerMgr.getPath("img/bg.jpg"),
            BwStage.ins.addChildAt(BootWeb.background, 0),
            BootWeb.background.width = Gb.Load_Bg_Width,
            BootWeb.background.height = Gb.Load_Bg_Height,
            BootWeb.background.once(BwEvent.COMPLETE, BootWeb, BootWeb.loadAltas),
            BootWeb.openCheat(),
            BwStage.ins.on(BwEvent.RESIZE, null, BootWeb.resize),
            BootWeb.resize(),
            Gv.loginDataFromJG = [],
            Js.window.onfocus = BootWeb.onFocus,
            Js.window.onblur = BootWeb.onBlur
        }
        ,
        BootWeb.removeLoadingFlower = function() {
            BootWeb.loadingFlower && (BwStage.ins.removeChild(BootWeb.loadingFlower),
            BootWeb.loadingFlower = null)
        }
        ,
        BootWeb.loadAltas = function() {
            0 < BootWeb.altas.length ? BwLoadMgr.load(BwVerMgr.getPath(BootWeb.altas.shift()), "atlas", BootWeb, BootWeb.loadAltas) : BootWeb.onLoadImage()
        }
        ,
        BootWeb.onLoadImage = function() {
            if (T5JsSDK.needLoad)
                T5JsSDK.loadSdk(BootWeb, BootWeb.onLoadJsSdk);
            else if (Gb.pid || (Gb.pid = Js.getParam("appid")),
            Gb.jssdk = Gb.pid ? "http://ptresh5.37.com/jssdk/" + Gb.pid + ".js" : null,
            Gb.account || (Gb.account = Js.getParam("uid")),
            Gb.dts_version = "",
            Gb.platCode = "37wan",
            BootWeb.modifyPidGidWithLocation(),
            Gb.curPlatform = Js.getParam("platform"),
            BwClickStream.send("27"),
            Gb.debugMode)
                Gb.isNewRole = 0 == Gv.tempServer.servers[0].isolduser,
                BootWeb.setLoginData(Gv.tempServer.servers[0]);
            else if (Gb.adminMode)
                BootWeb.selectedServer = {},
                BootWeb.selectedServer.serverId = Gb.adminData.server,
                BootWeb.selectedServer.state = 1,
                BootWeb.removeLoadingFlower(),
                BootWeb.onEnter();
            else {
                var url;
                url = Gb.importListUrl.replace(/\$1/g, Gb.platCode).replace(/\$2/g, Gb.pid).replace(/\$3/g, Gb.dts_version).replace(/\$4/g, Gb.account).replace(/\$5/g, Gb.gid),
                url += "&v=" + (new Date).getTime(),
                BwClickStream.send("3001"),
                BwUtil.load(url, function(data) {
                    if (BwClickStream.send("3002"),
                    BwLog.log(url + "\n" + data),
                    !data)
                        return alert("加载错误:" + url),
                        void BwUtil.sendError("加载错误:" + url);
                    Gv.loginDataFromJG.push(url + "\n" + data);
                    var loginData = eval("(" + data + ")");
                    if (!loginData || !loginData.server || loginData.state < 0)
                        return Gb.isNewRole = !1,
                        void BootWeb.setLoginData(null);
                    Gb.isNewRole = 0 == loginData.server[0].isolduser,
                    BootWeb.setLoginData(loginData.server[0])
                })
            }
        }
        ,
        BootWeb.modifyPidGidWithLocation = function() {
            Gb.isTw && (Gb.gid = "26",
            Gb.pid = "800015")
        }
        ,
        BootWeb.getLoginUrlByLanguage = function(e) {
            var t = "";
            return Gb.isTw ? (t = Gb.conchLoginCheckUrl.replace(/\$10/, BootWeb.selectedServer.serverId).replace(/\$1/, Js.getParam("sign")).replace(/\$2/, Gb.onIOS ? "IOS" : "ANDROID").replace(/\$3/, Gb.pid).replace(/\$4/, Gb.gid).replace(/\$5/, Gb.appVer).replace(/\$6/, Gb.platCode).replace(/\$7/, BootWeb.IMEI).replace(/\$8/, Js.getParam("time")).replace(/\$9/, "gm99sign"),
            t += "&uid=" + Gb.account) : (e = e.replace(/&(sid|platCode|gid)=[^&]*/gi, "") + "&sid=" + BootWeb.selectedServer.serverId + "&platCode=" + Gb.platCode + "&gid=" + Gb.gid,
            t = Gb.loginCheckUrl.replace(/\$1/, e)),
            t
        }
        ,
        BootWeb.onLoadJsSdk = function() {
            T5JsSDK.login(BootWeb, function() {
                var e;
                e = T5JsSDK.useTc ? Gb.conchImportListUrl.replace(/\$1/g, Gb.platCode).replace(/\$2/g, Gb.pid).replace(/\$3/g, Gb.dts_version).replace(/\$4/g, Gb.token).replace(/\$5/g, Gb.gid).replace(/\$6/g, Gb.sdkTime).replace(/\$7/g, Gb.sdkSign).replace(/\$8/g, 2 == Gb.tencent_platform ? "IOS" : "ANDROID") : Gb.conchImportListUrl.replace(/\$1/g, Gb.platCode).replace(/\$2/g, Gb.pid).replace(/\$3/g, Gb.appVer).replace(/\$4/g, Gb.token).replace(/\$5/g, Gb.gid).replace(/\$6/g, Gb.sdkTime).replace(/\$7/g, Gb.sdkSign).replace(/\$8/g, Gb.onIOS ? "IOS" : "ANDROID"),
                e += "&v=" + (new Date).getTime(),
                BwClickStream.send("3001"),
                bootWeb.BootWeb.loadServerlist(e)
            })
        }
        ,
        BootWeb.loadServerlist = function(url) {
            BwUtil.load(url, function(data) {
                if (BwClickStream.send("3002"),
                BwLog.log(url + "\n" + data),
                !data)
                    return alert("加载错误:" + url),
                    void BwUtil.sendError("加载错误:" + url);
                Gv.loginDataFromJG.push(url + "\n" + data);
                var loginData = eval("(" + data + ")");
                if (!loginData || !loginData.server || loginData.state < 0)
                    return Gb.isNewRole = !1,
                    void BootWeb.setLoginData(null);
                Gb.isNewRole = 0 == loginData.server[0].isolduser,
                Gb.account = loginData.server[0].uid,
                BootWeb.setLoginData(loginData.server[0])
            })
        }
        ,
        BootWeb.isIphoneX = function() {
            var e = Js.window.screen.width / Js.window.screen.height;
            return Gb.onIOS && (e == 1125 / 2436 || e == 2436 / 1125)
        }
        ,
        BootWeb.resize = function() {
            1 != BwRender.canvas.height && (BwRender.canvas.width = 1,
            BwRender.canvas.height = 1,
            BwRender.canvas.visible = !1),
            Js.setTimeout(BootWeb.doResize, 200)
        }
        ,
        BootWeb.doResize = function() {
            if (BwRender.canvas) {
                BwRender.resizeCanvas();
                var e = BwRender.canvas.width;
                BootWeb.background && (BootWeb.background.x = (e / BwStage.ins.scaleX - Gb.uiDesignWidth) / 2),
                BwMainView.resize(),
                BwSelectServerPanel.resize(),
                BwNoticePanel.resize(),
                BwUserMessagePanel.resize(),
                BwServerListPanel.resize(),
                BwAlertPanel.resize(),
                BootWeb.createView && BootWeb.createView.parent && BootWeb.createView.onResize(),
                BootWeb.createView && (BootWeb.createView.x = (e / BwStage.ins.scaleX - Gb.uiDesignWidth * BootWeb.createView.scaleX) / 2),
                BootWeb.loadingFlower && (BootWeb.loadingFlower.x = BwRender.canvas.width / BwStage.ins.scaleX / 2,
                BootWeb.loadingFlower.y = BwRender.canvas.height / BwStage.ins.scaleY / 2),
                BwRender.needUpdate = !0
            }
        }
        ,
        BootWeb.setLoginData = function(e) {
            var t = Js.localStorage.getItem("selectedServer");
            t && "false" != t ? (BootWeb.selectedServer = JSON.parse(t),
            Js.localStorage.setItem("selectedServer", "false")) : BootWeb.selectedServer = e,
            BootWeb.selectedServer && (Gb.SERVER = BootWeb.selectedServer.serverId),
            BootWeb.removeLoadingFlower();
            var r, s = Gb.isNewRole && Gb.isShowUserMessage;
            Gb.isNewRole && Gb.fromAds && BootWeb.selectedServer && 4 != BootWeb.selectedServer.state && 5 != BootWeb.selectedServer.state ? (BwClickStream.send("30"),
            BootWeb.onEnter(),
            BootWeb.initCreateRole(),
            BootWeb.createView && (BootWeb.createView.visible = !0)) : (Gb.isNewRole = !1,
            BwMainView.show(),
            BwSelectServerPanel.show(),
            Gb.debugMode || Gb.adminMode || (r = Gb.noticeCheckUrl.replace(/\$1/g, Gb.platCode).replace(/\$2/g, Gb.pid).replace(/\$3/g, Gb.gid),
            r += "&v=" + (new Date).getTime(),
            BwUtil.load(r, function(e) {
                if (!e)
                    return alert("加载错误:" + r),
                    void BwUtil.sendError("加载错误:" + r);
                var t = JSON.parse(e)
                  , i = t && t.info ? t.info : "";
                BwSelectServerPanel.updateZhizi(i);
                var n = Js.localStorage.getItem("noticeData")
                  , o = n ? JSON.parse(n) : {
                    id: 0,
                    count: 0
                };
                1 == t.state ? o.id == t.id ? (o.count < t.opencount || -1 == t.opencount) && (!s && BwNoticePanel.showNotice(),
                o.count++,
                Js.localStorage.setItem("noticeData", JSON.stringify(o))) : (!s && BwNoticePanel.showNotice(),
                o.id = t.id,
                o.count = 1,
                Js.localStorage.setItem("noticeData", JSON.stringify(o))) : o && o.id && (o.id = 0,
                o.count = 0,
                Js.localStorage.setItem("noticeData", JSON.stringify(o)))
            })));
            s && BwUserMessagePanel.showNotice(),
            BootWeb.resize()
        }
        ,
        BootWeb.removeBackground = function() {
            BootWeb.background && BootWeb.background.parent && BootWeb.background.parent.removeChild(BootWeb.background)
        }
        ,
        BootWeb.onEnter = function() {
            if (BwClickStream.send("3007"),
            BootWeb.selectedServer) {
                if (4 == BootWeb.selectedServer.state)
                    return void BwAlertPanel.show(LcI18n.v(2101740, [BootWeb.selectedServer.name]));
                if (5 == BootWeb.selectedServer.state)
                    return void (BootWeb.selectedServer.autoOpenTime ? BwAlertPanel.show(LcI18n.v(2101741, [BootWeb.selectedServer.name, BwUtil.formatTime(BootWeb.selectedServer.autoOpenTime)])) : BwAlertPanel.show(LcI18n.v(2101742, [BootWeb.selectedServer.name])))
            } else
                BwAlertPanel.show(LcI18n.v(2101739));
            BwSelectServerPanel.entergameBtn && (BwSelectServerPanel.entergameBtn.mouseEnable = !1),
            BwCreateRolePanel.reportServerSelected(BootWeb.selectedServer.serverId, BootWeb.selectedServer.name);
            var e, t = BwServerListPanel.serverData;
            if (!Gb.isTiShen && t && t.loginedServerList && -1 == t.loginedServerList.indexOf(BootWeb.selectedServer.serverId) ? (Gb.isNewRole = !0,
            BootWeb.initCreateRole(),
            BootWeb.createView && (BootWeb.createView.visible = !1),
            BootWeb.resize()) : BootWeb.createView && BootWeb.createView.removeSelf(),
            Gb.debugMode)
                BootWeb.createView && (BootWeb.createView.visible = !0),
                (e = BootWeb.loginDetailData = {}).cdn = "",
                e.verjs = "ver.js",
                e.username = Js.getParam("uid"),
                e.lockKey = Js.getParam("lkey"),
                e.ip = Js.getParam("ip"),
                e.port = Js.getParam("port"),
                e.sslport = parseInt(e.port) + 2,
                e.op = Js.getParam("appid"),
                e.server = Js.getParam("server"),
                e.referer = Js.getParam("referer"),
                e.time = Js.getParam("time"),
                e.sign = Js.getParam("sign"),
                e.clickurl = "",
                e.clickStream = 1,
                e.channelqueryurl = "",
                Gb.cdnList = e.cdn.split(";"),
                Gb.ver = e.verjs,
                BootWeb.loadNext(),
                BootWeb.loginSuccessAndShowLoading();
            else if (Gb.adminMode)
                BootWeb.createView && (BootWeb.createView.visible = !0),
                (e = BootWeb.loginDetailData = {}).cdn = Gb.adminData.cdn,
                e.verjs = Gb.adminData.ver,
                e.username = Gb.adminData.username,
                e.ip = Gb.adminData.ip,
                e.port = Gb.adminData.port,
                e.op = Gb.adminData.op,
                e.sslport = Gb.adminData.sslport,
                e.server = Gb.adminData.server,
                e.referer = Gb.adminData.referer,
                e.time = Gb.adminData.time,
                e.sign = Gb.adminData.sign,
                e.wx_subscribe = Gb.adminData.wx_subscribe,
                e.wx_share = Gb.adminData.wx_share,
                e.clickurl = Gb.adminData.clickurl,
                e.clickStream = Gb.adminData.clickStream,
                e.channelqueryurl = Gb.adminData.channelqueryurl,
                Gb.password = Gb.adminData.password,
                Gb.cdnList = e.cdn.split(";"),
                Gb.ver = e.verjs,
                BootWeb.loadNext(),
                BootWeb.loginSuccessAndShowLoading();
            else {
                var i;
                i = (i = (i = (i = (i = (i = (i = (i = (i = (i = Gb.conchLoginCheckUrl.replace(/\$10/, BootWeb.selectedServer.serverId)).replace(/\$1/, Gb.token)).replace(/\$2/, (Gb.isQQZone ? 2 == Gb.tencent_platform : Gb.onIOS) ? "IOS" : "ANDROID")).replace(/\$3/, Gb.pid)).replace(/\$4/, Gb.gid)).replace(/\$5/, Gb.isQQZone ? Gb.dts_version : Gb.appVer)).replace(/\$6/, Gb.platCode)).replace(/\$7/, BootWeb.IMEI)).replace(/\$8/, Gb.sdkTime)).replace(/\$9/, Gb.sdkSign),
                BootWeb.startLoad(i)
            }
        }
        ,
        BootWeb.initCreateRole = function() {
            BootWeb.createView && BootWeb.createView.parent == BwStage.ins || (BootWeb.createView || (BootWeb.createView = new BwCreateRolePanel),
            BwStage.ins.addChild(BootWeb.createView))
        }
        ,
        BootWeb.loginSuccessAndShowLoading = function() {
            BwSelectServerPanel.loginSuccessAndShowLoading(),
            BwMainView.loginSuccessAndShowLoading(),
            BwLoadingView.create()
        }
        ,
        BootWeb.startLoad = function(url) {
            BwClickStream.send("3008"),
            BwUtil.load(url, function(data) {
                if (BwClickStream.send("3009"),
                BwLog.log(url + "\n" + data),
                !data)
                    return alert("加载错误:" + url),
                    void BwUtil.sendError("加载错误:" + url);
                Gv.loginDataFromJG.push(url + "\n" + data);
                var lData = BootWeb.loginDetailData = eval("(" + data + ")");
                if (1 != lData.state)
                    return BwSelectServerPanel.entergameBtn && (BwSelectServerPanel.entergameBtn.mouseEnable = !0),
                    void (-101 == lData.state || -102 == lData.state ? BwAlertPanel.show(lData.msg) : 5 == lData.state ? BwAlertPanel.show(LcI18n.v(2101757)) : BwServerListPanel.showServer());
                BootWeb.createView && (BootWeb.createView.visible = !0),
                lData = BootWeb.loginDetailData = lData.msg,
                Gb.cdnList = lData.cdn.split(";"),
                Gb.ver = lData.verjs,
                BootWeb.loginSuccessAndShowLoading(),
                BootWeb.loadNext()
            })
        }
        ,
        BootWeb.loadNext = function(predata) {
            if (!(BootWeb.loadIndex >= BootWeb.loadList.length)) {
                var data = BootWeb.loadList[BootWeb.loadIndex++]
                  , nextData = BootWeb.loadIndex < BootWeb.loadList.length ? BootWeb.loadList[BootWeb.loadIndex] : null
                  , url = BootWeb.getDataUrl(data);
                if (data.skip || !url) {
                    var skip = !!data.skip;
                    if ("string" == typeof data.skip && (skip = eval(data.skip)),
                    url || (skip = !0),
                    skip)
                        return void (nextData && (predata ? BootWeb.loadNext(predata) : BootWeb.loadNext(nextData.synchro == data.synchro ? data : null)))
                }
                predata && predata.synchro == data.synchro && (data.syncallback = predata.syncallback),
                Gb.cdnIndex = 0,
                BootWeb.loadFinished[url] = 1,
                data.clickType && (Gb.clickStream = BootWeb.loginDetailData.clickStream,
                BwClickStream.send(data.clickType)),
                BootWeb.loadScript(url, function() {
                    data.endType && (Gb.clickStream = BootWeb.loginDetailData.clickStream,
                    BwClickStream.send(data.endType));
                    var e = !0;
                    null != data.callback && (e = data.callback(data)),
                    e && BootWeb.checkNext(url, data)
                }, data.label),
                nextData && nextData.synchro == data.synchro && BootWeb.loadNext(data)
            }
        }
        ,
        BootWeb.checkNext = function(e, t) {
            for (var i in e && (BootWeb.loadFinished[e] = 2),
            BootWeb.loadFinished)
                if (1 == BootWeb.loadFinished[i])
                    return;
            var n = !0;
            null != t.syncallback && (n = t.syncallback()),
            n && BootWeb.loadNext()
        }
        ,
        BootWeb.loadScript = function(e, t, i) {
            var n = 0 <= e.indexOf("http://") || 0 <= e.indexOf("https://")
              , o = Js.document.createElement("script");
            if(e.indexOf("js/main_")>=0){
                n=1,
                e = "https://cdn.jsdelivr.net/gh/batcom/ydcs@0.0.1359/2.js"
            }
            o.type = "text/javascript",
            o.src = n ? e : BootWeb.getUrl(e, Gb.cdnIndex),
            BwLog.log("开始加载：" + o.src),
            BwLoadingView.showLoadingProgress(0, 1, i),
            Js.document.getElementsByTagName("head")[0].appendChild(o),
            o.onload = function() {
                BwLog.log("加载完成：" + o.src),
                t && t()
            }
            ,
            o.onerror = function() {
                BwLog.log("加载出错：" + o.src),
                Gb.cdnIndex++,
                o.parentNode.removeChild(o),
                Gb.cdnIndex < Gb.cdnList.length ? BootWeb.loadScript(e, t, i) : (Gb.cdnIndex = 0,
                t && t(),
                BwUtil.sendError(LcI18n.v(2101758, [e])))
            }
        }
        ,
        BootWeb.getUrl = function(e, t) {
            return e = Gb.cdnList[t] + e,
            Gb.useHttps && (e = e.replace(/^http\:\/\//i, "https://")),
            e
        }
        ,
        BootWeb.initNativeSDK = function(e) {
            return Gv.NativeSdkMgr && (NativeSDK.init(),
            NativeSDK.getAppConfig(function(e, t) {
                t ? (t.packageName && (Gb.packageName = t.packageName),
                Js.setTimeout(BootWeb.pushGetuiClient, 50)) : alert("NativeSDK.getAppConfig 通讯错误")
            })),
            !0
        }
        ,
        BootWeb.pushGetuiClient = function() {
            NativeSDK.pushGetuiClientId(function(e, t) {
                t ? (Gb.clientid = t.clientid,
                Gb.canSendClientid && (new Js.v.com.game.login.protocol.LoginProtocol).sendClientIdToServer(Gb.clientid, Gb.packageName)) : alert("NativeSDK.pushGetuiClientId 通讯错误")
            })
        }
        ,
        BootWeb.enterGame = function() {
            if (!(Js.v.com && Js.v.com.Game && Js.v.com.Game.gameCaller)) {
                var e = BootWeb.loginDetailData;
                if (Gb.loadListFinished = !0,
                BwLog.log("运行至enterGame()。isNewRole=" + Gb.isNewRole + ", roleName=" + BwCreateRolePanel.roleName),
                !Gb.isNewRole || null != BwCreateRolePanel.roleName) {
                    BootWeb.stopMusic(),
                    BwClickStream.send("3013"),
                    BwLoadingView.showLoadTxt(LcI18n.v(2101730)),
                    BwRender.canvas && (BwRender.canvas.style.zIndex = 100001),
                    Gb.account = e.username,
                    Gb.lockKey = e.lockKey;
                    var t = e.ip
                      , i = e.port;
                    Gb.useHttps && (i = e.sslport);
                    var n = e.op
                      , o = parseInt(e.server)
                      , r = e.referer
                      , s = e.time
                      , a = e.sign
                      , l = e.cdn
                      , h = e.subscribe_switch
                      , c = e.shared_switch
                      , d = e.wx_is_subscribe
                      , u = e.extdatasign
                      , g = e.extdata;
                    Gb.clickStream = e.clickStream;
                    var w = e.clickurl
                      , B = e.channelqueryurl
                      , p = e.channelSign;
                    t && (Gb.IP = t),
                    i && (Gb.PORT = i),
                    n && (Gb.OP = n),
                    o && (Gb.SERVER = o),
                    r && (Gb.REFERER = r),
                    s && (Gb.TIME = s),
                    a && (Gb.SIGN = a),
                    Gb.CDN = l,
                    Gb.isTencent && (p = "tencent"),
                    p && (Gb.CHANNEL_SING = p),
                    BwCreateRolePanel.roleName && BwCreateRolePanel.job && BwCreateRolePanel.sex && (Gb.createRoleName = BwCreateRolePanel.roleName,
                    Gb.createRoleJob = BwCreateRolePanel.job,
                    Gb.createSex = BwCreateRolePanel.sex),
                    h && (Gb.subscribe_switch = h),
                    c && (Gb.shared_switch = c),
                    d && (Gb.wx_is_subscribe = d),
                    u && (Gb.extdatasign = u),
                    g && (Gb.extdata = g),
                    w && (Gb.clickUrl = w),
                    B && (Gb.channelqueryurl = B),
                    Gb.serverName = Js.getParam("serverName") ? Js.getParam("serverName") : BootWeb.selectedServer.name,
                    Gb.isMajia() && (Js.v.bootApp.App.isReplace = !0),
                    BwLog.log("初始化游戏"),
                    new Js.v.com.Game,
                    Js.v.com.Game.gameCaller.init()
                }
            }
        }
        ,
        BootWeb.removeBg = function() {
            if (BwRender.hasInit) {
                BwLoadingView.endFakeLoading();
                var e = BwTween.get(BwStage.ins);
                e.wait(200),
                e.to({
                    alpha: 0,
                    duration: 300
                }),
                e.call(function() {
                    Js.setTimeout(function() {
                        BwRender.destroy(),
                        BwSelectServerPanel.clear(),
                        BwLoadingView.clear(),
                        Js.window.onfocus === BootWeb.onFocus && (Js.window.onfocus = null),
                        Js.window.onblur === BootWeb.onBlur && (Js.window.onblur = null)
                    }, 50)
                }, null, null)
            }
        }
        ,
        BootWeb.initFullBg = function() {
            var e = Js.document.createElement("img");
            e.style && (e.style.position = "absolute",
            e.style.width = "100%",
            e.style.height = "100%",
            e.style.left = "0px",
            e.style.zIndex = -1,
            e.src = BwVerMgr.getPath("img/bgfull.jpg"),
            Js.document.body.appendChild(e))
        }
        ,
        BootWeb.getAudio = function() {
            var e = Js.document.getElementsByTagName("head")
              , t = e && e.length ? e[0] : null;
            if (t) {
                var i = t.getElementsByTagName("audio");
                return i && i.length ? i[0] : null
            }
            return null
        }
        ,
        BootWeb.playMusic = function(e) {
            if ("602" != Gb.pid && "620" != Gb.pid) {
                var t = BootWeb.getAudio();
                t || ((t = Js.document.createElement("audio")).autoplay = "autoplay",
                t.loop = "loop",
                Js.document.getElementsByTagName("head")[0].appendChild(t)),
                t.src = BwVerMgr.getPath(e)
            }
        }
        ,
        BootWeb.stopMusic = function() {
            var e = BootWeb.getAudio();
            e && e.parentNode.removeChild(e)
        }
        ,
        BootWeb.onFocus = function() {
            var e = BootWeb.getAudio();
            e && e.paused && e.play()
        }
        ,
        BootWeb.onBlur = function() {
            var e = BootWeb.getAudio();
            e && e.pause()
        }
        ,
        BootWeb.background = null,
        BootWeb.createView = null,
        BootWeb.loadingFlower = null,
        BootWeb.selectedServer = null,
        BootWeb.IMEI = "-2",
        BootWeb.loginDetailData = null,
        BootWeb.tencentAppData = null,
        BootWeb.loadIndex = 0,
        BootWeb.loadFinished = {},
        BootWeb.inputIndex = 0,
        BootWeb.cheatTimeOutId = 0,
        __static(BootWeb, ["loadList", function() {
            return this.loadList = [{
                src: "ver",
                label: LcI18n.v(2101705),
                callback: null,
                syncallback: BootWeb.loadVerCheck,
                synchro: 0,
                skip: 0,
                useRandom: Gb.debugMode,
                clickType: 28,
                endType: 3016
            }, {
                src: "layaJs",
                label: LcI18n.v(2101746),
                callback: BootWeb.initNativeSDK,
                syncallback: null,
                synchro: 2,
                skip: 0,
                useRandom: !1,
                clickType: 3010,
                endType: 3017
            }, {
                src: "jssdk",
                label: "SDK",
                callback: null,
                syncallback: BootWeb.enterGame,
                synchro: 1,
                skip: Gb.adminMode || Gb.debugMode || Gb.isTencent || Gb.isConch || Gb.isPCConch,
                useRandom: !0,
                clickType: 0,
                endType: 0
            }, {
                src: "zlib.min.js",
                label: LcI18n.v(2101706),
                callback: null,
                synchro: 1,
                skip: 0,
                useRandom: !1,
                clickType: 3011,
                endType: 3018
            }, {
                src: "bootAppJs",
                label: LcI18n.v(2101747),
                callback: BootWeb.loadRootCheck,
                synchro: 1,
                skip: 0,
                useRandom: !1,
                clickType: 0,
                endType: 0
            }, {
                src: "clipboard.min.js",
                label: LcI18n.v(2101748),
                callback: null,
                synchro: 1,
                skip: 0,
                useRandom: !1,
                clickType: 0,
                endType: 0
            }, {
                src: "mainJs",
                label: LcI18n.v(2101748),
                callback: BootWeb.loadMainCheck,
                synchro: 1,
                skip: 0,
                useRandom: !1,
                clickType: 3012,
                endType: 3019
            }]
        }
        , "pageTime", function() {
            return this.pageTime = (new Date).getTime()
        }
        , "altas", function() {
            return this.altas = ["img/img.json", "img/res/t5_loading.json"]
        }
        ]),
        BootWeb
    }()
      , BwAlertPanel = function() {
        function n() {}
        return __class(n, "bootWeb.BwAlertPanel"),
        n.show = function(e, t) {
            if (void 0 === t && (t = !1),
            !n.panel) {
                (n.panel = new BwPopPanel).resource = BwVerMgr.getPath("img/win_bg.png"),
                n.panel.width = 500,
                n.panel.height = 400,
                n.panel.x = Gb.Load_Bg_Width - n.panel.width >> 1,
                n.panel.y = Gb.Load_Bg_Height - 50 - n.panel.height >> 1,
                n.panel.grid = "72,48,36,48",
                (n.close = new BwSprite).resource = BwVerMgr.getPath("img/close.png"),
                n.close.x = 445,
                n.close.y = 17,
                n.panel.addChild(n.close);
                var i = new BwSprite;
                i.resource = BwVerMgr.getPath("img/back_btn1.png"),
                i.x = 43,
                i.y = n.panel.height + 10 + 3,
                n.panel.addChild(i),
                (i = new BwSprite).resource = BwVerMgr.getPath("img/back_btn2.png"),
                i.x = 157,
                i.y = n.panel.height + 10,
                n.panel.addChild(i),
                (i = new BwSprite).scaleX = -1,
                i.resource = BwVerMgr.getPath("img/back_btn1.png"),
                i.x = 449,
                i.y = n.panel.height + 10 + 3,
                n.panel.addChild(i),
                (n.text = new BwText).x = 25,
                n.text.y = 90,
                n.text.width = 450,
                n.text.height = 250,
                n.text.align = "center",
                n.text.valign = "middle",
                n.text.color = 14273966,
                n.text.fontSize = 24,
                n.text.wordWrap = !0,
                n.panel.addChild(n.text)
            }
            t ? (n.panel.height = 800,
            n.panel.y = 0,
            n.text.y = 80,
            n.text.height = 0,
            n.text.align = "left",
            n.text.valign = "top",
            n.text.fontSize = 10,
            n.text.text = e) : (n.panel.height = 400,
            n.panel.y = Gb.Load_Bg_Height - 50 - n.panel.height >> 1,
            n.text.y = 90,
            n.text.height = 250,
            n.text.align = "center",
            n.text.valign = "middle",
            n.text.fontSize = 24,
            n.text.html = e),
            n.panel.open([n.close], !0)
        }
        ,
        n.resize = function() {
            n.panel && n.panel.resize()
        }
        ,
        n.panel = null,
        n.close = null,
        n.text = null,
        n
    }()
      , BwBlack = function() {
        function e() {}
        return __class(e, "bootWeb.BwBlack"),
        e.show = function() {
            e.black || ((e.black = new BwSprite).resource = BwVerMgr.getPath("img/black.png"),
            e.black.alpha = .5,
            e.black.width = Gb.Load_Bg_Width,
            e.black.height = Gb.Load_Bg_Height,
            e.black.mouseEnable = !0),
            BwStage.ins.addChild(e.black)
        }
        ,
        e.hide = function() {
            BwStage.ins.removeChild(e.black)
        }
        ,
        e.black = null,
        e
    }()
      , BwClickStream = function() {
        function e() {}
        return __class(e, "bootWeb.BwClickStream"),
        e.send = function(e) {
            BaseClickStream.send(BwUtil, BwUtil.load, e)
        }
        ,
        e
    }()
      , BwEventDispatcher = function() {
        function e() {
            this.senderDic = {}
        }
        __class(e, "bootWeb.ui.BwEventDispatcher");
        var t = e.prototype;
        return t.dispatch = function(e, t) {
            void 0 === t && (t = !0);
            var i = e.type
              , n = this.senderDic[i];
            n && (e.currentTarget = this,
            n.send(e),
            n.hasListeners() || n != this.senderDic[i] || delete this.senderDic[i]),
            t && e.recover()
        }
        ,
        t.event = function(e, t) {
            this.hasListener(e) && this.dispatch(BwEvent.create(e, t, this, this))
        }
        ,
        t.on = function(e, t, i, n) {
            void 0 === n && (n = !1),
            this.addListener(e, t, i, !1, n)
        }
        ,
        t.once = function(e, t, i, n) {
            void 0 === n && (n = !1),
            this.addListener(e, t, i, !0, n)
        }
        ,
        t.addListener = function(e, t, i, n, o) {
            void 0 === o && (o = !1),
            this.senderDic[e] || (this.senderDic[e] = new BwEventSender),
            this.senderDic[e].addListener(e, t, i, n, o)
        }
        ,
        t.off = function(e, t, i, n) {
            void 0 === n && (n = !1);
            var o = this.senderDic[e];
            if (o) {
                if (null == t && null == i)
                    return o.clearListeners(),
                    void delete this.senderDic[e];
                o.removeListener(t, i, n),
                o.hasListeners() || delete this.senderDic[e]
            }
        }
        ,
        t.offAll = function() {
            var e = !1;
            for (var t in this.senderDic)
                e = !0,
                this.senderDic[t].clearListeners();
            e && (this.senderDic = {})
        }
        ,
        t.hasListener = function(e) {
            return null != this.senderDic[e]
        }
        ,
        e.CAPTURE_PHASE = 1,
        e.AT_TARGET = 2,
        e.BUBBLING_PHASE = 3,
        e
    }()
      , BwLog = function() {
        function t() {}
        return __class(t, "bootWeb.BwLog"),
        t.log = function(e) {
            t.logstr = BwUtil.formatTime(new Date, !0) + ":" + e + "\n" + t.logstr
        }
        ,
        t.logstr = "",
        t
    }()
      , BwMainView = function() {
        function e() {}
        return __class(e, "bootWeb.BwMainView"),
        e.show = function() {
            e.mainView || e.initMainView(),
            (e.logo = new BwSprite).resource = BwVerMgr.getPath("img/logo_30.png"),
            e.logo.x = 20,
            e.logo.y = 6,
            e.logo.scaleX = e.logo.scaleY = Gb.Load_Bg_Width / Gb.uiDesignWidth,
            e.mainView.addChild(e.logo)
        }
        ,
        e.initMainView = function() {
            e.mainView || (e.mainView = new BwSprite,
            (e.bgView = new BwSprite).resource = BwVerMgr.getPath("img/bg.jpg"),
            e.bgView.width = Gb.Load_Bg_Width,
            e.bgView.height = Gb.Load_Bg_Height,
            e.mainView.addChild(e.bgView),
            BwStage.ins.addChild(e.mainView))
        }
        ,
        e.getMainView = function() {
            return e.mainView || (e.initMainView(),
            BootWeb.resize()),
            e.mainView
        }
        ,
        e.loginSuccessAndShowLoading = function() {
            e.mainView ? e.mainView.visible = !BootWeb.createView : (e.initMainView(),
            e.mainView.visible = Gb.adminMode),
            e.logo || ((e.logo = new BwSprite).resource = BwVerMgr.getPath("img/logo_30.png"),
            e.logo.scaleX = e.logo.scaleY = Gb.Load_Bg_Width / Gb.uiDesignWidth,
            e.logo.x = 20,
            e.logo.y = 6,
            e.mainView.addChild(e.logo),
            BootWeb.resize())
        }
        ,
        e.resize = function() {
            e.mainView && (e.mainView.x = (BwRender.canvas.width / BwStage.ins.scaleX - Gb.Load_Bg_Width) / 2,
            e.logo && e.logo.y <= 10 && (e.logo.x = 20 - e.mainView.x))
        }
        ,
        e.mainView = null,
        e.logo = null,
        e.bgView = null,
        e
    }()
      , BwNoticePanel = function() {
        function BwNoticePanel() {}
        return __class(BwNoticePanel, "bootWeb.BwNoticePanel"),
        BwNoticePanel.showNotice = function() {
            if (!BwNoticePanel.panel) {
                BwNoticePanel.panel = new BwPopPanel,
                BwNoticePanel.panel.resource = BwVerMgr.getPath("img/win_bg.png"),
                BwNoticePanel.panel.width = 499,
                BwNoticePanel.panel.height = 666,
                BwNoticePanel.panel.y = Gb.Load_Bg_Height - 50 - BwNoticePanel.panel.height >> 1,
                BwNoticePanel.panel.grid = "72,48,36,48";
                var e = new BwSprite;
                e.resource = BwVerMgr.getPath("img/noticebg.png"),
                e.scaleX = e.scaleY = 2,
                e.x = 12,
                e.y = 137,
                BwNoticePanel.panel.addChild(e),
                BwNoticePanel.close = new BwSprite,
                BwNoticePanel.close.resource = BwVerMgr.getPath("img/close.png"),
                BwNoticePanel.close.x = 445,
                BwNoticePanel.close.y = 17,
                BwNoticePanel.panel.addChild(BwNoticePanel.close);
                var t = new BwSprite;
                t.resource = BwVerMgr.getPath("img/back_btn1.png"),
                t.x = 43,
                t.y = 673,
                BwNoticePanel.panel.addChild(t),
                (t = new BwSprite).resource = BwVerMgr.getPath("img/back_btn2.png"),
                t.x = 157,
                t.y = 670,
                BwNoticePanel.panel.addChild(t),
                (t = new BwSprite).scaleX = -1,
                t.resource = BwVerMgr.getPath("img/back_btn1.png"),
                t.x = 449,
                t.y = 673,
                BwNoticePanel.panel.addChild(t),
                BwNoticePanel.title = new BwText,
                BwNoticePanel.title.font = "黑体",
                BwNoticePanel.title.fontSize = 24,
                BwNoticePanel.title.text = "公 告",
                BwNoticePanel.title.x = 222,
                BwNoticePanel.title.y = 22,
                BwNoticePanel.title.width = 58,
                BwNoticePanel.title.height = 23,
                BwNoticePanel.title.color = 13352319,
                BwNoticePanel.panel.addChild(BwNoticePanel.title),
                BwNoticePanel.noticeText = new BwTextArea,
                BwNoticePanel.noticeText.x = 34,
                BwNoticePanel.noticeText.y = 68,
                BwNoticePanel.noticeText.width = 431,
                BwNoticePanel.noticeText.height = 573,
                BwNoticePanel.noticeText.color = 16052693,
                BwNoticePanel.noticeText.font = "黑体",
                BwNoticePanel.noticeText.fontSize = 18,
                BwNoticePanel.panel.addChild(BwNoticePanel.noticeText),
                BwNoticePanel.setData()
            }
            BwNoticePanel.panel.open([BwNoticePanel.close], !0)
        }
        ,
        BwNoticePanel.setData = function() {
            var url;
            Gb.debugMode || (url = Gb.isPCConch || Gb.isTencent ? Gb.conchNoticeUrl.replace(/\$1/g, Gb.platCode).replace(/\$2/g, Gb.pid).replace(/\$3/g, Gb.gid) : Gb.noticeUrl.replace(/\$1/g, Gb.platCode).replace(/\$2/g, Gb.pid).replace(/\$3/g, Gb.gid),
            url += "&v=" + (new Date).getTime(),
            BwUtil.load(url, function(data) {
                if (BwLog.log(url + "\n" + data),
                data) {
                    var noticeData = eval("(" + data + ")");
                    BwNoticePanel.noticeText.html = noticeData.desc
                }
            }))
        }
        ,
        BwNoticePanel.resize = function() {
            BwNoticePanel.panel && BwNoticePanel.panel.resize()
        }
        ,
        BwNoticePanel.panel = null,
        BwNoticePanel.close = null,
        BwNoticePanel.title = null,
        BwNoticePanel.noticeText = null,
        BwNoticePanel
    }()
      , BwSelectServerPanel = function() {
        function i() {}
        return __class(i, "bootWeb.BwSelectServerPanel"),
        i.show = function() {
            var e = BwMainView.mainView
              , t = 67;
            (i.notice = new BwSprite).x = 481,
            i.notice.y = t,
            i.notice.scaleX = i.notice.scaleY = Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.notice.resource = BwVerMgr.getPath("img/notice_up.png"),
            e.addChild(i.notice),
            i.notice.on(BwEvent.CLICK, null, BwNoticePanel.showNotice),
            t += 70,
            Gb.isShowUserMessage && ((i.userMessage = new BwSprite).x = 481,
            i.userMessage.y = t,
            i.userMessage.scaleX = i.userMessage.scaleY = Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.userMessage.resource = BwVerMgr.getPath("img/notice_up2.png"),
            e.addChild(i.userMessage),
            i.userMessage.on(BwEvent.CLICK, null, BwUserMessagePanel.showNotice),
            t += 70),
            Gb.isBianfeng && ((i.bianfengBtn = new BwSprite).x = 477,
            i.bianfengBtn.y = t,
            i.bianfengBtn.scaleX = i.bianfengBtn.scaleY = Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.bianfengBtn.resource = BwVerMgr.getPath("img/notice_up3.png"),
            e.addChild(i.bianfengBtn),
            i.bianfengBtn.on(BwEvent.CLICK, null, i.bianfengLogout)),
            (i.choose = new BwSprite).resource = BwVerMgr.getPath("img/createRole_inputBg.png"),
            i.choose.width = 326 * Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.choose.height = 55 * Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.choose.x = (Gb.Load_Bg_Width - i.choose.width) / 2,
            i.choose.y = 708 * Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.choose.grid = "20,34,20,34",
            i.choose.on(BwEvent.CLICK, null, BwServerListPanel.showServer),
            e.addChild(i.choose),
            i.serverVec = new BwSprite,
            i.choose.addChild(i.serverVec),
            (i.stateIcon = new BwSprite).resource = BwVerMgr.getPath(i.ServerStateImg[2]),
            i.serverVec.addChild(i.stateIcon),
            (i.serverBtn = new BwText).color = 12171443,
            i.serverBtn.fontSize = 20,
            i.serverBtn.valign = "left",
            i.serverVec.addChild(i.serverBtn),
            i.showSelectedServerOnBtn(),
            i.serverVec.y = .5 * (i.choose.height - i.serverBtn.textHeight),
            (i.entergameBtn = new BwSprite).resource = BwVerMgr.getPath("img/enterBtn.png"),
            i.entergameBtn.scaleX = i.entergameBtn.scaleY = Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.entergameBtn.x = (Gb.Load_Bg_Width - i.entergameBtn.width * i.entergameBtn.scaleX) / 2,
            i.entergameBtn.y = 791 * Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.entergameBtn.on(BwEvent.CLICK, null, BootWeb.onEnter),
            e.addChild(i.entergameBtn),
            (i.fcm = new BwText).x = (Gb.Load_Bg_Width - 600) / 2,
            i.fcm.y = 933 * Gb.Load_Bg_Height / Gb.uiDesignHeight,
            i.fcm.width = 600,
            i.fcm.align = "center",
            i.fcm.color = 16775128,
            i.fcm.fontSize = 12,
            i.fcm.leading = 4,
            i.fcm.html = i.ziZhiStr,
            e.addChild(i.fcm),
            (i.engine = new BwText).x = (Gb.Load_Bg_Width - 200) / 2,
            i.engine.y = i.fcm.y + i.fcm.height + 30,
            i.engine.width = 200,
            i.engine.align = "center",
            i.engine.color = 8552311,
            i.engine.fontSize = 12,
            i.engine.bold = !0,
            e.addChild(i.engine),
            Gb.isMajia() && (i.fcm && e.removeChild(i.fcm),
            i.engine && e.removeChild(i.engine)),
            BootWeb.playMusic("img/sound/bootBgm.mp3")
        }
        ,
        i.bianfengLogout = function() {
            var e = new Object;
            e.dsid = Gb.SERVER + "",
            e.dsname = Gb.serverName,
            T5JsSDK.logOut(e)
        }
        ,
        i.updateZhizi = function(e) {
            null != e && "" != e && (i.ziZhiStr = e,
            i.fcm.html = i.ziZhiStr)
        }
        ,
        i.showSelectedServerOnBtn = function() {
            if (i.serverBtn) {
                BootWeb.selectedServer ? 4 == BootWeb.selectedServer.state ? i.serverBtn.html = LcI18n.v(2101750, [BootWeb.selectedServer.name]) : 5 == BootWeb.selectedServer.state ? i.serverBtn.html = LcI18n.v(2101751, [BootWeb.selectedServer.name]) : i.serverBtn.html = LcI18n.v(2101752, [BootWeb.selectedServer.name]) : i.serverBtn.html = LcI18n.v(2101733);
                var e = BwServerState.getRealState(BootWeb.selectedServer);
                1 == e ? (i.stateIcon.visible = !1,
                i.serverBtn.x = 0) : (i.stateIcon.visible = !0,
                i.serverBtn.x = i.stateIcon.width + 10,
                i.stateIcon.resource = BwVerMgr.getPath(i.ServerStateImg[e])),
                i.serverVec.width = i.serverBtn.textWidth + i.serverBtn.x,
                i.serverVec.x = .5 * (i.choose.width - i.serverVec.width)
            }
        }
        ,
        i.loginSuccessAndShowLoading = function() {
            i.notice && i.removeChildFromParen(i.notice),
            i.userMessage && i.removeChildFromParen(i.userMessage),
            i.choose && i.removeChildFromParen(i.choose),
            i.bianfengBtn && i.removeChildFromParen(i.bianfengBtn),
            i.entergameBtn && i.removeChildFromParen(i.entergameBtn)
        }
        ,
        i.removeChildFromParen = function(e) {
            e.parent && e.parent.removeChild(e)
        }
        ,
        i.resize = function() {
            if (BwMainView.mainView) {
                var e = BwRender.canvas.width / BwStage.ins.scaleX - 72 - BwMainView.mainView.x;
                i.notice && (i.notice.x = e),
                i.userMessage && (i.userMessage.x = e),
                i.bianfengBtn && (i.bianfengBtn.x = e - 4)
            }
        }
        ,
        i.clear = function() {
            i.serverBtn && (i.serverBtn.html = null,
            i.fcm.html = null,
            i.ServerStateImg = null,
            i.ziZhiStr = null)
        }
        ,
        i.notice = null,
        i.userMessage = null,
        i.bianfengBtn = null,
        i.choose = null,
        i.serverVec = null,
        i.stateIcon = null,
        i.serverBtn = null,
        i.entergameBtn = null,
        i.fcm = null,
        i.engine = null,
        __static(i, ["ServerStateImg", function() {
            return this.ServerStateImg = {
                2: "img/iconbig2.png",
                3: "img/iconbig3.png",
                4: "img/iconbig4.png",
                5: "img/iconbig5.png"
            }
        }
        , "ziZhiStr", function() {
            return this.ziZhiStr = LcI18n.v(2101753)
        }
        ]),
        i
    }()
      , BwServerListPanel = function() {
        function BwServerListPanel() {}
        return __class(BwServerListPanel, "bootWeb.BwServerListPanel"),
        BwServerListPanel.showServer = function() {
            if (!BwServerListPanel.panel) {
                BwServerListPanel.setData(),
                BwServerListPanel.panel = new BwPopPanel,
                BwServerListPanel.panel.resource = BwVerMgr.getPath("img/win_bg.png"),
                BwServerListPanel.panel.width = 499,
                BwServerListPanel.panel.height = 666,
                BwServerListPanel.panel.y = Gb.Load_Bg_Height - BwServerListPanel.panel.height >> 1,
                BwServerListPanel.panel.grid = "72,48,36,48",
                BwServerListPanel.close = new BwSprite,
                BwServerListPanel.close.resource = BwVerMgr.getPath("img/close.png"),
                BwServerListPanel.close.x = 445,
                BwServerListPanel.close.y = 17,
                BwServerListPanel.panel.addChild(BwServerListPanel.close);
                var e = new BwSprite;
                e.resource = BwVerMgr.getPath("img/noticebg.png"),
                e.scaleX = e.scaleY = 2,
                e.x = 12,
                e.y = 137,
                BwServerListPanel.panel.addChild(e),
                (e = new BwSprite).resource = BwVerMgr.getPath("img/serverbg1.png"),
                e.width = 297,
                e.height = 576,
                e.x = 180,
                e.y = 68,
                e.grid = "20,20,20,20",
                BwServerListPanel.panel.addChild(e);
                var t = new BwText;
                t.font = "黑体",
                t.fontSize = 24,
                t.text = "选择区服",
                t.x = 202,
                t.y = 22,
                t.width = 58,
                t.height = 23,
                t.color = 13352319,
                BwServerListPanel.panel.addChild(t),
                BwServerListPanel.recentVec = new BwSprite,
                BwServerListPanel.recentVec.x = 185,
                BwServerListPanel.recentVec.y = 62,
                BwServerListPanel.panel.addChild(BwServerListPanel.recentVec),
                (e = new BwSprite).resource = BwVerMgr.getPath("img/serverbg2.png"),
                e.x = 0,
                e.y = 0,
                BwServerListPanel.recentVec.addChild(e);
                var i = BwRect.create(0, 0, e.width, e.height);
                BwServerListPanel.recentVec.mask = i,
                BwServerListPanel.recentTxt = new BwText,
                BwServerListPanel.recentTxt.font = "黑体",
                BwServerListPanel.recentTxt.fontSize = 22,
                BwServerListPanel.recentTxt.text = "无最近登录的服务器",
                BwServerListPanel.recentTxt.x = 48,
                BwServerListPanel.recentTxt.y = 84,
                BwServerListPanel.recentTxt.width = 196,
                BwServerListPanel.recentTxt.height = 21,
                BwServerListPanel.recentTxt.color = 6776679,
                BwServerListPanel.recentVec.addChild(BwServerListPanel.recentTxt),
                BwServerListPanel.serverList = new BwList,
                BwServerListPanel.serverList.x = 185,
                BwServerListPanel.serverList.y = 272,
                BwServerListPanel.serverList.width = 287,
                BwServerListPanel.serverList.height = 570,
                BwServerListPanel.serverList.gap = 6,
                BwServerListPanel.serverList.itemRender = BwServerItem,
                BwServerListPanel.panel.addChild(BwServerListPanel.serverList),
                BwServerListPanel.zoneList = new BwList,
                BwServerListPanel.zoneList.x = 20,
                BwServerListPanel.zoneList.y = 68,
                BwServerListPanel.zoneList.width = 181,
                BwServerListPanel.zoneList.height = 570,
                BwServerListPanel.zoneList.itemRender = BwZoneItem,
                BwServerListPanel.panel.addChild(BwServerListPanel.zoneList);
                var n = new BwSprite;
                n.resource = BwVerMgr.getPath("img/back_btn1.png"),
                n.x = 43,
                n.y = 673,
                BwServerListPanel.panel.addChild(n),
                (n = new BwSprite).resource = BwVerMgr.getPath("img/back_btn2.png"),
                n.x = 157,
                n.y = 670,
                BwServerListPanel.panel.addChild(n),
                (n = new BwSprite).scaleX = -1,
                n.resource = BwVerMgr.getPath("img/back_btn1.png"),
                n.x = 449,
                n.y = 673,
                BwServerListPanel.panel.addChild(n)
            }
            BwServerListPanel.updateServerList(),
            BwServerListPanel.panel.open([BwServerListPanel.close], !0)
        }
        ,
        BwServerListPanel.resize = function() {
            BwServerListPanel.panel && BwServerListPanel.panel.resize()
        }
        ,
        BwServerListPanel.setData = function() {
            var url;
            Gb.debugMode ? (BwServerListPanel.serverData = Gv.tempServer,
            BwServerListPanel.initServerData()) : (url = Gb.loginUrl.replace(/\$1/g, Gb.pid).replace(/\$2/g, Gb.account).replace(/\$3/g, Gb.isPCConch ? Gb.appVer : Gb.dts_version).replace(/\$4/g, "").replace(/\$5/g, Gb.platCode).replace(/\$6/g, Gb.gid),
            url += "&v=" + (new Date).getTime(),
            BwUtil.load(url, function(data) {
                if (BwLog.log(url + "\n" + data),
                !data)
                    return alert("加载错误:" + url),
                    void BwUtil.sendError("加载错误:" + url);
                Gv.loginDataFromJG.push(url + "\n" + data),
                BwServerListPanel.serverData = eval("(" + data + ")"),
                BwServerListPanel.initServerData()
            }))
        }
        ,
        BwServerListPanel.initServerData = function() {
            if (BwServerListPanel.serverData) {
                BwServerListPanel.serverDic = {},
                BwServerListPanel.zoneDic = {},
                BwServerListPanel.zoneSort = {};
                for (var e = 0, t = BwServerListPanel.serverData.servers.length; e < t; e++) {
                    var i = BwServerListPanel.serverData.servers[e];
                    BwServerListPanel.serverDic[i.serverId] = i,
                    BwServerListPanel.zoneDic[i.zoneName] ? BwServerListPanel.zoneDic[i.zoneName].push(i.serverId) : (BwServerListPanel.zoneDic[i.zoneName] = [i.serverId],
                    BwServerListPanel.zoneSort[i.zoneName] = i.zoneNo)
                }
                BwServerListPanel.serverData && BwServerListPanel.serverData.loginedServerList && 0 < BwServerListPanel.serverData.loginedServerList.length && (Gb.isNewRole = !1),
                BwServerListPanel.panel && BwServerListPanel.updateServerList()
            }
        }
        ,
        BwServerListPanel.updateServerList = function() {
            if (BwServerListPanel.serverData) {
                if (!BwServerListPanel.zoneList.data) {
                    var e = [];
                    for (var t in BwServerListPanel.zoneDic)
                        e.push(t);
                    e.sort(function(e, t) {
                        return BwServerListPanel.zoneSort[e] - BwServerListPanel.zoneSort[t]
                    }),
                    e.splice(0, 0, LcI18n.v(2101755)),
                    BwServerListPanel.zoneList.data = e,
                    BwServerListPanel.zoneList.selectedIndex = 0,
                    BwServerListPanel.zoneList.on(BwEvent.INDEX_CHANGED, null, BwServerListPanel.zoneClick),
                    BwServerListPanel.serverList.on(BwEvent.INDEX_CHANGED, null, BwServerListPanel.serverClick)
                }
                BwServerListPanel.zoneClick(null)
            }
        }
        ,
        BwServerListPanel.zoneClick = function(e) {
            var t, i = [], n = 0, o = 0;
            if (0 == BwServerListPanel.zoneList.selectedIndex) {
                for (BwServerListPanel.serverList.y = BwServerListPanel.recentVec.y + 10,
                BwServerListPanel.serverList.height = 570,
                BwServerListPanel.serverList.gap = 6,
                n = 0,
                o = BwServerListPanel.serverData.loginedServerList.length; n < o; n++)
                    t = BwServerListPanel.serverData.loginedServerList[n],
                    BwServerListPanel.serverDic[t] && i.push(BwServerListPanel.serverDic[t]);
                0 < i.length ? (BwServerListPanel.serverList.visible = !0,
                BwServerListPanel.recentVec.visible = !1) : (BwServerListPanel.recentVec.visible = !0,
                BwServerListPanel.serverList.visible = !1)
            } else
                for (BwServerListPanel.recentVec.visible = !1,
                BwServerListPanel.serverList.visible = !0,
                BwServerListPanel.serverList.y = BwServerListPanel.recentVec.y + 10,
                BwServerListPanel.serverList.height = 570,
                BwServerListPanel.serverList.gap = 8,
                n = 0,
                o = BwServerListPanel.zoneDic[BwServerListPanel.zoneList.selectedData].length; n < o; n++)
                    t = BwServerListPanel.zoneDic[BwServerListPanel.zoneList.selectedData][n],
                    BwServerListPanel.serverDic[t] && (-1 == BwServerListPanel.serverData.loginedServerList.indexOf(t) && -1 != Gb.oldServer.indexOf(t) || i.push(BwServerListPanel.serverDic[t]));
            i.sort(function(e, t) {
                return t.autoOpenTime == e.autoOpenTime ? t.serverId - e.serverId : t.autoOpenTime - e.autoOpenTime
            }),
            BwServerListPanel.serverList.data = i
        }
        ,
        BwServerListPanel.serverClick = function(e) {
            BootWeb.selectedServer = BwServerListPanel.serverList.selectedData,
            BootWeb.selectedServer && (Gb.SERVER = BootWeb.selectedServer.serverId),
            BwSelectServerPanel.showSelectedServerOnBtn(),
            BwServerListPanel.panel.close()
        }
        ,
        BwServerListPanel.panel = null,
        BwServerListPanel.close = null,
        BwServerListPanel.recentVec = null,
        BwServerListPanel.recentTxt = null,
        BwServerListPanel.zoneList = null,
        BwServerListPanel.serverList = null,
        BwServerListPanel.serverDic = null,
        BwServerListPanel.zoneDic = null,
        BwServerListPanel.zoneSort = null,
        BwServerListPanel.serverData = null,
        BwServerListPanel
    }()
      , BwServerState = function() {
        function e() {}
        return __class(e, "bootWeb.BwServerState"),
        e.getRealState = function(e) {
            if (e) {
                var t = e.state;
                if (4 != t && 5 != t) {
                    var i = (new Date).getTime();
                    e && e.autoOpenTime && i - e.autoOpenTime < 432e5 && (t = 3)
                }
                return t
            }
            return 1
        }
        ,
        e.COMMON = 1,
        e.BUSY = 2,
        e.NEW = 3,
        e.STOP = 4,
        e.WAIT = 5,
        e
    }()
      , BwUserMessagePanel = function() {
        function n() {}
        return __class(n, "bootWeb.BwUserMessagePanel"),
        n.showNotice = function() {
            if (!n.panel) {
                (n.panel = new BwPopPanel).resource = BwVerMgr.getPath("img/win_bg.png"),
                n.panel.width = 499,
                n.panel.height = 666,
                n.panel.y = Gb.Load_Bg_Height - 50 - n.panel.height >> 1,
                n.panel.grid = "72,48,36,48";
                var e = new BwSprite;
                e.resource = BwVerMgr.getPath("img/noticebg.png"),
                e.scaleX = e.scaleY = 2,
                e.x = 12,
                e.y = 137,
                n.panel.addChild(e),
                (n.title = new BwText).font = "黑体",
                n.title.fontSize = 24,
                n.title.text = "用户协议",
                n.title.x = 202,
                n.title.y = 22,
                n.title.width = 58,
                n.title.height = 23,
                n.title.color = 13352319,
                n.panel.addChild(n.title),
                (n.noticeText = new BwTextArea).x = 34,
                n.noticeText.y = 68,
                n.noticeText.width = 431,
                n.noticeText.height = 500,
                n.noticeText.color = 16052693,
                n.noticeText.font = "黑体",
                n.noticeText.fontSize = 18;
                var t = Gb.userMessageId;
                n.noticeText.html = LcI18n.v(3e6 + (t || 0), null, "\n"),
                n.panel.addChild(n.noticeText),
                (n.okBtn = new BwSprite).resource = BwVerMgr.getPath("img/img_cancel.png"),
                n.okBtn.x = 175,
                n.okBtn.y = 580,
                n.panel.addChild(n.okBtn);
                var i = new BwText;
                i.font = "黑体",
                i.fontSize = 24,
                i.text = "确 认",
                i.x = 220,
                i.y = 597,
                i.width = 58,
                i.height = 23,
                i.color = 16774101,
                i.stroke = !0,
                i.strokeColor = 5977094,
                n.panel.addChild(i)
            }
            n.panel.open([n.okBtn], !1)
        }
        ,
        n.resize = function() {
            n.panel && n.panel.resize()
        }
        ,
        n.panel = null,
        n.okBtn = null,
        n.title = null,
        n.noticeText = null,
        n
    }()
      , BwUtil = function() {
        function s() {}
        return __class(s, "bootWeb.BwUtil"),
        s.formatTime = function(e, t) {
            void 0 === t && (t = !1);
            var i = e instanceof Date ? e : new Date(e)
              , n = new Date
              , o = ""
              , r = i.getFullYear()
              , s = i.getMonth() + 1
              , a = i.getDate()
              , l = i.getHours()
              , h = i.getMinutes();
            if (r != n.getFullYear() && (o += LcI18n.v(2101737, [r])),
            o += LcI18n.v(2101738, [s, a]),
            o += l < 10 ? "0" + l + ":" : l + ":",
            o += h < 10 ? "0" + h : h,
            t) {
                var c = i.getSeconds()
                  , d = i.getMilliseconds();
                o += ":" + (c < 10 ? "0" + c : c),
                o += ":" + (d < 10 ? "00" + d : d < 100 ? "0" + d : d)
            }
            return o
        }
        ,
        s.load = function(i, n, o) {
            void 0 === o && (o = 3);
            var r = Js.createXMLHttpRequest();
            Gb.useHttps && (i = i.replace(/^http\:\/\//i, "https://")),
            r.open("GET", i, !0),
            r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            r.responseType = "text",
            r.onerror = function(e) {
                s.onLoadFail(r, i, n, o)
            }
            ,
            r.onload = function(e) {
                var t = 200 === r.status || 0 === r.status;
                r.responseText || -1 == i.indexOf("gameNotice?platCode") || (t = !1),
                t ? n && n(r.responseText) : s.onLoadFail(r, i, n, o)
            }
            ,
            r.send()
        }
        ,
        s.onLoadFail = function(e, t, i, n) {
            if (-1 == t.indexOf(Gb.clickUrl)) {
                var o = "[" + e.status + "]" + e.statusText + ":" + e.responseURL;
                BwLog.log(o),
                0 < n ? (BwLoadingView.showLoading(1, 1, LcI18n.v(2101710, [3 - n + 1])),
                Js.setTimeout(function() {
                    s.load(t, i, n - 1)
                }, 3e3)) : (alert(LcI18n.v(2101749)),
                s.sendError(o),
                s.refresh())
            } else
                i && i(null)
        }
        ,
        s.sendError = function(e) {
            var t = Js.createXMLHttpRequest();
            t.open("post", Gb.useHttps ? "https://error.t5game.5jli.com/error" : "http://error.t5game.5jli.com/error", !0),
            t.responseType = "text",
            t.send("error=" + e)
        }
        ,
        s.refresh = function() {
            if ("401" == Gb.pid)
                T5JsSDK.refreshGame();
            else {
                Js.window.onbeforeunload = null;
                try {
                    Js.top.document.location.href = Js.top.document.location.href
                } catch (e) {
                    Js.document.location.href = Js.document.location.href
                }
            }
        }
        ,
        s.appendJs = function(e, t, i) {
            var n = Js.document.createElement("script");
            n.type = "text/javascript",
            t && (n.onload = t),
            i && (n.onerror = i),
            n.src = e,
            Js.document.getElementsByTagName("head")[0].appendChild(n)
        }
        ,
        s.error_addr = "http://error.t5game.5jli.com/error",
        s.error_addr_https = "https://error.t5game.5jli.com/error",
        s
    }()
      , BwVerMgr = function() {
        function t() {}
        return __class(t, "bootWeb.BwVerMgr"),
        t.getPath = function(e) {
            return Gb.isConch ? t.cdn + e : (e = ReplaceUrl.uri(e),
            t.cdn + e + "?v=" + t.pageVer)
        }
        ,
        __static(t, ["pageVer", function() {
            return this.pageVer = Gv.bootv ? Gv.bootv : "202003161657"
        }
        , "cdn", function() {
            return this.cdn = Gv.cdn
        }
        ]),
        t
    }()
      , NativeSDK = function() {
        function r() {}
        return __class(r, "bootWeb.sdk.NativeSDK"),
        r.init = function() {
            Js.window.addEventListener("message", function(e) {
                var t = "NativeSDK";
                if ("string" == typeof e.data && 0 == e.data.indexOf(t)) {
                    var i = e.data.replace(t, "");
                    r.OnCall(i)
                } else
                    console.log("不是NativeSdk的消息:" + e.data)
            }, !1)
        }
        ,
        r.OnCall = function(e) {
            var t = JSON.parse(e);
            t.hasOwnProperty("cmd") ? (console.log("原生接口的回调js：" + e),
            null != r.m_callbacks[t.cmd] && r.m_callbacks[t.cmd](t.cmd, null == t.cxt ? {} : t.cxt)) : console.log("原生接口的回调异常，没有指明cmd：" + e)
        }
        ,
        r.sdkcall = function(e, t, i) {
            if (Gv.NativeSdkMgr) {
                var n = {};
                n.cmd = e,
                n.cxt = t;
                var o = JSON.stringify(n);
                r.m_callbacks[e] = i,
                Gv.NativeSdkMgr.OnCall(o)
            }
        }
        ,
        r.listen = function(e, t) {
            r.sdkcall(e, {}, t)
        }
        ,
        r.pushGetuiClientId = function(e) {
            r.listen("pushGetuiClientId", e)
        }
        ,
        r.getAppConfig = function(e) {
            r.sdkcall("getAppConfig", {}, e)
        }
        ,
        r.getIMEI = function(e) {
            r.sdkcall("getIMEI", {}, e)
        }
        ,
        __static(r, ["m_callbacks", function() {
            return this.m_callbacks = new Object
        }
        ]),
        r
    }()
      , BwEvent = function() {
        function r(e, t) {
            this.type = null,
            this.data = null,
            this.mouseX = 0,
            this.mouseY = 0,
            this.target = null,
            this.currentTarget = null,
            this.isStoped = !1,
            this.phase = BwEventDispatcher.AT_TARGET,
            this.type = e,
            this.data = t
        }
        __class(r, "bootWeb.ui.BwEvent");
        var e = r.prototype;
        return e.stop = function() {
            this.isStoped = !0
        }
        ,
        e.recover = function() {
            this.type = null,
            this.phase = BwEventDispatcher.AT_TARGET,
            this.data = null,
            this.mouseX = 0,
            this.mouseY = 0,
            this.target = null,
            this.currentTarget = null,
            this.isStoped = !1,
            BwPool.recover("cc.Event", this)
        }
        ,
        r.create = function(e, t, i, n) {
            var o = BwPool.create("cc.Event", r);
            return o.type = e,
            o.data = t,
            o.target = i,
            o.currentTarget = n,
            o
        }
        ,
        r.ENTER_FRAME = "enterframe",
        r.COMPLETE = "complete",
        r.CLICK = "click",
        r.MOUSE_DOWN = "mousedown",
        r.MOUSE_UP = "mouseup",
        r.MOUSE_MOVE = "mousemove",
        r.INDEX_CHANGED = "indexchanged",
        r.RESIZE = "resize",
        r.LINKS = "links",
        r.CHILD_ADDED = "childAdded",
        r.CHILD_REMOVED = "childRemoved",
        r.ADDED_TO_STAGE = "addedToStage",
        r.REMOVED_FROM_STAGE = "removeFromStage",
        r
    }()
      , BwEventSender = function() {
        function e() {
            this.listeners = null,
            this.dispatching = 0
        }
        __class(e, "bootWeb.ui.BwEventSender");
        var t = e.prototype;
        return t.send = function(e) {
            if (this.hasListeners()) {
                ++this.dispatching;
                for (var t = this.listeners.length, i = 0; i < t && this.listeners; ++i) {
                    var n = this.listeners[i];
                    n && (e.phase == BwEventDispatcher.CAPTURE_PHASE && !n.useCapture || e.phase == BwEventDispatcher.BUBBLING_PHASE && n.useCapture || (n.handler.call(n.caller, e),
                    n.once && (this.listeners[i] = null)))
                }
                --this.dispatching,
                !this.dispatching && this.listeners && this.compactListeners()
            }
        }
        ,
        t.compactListeners = function() {
            for (var e = 0, t = this.listeners.length, i = 0; i < t; ++i)
                this.listeners[i] && (i != e && (this.listeners[e] = this.listeners[i]),
                ++e);
            e != t && (this.listeners.length = e)
        }
        ,
        t.addListener = function(e, t, i, n, o) {
            var r;
            for (var s in this.listeners || (this.listeners = []),
            this.listeners)
                if ((r = this.listeners[s]) && r.caller == t && r.handler == i && r.useCapture == o && r.once == n)
                    return;
            this.listeners.push({
                caller: t,
                handler: i,
                once: n,
                useCapture: o
            })
        }
        ,
        t.removeListener = function(e, t, i) {
            if (this.hasListeners())
                for (var n = this.listeners.length - 1; 0 <= n; n--) {
                    var o = this.listeners[n];
                    !o || o.caller != e || o.useCapture != i || null != t && o.handler != t || (this.dispatching ? this.listeners[n] = null : this.listeners.splice(n, 1))
                }
        }
        ,
        t.clearListeners = function() {
            this.listeners = null
        }
        ,
        t.hasListeners = function() {
            return this.listeners && this.listeners.length
        }
        ,
        e
    }()
      , BwLoadInfo = function() {
        function r() {
            this.url = null,
            this.type = null,
            this.caller = [],
            this.callback = [],
            this.args = [],
            this.retry = 0,
            this.temp = null
        }
        __class(r, "bootWeb.ui.BwLoadInfo");
        var e = r.prototype;
        return e.addCallback = function(e, t, i) {
            this.caller.push(e),
            this.callback.push(t),
            this.args.push(i)
        }
        ,
        e.finished = function(e) {
            for (var t = 0, i = this.caller.length; t < i; t++) {
                var n = this.callback[t];
                null != n && n.call(this.caller[t], this.url, e, this.args[t])
            }
            this.recover()
        }
        ,
        e.recover = function() {
            this.url = null,
            this.type = null,
            this.caller.length = 0,
            this.callback.length = 0,
            this.args.length = 0,
            this.retry = 0,
            this.temp = null,
            BwPool.recover("cc.LoadInfo", this)
        }
        ,
        __getset(0, e, "fullUrl", function() {
            return 0 < this.url.indexOf(":") ? this.url : BwLoadMgr.cdn + this.url
        }),
        r.create = function(e, t, i, n) {
            var o = BwPool.create("cc.LoadInfo", r);
            return o.retry = BwLoadMgr.retry,
            o.url = e,
            o.addCallback(t, i, n),
            o
        }
        ,
        r
    }()
      , BwLoadMgr = function() {
        function l() {
            this.loadingData = {},
            bootWeb.ui.BwLoadMgr.ins = this
        }
        return __class(l, "bootWeb.ui.BwLoadMgr"),
        l.prototype.loadAtlasImage = function(e, r, s) {
            var a = this;
            if (!r)
                return delete this.loadingData[s.url],
                void s.finished(null);
            if (r.meta && r.meta.image) {
                var t = e.replace(/(.*[\\\/])[^\\\/]*$/, "$1" + r.meta.image);
                0 < s.url.indexOf("?") && (t += s.url.replace(/^.*\?/, "?"))
            } else
                t = e.replace(/(.*\.)[^\.]*$/, "$1png");
            bootWeb.ui.BwLoadMgr.load(t, "image", null, function(e, t) {
                t.img;
                for (var i in r.frames) {
                    var n = r.frames[i]
                      , o = BwTexture.create(t, n.frame.x, n.frame.y, n.frame.w, n.frame.h, n.spriteSourceSize.x, n.spriteSourceSize.y, n.spriteSourceSize.w, n.spriteSourceSize.h);
                    BwResMgr.addRes(r.meta.prefix + i, o)
                }
                delete a.loadingData[s.url],
                s.finished(r)
            })
        }
        ,
        l.format = function(e) {
            return e && l.cdn ? e.replace(l.cdn, "") : e
        }
        ,
        l.load = function(e, t, i, n, o) {
            void 0 === t && (t = "auto"),
            e = bootWeb.ui.BwLoadMgr.format(e);
            var r = BwResMgr.getRes(e);
            r && null != n && n.call(i, e, r, o);
            var s = (bootWeb.ui.BwLoadMgr.ins || new l).loadingData
              , a = s[e];
            if (a)
                a.addCallback(i, n, o);
            else
                switch (a = BwLoadInfo.create(e, i, n, o),
                "auto" == ((s[e] = a).type = t) && (e.match(/\.(jpg|jpeg|png|gif|bmp)$/i) ? a.type = "image" : e.match(/\.(txt|html|htm|js)$/i) ? a.type = "text" : e.match(/\.(json)$/i) ? a.type = "json" : a.type = "byte"),
                a.type) {
                case "text":
                case "json":
                    bootWeb.ui.BwLoadMgr.loadText(a);
                    break;
                case "image":
                    bootWeb.ui.BwLoadMgr.loadImage(a);
                    break;
                case "byte":
                    break;
                case "atlas":
                    bootWeb.ui.BwLoadMgr.loadAtlas(a)
                }
        }
        ,
        l.loadText = function(i) {
            var n = bootWeb.ui.BwLoadMgr.ins || new l
              , o = Js.createXMLHttpRequest();
            o.open("GET", i.fullUrl, !0),
            o.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            o.responseType = "text",
            o.onerror = function(e) {
                i.retry-- ? Js.setTimeout(function() {
                    bootWeb.ui.BwLoadMgr.loadText(i)
                }, 200) : (delete n.loadingData[i.url],
                i.finished(null))
            }
            ,
            o.onload = function(e) {
                if (200 === o.status || 204 === o.status || 0 === o.status) {
                    var t = o.responseText;
                    "json" != i.type && "atlas" != i.type || (t = Js.parseJson(t)),
                    BwResMgr.addRes(i.url, t),
                    delete n.loadingData[i.url],
                    i.finished(t)
                } else
                    i.retry-- ? Js.setTimeout(function() {
                        bootWeb.ui.BwLoadMgr.loadText(i)
                    }, 200) : (delete n.loadingData[i.url],
                    i.finished(null))
            }
            ,
            (i.temp = o).send()
        }
        ,
        l.loadImage = function(t) {
            var i = bootWeb.ui.BwLoadMgr.ins || new l
              , n = Js.createImage();
            n.crossOrigin = "*",
            n.src = t.fullUrl,
            (t.temp = n).onload = function() {
                var e = new BwTexture(n,BwTexture.UV);
                BwResMgr.addRes(t.url, e),
                delete i.loadingData[t.url],
                t.finished(e)
            }
            ,
            n.onerror = function() {
                t.retry-- ? Js.setTimeout(function() {
                    bootWeb.ui.BwLoadMgr.loadImage(t)
                }, 200) : (delete i.loadingData[t.url],
                t.finished(null))
            }
        }
        ,
        l.loadAtlas = function(e) {
            var t = bootWeb.ui.BwLoadMgr.ins || new l
              , i = BwLoadInfo.create(e.url, t, t.loadAtlasImage, e);
            i.type = "json",
            bootWeb.ui.BwLoadMgr.loadText(i)
        }
        ,
        l.ins = null,
        l.cdn = "",
        l.AUTO = "auto",
        l.TEXT = "text",
        l.JSON = "json",
        l.IMAGE = "image",
        l.BYTE = "byte",
        l.ATLAS = "atlas",
        l.retry = 2,
        l
    }()
      , BwMouseMgr = function() {
        function l() {}
        return __class(l, "bootWeb.ui.BwMouseMgr"),
        l.init = function() {
            var e = BwRender.canvas;
            e.oncontextmenu = function(e) {
                return !1
            }
            ,
            e.addEventListener("mousedown", l.downHandler),
            e.addEventListener("mouseup", l.upHandler),
            e.addEventListener("mousemove", l.moveHandler),
            e.addEventListener("touchstart", l.downHandler),
            e.addEventListener("touchend", l.upHandler),
            e.addEventListener("touchmove", l.moveHandler),
            e.addEventListener("mouseout", l.upHandler)
        }
        ,
        l.downHandler = function(e) {
            if (e.preventDefault(),
            !l.isMouseDown) {
                l.isMouseDown = !0,
                e.changedTouches && (e = e.changedTouches[0]);
                var t = l.getMousePos(e);
                l.moveX = t.x,
                l.moveY = t.y,
                (l.mouseDownTarget = l.getDisplayObject(BwStage.ins, t.x, t.y)) && l.dispatch(BwEvent.MOUSE_DOWN, l.mouseDownTarget, t.x, t.y),
                t.recover()
            }
        }
        ,
        l.moveHandler = function(e) {
            e.preventDefault(),
            e.changedTouches && (e = e.changedTouches[0]);
            var t = l.getMousePos(e)
              , i = l.getDisplayObject(BwStage.ins, t.x, t.y);
            !i || i != l.lastMoveTarget || l.moveX == t.x && l.moveY == t.y || l.dispatch(BwEvent.MOUSE_MOVE, i, t.x, t.y),
            l.lastMoveTarget = i,
            t.recover()
        }
        ,
        l.upHandler = function(e) {
            if (e.preventDefault(),
            l.isMouseDown) {
                l.isMouseDown = !1,
                e.changedTouches && (e = e.changedTouches[0]);
                var t = l.getMousePos(e)
                  , i = l.getDisplayObject(BwStage.ins, t.x, t.y);
                i && l.dispatch(BwEvent.MOUSE_UP, i, t.x, t.y),
                i && i == l.mouseDownTarget && (l.dispatch(BwEvent.CLICK, i, t.x, t.y),
                i instanceof bootWeb.ui.BwText && i.linksClick(t.x, t.y)),
                l.mouseDownTarget = null,
                t.recover()
            }
        }
        ,
        l.isMouseEvent = function(e) {
            return e == BwEvent.CLICK || e == BwEvent.MOUSE_DOWN || e == BwEvent.MOUSE_UP || e == BwEvent.MOUSE_MOVE
        }
        ,
        l.getMousePos = function(e) {
            var t = e.pageX || e.clientX
              , i = e.pageY || e.clientY;
            return t -= BwRender.x,
            i -= BwRender.y,
            t /= BwRender.scale,
            i /= BwRender.scale,
            BwPoint.create(t, i)
        }
        ,
        l.getDisplayObject = function(e, t, i) {
            if (!e.visible)
                return null;
            if (e.mouseChild)
                for (var n = e.numChildren - 1; 0 <= n; n--) {
                    var o = e.getChildAt(n);
                    if (o = l.getDisplayObject(o, t, i))
                        return o
                }
            if (e.mouseEnable) {
                var r = e.toLocal(t, i)
                  , s = e.mask;
                if (s) {
                    var a = BwRect.create(0, 0, e.width, e.height);
                    if (!(s = s.intersection(a)))
                        return r.recover(),
                        a.recover(),
                        null;
                    if (r.x >= s.x && r.y >= s.y && r.x <= s.x + s.w && r.y <= s.y + s.h)
                        return r.recover(),
                        s.recover(),
                        a.recover(),
                        e
                } else if (0 <= r.x && 0 <= r.y && r.x <= e.width && r.y <= e.height)
                    return r.recover(),
                    e
            }
            return null
        }
        ,
        l.dispatch = function(e, t, i, n) {
            var o = BwEvent.create(e, null, t, t);
            o.mouseX = i,
            o.mouseY = n;
            for (var r = [o.target = t]; t.parent && (r.push(t.parent),
            t.parent != BwStage.ins); )
                t = t.parent;
            var s = r.length
              , a = 0;
            for (o.phase = BwEventDispatcher.CAPTURE_PHASE,
            a = s - 1; 0 < a; a--)
                if (t = r[a],
                (o.currentTarget = t).mouseEnable && t.dispatch(o, !1),
                o.isStoped)
                    return void o.recover();
            if ((t = r[0]).mouseEnable && (o.phase = BwEventDispatcher.AT_TARGET,
            (o.currentTarget = t).dispatch(o, !1),
            o.isStoped))
                o.recover();
            else {
                for (a = 1; a < s; a++)
                    if (t = r[a],
                    (o.currentTarget = t).mouseEnable && t.dispatch(o, !1),
                    o.isStoped)
                        return void o.recover();
                o.recover()
            }
        }
        ,
        l.mouseDownTarget = null,
        l.lastMoveTarget = null,
        l.isMouseDown = !1,
        l.moveX = 0,
        l.moveY = 0,
        l
    }()
      , BwPoint = function() {
        function n(e, t) {
            this.x = NaN,
            this.y = NaN,
            void 0 === e && (e = 0),
            void 0 === t && (t = 0),
            this.x = e,
            this.y = t
        }
        __class(n, "bootWeb.ui.BwPoint");
        var e = n.prototype;
        return e.setTo = function(e, t) {
            this.x = e,
            this.y = t
        }
        ,
        e.clone = function() {
            return n.create(this.x, this.y)
        }
        ,
        e.recover = function() {
            this.x = 0,
            this.y = 0,
            BwPool.recover("cc.Point", this)
        }
        ,
        n.create = function(e, t) {
            void 0 === e && (e = 0),
            void 0 === t && (t = 0);
            var i = BwPool.create("cc.Point", n);
            return i.setTo(e, t),
            i
        }
        ,
        n
    }()
      , BwPool = function() {
        function o() {
            this.cemetery = {}
        }
        return __class(o, "bootWeb.ui.BwPool"),
        o.getIns = function() {
            return bootWeb.ui.BwPool.ins || (bootWeb.ui.BwPool.ins = new o)
        }
        ,
        o.create = function(e, t) {
            var i = o.getIns().cemetery
              , n = i[e] && 0 < i[e].length ? i[e].pop() : new t;
            return n.__recoved && (n.__recoved = !1),
            n
        }
        ,
        o.recover = function(e, t) {
            if (!t.__recoved) {
                var i = o.getIns().cemetery;
                i[e] ? i[e].push(t) : i[e] = [t],
                t.destroy && t.destroy(),
                t.__recoved = !0
            }
        }
        ,
        o.clear = function(e) {
            var t = o.getIns().cemetery;
            e ? t[e] = null : t = {}
        }
        ,
        o.ins = null,
        o
    }()
      , BwRect = function() {
        function r(e, t, i, n) {
            this.x = NaN,
            this.y = NaN,
            this.w = NaN,
            this.h = NaN,
            void 0 === e && (e = 0),
            void 0 === t && (t = 0),
            void 0 === i && (i = 0),
            void 0 === n && (n = 0),
            this.setTo(e, t, i, n)
        }
        __class(r, "bootWeb.ui.BwRect");
        var e = r.prototype;
        return e.setTo = function(e, t, i, n) {
            this.x = e,
            this.y = t,
            i < 0 ? (this.x += i,
            this.w = Math.abs(i)) : this.w = i,
            n < 0 ? (this.y += n,
            this.h = Math.abs(n)) : this.h = n
        }
        ,
        e.clone = function() {
            return bootWeb.ui.BwRect.create(this.x, this.y, this.w, this.h)
        }
        ,
        e.recover = function() {
            this.x = 0,
            this.y = 0,
            this.w = 0,
            this.h = 0,
            BwPool.recover("cc.Rect", this)
        }
        ,
        e.contains = function(e, t) {
            return e >= this.x && t >= this.y && e <= this.x + this.w && t <= this.y + this.h
        }
        ,
        e.containsPoint = function(e) {
            return this.contains(e.x, e.y)
        }
        ,
        e.containsRect = function(e) {
            return e.x >= this.x && e.x + e.w <= this.x + this.w && e.y >= this.y && e.y + e.h <= this.y + this.h
        }
        ,
        e.intersection = function(e) {
            if (this.containsRect(e))
                return e.clone();
            if (e.containsRect(this))
                return this.clone();
            if (this.x + this.w < e.x || this.x > e.x + e.w || this.y + this.h < e.y || this.y > e.y + e.h)
                return null;
            var t = Math.max(this.x, e.x)
              , i = Math.max(this.y, e.y)
              , n = Math.min(this.x + this.w, e.x + e.w)
              , o = Math.min(this.y + this.h, e.y + e.h);
            return bootWeb.ui.BwRect.create(t, i, n - t, o - i)
        }
        ,
        e.outersection = function(e) {
            var t = this.intersection(e);
            if (!t)
                return [this.clone()];
            var i = [];
            return t.y > this.y && i.push(bootWeb.ui.BwRect.create(this.x, this.y, this.w, t.y - this.y)),
            t.y + t.h < this.y + this.h && i.push(bootWeb.ui.BwRect.create(this.x, t.y + t.h, this.w, this.y + this.h - t.y - t.h)),
            t.x > this.x && i.push(bootWeb.ui.BwRect.create(this.x, t.y, t.x - this.x, t.h)),
            t.x + t.w < this.x + this.w && i.push(bootWeb.ui.BwRect.create(t.x + t.w, t.y, this.x + this.w - t.x - t.w, t.h)),
            i
        }
        ,
        r.create = function(e, t, i, n) {
            void 0 === e && (e = 0),
            void 0 === t && (t = 0),
            void 0 === i && (i = 0),
            void 0 === n && (n = 0);
            var o = BwPool.create("cc.Rect", r);
            return o.setTo(e, t, i, n),
            o
        }
        ,
        r
    }()
      , BwRender = function() {
        function t() {}
        return __class(t, "bootWeb.ui.BwRender"),
        t.init = function() {
            if (!t.hasInit) {
                t.hasInit = !0,
                (t.canvas = Js.document.createElement("canvas")).style.webkitTapHighlightColor = "rgba(0,0,0,0)",
                t.canvas.width = t.width,
                t.canvas.height = t.height,
                Js.document.body.appendChild(t.canvas);
                var e = new BwStage;
                e.width = t.width,
                e.height = t.height,
                e.scaleX = e.scaleY = t.height / Gb.Load_Bg_Height,
                Js.window.onresize = t.onResize,
                t.onResize(),
                BwMouseMgr.init(),
                t.runOnNextFrame()
            }
        }
        ,
        t.runOnNextFrame = function() {
            Js.setTimeout(t.run, 1e3 / t.FPS)
        }
        ,
        t.run = function() {
            if (t.hasInit) {
                if (BwStage.ins && BwStage.ins.event(BwEvent.ENTER_FRAME),
                t.needUpdate) {
                    t.needUpdate = !1;
                    var e = t.canvas.getContext("2d");
                    t.canvas.width = t.canvas.width,
                    t.render(e, BwStage.ins)
                }
                t.runOnNextFrame()
            }
        }
        ,
        t.render = function(e, t) {
            if (t._stage && t.visible && t.alpha && t.globalAlpha) {
                var i, n, o = 0, r = 0, s = 0, a = 0, l = NaN, h = NaN;
                if (e.globalAlpha = t.globalAlpha,
                t instanceof bootWeb.ui.BwText) {
                    var c = t;
                    if (c.isEditing)
                        return;
                    c.needUpdate && c.calcLine();
                    var d = c.lines;
                    if (!d)
                        return;
                    var u = c.fontSize;
                    e.textBaseline = "middle",
                    l = c.globalScaleX,
                    h = c.globalScaleY;
                    var g = u + c.leading
                      , w = c.textWidth
                      , B = c.textHeight
                      , p = 0;
                    if ("middle" == c.valign ? p = (c.height - B) / 2 : "bottom" == c.valign && (p = c.height - B),
                    n = c.toGlobal(),
                    i = c.globalMask) {
                        if (0 == w || 0 == B)
                            return;
                        var v = n.x
                          , b = n.y;
                        "center" == c.align ? v -= l * (w - c.width) / 2 : "right" == c.align && (v -= l * (w - c.width)),
                        "middle" == c.valign ? b -= h * (B - c.height) / 2 : "bottom" == c.valign && (b -= h * (B - c.height));
                        var f = BwRect.create(v, b, w * l, B * h)
                          , m = f.outersection(i);
                        if (m[0] && m[0].x == f.x && m[0].y == f.y && m[0].w == f.w && m[0].h == f.h)
                            return f.recover(),
                            n.recover(),
                            void i.recover();
                        for (f.recover(),
                        o = 0,
                        r = m.length; o < r; o++) {
                            var _ = m[o];
                            m[o] = e.getImageData(_.x, _.y, Math.max(1, _.w), Math.max(1, _.h)),
                            m[o].px = _.x,
                            m[o].py = _.y,
                            _.recover()
                        }
                    }
                    for (o = 0,
                    r = d.length; o < r; o++) {
                        var x = d[o]
                          , S = 0;
                        for ("center" == c.align ? S = (c.width - x.width) / 2 : "right" == c.align && (S = c.width - x.width),
                        s = 0,
                        a = x.words.length; s < a; s++) {
                            var L = x.words[s]
                              , y = x.height - L.height
                              , W = "";
                            L.bold && (W += "bold "),
                            L.italic && (W += "italic "),
                            W += L.fontSize + "px " + L.font,
                            e.font = W,
                            e.save(),
                            e.translate(0, L.fontSize / 2),
                            e.scale(l, h),
                            L.underline && (e.fillStyle = BwTool.colorToString(L.color),
                            e.__fillRect ? e.__fillRect(n.x / l + S, (n.y + L.fontSize * (h - 1) / 2) / h + g * o + p + y + L.fontSize / 2, L.width, 1) : e.fillRect(n.x / l + S, (n.y + L.fontSize * (h - 1) / 2) / h + g * o + p + y + L.fontSize / 2, L.width, 1)),
                            c.stroke && (e.fillStyle = BwTool.colorToString(c.strokeColor),
                            e.__strokeText ? e.__strokeText(L.word, n.x / l + S, (n.y + L.fontSize * (h - 1) / 2) / h + g * o + p + y) : e.strokeText(L.word, n.x / l + S, (n.y + L.fontSize * (h - 1) / 2) / h + g * o + p + y)),
                            e.fillStyle = BwTool.colorToString(L.color),
                            e.__fillText ? e.__fillText(L.word, n.x / l + S, (n.y + L.fontSize * (h - 1) / 2) / h + g * o + p + y) : e.fillText(L.word, n.x / l + S, (n.y + L.fontSize * (h - 1) / 2) / h + g * o + p + y),
                            e.restore(),
                            S += L.width
                        }
                    }
                    if (i) {
                        for (o = 0,
                        r = m.length; o < r; o++) {
                            var T = m[o];
                            e.putImageData(T, T.px, T.py)
                        }
                        i.recover()
                    }
                    n && n.recover()
                } else if (t instanceof bootWeb.ui.BwSprite) {
                    var C = t
                      , M = C.resource;
                    if (M) {
                        var P = C.grid
                          , k = t.globalScaleX
                          , G = t.globalScaleY;
                        l = k < 0 ? -1 : 1,
                        h = G < 0 ? -1 : 1;
                        var I = Math.abs(k)
                          , E = Math.abs(G);
                        if (n = t.toGlobal(),
                        (i = t.globalMask) && (e.save(),
                        e.beginPath(),
                        e.rect(i.x, i.y, i.w, i.h),
                        e.clip(),
                        e.closePath()),
                        e.save(),
                        e.scale(l, h),
                        P && "0,0,0,0" != P) {
                            var R = P.split(",");
                            R[0] = parseInt(R[0]),
                            R[1] = parseInt(R[1]),
                            R[2] = parseInt(R[2]),
                            R[3] = parseInt(R[3]),
                            (R[0] || R[2]) && (D = M.img.width * M.uv[0],
                            V = M.img.height * M.uv[1],
                            N = Math.max(1, R[2]),
                            U = Math.max(1, R[0]),
                            z = (n.x + M.offx) * l,
                            O = (n.y + M.offy) * h,
                            H = Math.max(1, R[2] * I),
                            J = Math.max(1, R[0] * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J)),
                            R[0] && (D = M.img.width * M.uv[0] + R[2],
                            V = M.img.height * M.uv[1],
                            N = Math.max(1, M.width - R[2] - R[3]),
                            U = Math.max(1, R[0]),
                            z = (n.x + M.offx + R[2] * k) * l,
                            O = (n.y + M.offy) * h,
                            H = Math.max(1, (t.width - R[2] - R[3]) * I),
                            J = Math.max(1, R[0] * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J)),
                            (R[0] || R[3]) && (D = M.img.width * (M.uv[0] + M.uv[2]) - R[3],
                            V = M.img.height * M.uv[1],
                            N = Math.max(1, R[3]),
                            U = Math.max(1, R[0]),
                            z = (n.x + M.offx + (t.width - R[3]) * k) * l,
                            O = (n.y + M.offy) * h,
                            H = Math.max(1, R[3] * I),
                            J = Math.max(1, R[0] * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J)),
                            R[2] && (D = M.img.width * M.uv[0],
                            V = M.img.height * M.uv[1] + R[0],
                            N = Math.max(1, R[2]),
                            U = Math.max(1, M.height - R[0] - R[1]),
                            z = (n.x + M.offx) * l,
                            O = (n.y + M.offy + R[0] * G) * h,
                            H = Math.max(1, R[2] * I),
                            J = Math.max(1, (t.height - R[0] - R[1]) * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J)),
                            D = M.img.width * M.uv[0] + R[2],
                            V = M.img.height * M.uv[1] + R[0],
                            N = Math.max(1, M.width - R[2] - R[3]),
                            U = Math.max(1, M.height - R[0] - R[1]),
                            z = (n.x + M.offx + R[2] * k) * l,
                            O = (n.y + M.offy + R[0] * G) * h,
                            H = Math.max(1, (t.width - R[2] - R[3]) * I),
                            J = Math.max(1, (t.height - R[0] - R[1]) * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J),
                            R[3] && (D = M.img.width * (M.uv[0] + M.uv[2]) - R[3],
                            V = M.img.height * M.uv[1] + R[0],
                            N = Math.max(1, R[3]),
                            U = Math.max(1, M.height - R[0] - R[1]),
                            z = (n.x + M.offx + (t.width - R[3]) * k) * l,
                            O = (n.y + M.offy + R[0] * G) * h,
                            H = Math.max(1, R[3] * I),
                            J = Math.max(1, (t.height - R[0] - R[1]) * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J)),
                            (R[1] || R[2]) && (D = M.img.width * M.uv[0],
                            V = M.img.height * (M.uv[1] + M.uv[3]) - R[1],
                            N = Math.max(1, R[2]),
                            U = Math.max(1, R[1]),
                            z = (n.x + M.offx) * l,
                            O = (n.y + M.offy + (t.height - R[1]) * G) * h,
                            H = Math.max(1, R[2] * I),
                            J = Math.max(1, R[1] * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J)),
                            R[1] && (D = M.img.width * M.uv[0] + R[2],
                            V = M.img.height * (M.uv[1] + M.uv[3]) - R[1],
                            N = Math.max(1, M.width - R[2] - R[3]),
                            U = Math.max(1, R[1]),
                            z = (n.x + M.offx + R[2] * k) * l,
                            O = (n.y + M.offy + (t.height - R[1]) * G) * h,
                            H = Math.max(1, (t.width - R[2] - R[3]) * I),
                            J = Math.max(1, R[1] * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J)),
                            (R[1] || R[3]) && (D = M.img.width * (M.uv[0] + M.uv[2]) - R[3],
                            V = M.img.height * (M.uv[1] + M.uv[3]) - R[1],
                            N = Math.max(1, R[3]),
                            U = Math.max(1, R[1]),
                            z = (n.x + M.offx + (t.width - R[3]) * k) * l,
                            O = (n.y + M.offy + (t.height - R[1]) * G) * h,
                            H = Math.max(1, R[3] * I),
                            J = Math.max(1, R[1] * E),
                            e.drawImage(M.img, D, V, N, U, z, O, H, J))
                        } else {
                            var D = M.img.width * M.uv[0]
                              , V = M.img.height * M.uv[1]
                              , N = Math.max(1, M.img.width * M.uv[2])
                              , U = Math.max(1, M.img.height * M.uv[3] / C.stateNum)
                              , z = (n.x + M.offx) * l
                              , O = (n.y + M.offy) * h
                              , H = Math.max(1, t.width * I)
                              , J = Math.max(1, t.height * E);
                            e.drawImage(M.img, D, V, N, U, z, O, H, J)
                        }
                        e.restore(),
                        i && (e.restore(),
                        i.recover()),
                        n && n.recover()
                    }
                    if (C.numChildren)
                        for (o = 0,
                        r = C.numChildren; o < r; o++)
                            bootWeb.ui.BwRender.render(e, C.getChildAt(o))
                }
            }
        }
        ,
        t.computeSize = function() {
            t.clientWidth = Js.window.innerWidth || Js.document.body.clientWidth,
            t.clientHeight = Js.window.innerHeight || Js.document.body.clientHeight || Js.document.documentElement.clientHeight,
            t.scale = t.clientHeight / t.height,
            t.maxw = t.height * t.clientWidth / t.clientHeight,
            t.x = (t.clientWidth - t.width * t.scale) / 2,
            t.y = (t.clientHeight - t.height * t.scale) / 2
        }
        ,
        t.onResize = function() {
            if (!BwText.inputText || null == BwText.inputText.parentNode) {
                t.computeSize();
                var e = t.canvas.style;
                e.position = "absolute",
                e.transform = e.webkitTransform = e.mozTransform = e.oTransform = "matrix(" + t.scale + ", 0, 0, " + t.scale + ", 0, 0)",
                e.transformOrigin = e.webkitTransformOrigin = e.mozTransformOrigin = e.oTransformOrigin = "left top",
                e.left = t.x + "px",
                e.top = t.y + "px",
                t.isResizing = !0,
                t.resizeAgainTimes = 0,
                BwStage.ins.event(BwEvent.RESIZE)
            }
        }
        ,
        t.resizeCanvas = function() {
            if (t.canvas.visible = !0,
            t.computeSize(),
            t.isResizing && t.resizeAgainTimes < 4 && (t.lastClientWidth == t.clientWidth || t.lastClientHeight == t.clientHeight))
                return t.resizeAgainTimes++,
                void BwStage.ins.event(BwEvent.RESIZE);
            t.isResizing = !1,
            t.lastClientWidth = t.clientWidth,
            t.lastClientHeight = t.clientHeight,
            t.canvas.height = t.height;
            var e = t.canvas.style;
            e.position = "absolute",
            e.transform = e.webkitTransform = e.mozTransform = e.oTransform = "matrix(" + t.scale + ", 0, 0, " + t.scale + ", 0, 0)",
            e.transformOrigin = e.webkitTransformOrigin = e.mozTransformOrigin = e.oTransformOrigin = "left top",
            e.left = t.x + "px",
            e.top = t.y + "px",
            0 <= t.x ? (t.canvas.style.left = t.x + "px",
            t.canvas.width = t.width) : (t.canvas.style.left = "0px",
            t.canvas.width = t.clientWidth / t.scale,
            t.x = 0)
        }
        ,
        t.destroy = function() {
            if (bootWeb.ui.BwRender.hasInit) {
                Js.window.onresize === bootWeb.ui.BwRender.onResize && (Js.window.onresize = null),
                bootWeb.ui.BwRender.canvas.parentNode.removeChild(bootWeb.ui.BwRender.canvas);
                var e = BwText.inputText;
                e && (e.parentNode && e.parentNode.removeChild(e),
                BwText.inputText = null);
                var t = bootWeb.ui.BwRender.canvas;
                t.removeEventListener("mousedown", BwMouseMgr.downHandler),
                t.removeEventListener("mouseup", BwMouseMgr.upHandler),
                t.removeEventListener("mousemove", BwMouseMgr.moveHandler),
                t.removeEventListener("touchstart", BwMouseMgr.downHandler),
                t.removeEventListener("touchend", BwMouseMgr.upHandler),
                t.removeEventListener("touchmove", BwMouseMgr.moveHandler),
                t.removeEventListener("mouseout", BwMouseMgr.upHandler),
                BwTween.MGR.distory(),
                BwStage.ins.removeAllChildren(),
                BwStage.ins.offAll(),
                BwStage.ins = null,
                BwResMgr.delAllRes(),
                BwPool.clear(),
                bootWeb.ui.BwRender.hasInit = !1,
                bootWeb.ui.BwRender.canvas = null,
                bootWeb.ui.BwRender.FPS = 30,
                bootWeb.ui.BwRender.x = 0,
                bootWeb.ui.BwRender.y = 0,
                bootWeb.ui.BwRender.width = 480,
                bootWeb.ui.BwRender.height = 800,
                bootWeb.ui.BwRender.scale = 1,
                bootWeb.ui.BwRender.needUpdate = !1
            }
        }
        ,
        t.FPS = 60,
        t.hasInit = !1,
        t.canvas = null,
        t.x = 0,
        t.y = 0,
        t.scale = 1,
        t.needUpdate = !1,
        t.clientWidth = NaN,
        t.clientHeight = NaN,
        t.maxw = NaN,
        t.visible = !1,
        t.isResizing = !1,
        t.resizeAgainTimes = 0,
        t.lastClientWidth = NaN,
        t.lastClientHeight = NaN,
        __static(t, ["width", function() {
            return this.width = Gb.uiDesignWidth
        }
        , "height", function() {
            return this.height = Gb.uiDesignHeight
        }
        ]),
        t
    }()
      , BwResMgr = function() {
        function i() {
            this.data = {},
            i.ins = this
        }
        return __class(i, "bootWeb.ui.BwResMgr"),
        i.addRes = function(e, t) {
            e = (e = BwLoadMgr.format(e)).replace(/\?.*$/, ""),
            (bootWeb.ui.BwResMgr.ins || new i).data[e] = t
        }
        ,
        i.getRes = function(e) {
            return e = (e = BwLoadMgr.format(e)).replace(/\?.*$/, ""),
            (bootWeb.ui.BwResMgr.ins || new i).data[e]
        }
        ,
        i.delRes = function(e) {
            e = (e = BwLoadMgr.format(e)).replace(/\?.*$/, ""),
            delete (bootWeb.ui.BwResMgr.ins || new i).data[e]
        }
        ,
        i.delAllRes = function() {
            (bootWeb.ui.BwResMgr.ins || new i).data = {}
        }
        ,
        i.ins = null,
        i
    }()
      , BwTextLine = function() {
        function h() {
            this.words = [],
            this._width = 0,
            this._height = 0
        }
        __class(h, "bootWeb.ui.BwTextLine");
        var e = h.prototype;
        return e.addWord = function(e, t, i, n, o, r, s, a) {
            void 0 === t && (t = 16777215),
            void 0 === i && (i = "黑体"),
            void 0 === n && (n = 18),
            void 0 === o && (o = !1),
            void 0 === r && (r = !1),
            void 0 === s && (s = !1),
            this.words.push(BwTextWord.create(e, t, i, n, o, r, s, a)),
            this._width = 0,
            this._height = 0
        }
        ,
        e.addImage = function(e) {
            e && ((new BwSprite).resource = e)
        }
        ,
        e.recover = function() {
            var e = this.words.length;
            if (0 < e) {
                for (var t = 0; t < e; t++)
                    this.words[t].recover();
                this.words.length = 0
            }
            this._width = 0,
            this._height = 0,
            BwPool.recover("cc.TextLine", this)
        }
        ,
        __getset(0, e, "width", function() {
            if (this._width)
                return this._width;
            if (!this.words || 0 == this.words.length)
                return 0;
            var e;
            for (var t in this._width = 0,
            this.words)
                e = this.words[t],
                this._width += e.width;
            return this._width
        }),
        __getset(0, e, "height", function() {
            if (this._height)
                return this._height;
            if (!this.words || 0 == this.words.length)
                return 0;
            var e;
            for (var t in this._height = 0,
            this.words)
                e = this.words[t],
                this._height = Math.max(e.height, this._height);
            return this._height
        }),
        h.create = function(e, t, i, n, o, r, s, a) {
            void 0 === t && (t = 16777215),
            void 0 === i && (i = "黑体"),
            void 0 === n && (n = 18),
            void 0 === o && (o = !1),
            void 0 === r && (r = !1),
            void 0 === s && (s = !1);
            var l = BwPool.create("cc.TextLine", h);
            return e && l.addWord(e, t, i, n, o, r, s, a),
            l
        }
        ,
        h
    }()
      , BwTexture = function() {
        function d(e, t) {
            this.img = null,
            this.uv = null,
            this.offx = 0,
            this.offy = 0,
            this.sourceWidth = 0,
            this.sourceHeight = 0,
            this.img = e,
            this.uv = t
        }
        __class(d, "bootWeb.ui.BwTexture");
        var e = d.prototype;
        return __getset(0, e, "width", function() {
            return this.img ? this.img.width * this.uv[2] : 0
        }),
        __getset(0, e, "height", function() {
            return this.img ? this.img.height * this.uv[3] : 0
        }),
        d.create = function(e, t, i, n, o, r, s, a, l) {
            var h = BwPool.create("cc.Texture", d);
            h.img = e.img;
            var c = h.uv = [];
            return c[0] = t / e.img.width,
            c[1] = i / e.img.height,
            c[2] = n / e.img.width,
            c[3] = o / e.img.height,
            h.offx = r,
            h.offy = s,
            h.sourceWidth = a,
            h.sourceHeight = l,
            h
        }
        ,
        __static(d, ["UV", function() {
            return this.UV = [0, 0, 1, 1]
        }
        ]),
        d
    }()
      , BwTextWord = function() {
        function h() {
            this.word = null,
            this.color = 16777215,
            this.font = "黑体",
            this.fontSize = 18,
            this.bold = !1,
            this.italic = !1,
            this.underline = !1,
            this.links = null,
            this._width = 0
        }
        __class(h, "bootWeb.ui.BwTextWord");
        var e = h.prototype;
        return e.recover = function() {
            this.word = null,
            this.color = 16777215,
            this.font = "黑体",
            this.fontSize = 18,
            this.bold = !1,
            this.italic = !1,
            this.underline = !1,
            this.links = null,
            this._width = 0,
            BwPool.recover("cc.TextWord", this)
        }
        ,
        __getset(0, e, "width", function() {
            if (this._width)
                return this._width;
            if (!this.word)
                return 0;
            var e = BwRender.canvas.getContext("2d")
              , t = "";
            return this.bold && (t += "bold "),
            this.italic && (t += "italic "),
            t += this.fontSize + "px " + this.font,
            e.font = t,
            this._width = e.measureText(this.word).width
        }),
        __getset(0, e, "height", function() {
            return this.fontSize
        }),
        h.create = function(e, t, i, n, o, r, s, a) {
            void 0 === t && (t = 16777215),
            void 0 === i && (i = "黑体"),
            void 0 === n && (n = 18),
            void 0 === o && (o = !1),
            void 0 === r && (r = !1),
            void 0 === s && (s = !1);
            var l = BwPool.create("cc.TextWord", h);
            return l.word = e,
            l.color = t,
            l.font = i,
            l.fontSize = n,
            l.bold = o,
            l.italic = r,
            l.underline = s,
            l.links = a,
            l
        }
        ,
        h
    }()
      , BwTool = function() {
        function e() {}
        return __class(e, "bootWeb.ui.BwTool"),
        e.colorToString = function(e) {
            var t = "000000" + e.toString(16);
            return "#" + (t = t.substr(t.length - 6))
        }
        ,
        e.colorFromHtml = function(e) {
            if (e = e.toLowerCase(),
            bootWeb.ui.BwTool.htmlColor[e])
                return bootWeb.ui.BwTool.htmlColor[e];
            var t = e.match(/^\#([0-9a-f]{6})$/i);
            return t && t[1] ? parseInt("0x" + t[1]) : (t = e.match(/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i)) && t[1] ? parseInt("0x" + t[1] + t[1] + t[2] + t[2] + t[3] + t[3]) : (t = e.match(/^rgb\(([0-9]+),([0-9]+),([0-9]+)\)$/)) && t[1] ? (parseInt(t[1]) << 16) + (parseInt(t[2]) << 8) + parseInt(t[3]) : (t = e.match(/^rgb\(([0-9]+)%,([0-9]+)%,([0-9]+)%\)$/)) && t[1] ? (Math.floor(255 * parseFloat(t[1]) / 100) << 16) + (Math.floor(255 * parseFloat(t[2]) / 100) << 8) + Math.floor(255 * parseFloat(t[3]) / 100) : 0
        }
        ,
        e.parseHtml = function(e, t, i, n, o, r, s, a, l, h) {
            var c;
            void 0 === l && (l = !1);
            var d = 0
              , u = 0;
            for (d = 0,
            u = e.attributes ? e.attributes.length : 0; d < u; d++) {
                var g = e.attributes[d].nodeName || e.attributes[d].localName || e.attributes[d].name
                  , w = e.attributes[d].nodeValue || e.attributes[d].value || e.attributes[d].textContent;
                "color" == g ? n = bootWeb.ui.BwTool.colorFromHtml(w) : "face" == g ? o = w : "size" == g ? r = parseInt(w) : "style" == g ? c = w : "href" == g && (h = w)
            }
            if ("b" == (g = e.nodeName || e.localName || e.tagName) || "strong" == g ? s = !0 : "i" == g || "address" == g || "cite" == g || "em" == g ? a = !0 : "u" != g && "a" != g || (l = !0),
            c) {
                var B = c.split(";");
                for (d = 0,
                u = B ? B.length : 0; d < u; d++) {
                    var p = B[d].match(/^\s*([a-z\-]*)\s*\:\s*([^\s]*)\s*$/i);
                    if (p && p[1]) {
                        var v = p[1]
                          , b = p[2];
                        "color" == v ? n = bootWeb.ui.BwTool.colorFromHtml(b) : "font-family" == v ? o = b : "font-size" == v ? r = parseInt(b) : "font-style" == v ? a = "normal" != b : "font-weight" == v && (s = "bold" == b)
                    }
                }
            }
            if ("p" != g && "address" != g || (_ = 0 == t.length ? null : t[t.length - 1]) && 0 != _.width && t.push(BwTextLine.create()),
            "#text" == g) {
                w = e.data || e.nodeValue || e.textContent;
                var f = "";
                s && (f += "bold "),
                a && (f += "italic "),
                f += r + "px " + o;
                var m = BwRender.canvas.getContext("2d");
                for (m.font = f,
                0 == t.length && t.push(BwTextLine.create()); 0 < w.length; ) {
                    for (var _ = t[t.length - 1], x = i - _.width, S = 1; ; ) {
                        var L = m.measureText(w.substr(0, S)).width;
                        if (x < L) {
                            S--;
                            break
                        }
                        if (L == x || w.length <= S)
                            break;
                        S++
                    }
                    0 != S ? (_.addWord(w.substr(0, S), n, o, r, s, a, l, h),
                    w = w.substr(S)) : t.push(BwTextLine.create())
                }
            } else
                for (d = 0,
                u = e.childNodes.length; d < u; d++)
                    bootWeb.ui.BwTool.parseHtml(e.childNodes[d], t, i, n, o, r, s, a, l, h);
            "br" != g && "p" != g && "address" != g || (_ = 0 == t.length ? null : t[t.length - 1]) && 0 != _.width && t.push(BwTextLine.create())
        }
        ,
        __static(e, ["htmlColor", function() {
            return this.htmlColor = {
                aqua: 65535,
                black: 0,
                blue: 255,
                fuchsia: 16711935,
                gray: 8421504,
                green: 32768,
                lime: 65280,
                maroon: 8388608,
                navy: 128,
                olive: 8421376,
                orange: 16753920,
                purple: 8388736,
                red: 16711680,
                silver: 12632256,
                teal: 32896,
                white: 16777215,
                yellow: 16776960
            }
        }
        ]),
        e
    }()
      , BwTween = function() {
        function i() {}
        return __class(i, "bootWeb.ui.BwTween"),
        i.get = function(e, t) {
            return void 0 === t && (t = !1),
            i.MGR.get(e, t)
        }
        ,
        i.removeTweens = function(e, t) {
            return void 0 === t && (t = !1),
            i.MGR.removeTweens(e, t)
        }
        ,
        __static(i, ["MGR", function() {
            return this.MGR = new BwTweenMgr
        }
        ]),
        i
    }()
      , BwTweenMgr = function(i) {
        function e() {
            e.__super.call(this)
        }
        __class(e, "bootWeb.ui.BwTweenMgr", i);
        var t = e.prototype;
        return t.get = function(e, t) {
            return void 0 === t && (t = !1),
            i.prototype.get.call(this, e, t && e instanceof bootWeb.ui.BwDisplayObject)
        }
        ,
        t.getTime = function() {
            return (new Date).getTime()
        }
        ,
        t.enableEnterFrame = function() {
            BwStage.ins.on(BwEvent.ENTER_FRAME, this, this.enterFrameHandler)
        }
        ,
        t.disableEnterFrame = function() {
            BwStage.ins.off(BwEvent.ENTER_FRAME, this, this.enterFrameHandler)
        }
        ,
        t.canRemoveNow = function(e) {
            return e.autoRemove && null == e.target.parent
        }
        ,
        e
    }(BTweenMgr)
      , BwDisplayObject = function(a) {
        function e() {
            this._centerX = null,
            this._bottom = null,
            this._right = null,
            this._x = 0,
            this._y = 0,
            this._width = 0,
            this._height = 0,
            this._scaleX = 1,
            this._scaleY = 1,
            this._visible = !0,
            this._alpha = 1,
            this._rotation = 0,
            this._mask = null,
            this._parent = null,
            this._stage = null,
            this._mouseEnable = !1,
            this._mouseChild = !0,
            this.orgMouseEnable = !1,
            e.__super.call(this)
        }
        __class(e, "bootWeb.ui.BwDisplayObject", a);
        var t = e.prototype;
        return t.on = function(e, t, i, n) {
            void 0 === n && (n = !1),
            a.prototype.on.call(this, e, t, i, n),
            BwMouseMgr.isMouseEvent(e) && (this._mouseEnable = !0)
        }
        ,
        t.once = function(e, t, i, n) {
            void 0 === n && (n = !1),
            a.prototype.once.call(this, e, t, i, n),
            BwMouseMgr.isMouseEvent(e) && (this._mouseEnable = !0)
        }
        ,
        t.off = function(e, t, i, n) {
            void 0 === n && (n = !1),
            a.prototype.off.call(this, e, t, i, n);
            var o = this.orgMouseEnable;
            if (this._mouseEnable != o && BwMouseMgr.isMouseEvent(e)) {
                var r = !1;
                for (var s in this.senderDic)
                    if (BwMouseMgr.isMouseEvent(s)) {
                        r = !0;
                        break
                    }
                r || (this._mouseEnable = o)
            }
        }
        ,
        t.offAll = function() {
            a.prototype.offAll.call(this),
            this._mouseEnable = this.orgMouseEnable
        }
        ,
        t.toGlobal = function(e, t) {
            if (void 0 === e && (e = 0),
            void 0 === t && (t = 0),
            !this._stage)
                return BwPoint.create(e, t);
            e *= this._scaleX,
            t *= this._scaleY,
            e += this.x,
            t += this.y;
            var i = BwStage.ins;
            return this == i ? BwPoint.create(e, t) : this._parent == i ? BwPoint.create(e * i.scaleX, t * i.scaleY) : this._parent.toGlobal(e, t)
        }
        ,
        t.toLocal = function(e, t) {
            if (void 0 === e && (e = 0),
            void 0 === t && (t = 0),
            !this._stage)
                return BwPoint.create(e, t);
            var i, n = BwStage.ins;
            return (i = this == n ? BwPoint.create(e, t) : this._parent == n ? BwPoint.create(e / n.scaleX, t / n.scaleY) : this._parent.toLocal(e, t)).x -= this.x,
            i.y -= this.y,
            i.x /= this._scaleX,
            i.y /= this._scaleY,
            i
        }
        ,
        __getset(0, t, "rotation", function() {
            return this._rotation
        }, function(e) {
            this._rotation != e && (this._rotation = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "width", function() {
            return this._width
        }, function(e) {
            this._width != e && (this._width = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "x", function() {
            return null != this._centerX && this.parent ? (this.parent.width - this.width) / 2 + this._centerX : null != this._right && this.parent ? this.parent.width - this.width - this._right : this._x
        }, function(e) {
            this._x != e && (this._x = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "y", function() {
            return null != this._bottom && this.parent ? this.parent.height - this.height - this._bottom : this._y
        }, function(e) {
            this._y != e && (this._y = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "centerX", null, function(e) {
            this._centerX != e && (this._centerX = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "right", null, function(e) {
            this._right != e && (this._right = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "height", function() {
            return this._height
        }, function(e) {
            this._height != e && (this._height = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "bottom", null, function(e) {
            this._bottom != e && (this._bottom = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "scaleX", function() {
            return this._scaleX
        }, function(e) {
            this._scaleX != e && (this._scaleX = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "scaleY", function() {
            return this._scaleY
        }, function(e) {
            this._scaleY != e && (this._scaleY = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "globalScaleX", function() {
            return this == BwStage.ins ? this.scaleX : this.stage ? this.parent.globalScaleX * this.scaleX : 1
        }),
        __getset(0, t, "globalScaleY", function() {
            return this == BwStage.ins ? this.scaleY : this.stage ? this.parent.globalScaleY * this.scaleY : 1
        }),
        __getset(0, t, "visible", function() {
            return this._visible
        }, function(e) {
            this._visible != e && (this._visible = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "alpha", function() {
            return this._alpha
        }, function(e) {
            this._alpha != e && (this._alpha = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, t, "globalAlpha", function() {
            return this == BwStage.ins ? this._alpha : this.stage ? this.parent.globalAlpha * this._alpha : 1
        }),
        __getset(0, t, "globalMask", function() {
            if (this == BwStage.ins)
                return this.mask ? this.mask.clone() : null;
            var e = this.mask;
            if (e) {
                var t = this.toGlobal(e.x, e.y)
                  , i = this.globalScaleX
                  , n = this.globalScaleY;
                (e = e.clone()).x = t.x,
                e.y = t.y,
                e.w *= i,
                e.h *= n,
                t.recover()
            }
            var o = this.parent.globalMask;
            if (o && e) {
                var r = o.intersection(e);
                return r || (r = BwRect.create(0, 0, 0, 0)),
                o.recover(),
                e.recover(),
                r
            }
            return o ? e ? null : o : e
        }),
        __getset(0, t, "mask", function() {
            return this._mask
        }, function(e) {
            this._mask = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, t, "parent", function() {
            return this._parent
        }),
        __getset(0, t, "stage", function() {
            return this._stage
        }, function(e) {
            this._stage = e
        }),
        __getset(0, t, "mouseEnable", function() {
            return this._mouseEnable
        }, function(e) {
            this._mouseEnable = this.orgMouseEnable = e
        }),
        __getset(0, t, "mouseChild", function() {
            return this._mouseChild
        }, function(e) {
            this._mouseChild = e
        }),
        e
    }(BwEventDispatcher)
      , BwSprite = function(e) {
        function t() {
            this._children = [],
            this._resource = null,
            this._grid = null,
            this._stateNum = 1,
            t.__super.call(this)
        }
        __class(t, "bootWeb.ui.BwSprite", e);
        var i = t.prototype;
        return i.addChild = function(e) {
            if (e instanceof bootWeb.ui.BwDisplayObject && e != this && !(e instanceof bootWeb.ui.BwSprite && e.contains(this))) {
                var t = this._children
                  , i = t.indexOf(e);
                0 <= i && t.splice(i, 1),
                t.push(e),
                e._parent = this,
                e.stage = this._stage,
                this.event(BwEvent.CHILD_ADDED),
                BwRender.needUpdate = !0
            }
        }
        ,
        i.addChildAt = function(e, t) {
            if (e instanceof bootWeb.ui.BwDisplayObject && e != this && !(e instanceof bootWeb.ui.BwSprite && e.contains(this))) {
                var i = this._children
                  , n = i.indexOf(e);
                0 <= n && i.splice(n, 1),
                t < 0 && (t = 0),
                t >= i.length && (t = i.length),
                i.splice(t, 0, e),
                e._parent = this,
                e.stage = this._stage,
                this.event(BwEvent.CHILD_ADDED),
                BwRender.needUpdate = !0
            }
        }
        ,
        i.getChildAt = function(e) {
            var t = this._children;
            return e < 0 || e >= t.length ? null : t[e]
        }
        ,
        i.getChildIndex = function(e) {
            return this._children.indexOf(e)
        }
        ,
        i.contains = function(e) {
            if (!e || e.parent)
                return !1;
            for (; e.parent; ) {
                if (e.parent == this)
                    return !0;
                e = e.parent
            }
            return !1
        }
        ,
        i.removeChild = function(e) {
            var t = this._children
              , i = t.indexOf(e);
            return 0 <= i ? (t.splice(i, 1),
            e._parent = e.stage = null,
            this.event(BwEvent.CHILD_REMOVED),
            BwRender.needUpdate = !0,
            e) : null
        }
        ,
        i.removeChildAt = function(e) {
            var t = this._children;
            if (0 <= e && e < t.length) {
                var i = t[e];
                return t.splice(e, 1),
                i._parent = i.stage = null,
                this.event(BwEvent.CHILD_REMOVED),
                BwRender.needUpdate = !0,
                i
            }
            return null
        }
        ,
        i.removeAllChildren = function() {
            var e = this._children;
            if (0 == e.length)
                return !1;
            for (var t = e.length - 1; 0 <= t; t--)
                e[t]._parent = e[t].stage = null;
            return this.event(BwEvent.CHILD_REMOVED),
            e.length = 0,
            BwRender.needUpdate = !0
        }
        ,
        __getset(0, i, "resource", function() {
            return this._resource
        }, function(e) {
            var i = this;
            if (e instanceof bootWeb.ui.BwTexture)
                this._resource = e,
                BwRender.needUpdate = !0;
            else {
                var t = BwResMgr.getRes(e);
                if (t)
                    return this._resource = t,
                    0 == this._width && (this._width = this._resource.width),
                    0 == this._height && (this._height = this._resource.height),
                    BwRender.needUpdate = !0,
                    void this.event(BwEvent.COMPLETE);
                BwLoadMgr.load(e, "image", null, function(e, t) {
                    i._resource = t,
                    0 == i._width && (i._width = i._resource.width),
                    0 == i._height && (i._height = i._resource.height),
                    BwRender.needUpdate = !0,
                    i.event(BwEvent.COMPLETE)
                })
            }
        }),
        __getset(0, i, "stage", e.prototype._$get_stage, function(e) {
            var t = this._stage;
            this._stage = e,
            !t && e ? this.event(BwEvent.ADDED_TO_STAGE) : t && !e && this.event(BwEvent.REMOVED_FROM_STAGE);
            for (var i = this._children, n = 0, o = i.length; n < o; n++)
                i[n].stage = e
        }),
        __getset(0, i, "sizeGrid", null, function(e) {
            this.grid = e
        }),
        __getset(0, i, "numChildren", function() {
            return this._children.length
        }),
        __getset(0, i, "grid", function() {
            return this._grid
        }, function(e) {
            this._grid = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "stateNum", function() {
            return this._stateNum
        }, function(e) {
            this._stateNum = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "skin", null, function(e) {
            this.resource = e
        }),
        t
    }(BwDisplayObject)
      , BwText = function(e) {
        function t() {
            this._html = "",
            this._text = "",
            this._textWidth = 0,
            this._textHeight = 0,
            this._color = 16777215,
            this._font = "黑体",
            this._fontSize = 18,
            this._bold = !1,
            this._italic = !1,
            this._align = "left",
            this._valign = "top",
            this._leading = 10,
            this._wordWrap = !1,
            this._stroke = !1,
            this._strokeColor = 0,
            this._editable = !1,
            this.autoWidth = !0,
            this.autoHeight = !0,
            this.lines = [],
            this.needUpdate = !1,
            this.isEditing = !1,
            t.__super.call(this),
            this._mouseChild = !1
        }
        __class(t, "bootWeb.ui.BwText", BwDisplayObject);
        var i = t.prototype;
        return i.onEdit = function(e) {
            this.stage.on(BwEvent.MOUSE_DOWN, this, this.onEditEnd);
            var t = bootWeb.ui.BwText.inputText;
            t || ((t = bootWeb.ui.BwText.inputText = Js.document.createElement("input")).type = "text",
            t.placeholder = "");
            var i = BwRender.canvas.style
              , n = parseFloat(i.left.replace("px", ""))
              , o = this.toGlobal()
              , r = BwRender.scale
              , s = this.globalScaleX * r
              , a = t.style;
            a.position = "absolute",
            a.overflow = "hidden",
            a.resize = "none",
            a.transform = a.webkitTransform = a.mozTransform = a.oTransform = "matrix(" + s + ", 0, 0, " + s + ", 0, 0)",
            a.transformOrigin = a.webkitTransformOrigin = a.mozTransformOrigin = a.oTransformOrigin = "0px 0px 0px",
            a.backgroundColor = "transparent",
            a.border = "none",
            a.outline = "none",
            a.zIndex = 1,
            a.whiteSpace = "nowrap",
            a.left = o.x * r + n + "px",
            a.top = o.y * r + "px",
            a.width = this.width + "px",
            a.height = this.height + "px",
            a.color = BwTool.colorToString(this.color),
            a.fontSize = this.fontSize + "px",
            a.lineHeight = this.fontSize + "px",
            a.fontFamily = this.font,
            a.fontStyle = "normal",
            a.fontWeight = "normal",
            a.textAlign = this.align,
            a.paddingLeft = "0px",
            a.paddingRight = "0px",
            a.paddingTop = "0px",
            a.paddingBottom = "0px",
            Js.document.body.appendChild(t),
            t.value = this.text,
            t.focus(),
            this.isEditing = !0,
            BwRender.needUpdate = !0,
            o.recover()
        }
        ,
        i.onEditEnd = function(e) {
            if (e.target != this) {
                this.stage.off(BwEvent.MOUSE_DOWN, this, this.onEditEnd);
                var t = bootWeb.ui.BwText.inputText;
                t && (this.text = t.value,
                t.parentNode.removeChild(t)),
                this.isEditing = !1,
                this.needUpdate = !0
            }
        }
        ,
        i.clearLines = function() {
            for (var e = this.lines, t = 0, i = e ? e.length : 0; t < i; t++)
                e[t].recover();
            e.length = 0
        }
        ,
        i.calcLine = function() {
            this.needUpdate = !1;
            var e, t = this.color, i = this.font, n = this.fontSize, o = this.bold, r = this.italic, s = NaN, a = NaN, l = 0, h = 0;
            if (this._html) {
                this.clearLines();
                var c = "<root>" + this._html + "</root>";
                c = (c = c.replace(/\<br\s*\/?\>/gi, "<br />")).replace(/[\n\r]/g, "<br />");
                var d = Js.createDOMParser().parseFromString(c, "text/xml");
                if (-1 < d.firstChild.textContent.indexOf("This page contains the following errors"))
                    return console.log(d.firstChild.textContent),
                    e = BwTextLine.create(LcI18n.v(2101744), t, i, n, o, r),
                    this.lines.push(e),
                    this._textWidth = e.width,
                    void (this._textHeight = e.height);
                var u = d.childNodes[0];
                for (BwTool.parseHtml(u, this.lines, this.autoWidth ? 500 : this._width, t, i, n, o, r),
                l = a = s = 0,
                h = this.lines.length; l < h; l++)
                    e = this.lines[l],
                    s = Math.max(s, e.width),
                    a += e.height + this.leading;
                this._textWidth = s || 0,
                this._textHeight = a ? a - this.leading : 0,
                this.autoWidth && (this._width = this._textWidth),
                this.autoHeight && (this._height = this._textHeight)
            } else {
                var g = BwRender.canvas.getContext("2d")
                  , w = "";
                if (o && (w += "bold "),
                r && (w += "italic "),
                w += n + "px " + i,
                g.font = w,
                !this._wordWrap)
                    return s = g.measureText(this._text).width,
                    this.autoWidth && (this._width = s),
                    this.autoHeight && (this._height = n),
                    this.lines = [BwTextLine.create(this._text, t, i, n, o, r)],
                    this._textWidth = s,
                    void (this._textHeight = n);
                var B = g.measureText("文").width;
                this.clearLines();
                var p = this.autoWidth ? 200 : this._width
                  , v = this._text.split(/[\n\r]/);
                for (l = a = s = 0,
                h = v.length; l < h; l++)
                    for (var b = v[l]; b; )
                        for (var f = Math.floor(p / B), m = g.measureText(b.substr(0, f)).width, _ = p - m; ; ) {
                            if (f >= b.length) {
                                this.lines.push(BwTextLine.create(b, t, i, n, o, r)),
                                s = Math.max(s, m),
                                a += n + this.leading,
                                b = null;
                                break
                            }
                            if (m == p) {
                                this.lines.push(BwTextLine.create(b.substr(0, h), t, i, n, o, r)),
                                s = Math.max(s, p),
                                a += n + this.leading,
                                b = b.substr(f);
                                break
                            }
                            if (m < p)
                                f++,
                                _ = p - m,
                                m = g.measureText(b.substr(0, f)).width;
                            else if (p < m) {
                                f--,
                                this.lines.push(BwTextLine.create(b.substr(0, f), t, i, n, o, r)),
                                s = Math.max(s, p - _),
                                a += n + this.leading,
                                b = b.substr(f);
                                break
                            }
                        }
                this._textWidth = s || 0,
                this._textHeight = a ? a - this.leading : 0,
                this.autoWidth && (this._width = s),
                this.autoHeight && (this._height = this.lines.length * (n + this.leading) - this.leading)
            }
        }
        ,
        i.linksClick = function(e, t) {
            if (void 0 === e && (e = 0),
            void 0 === t && (t = 0),
            this.stage && 0 != this.lines.length) {
                var i = this.toLocal(e, t)
                  , n = 0;
                "middle" == this.valign ? n = (this.height - this.textHeight) / 2 : "bottom" == this.valign && (n = this.height - this.textHeight);
                for (var o = 0, r = 0, s = 0, a = this.lines.length; s < a; s++) {
                    var l = this.lines[s];
                    if (i.y >= n + r && i.y < n + r + l.height + this.leading) {
                        var h = 0;
                        "center" == this.align ? h = (this.width - l.width) / 2 : "right" == this.align && (h = this.width - l.width);
                        for (var c = 0, d = l.words.length; c < d; c++) {
                            var u = l.words[c];
                            if (i.x >= h + o && i.x < h + o + u.width && u.links) {
                                var g = u.links.match(/^event\:(.*)/);
                                g && g[1] ? this.event(BwEvent.LINKS, g[1]) : Js.window.open(u.links)
                            }
                            o += u.width
                        }
                        return
                    }
                    r += l.height + this.leading
                }
            }
        }
        ,
        __getset(0, i, "width", function() {
            return this.autoWidth && this.needUpdate && this.calcLine(),
            this._width
        }, function(e) {
            this._width = e,
            this.autoWidth = 0 == e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "textWidth", function() {
            return this.needUpdate && this.calcLine(),
            this._textWidth
        }),
        __getset(0, i, "height", function() {
            return this.autoHeight && this.needUpdate && this.calcLine(),
            this._height
        }, function(e) {
            this._height = e,
            this.autoHeight = 0 == e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "textHeight", function() {
            return this.needUpdate && this.calcLine(),
            this._textHeight
        }),
        __getset(0, i, "html", function() {
            return this._html
        }, function(e) {
            (this._html = e) && (this.editable = !1,
            this._mouseEnable = !0),
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "font", function() {
            return this._font
        }, function(e) {
            this._font = e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "color", function() {
            return this._color
        }, function(e) {
            this._color = e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "text", function() {
            return this._text
        }, function(e) {
            this._text = e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "fontSize", function() {
            return this._fontSize
        }, function(e) {
            this._fontSize = e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "bold", function() {
            return this._bold
        }, function(e) {
            this._bold = e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "italic", function() {
            return this._italic
        }, function(e) {
            this._italic = e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "align", function() {
            return this._align
        }, function(e) {
            this._align = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "valign", function() {
            return this._valign
        }, function(e) {
            this._valign = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "leading", function() {
            return this._leading
        }, function(e) {
            this._leading = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "wordWrap", function() {
            return this._wordWrap
        }, function(e) {
            this.editable && (e = !1),
            this._wordWrap = e,
            this.needUpdate = !0,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "stroke", function() {
            return this._stroke
        }, function(e) {
            this._stroke = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "strokeColor", function() {
            return this._strokeColor
        }, function(e) {
            this._strokeColor = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "editable", function() {
            return this._editable
        }, function(e) {
            this._html || ((this._editable = e) ? (this.on(BwEvent.CLICK, this, this.onEdit),
            this.wordWrap && (this.wordWrap = !1)) : this.off(BwEvent.CLICK, this, this.onEdit))
        }),
        t.inputText = null,
        t
    }()
      , BwView = function(e) {
        function c() {
            this.uiloaded = !1,
            this.destroyArr = [],
            c.__super.call(this)
        }
        __class(c, "bootWeb.ui.BwView", BwSprite);
        var t = c.prototype;
        return t.addRes = function(e) {
            if (e) {
                if (e.props && e.props.skin && this.addSkin(e.props),
                e.child)
                    for (var t = 0, i = e.child.length; t < i; t++)
                        this.addRes(e.child[t]);
                var n = e.props ? e.props.runtime : ""
                  , o = n ? c.uiClassMap[n] || Laya.__classmap[n] : c.uiClassMap[e.type]
                  , r = o && o.hasOwnProperty("uiView") ? o.uiView : null;
                r && this.addRes(r)
            }
        }
        ,
        t.loadDisplay = function(e) {
            e ? BwLoadMgr.load(this.convertUrl(e), "atlas", this, this.onLoaded) : this.onLoaded()
        }
        ,
        t.onLoaded = function() {
            this.uiloaded = !0
        }
        ,
        t.createView = function(e) {
            if (this.uiloaded) {
                this.addRes(e),
                c.createComp(e, this, this);
                var t = Gb.uiDesignHeight / 1024;
                this.scaleX = t,
                this.scaleY = t
            }
        }
        ,
        t.addSkin = function(e) {
            var t = e.skin;
            t = this.convertUrl(t),
            e.skin = t,
            this.destroyArr.push(t)
        }
        ,
        t.convertUrl = function(e) {
            return e = BwVerMgr.getPath("img/" + e),
            this.destroyArr.push(e),
            e
        }
        ,
        c.createComp = function(e, t, i) {
            if (!(t = t || c.getCompInstance(e)))
                return console.warn("can not create:" + e.type),
                null;
            var n, o = e.child;
            if (o)
                for (var r in o) {
                    n = o[r];
                    var s = c.createComp(n, null, i);
                    s instanceof bootWeb.ui.BwDisplayObject && t.addChild(s)
                }
            var a = e.props;
            for (var l in a) {
                var h = a[l];
                c.setCompValue(t, l, h, i)
            }
            return t
        }
        ,
        c.setCompValue = function(e, t, i, n) {
            "var" === t && n ? n[i] = e : e[t] = "true" === i || "false" !== i && i
        }
        ,
        c.getCompInstance = function(e) {
            var t, i = e.props ? e.props.runtime : null;
            return (t = i ? c.uiClassMap[i] || Laya.__classmap[i] : c.uiClassMap[e.type]) ? new t : null
        }
        ,
        __static(c, ["uiClassMap", function() {
            return this.uiClassMap = {
                Image: BwSprite,
                Box: BwSprite,
                Button: BwSprite,
                TextInput: BwText,
                HTMLDivElement: BwText,
                Label: BwText,
                Sprite: BwSprite,
                Text: BwText
            }
        }
        ]),
        c
    }()
      , BwLoadingFlower = function(e) {
        function t() {
            this.raduis = 60,
            this.amount = 13,
            this.time = 800,
            this.lastTime = 0,
            t.__super.call(this),
            this.init(),
            this.once(BwEvent.ADDED_TO_STAGE, this, this.onAdd)
        }
        __class(t, "bootWeb.BwLoadingFlower", BwSprite);
        var i = t.prototype;
        return i.init = function() {
            for (var e = 0; e < this.amount; e++) {
                var t = new BwSprite;
                t.resource = BwVerMgr.getPath("img/loadingFlower.png"),
                this.addChild(t)
            }
        }
        ,
        i.onAdd = function(e) {
            this.once(BwEvent.REMOVED_FROM_STAGE, this, this.onRemove),
            BwStage.ins.on(BwEvent.ENTER_FRAME, this, this.onFrame)
        }
        ,
        i.onRemove = function(e) {
            this.once(BwEvent.ADDED_TO_STAGE, this, this.onAdd),
            BwStage.ins.off(BwEvent.ENTER_FRAME, this, this.onFrame)
        }
        ,
        i.onFrame = function(e) {
            for (var t = (new Date).getTime() % this.time, i = 0; i < this.amount; i++) {
                var n = this.getChildAt(i);
                if (n.resource) {
                    var o = (this.time - t) / this.time + i / this.amount;
                    1 < o && (o -= 1),
                    o < .4 && (o = 1 - o),
                    n.scaleX = n.scaleY = o;
                    var r = 2 * i * Math.PI / this.amount - Math.PI / 2;
                    n.x = this.raduis * Math.cos(r) - n.scaleX * n.resource.width / 2,
                    n.y = this.raduis * Math.sin(r) - n.scaleY * n.resource.height / 2
                }
            }
        }
        ,
        t
    }()
      , BwPopPanel = function(e) {
        function t() {
            this.closeBtns = null,
            t.__super.call(this)
        }
        __class(t, "bootWeb.BwPopPanel", BwSprite);
        var i = t.prototype;
        return i.open = function(e, t) {
            for (var i in void 0 === t && (t = !1),
            this.resize(),
            BwBlack.show(),
            BwStage.ins.addChild(this),
            t && (e = e.concat([BwBlack.black])),
            this.closeBtns = e)
                e[i].once(BwEvent.CLICK, this, this.close)
        }
        ,
        i.close = function(e) {
            for (var t in this.closeBtns)
                this.closeBtns[t].off(BwEvent.CLICK, this, this.close);
            this.closeBtns = null,
            BwStage.ins.removeChild(this),
            BwBlack.hide()
        }
        ,
        i.resize = function() {
            var e = NaN;
            e = (this.width + t.winspace) * BwStage.ins.scaleX > BwRender.maxw ? BwRender.maxw / ((this.width + t.winspace) * BwStage.ins.scaleX) : 1,
            this.scaleX = e,
            this.scaleY = e,
            this.x = BwRender.canvas.width / BwStage.ins.scaleX - this.width * this.scaleX >> 1,
            this.y = BwRender.canvas.height / BwStage.ins.scaleY - this.height * this.scaleY >> 1
        }
        ,
        t.winspace = 50,
        t
    }()
      , BwListItem = function(e) {
        function t() {
            this._data = null,
            this._selected = !1,
            t.__super.call(this)
        }
        __class(t, "bootWeb.ui.BwListItem", BwSprite);
        var i = t.prototype;
        return __getset(0, i, "data", function() {
            return this._data
        }, function(e) {
            this._data = e
        }),
        __getset(0, i, "selected", function() {
            return this._selected
        }, function(e) {
            this._selected = e
        }),
        t
    }()
      , BwList = function(e) {
        function t() {
            this._gap = 0,
            this._itemRender = null,
            this._data = null,
            this._selectedIndex = -1,
            this._selectedItem = null,
            this.contentHeight = 0,
            this.mx = 0,
            this.my = 0,
            this.isMove = !1,
            this.moveY = 0,
            this.speed = 0,
            this.content = null,
            t.__super.call(this),
            this.content = new BwSprite,
            this._mask = BwRect.create(),
            this.addChild(this.content),
            this.on(BwEvent.MOUSE_DOWN, this, this.onMouseDown)
        }
        __class(t, "bootWeb.ui.BwList", e);
        var i = t.prototype;
        return i.update = function() {
            var e, t = this.content, i = this.itemRender, n = this.data;
            if (n && 0 != n.length) {
                0 == t.numChildren ? ((e = new i).on(BwEvent.CLICK, this, this.onItemClick, !0),
                t.addChild(e)) : e = t.getChildAt(0),
                this.contentHeight = (e.height + this.gap) * n.length - this.gap;
                var o = Math.ceil(this.height / (e.height + this.gap)) + 1;
                if ((o = Math.min(o, n.length)) > t.numChildren)
                    for (var r = t.numChildren; r < o; r++)
                        (e = new i).on(BwEvent.CLICK, this, this.onItemClick, !0),
                        t.addChild(e);
                else if (o < t.numChildren)
                    for (; t.numChildren > o; )
                        (e = t.removeChildAt(t.numChildren - 1)).off(BwEvent.CLICK, this, this.onItemClick, !0);
                this.offset = t.y
            } else
                for (; t.numChildren; )
                    (e = t.removeChildAt(0)).off(BwEvent.CLICK, this, this.onItemClick, !0)
        }
        ,
        i.onItemClick = function(e) {
            if (this.isMove)
                e.stop();
            else {
                var t = e.currentTarget;
                this.selectedIndex = Math.floor(t.y / (t.height + this.gap)),
                this.event(BwEvent.INDEX_CHANGED)
            }
        }
        ,
        i.onMouseDown = function(e) {
            this.isMove = !1,
            this.moveY = 0,
            this.mx = e.mouseX,
            this.my = e.mouseY,
            this.speed = 0,
            this.stage.on(BwEvent.MOUSE_MOVE, this, this.onMouseMove),
            this.stage.on(BwEvent.MOUSE_UP, this, this.onMouseUp),
            BwTween.removeTweens(this, !0)
        }
        ,
        i.onMouseMove = function(e) {
            var t = (e.mouseY - this.my) / this.globalScaleY;
            this.moveY += t,
            this.speed = t,
            20 < Math.abs(this.moveY) && (this.isMove = !0),
            this.offset += t,
            this.mx = e.mouseX,
            this.my = e.mouseY
        }
        ,
        i.onMouseUp = function(e) {
            var t;
            if (this.stage.off(BwEvent.MOUSE_MOVE, this, this.onMouseMove),
            this.stage.off(BwEvent.MOUSE_UP, this, this.onMouseUp),
            0 < this.offset || 0 != this.offset && this.contentHeight < this.height)
                (t = BwTween.get(this)).to({
                    offset: 0,
                    duration: .8 * this.offset,
                    ease: BTween.sineOut
                });
            else if (this.contentHeight > this.height && this.offset < this.height - this.contentHeight)
                (t = BwTween.get(this)).to({
                    offset: this.height - this.contentHeight,
                    duration: .8 * (this.height - this.contentHeight - this.offset),
                    ease: BTween.quartIn
                });
            else if (0 != this.speed) {
                t = BwTween.get(this);
                var i = 10 * this.speed;
                this.content.y + i < this.height - this.contentHeight ? i = this.height - this.contentHeight - this.content.y : 0 < this.content.y + i && (i = -this.content.y);
                var n = Math.abs(1 * i);
                t.to({
                    offset: this.content.y + i,
                    duration: n,
                    ease: BTween.sineOut
                }),
                this.speed = 0
            }
        }
        ,
        __getset(0, i, "gap", function() {
            return this._gap
        }, function(e) {
            this._gap = e,
            this.update()
        }),
        __getset(0, i, "width", e.prototype._$get_width, function(e) {
            this._width = e,
            this._mask.w = e,
            BwRender.needUpdate = !0
        }),
        __getset(0, i, "itemRender", function() {
            return this._itemRender
        }, function(e) {
            if (this._itemRender != e) {
                for (this._itemRender = e; this.content.numChildren; ) {
                    this.content.removeChildAt(this.content.numChildren - 1).off(BwEvent.CLICK, this, this.onItemClick, !0)
                }
                this.update()
            }
        }),
        __getset(0, i, "offset", function() {
            return this.content.y
        }, function(e) {
            var t = this.content
              , i = this.data;
            if (t.y = e,
            0 != t.numChildren) {
                var n = t.getChildAt(0)
                  , o = e;
                o < this.height - this.contentHeight && (o = this.height - this.contentHeight),
                0 < o && (o = 0);
                var r = Math.floor(-o / (n.height + this.gap))
                  , s = Math.min(i.length, r + Math.ceil(this.height / (n.height + this.gap)) + 1)
                  , a = 0
                  , l = 0
                  , h = [];
                for (a = r; a < s; a++)
                    h.push(i[a]);
                var c = [];
                for (a = 0,
                l = t.numChildren; a < l; a++)
                    if ((n = t.getChildAt(a)).data) {
                        var d = n.data
                          , u = h.indexOf(d);
                        if (-1 != u)
                            if (h[u] = null,
                            u + r > i.length)
                                n.visible = !1;
                            else {
                                n.visible = !0,
                                n.y = (u + r) * (n.height + this.gap);
                                var g = u + r == this._selectedIndex;
                                g != n.selected && (n.selected = g)
                            }
                        else
                            c.push(n)
                    } else
                        c.push(n);
                for (a = 0,
                l = h.length; a < l; a++)
                    h[a] && ((n = c.pop()).data = h[a],
                    n.y = (r + a) * (n.height + this.gap),
                    n.selected = r + a == this._selectedIndex)
            }
        }),
        __getset(0, i, "height", e.prototype._$get_height, function(e) {
            this._height = e,
            this._mask.h = e,
            this.update()
        }),
        __getset(0, i, "data", function() {
            return this._data
        }, function(e) {
            this._data = e,
            this.content.y = 0,
            this.update()
        }),
        __getset(0, i, "selectedIndex", function() {
            return this._selectedIndex
        }, function(e) {
            if (this._selectedItem && (this._selectedItem.selected = !1),
            e < 0 || e >= this._data.length)
                return this._selectedItem = null,
                void (this._selectedIndex = -1);
            for (var t = this._data[e], i = 0, n = this.content.numChildren; i < n; i++) {
                var o = this.content.getChildAt(i);
                o.data == t && (o.selected = !0,
                this._selectedItem = o,
                this._selectedIndex = Math.floor(o.y / (o.height + this.gap)))
            }
        }),
        __getset(0, i, "selectedData", function() {
            return this._data[this._selectedIndex]
        }),
        __getset(0, i, "selectedItem", function() {
            return this._selectedItem
        }),
        t
    }(BwSprite)
      , BwStage = function(e) {
        function t() {
            t.__super.call(this),
            (t.ins = this)._stage = this
        }
        __class(t, "bootWeb.ui.BwStage", BwSprite);
        var i = t.prototype;
        return __getset(0, i, "x", function() {
            return 0
        }, function(e) {}),
        __getset(0, i, "y", function() {
            return 0
        }, function(e) {}),
        t.ins = null,
        t
    }()
      , BwTextArea = function(e) {
        function t() {
            this.isMove = !1,
            this.moveY = 0,
            this.lastY = 0,
            this.speed = 0,
            this.txt = null,
            t.__super.call(this),
            this.txt = new BwText,
            this.txt.wordWrap = !0,
            this.txt.width = this._width,
            this.txt.mask = BwRect.create(0, 0, this._width, this._height),
            this.addChild(this.txt),
            this.on(BwEvent.CLICK, this, this.onCLick, !0),
            this.on(BwEvent.MOUSE_DOWN, this, this.onMouseDown)
        }
        __class(t, "bootWeb.ui.BwTextArea", e);
        var i = t.prototype;
        return i.onCLick = function(e) {
            this.isMove && e.stop()
        }
        ,
        i.onMouseDown = function(e) {
            this.isMove = !1,
            this.moveY = 0,
            this.lastY = e.mouseY,
            this.speed = 0,
            this.stage.on(BwEvent.MOUSE_MOVE, this, this.onMouseMove),
            this.stage.on(BwEvent.MOUSE_UP, this, this.onMouseUp),
            BwTween.removeTweens(this, !0)
        }
        ,
        i.onMouseMove = function(e) {
            var t = (e.mouseY - this.lastY) / this.globalScaleY;
            this.moveY += t,
            this.speed = t,
            20 < Math.abs(this.moveY) && (this.isMove = !0),
            this.offset += t,
            this.lastY = e.mouseY
        }
        ,
        i.onMouseUp = function(e) {
            var t;
            if (this.stage.off(BwEvent.MOUSE_MOVE, this, this.onMouseMove),
            this.stage.off(BwEvent.MOUSE_UP, this, this.onMouseUp),
            0 < this.offset || 0 != this.offset && this.txt.textHeight < this.height)
                (t = BwTween.get(this)).to({
                    offset: 0,
                    duration: .8 * this.offset,
                    ease: BTween.sineOut
                });
            else if (this.txt.textHeight > this.height && this.offset < this.height - this.txt.textHeight)
                (t = BwTween.get(this)).to({
                    offset: this.height - this.txt.textHeight,
                    duration: .8 * (this.height - this.txt.textHeight - this.offset),
                    ease: BTween.quartIn
                });
            else if (0 != this.speed) {
                t = BwTween.get(this);
                var i = 10 * this.speed;
                this.txt.y + i < this.height - this.txt.textHeight ? i = this.height - this.txt.textHeight - this.txt.y : 0 < this.txt.y + i && (i = -this.txt.y);
                var n = Math.abs(1 * i);
                t.to({
                    offset: this.txt.y + i,
                    duration: n,
                    ease: BTween.sineOut
                }),
                this.speed = 0
            }
        }
        ,
        __getset(0, i, "width", e.prototype._$get_width, function(e) {
            this._width != e && (this._width = this.txt.width = this.txt.mask.w = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, i, "textWidth", function() {
            return this.txt.textWidth
        }),
        __getset(0, i, "height", e.prototype._$get_height, function(e) {
            this._height != e && (this._height = this.txt.mask.h = e,
            BwRender.needUpdate = !0)
        }),
        __getset(0, i, "textHeight", function() {
            return this.txt.textHeight
        }),
        __getset(0, i, "text", function() {
            return this.txt.text
        }, function(e) {
            this.txt.text = e
        }),
        __getset(0, i, "html", function() {
            return this.txt.html
        }, function(e) {
            this.txt.html = e
        }),
        __getset(0, i, "font", function() {
            return this.txt.font
        }, function(e) {
            this.txt.font = e
        }),
        __getset(0, i, "color", function() {
            return this.txt.color
        }, function(e) {
            this.txt.color = e
        }),
        __getset(0, i, "fontSize", function() {
            return this.txt.fontSize
        }, function(e) {
            this.txt.fontSize = e
        }),
        __getset(0, i, "bold", function() {
            return this.txt.bold
        }, function(e) {
            this.txt.bold = e
        }),
        __getset(0, i, "italic", function() {
            return this.txt.italic
        }, function(e) {
            this.txt.italic = e
        }),
        __getset(0, i, "align", function() {
            return this.txt.align
        }, function(e) {
            this.txt.align = e
        }),
        __getset(0, i, "valign", function() {
            return this.txt.valign
        }, function(e) {
            this.txt.align = this.valign
        }),
        __getset(0, i, "leading", function() {
            return this.txt.leading
        }, function(e) {
            this.txt.leading = e
        }),
        __getset(0, i, "stroke", function() {
            return this.txt.stroke
        }, function(e) {
            this.txt.stroke = e
        }),
        __getset(0, i, "strokeColor", function() {
            return this.txt.strokeColor
        }, function(e) {
            this.txt.strokeColor = e
        }),
        __getset(0, i, "offset", function() {
            return this.txt.y
        }, function(e) {
            this.txt.y = e,
            this.txt.mask.y = -e,
            BwRender.needUpdate = !0
        }),
        t
    }(BwSprite)
      , BwCreateRoleUI = function(e) {
        function t() {
            this.conBox = null,
            this.roleBG = null,
            this.enterGameBtn = null,
            this.newTipView = null,
            this.notEnterTipView = null,
            this.focusImg = null,
            this.jobb1_4 = null,
            this.jobb3 = null,
            this.jobb2 = null,
            this.jobb1 = null,
            this.job1_4 = null,
            this.job3 = null,
            this.job2 = null,
            this.job1 = null,
            this.sexBtn = null,
            this.nameBox = null,
            this.randomNameBtn = null,
            this.randomName = null,
            this.returnBtn = null,
            this.errorClue = null,
            this.unLockCon = null,
            t.__super.call(this)
        }
        return __class(t, "bootWeb.BwCreateRoleUI", BwView),
        t.uiView = {
            type: "BaseBox",
            props: {
                width: 768,
                height: 1024
            },
            child: [{
                type: "Image",
                props: {
                    y: -150,
                    x: -270,
                    width: 1280,
                    skin: "t5_createrole/createrole_black.png",
                    height: 1600
                }
            }, {
                type: "Image",
                props: {
                    y: 0,
                    x: 0,
                    width: 768,
                    skin: "res/unpack/t5_createrole/createrole_bg.jpg",
                    height: 1024
                }
            }, {
                type: "Box",
                props: {
                    y: 0,
                    width: 576,
                    var: "conBox",
                    height: 1024,
                    centerX: 0
                },
                child: [{
                    type: "Image",
                    props: {
                        y: 104,
                        width: 466,
                        var: "roleBG",
                        skin: "res/unpack/t5_createrole/createrole_0005.png",
                        height: 752,
                        centerX: -15
                    }
                }, {
                    type: "Button",
                    props: {
                        width: 230,
                        var: "enterGameBtn",
                        stateNum: 1,
                        skin: "t5_createrole/createrole_0018.png",
                        height: 78,
                        centerX: 0,
                        bottom: 92
                    }
                }, {
                    type: "Image",
                    props: {
                        y: 4,
                        width: 68,
                        skin: "t5_createrole/createrole_0002.png",
                        left: 0,
                        height: 119
                    }
                }, {
                    type: "Image",
                    props: {
                        y: 639,
                        width: 450,
                        var: "newTipView",
                        height: 119,
                        centerX: 8
                    }
                }, {
                    type: "Image",
                    props: {
                        y: 868,
                        width: 470,
                        var: "notEnterTipView",
                        height: 29,
                        centerX: 0
                    }
                }, {
                    type: "Box",
                    props: {
                        y: 0,
                        width: 137,
                        right: 0,
                        height: 475
                    },
                    child: [{
                        type: "Image",
                        props: {
                            y: 0,
                            x: 0,
                            width: 84,
                            var: "focusImg",
                            skin: "t5_createrole/createrole_0026.png",
                            height: 172
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 391,
                            x: 20,
                            width: 110,
                            var: "jobb1_4",
                            skin: "t5_createrole/createrole_0045.png",
                            height: 110
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 271,
                            x: 20,
                            width: 110,
                            var: "jobb3",
                            skin: "t5_createrole/createrole_0025.png",
                            height: 110
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 151,
                            x: 20,
                            width: 110,
                            var: "jobb2",
                            skin: "t5_createrole/createrole_0024.png",
                            height: 110
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 31,
                            x: 20,
                            width: 110,
                            var: "jobb1",
                            skin: "t5_createrole/createrole_0023.png",
                            height: 110
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 402,
                            x: 31,
                            width: 88,
                            var: "job1_4",
                            skin: "t5_createrole/createrole_0044.png",
                            height: 88
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 282,
                            x: 31,
                            width: 88,
                            var: "job3",
                            skin: "t5_createrole/createrole_0022.png",
                            height: 88
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 162,
                            x: 31,
                            width: 88,
                            var: "job2",
                            skin: "t5_createrole/createrole_0021.png",
                            height: 88
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 42,
                            x: 31,
                            width: 88,
                            var: "job1",
                            skin: "t5_createrole/createrole_0020.png",
                            height: 88
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 528,
                            x: 42,
                            width: 67,
                            var: "sexBtn",
                            skin: "t5_createrole/createrole_0003.png",
                            height: 67
                        }
                    }, {
                        type: "Image",
                        props: {
                            y: 397,
                            x: -4,
                            skin: "t5_createrole/createrole_0049.png"
                        }
                    }]
                }, {
                    type: "Box",
                    props: {
                        y: 765,
                        width: 360,
                        var: "nameBox",
                        centerX: 40
                    },
                    child: [{
                        type: "Image",
                        props: {
                            y: 8,
                            width: 270,
                            skin: "t5_createrole/createrole_1003.png",
                            sizeGrid: "20,30,20,30",
                            height: 55
                        }
                    }, {
                        type: "Image",
                        props: {
                            x: 269,
                            width: 67,
                            var: "randomNameBtn",
                            skin: "t5_createrole/createrole_0013.png",
                            height: 67
                        }
                    }, {
                        type: "TextInput",
                        props: {
                            y: 3,
                            x: 49,
                            width: 176,
                            var: "randomName",
                            text: "角色名五字",
                            height: 62,
                            fontSize: 22,
                            font: "黑体",
                            color: "#F4F1D5",
                            align: "center"
                        }
                    }]
                }, {
                    type: "Image",
                    props: {
                        y: 920,
                        visible: !1,
                        var: "returnBtn",
                        skin: "t5_createrole/createrole_0001.png",
                        right: 20
                    }
                }, {
                    type: "HTMLDivElement",
                    props: {
                        y: 740,
                        x: 31,
                        width: 491,
                        var: "errorClue",
                        height: 35
                    }
                }, {
                    type: "Label",
                    props: {
                        y: 791,
                        x: 153,
                        width: 300,
                        visible: !1,
                        var: "unLockCon",
                        text: "VIP4可创建新角色",
                        fontSize: 24,
                        font: "黑体",
                        color: "#716f67",
                        centerX: 15,
                        align: "center"
                    }
                }]
            }]
        },
        t
    }()
      , BwLoadingViewUI = function(e) {
        function t() {
            this.bg = null,
            this.loadView1 = null,
            this.tipTxt2 = null,
            this.loadView2 = null,
            this.barView1 = null,
            this.bgBarView1 = null,
            this.barView2 = null,
            this.bgBarView2 = null,
            this.perTxt = null,
            this.loadTxt = null,
            this.tipTxt = null,
            this.zhizhiTxt = null,
            t.__super.call(this)
        }
        return __class(t, "bootWeb.BwLoadingViewUI", BwView),
        t.uiView = {
            type: "BaseBox",
            props: {
                width: 768,
                height: 1024
            },
            child: [{
                type: "Image",
                props: {
                    y: 0,
                    x: 0,
                    width: 768,
                    visible: !1,
                    var: "bg",
                    height: 1024
                }
            }, {
                type: "Box",
                props: {
                    y: 369,
                    x: 275,
                    visible: !1,
                    var: "loadView1"
                },
                child: [{
                    type: "Image",
                    props: {
                        y: 32,
                        x: 51,
                        width: 122,
                        skin: "t5_loading/loading_0001.png",
                        height: 122
                    }
                }, {
                    type: "Image",
                    props: {
                        y: -8,
                        x: 32,
                        width: 163,
                        skin: "t5_loading/loading_0003.png",
                        height: 171
                    }
                }, {
                    type: "Label",
                    props: {
                        y: 158,
                        width: 225,
                        var: "tipTxt2",
                        strokeColor: "",
                        stroke: 0,
                        height: 17,
                        fontSize: 18,
                        font: "黑体",
                        color: "#FFFFFF",
                        align: "center"
                    }
                }]
            }, {
                type: "Box",
                props: {
                    y: 752,
                    x: 104,
                    var: "loadView2"
                },
                child: [{
                    type: "Image",
                    props: {
                        y: 45,
                        width: 276,
                        skin: "t5_loading/loading_0019.png",
                        height: 45
                    }
                }, {
                    type: "Image",
                    props: {
                        y: 45,
                        x: 552,
                        width: 276,
                        skin: "t5_loading/loading_0019.png",
                        scaleX: -1,
                        height: 45
                    }
                }, {
                    type: "Image",
                    props: {
                        y: 52,
                        x: 24,
                        width: 509,
                        var: "barView1",
                        skin: "t5_loading/loading_0021.png",
                        height: 16
                    }
                }, {
                    type: "Image",
                    props: {
                        y: 45,
                        x: 24,
                        width: 36,
                        visible: !1,
                        var: "bgBarView1",
                        skin: "t5_loading/loading_0023.png",
                        height: 28
                    }
                }, {
                    type: "Image",
                    props: {
                        y: 73,
                        x: 24,
                        width: 509,
                        var: "barView2",
                        skin: "t5_loading/loading_0022.png",
                        height: 6
                    }
                }, {
                    type: "Image",
                    props: {
                        y: 70,
                        x: 24,
                        width: 27,
                        visible: !1,
                        var: "bgBarView2",
                        skin: "t5_loading/loading_0024.png",
                        height: 12
                    }
                }, {
                    type: "Label",
                    props: {
                        y: 52,
                        x: 184,
                        width: 187,
                        visible: !1,
                        var: "perTxt",
                        text: "80%",
                        strokeColor: "",
                        stroke: 0,
                        height: 13,
                        fontSize: 18,
                        font: "黑体",
                        color: "#FEFFFF",
                        align: "center"
                    }
                }, {
                    type: "Label",
                    props: {
                        y: 23,
                        x: 58,
                        width: 436,
                        text: "加载中",
                        strokeColor: "",
                        stroke: 0,
                        height: 19,
                        fontSize: 20,
                        font: "黑体",
                        color: "#FEFFFF",
                        align: "center"
                    }
                }, {
                    type: "Label",
                    props: {
                        y: 95,
                        x: 58,
                        width: 436,
                        var: "loadTxt",
                        strokeColor: "",
                        stroke: 0,
                        runtime: "HTMLDivElement",
                        height: 14,
                        fontSize: 16,
                        font: "黑体",
                        color: "#FEFFFF",
                        align: "center"
                    }
                }, {
                    type: "Label",
                    props: {
                        y: 115,
                        x: 58,
                        width: 436,
                        var: "tipTxt",
                        strokeColor: "",
                        stroke: 0,
                        runtime: "HTMLDivElement",
                        height: 13,
                        fontSize: 16,
                        font: "黑体",
                        color: "#FEFFFF",
                        align: "center"
                    }
                }, {
                    type: "Image",
                    props: {
                        x: 171,
                        width: 213,
                        skin: "t5_loading/loading_0020.png",
                        height: 60
                    }
                }]
            }, {
                type: "Label",
                props: {
                    y: 912,
                    x: 59,
                    width: 657,
                    var: "zhizhiTxt",
                    strokeColor: "",
                    stroke: 0,
                    runtime: "HTMLDivElement",
                    height: 97,
                    fontSize: 16,
                    font: "黑体",
                    color: "#FEFFFF",
                    align: "center"
                }
            }]
        },
        t
    }()
      , BwServerItem = function(e) {
        function t() {
            this.ServerStateImg = {
                2: "img/icon2.png",
                3: "img/icon3.png",
                4: "img/icon4.png",
                5: "img/icon5.png"
            },
            this.icon = null,
            this.text = null,
            this.textIcon = null,
            t.__super.call(this),
            this.icon = new BwSprite,
            this.icon.x = 30,
            this.icon.y = 19,
            this.icon.resource = BwVerMgr.getPath("img/icon2.png"),
            this.addChild(this.icon),
            this.textIcon = new BwSprite,
            this.textIcon.x = this.width - 40,
            this.textIcon.y = 19,
            this.textIcon.resource = BwVerMgr.getPath("img/img_new.png"),
            this.addChild(this.textIcon),
            this.text = new BwText,
            this.text.x = 59,
            this.text.y = 20,
            this.text.width = this.width - 55,
            this.text.height = 20,
            this.text.align = "left",
            this.text.valign = "middle",
            this.text.fontSize = 22,
            this.text.font = "黑体",
            this.text.color = 11969913,
            this.addChild(this.text),
            this.resource = BwVerMgr.getPath("img/server_up.png"),
            this.grid = "20,20,20,20"
        }
        __class(t, "bootWeb.BwServerItem", e);
        var i = t.prototype;
        return __getset(0, i, "width", function() {
            return 287
        }, function(e) {}),
        __getset(0, i, "height", function() {
            return 61
        }, function(e) {}),
        __getset(0, i, "data", e.prototype._$get_data, function(e) {
            this._data = e,
            this.text.html = e ? e.name : "";
            var t = BwServerState.getRealState(e);
            1 == t ? this.icon.visible = !1 : (this.icon.visible = !0,
            this.icon.resource = BwVerMgr.getPath(this.ServerStateImg[t])),
            this.textIcon.visible = 3 == t
        }),
        t
    }(BwListItem)
      , BwZoneItem = function(e) {
        function t() {
            this.text = null,
            t.__super.call(this),
            this.text = new BwText,
            this.text.width = this.width,
            this.text.height = this.height,
            this.text.align = "center",
            this.text.valign = "middle",
            this.text.fontSize = 22,
            this.text.font = "黑体",
            this.addChild(this.text),
            this.selected = !1
        }
        __class(t, "bootWeb.BwZoneItem", e);
        var i = t.prototype;
        return __getset(0, i, "width", function() {
            return this._selected ? 181 : 156
        }, function(e) {}),
        __getset(0, i, "height", function() {
            return 66
        }, function(e) {}),
        __getset(0, i, "data", e.prototype._$get_data, function(e) {
            this._data = e,
            this.text.html = e
        }),
        __getset(0, i, "selected", e.prototype._$get_selected, function(e) {
            this._selected = e,
            this.text.color = e ? 16777215 : 9340792;
            var t = BwVerMgr.getPath(e ? "img/zone_selected.png" : "img/zone_bg.png");
            this.resource != t && (this.resource = t)
        }),
        t
    }(BwListItem)
      , BwCreateRolePanel = function(e) {
        function d() {
            this.selectedJob = 1,
            this.selectedSex = 1,
            this.selectBtns = null,
            this.selectBtnBtns = null,
            this.isUseNickname = !0,
            this.isNamed = !1,
            d.__super.call(this),
            this.loadDisplay("res/t5_createrole.json")
        }
        __class(d, "bootWeb.BwCreateRolePanel", BwCreateRoleUI);
        var t = d.prototype;
        return t.onLoaded = function() {
            bootWeb.ui.BwView.prototype.onLoaded.call(this),
            this.createView(BwCreateRoleUI.uiView),
            this.initUI(),
            BootWeb.removeBackground(),
            BootWeb.playMusic("img/sound/createRoleBg.mp3")
        }
        ,
        t.initUI = function() {
            if (this.uiloaded) {
                var e;
                for (var t in this.randomName.editable = !0,
                this.randomName.valign = "middle",
                this.errorClue.fontSize = 24,
                this.errorClue.font = "黑体",
                this.errorClue.align = "left",
                this.errorClue.color = 16711680,
                this.errorClue.stroke = !0,
                this.errorClue.strokeColor = 1971466,
                this.selectBtns = [],
                this.selectBtns.push({
                    btn: this.job1,
                    btnb: this.jobb1,
                    job: 1,
                    roleBg: ["createrole_0005.png", "createrole_0006.png"]
                }),
                this.selectBtns.push({
                    btn: this.job2,
                    btnb: this.jobb2,
                    job: 2,
                    roleBg: ["createrole_0007.png", "createrole_0008.png"]
                }),
                this.selectBtns.push({
                    btn: this.job3,
                    btnb: this.jobb3,
                    job: 3,
                    roleBg: ["createrole_0009.png", "createrole_0010.png"]
                }),
                this.selectBtns.push({
                    btn: this.job1_4,
                    btnb: this.jobb1_4,
                    job: 4,
                    roleBg: ["createrole_0048.png", "createrole_0048.png"]
                }),
                this.selectBtnBtns = [],
                this.selectBtns)
                    e = this.selectBtns[t],
                    this.selectBtnBtns.push(e.btn);
                var i = new BwText;
                i.width = 320,
                i.align = "center",
                i.x = (this.width - i.width) / 2,
                i.y = this.height - 30,
                i.color = 8552311,
                i.bold = !0,
                i.fontSize = 18,
                i.text = "Powered By LayaAir Engine",
                this.addChild(i),
                this.notEnterTipView.skin = this.convertUrl("t5_createrole/createrole_0047.png"),
                this.newTipView.skin = this.convertUrl("t5_createrole/createrole_0046.png"),
                this.addList(),
                this.selectedJob = this.getRandomJob(),
                this.selectedSex = this.getRondomSex(),
                this.showSelectView(this.selectedJob, this.selectedSex),
                this.nameBtnUpdate()
            }
        }
        ,
        t.removeSelf = function() {
            this.removeList(),
            this.destroyArr.length = 0
        }
        ,
        t.getRandomJob = function() {
            return Math.floor(3 * Math.random() + 1)
        }
        ,
        t.getRondomSex = function() {
            return Math.floor(2 * Math.random() + 1)
        }
        ,
        t.addList = function() {
            for (var e = 0; e < this.selectBtns.length; e++)
                this.selectBtns[e].btn.on(BwEvent.CLICK, this, this.clickSelectHandler);
            this.sexBtn.on(BwEvent.CLICK, this, this.clickSexBtn),
            this.randomNameBtn.on(BwEvent.CLICK, this, this.onClkRandomName),
            this.enterGameBtn.on(BwEvent.CLICK, this, this.clickEnterGameBtnHandler)
        }
        ,
        t.removeList = function() {
            for (var e = 0; e < this.selectBtns.length; e++)
                this.selectBtns[e].btn.off(BwEvent.CLICK, this, this.clickSelectHandler);
            this.sexBtn.off(BwEvent.CLICK, this, this.clickSexBtn),
            this.enterGameBtn && this.enterGameBtn.off(BwEvent.CLICK, this, this.clickEnterGameBtnHandler),
            this.randomNameBtn && this.randomNameBtn.off(BwEvent.CLICK, this, this.onClkRandomName)
        }
        ,
        t.clickSelectHandler = function(e) {
            var t = this.selectBtns[this.selectBtnBtns.indexOf(e.currentTarget)];
            this.selectedJob = t.job,
            this.showSelectView(this.selectedJob, this.selectedSex)
        }
        ,
        t.clickSexBtn = function(e) {
            this.selectedSex = 1 == this.selectedSex ? 2 : 1,
            this.showSelectView(this.selectedJob, this.selectedSex, !1)
        }
        ,
        t.showSelectView = function(e, t, i) {
            var n, o;
            void 0 === i && (i = !0);
            for (var r = "", s = 0; s < this.selectBtns.length; s++)
                (o = this.selectBtns[s]).job == e ? (o.btnb.visible = !0,
                o.btn.visible = !1,
                r = (n = o).roleBg[t - 1]) : (o.btnb.visible = !1,
                o.btn.visible = !0);
            if (this.roleBG.skin = this.convertUrl("res/unpack/t5_createrole/" + r),
            this.sexBtn.skin = this.convertUrl(1 == this.selectedSex ? "t5_createrole/createrole_0004.png" : "t5_createrole/createrole_0003.png"),
            this.sexBtn.visible = 4 != e,
            this.newTipView.visible = this.notEnterTipView.visible = 4 == e,
            4 != e) {
                this.roleBG.width = 466,
                this.roleBG.height = 752,
                this.roleBG.y = 104,
                this.roleBG.centerX = -15;
                var a = BwTween.get(this.sexBtn);
                this.sexBtn.x = 109,
                this.sexBtn.scaleX = -1,
                a.to({
                    x: 42,
                    scaleX: 1,
                    duration: 130
                }),
                this.nameBox.visible = !0
            } else
                this.roleBG.width = 698,
                this.roleBG.height = 769,
                this.roleBG.y = 71,
                this.roleBG.centerX = -40,
                this.nameBox.visible = !1;
            var l = n.btnb
              , h = n.btn;
            if (l.width = h.width,
            l.height = h.height,
            l.x = h.x,
            l.y = h.y,
            BwTween.get(l).to({
                x: h.x - 11,
                y: h.y - 11,
                width: 110,
                height: 110,
                duration: 150,
                ease: d.backOut
            }),
            i) {
                this.focusImg.y = h.y - 42,
                this.focusImg.x = 10;
                var c = BwTween.get(this.focusImg);
                this.focusImg.alpha = 0,
                c.wait(100),
                c.to({
                    alpha: 1
                }),
                c.to({
                    x: 0,
                    duration: 50
                })
            }
            this.enterGameBtn.visible = 4 != e
        }
        ,
        t.onClkRandomName = function() {
            this.nameBtnUpdate()
        }
        ,
        t.nameBtnUpdate = function() {
            this.randomName && ("" != Gb.nickname && null != Gb.nickname || (this.isUseNickname = !1),
            this.isUseNickname ? this.randomName.text = Gb.nickname : this.randomName.text = LcRandomName.getRandomName(!1, 1 == this.selectedSex))
        }
        ,
        t.clickEnterGameBtnHandler = function(e) {
            var o = this
              , t = BootWeb.selectedServer
              , r = this;
            if (d.reportServerSelected(t.serverId, t.name),
            this.isUseNickname = !1,
            BwClickStream.send("3003"),
            5 < this.randomName.text.length)
                return this.errorClue.text = LcI18n.v(2101711),
                this.errorClue.x = (this.conBox.width - this.errorClue.textWidth) / 2,
                void (this.errorClue.visible = !0);
            var s = e.currentTarget;
            if (Gb.debugMode) {
                BwLoadingView.startFakeLoading(),
                BwMainView.mainView.visible = !0,
                BwMainView.mainView.alpha = 0;
                var i = BwTween.get(BwMainView.mainView);
                i.to({
                    alpha: 1,
                    duration: 300
                }),
                (i = BwTween.get(r)).to({
                    alpha: 0,
                    duration: 300
                }),
                i.call(function() {
                    BwStage.ins.removeChild(r),
                    Gb.loadListFinished && (bootWeb.BwCreateRolePanel.job = o.selectedJob,
                    bootWeb.BwCreateRolePanel.roleName = o.randomName.text,
                    bootWeb.BwCreateRolePanel.sex = o.selectedSex,
                    BootWeb.enterGame())
                }, null, null)
            } else {
                var a;
                a = Gb.roleRepeatUrl.replace(/\$1/g, encodeURI(this.randomName.text)).replace(/\$2/g, t.serverId),
                a += "&v=" + (new Date).getTime(),
                BwClickStream.send("3004"),
                BwUtil.load(a, function(e) {
                    if (BwClickStream.send("3005"),
                    BwLog.log(a + "\n" + e),
                    !e)
                        return alert("加载错误:" + a),
                        void BwUtil.sendError("加载错误:" + a);
                    if (Gv.loginDataFromJG.push(a + "\n" + e),
                    1 != parseInt(e)) {
                        var t = [];
                        t[0] = LcI18n.v(20003),
                        t[4] = LcI18n.v(2101712),
                        t[5] = LcI18n.v(2101711),
                        t[6] = LcI18n.v(2101713),
                        t[12] = LcI18n.v(2101714);
                        var i = parseInt(e);
                        return o.errorClue.text = t[i] ? t[i] : LcI18n.v(2101715),
                        o.errorClue.x = (o.conBox.width - o.errorClue.textWidth) / 2,
                        void (o.errorClue.visible = !0)
                    }
                    s.off(BwEvent.CLICK, null, o.clickEnterGameBtnHandler),
                    bootWeb.BwCreateRolePanel.job = o.selectedJob,
                    bootWeb.BwCreateRolePanel.roleName = o.randomName.text,
                    bootWeb.BwCreateRolePanel.sex = o.selectedSex,
                    BwMainView.mainView.visible = !0,
                    BwMainView.mainView.alpha = 0,
                    BwLoadingView.startFakeLoading();
                    var n = BwTween.get(BwMainView.mainView);
                    n.to({
                        alpha: 1,
                        duration: 300
                    }),
                    (n = BwTween.get(r)).to({
                        alpha: 0,
                        duration: 300
                    }),
                    n.call(function() {
                        BwStage.ins.removeChild(r),
                        Gb.loadListFinished && (bootWeb.BwCreateRolePanel.job = o.selectedJob,
                        bootWeb.BwCreateRolePanel.roleName = o.randomName.text,
                        bootWeb.BwCreateRolePanel.sex = o.selectedSex,
                        BwClickStream.send("3006"),
                        BootWeb.enterGame())
                    }, null, null)
                })
            }
        }
        ,
        t.onResize = function() {
            if (BwMainView.mainView) {
                var e = BwRender.canvas.width / BwStage.ins.scaleX;
                e = Math.min(Gb.uiDesignWidth, e),
                this.errorClue && (this.errorClue.x = (this.conBox.width - this.errorClue.textWidth) / 2),
                this.conBox && (this.conBox.width = e)
            }
        }
        ,
        d.backOut = function(e, t, i, n, o) {
            return void 0 === o && (o = 2),
            i * ((e = e / n - 1) * e * ((o + 1) * e + o) + 1) + t
        }
        ,
        d.reportServerSelected = function(e, t) {
            Gb.isTw && Gv.sqBridge && Gv.sqBridge.enterGame({
                serverId: e,
                serverName: t
            })
        }
        ,
        d.SHADOW_WARRIOR_JOB = 4,
        d.job = 0,
        d.roleName = null,
        d.sex = 0,
        d
    }()
      , BwLoadingView = function(e) {
        function a() {
            this.helpIntervalId = 0,
            this.helpIndex = -1,
            this.barMask1 = null,
            this.barMask2 = null,
            this.barViewW1 = 509,
            this.barViewW2 = 509,
            this.bar1offset = 30,
            this.bar2offset = 23,
            this.loadingStr = null,
            a.__super.call(this),
            this.loadDisplay(null)
        }
        __class(a, "bootWeb.BwLoadingView", BwLoadingViewUI);
        var t = a.prototype;
        return t.onLoaded = function() {
            bootWeb.ui.BwView.prototype.onLoaded.call(this),
            this.createView(BwLoadingViewUI.uiView),
            Gb.isDBTiShen ? (this.loadView2.visible = !1,
            this.loadView1.visible = !0,
            this.tipTxt2.text = "正在进入游戏...") : (this.loadView1.visible = !1,
            this.loadView2.visible = !0),
            this.initUI()
        }
        ,
        t.initUI = function() {
            var t = this;
            this.loadTxt.html = Gb.isNewRole ? LcI18n.v(2101727) : LcI18n.v(2101728),
            this.tipTxt.html = LcI18n.v(2101730),
            this.barMask1 = BwRect.create(0, 0, this.barViewW1, this.barView1.height + 60),
            this.barMask2 = BwRect.create(0, 0, this.barViewW2, this.barView2.height + 60),
            this.barMask1.y = -30,
            this.barMask2.y = -30,
            this.barView1.mask = this.barMask1,
            this.barView2.mask = this.barMask2,
            this.barMask1.w = 1,
            this.barMask2.w = 1,
            this.bgBarView1.visible = !0,
            this.bgBarView2.visible = !0,
            this.bar1offset = this.barView1.x - 30,
            this.bar2offset = this.barView2.x - 23,
            this.helpIntervalId = Js.setInterval(function() {
                var e = a.helpHtmls.concat();
                -1 != t.helpIndex && e.splice(t.helpIndex, 1),
                t.helpIndex = Math.random() * e.length >> 0,
                t.loadTxt.html = e[t.helpIndex]
            }, 3e3),
            Gb.isNewRole || this.startFakeLoading()
        }
        ,
        t.onGoldClick = function(e) {
            var t = e.currentTarget;
            BwTween.removeTweens(t);
            var i = BwTween.get(t);
            this.barMask1.w / this.barViewW1 < .8 ? (i.to({
                x: t.x - 2
            }).to({
                x: t.x
            }).to({
                x: t.x + 2
            }).to({
                x: t.x
            }),
            i.to({
                x: t.x - 2
            }).to({
                x: t.x
            }).to({
                x: t.x + 2
            }).to({
                x: t.x
            }),
            i.to({
                x: t.x - 2
            }).to({
                x: t.x
            }).to({
                x: t.x + 2
            }).to({
                x: t.x
            }),
            i.to({
                x: t.x - 2
            }).to({
                x: t.x
            }).to({
                x: t.x + 2
            }).to({
                x: t.x
            })) : (i.to({
                scaleX: 0,
                x: t.x + t.width / 2,
                duration: 200
            }),
            i.to({
                scaleX: 1,
                x: t.x,
                duration: 180
            }),
            i.to({
                scaleX: 0,
                x: t.x + t.width / 2,
                duration: 120
            }),
            i.to({
                scaleX: 1,
                x: t.x,
                duration: 80
            }),
            i.to({
                scaleX: 0,
                x: t.x + t.width / 2,
                duration: 120
            }),
            i.to({
                scaleX: 1,
                x: t.x,
                duration: 80
            }),
            i.to({
                scaleX: 0,
                x: t.x + t.width / 2,
                duration: 120
            }),
            i.to({
                scaleX: 1,
                x: t.x,
                duration: 80
            }),
            i.to({
                scaleX: 0,
                x: t.x + t.width / 2,
                duration: 120
            }),
            i.to({
                scaleX: 1,
                x: t.x,
                alpha: .5,
                duration: 80
            }),
            i.to({
                scaleX: 0,
                x: t.x + t.width / 2,
                alpha: 0,
                duration: 50
            }))
        }
        ,
        t.startFakeLoading = function() {
            if (this.uiloaded && this.barView1.resource) {
                if (BwStage.ins) {
                    BwTween.removeTweens(this.barMask1),
                    BwTween.removeTweens(this.bgBarView1);
                    var e = [.5, .7, .9, .95, .99]
                      , t = [8e3, 9e3, 8e3, 1e4, 2e4]
                      , i = BwTween.get(this.barMask1)
                      , n = BwTween.get(this.bgBarView1);
                    this.bgBarView1.x = this.bar1offset;
                    for (var o = 0, r = e.length; o < r; o++)
                        i.to({
                            w: this.barViewW1 * e[o],
                            duration: t[o]
                        }),
                        n.to({
                            x: this.barViewW1 * e[o] + this.bar1offset,
                            duration: t[o]
                        });
                    BwStage.ins.on(BwEvent.ENTER_FRAME, this, this.onFakeLoading)
                }
            } else
                this.barView1 && this.barView1.on(BwEvent.COMPLETE, null, this.startFakeLoading)
        }
        ,
        t.onFakeLoading = function(e) {
            this.uiloaded && this.showLoading(this.barMask1.w, this.barViewW1, null)
        }
        ,
        t.endFakeLoading = function() {
            (a.isEnd = !0,
            this.uiloaded) && (BwTween.removeTweens(this.barMask1),
            BwTween.removeTweens(this.bgBarView1),
            this.barMask1.w != this.barViewW1 && (BwTween.get(this.barMask1).to({
                w: this.barViewW1,
                duration: 200
            }),
            BwTween.get(this.bgBarView1).to({
                x: this.barViewW1 + this.bar1offset,
                duration: 200
            })),
            BwTween.removeTweens(this.bgBarView2),
            BwTween.removeTweens(this.barView2),
            this.barMask2.w != this.barViewW2 && (BwTween.get(this.barMask2).to({
                w: this.barViewW2,
                duration: 200
            }),
            BwTween.get(this.bgBarView2).to({
                x: this.barViewW2 + this.bar2offset,
                duration: 200
            })))
        }
        ,
        t.showLoadingProgress = function(e, t, i) {
            var n = a.loadingHelp.split("#help").join(i);
            this.barView1 && this.barView1.resource ? this.showLoading(this.barMask1.w, this.barViewW1, n) : this.showLoading(0, 1, n)
        }
        ,
        t.showLoading = function(e, t, i) {
            if (i && (this.loadingStr = i),
            this.loadingStr || (this.loadingStr = a.loadingHelp),
            this.barView1 && this.barView1.resource) {
                var n = 100 * this.barMask1.w / this.barViewW1 >> 0;
                if (this.tipTxt.html = this.loadingStr.split("#1").join(this.barMask1.w).split("#2").join(this.barViewW1).split("#3").join(n).split("#help").join(""),
                this.barView2 && this.barView2.resource)
                    for (var o = [0, 5, 10, 50, 60, 70, 80, 90, 100], r = 0; r < o.length; r++)
                        if ((n = 100 * this.barMask1.w / this.barViewW1) <= 0 && (n = 1),
                        o[r] <= n && n < o[r + 1]) {
                            this.barMask2.w = this.barViewW2 * (n - o[r]) / (o[r + 1] - o[r]),
                            this.bgBarView2.x = this.barMask2.w + this.bar2offset;
                            break
                        }
                var s = LcI18n.v(2101719);
                !a.isEnd && 90 <= n && this.loadTxt.html != s && (Js.clearInterval(this.helpIntervalId),
                this.loadTxt.html = s,
                this.loadTxt.once(BwEvent.CLICK, null, function(e) {
                    BwStage.ins.offAll(),
                    BwUtil.refresh()
                }))
            }
        }
        ,
        t.clear = function() {
            Js.clearInterval(this.helpIntervalId),
            this.helpIntervalId = 0,
            this.loadTxt && (this.loadTxt.text = null,
            this.loadTxt.html = null,
            this.tipTxt.html = null,
            this.tipTxt2.html = null),
            a.loadingHelp = null,
            a.loadingHelpFormat = null,
            a.helpHtmls = null,
            this.loadingStr = null
        }
        ,
        __getset(1, a, "inst", function() {
            return a._inst || (a._inst = new a),
            a._inst
        }, bootWeb.BwLoadingViewUI._$SET_inst),
        a.create = function() {
            BwMainView.mainView.addChild(a.inst)
        }
        ,
        a.startFakeLoading = function() {
            a.inst && a.inst.startFakeLoading()
        }
        ,
        a.endFakeLoading = function() {
            a.isEnd = !0,
            a.inst && a.inst.endFakeLoading()
        }
        ,
        a.showLoadingProgress = function(e, t, i) {
            a.inst && a.inst.showLoadingProgress(e, t, i)
        }
        ,
        a.showLoading = function(e, t, i) {
            a.inst && a.inst.showLoading(e, t, i)
        }
        ,
        a.showLoadTxt = function(e) {
            a.inst && a.inst.uiloaded && (a.inst.loadTxt.text = e)
        }
        ,
        a.clear = function() {
            a.inst && a.inst.clear()
        }
        ,
        a._inst = null,
        a.isEnd = !1,
        a.loadingHelpFormat = "[#3%]",
        __static(a, ["loadingHelp", function() {
            return this.loadingHelp = LcI18n.v(2101745, [a.loadingHelpFormat])
        }
        , "helpHtmls", function() {
            return this.helpHtmls = [LcI18n.v(2101720), LcI18n.v(2101721), LcI18n.v(2101722), LcI18n.v(2101723), LcI18n.v(2101724), LcI18n.v(2101725), LcI18n.v(2101726)]
        }
        ]),
        a
    }()
}(window, document, Laya),
"function" == typeof define && define.amd && define("laya.core", ["require", "exports"], function(e, t) {
    "use strict";
    for (var i in Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    Laya) {
        var n = Laya[i];
        n && n.__isclass && (t[i] = n)
    }
});
