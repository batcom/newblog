var messageTable = {}

sendMsgFlag = 0;
recvMsgFlag = 0;
/* ToolKit 时间格式函数说明
1587981094 秒数 下面有的函数需要变为好毫秒
ToolKit.timeFormat3(1587981094*1e3)=>"17时51分34秒0毫秒"
ToolKit.timeFormat4(1587981094*1e3)=>"4月27日17时51分"
ToolKit.timeFormat4(1587981094*1e3,2)=>"4月27日17:51"
ToolKit.timeFormat6(1587981094*1e3)=>"17:51:34"
ToolKit.timeFormat2(1587981094*1e3)=>"2020年4月27日17时51分"
ToolKit.timeFormat2(1587981094*1e3,2)=>"2020年4月27日 17:51"
ToolKit.timeFormat2(1587981094*1e3,3)=>"17:51"
ToolKit.timeFormat2(1587981094*1e3,4)=>"2020年4月27日"
ToolKit.timeFormat2(1587981094*1e3,5)=>"17:51:34"
ToolKit.timeFormat2(1587981094*1e3,6)=>"2020-4-27"
ToolKit.timeFormat2(1587981094*1e3,7)=>"17:51"


ToolKit.
*/
// 这是一个非公平锁

Lock = function () {

}
Lock.prototype = {
    isLock: false,
    lock: function () {
        if (this.isLock) {
            const self = this;
            // 循环while死循环，不停测试isLock是否等于false
            return new Promise((resolve) => {
                (function recursion() {
                    if (!self.isLock) {
                        // 占用锁
                        self.isLock = true;
                        // 使外部await语句继续往下执行
                        resolve();
                        return;
                    }
                    setTimeout(recursion, 100);
                })();
            });
        } else {
            this.isLock = true;
            return Promise.resolve();
        }
    },
    unLock() {
        this.isLock = false;
    }

}
tasklock = new Lock()

//通用观察者
var observer = {
    //订阅
    addSubscriber: function (callback) {
        this.subscribers[this.subscribers.length] = callback;
    },
    //退订
    removeSubscriber: function (callback) {
        for (var i = 0; i < this.subscribers.length; i++) {
            if (this.subscribers[i] === callback) {
                delete(this.subscribers[i]);
            }
        }
    },
    //发布
    publish: function (what) {
        for (var i = 0; i < this.subscribers.length; i++) {
            if (typeof this.subscribers[i] === 'function') {
                this.subscribers[i](what);
            }
        }
    },
    // 将对象o具有观察者功能
    make: function (o) {
        for (var i in this) {
            o[i] = this[i];
            o.subscribers = [];
        }
    }
};

// 异步事件流控制
Condition = function (taskName, ms) {
    if (ms) {
        this.interval = ms
    } else {
        this.interval = 1e3 //默认1秒
    }
    this.condition = false;
    this.taskName = taskName
    return this;
}

Condition.prototype.setTask = function (task) {
    if (typeof task !== 'undefined') {
        console.log("task 必须是function")
        return false
    }
    this.task = task;
}
Condition.prototype.setCondition = function (condition) {
    this.condition = condition;
}

Condition.prototype.waitFor = function () {
    var _that = this
    return new Promise(resolve => {
        var timerId = setInterval(() => {
            if (_that.condition) {
                console.log("任务%s到达要求,结束", _that.taskName)
                clearInterval(timerId)
                resolve()
            } else {
                if (typeof _that.task === 'function') {
                    _that.task()
                } else {
                    // console.log("任务%s正在执行中...", _that.taskName)
                }
            }
        }, this.interval);
    })
}

Condition.prototype.notify = function () {
    this.condition = true;
}

// 创建打斗观察者,用于系统在打Boss时，处理不同的消息响应
msgObserver = {
    sendMsg: function (msg) {
        this.publish(msg)
    }
}
observer.make(msgObserver)

sendMsgObserver = {
    sendMsg: function (msg) {
        this.publish(msg)
    }
}
observer.make(sendMsgObserver)

bossDeadObserver = {
    sendMsg: function (msg) {
        this.publish(msg)
    }
}
observer.make(bossDeadObserver)


GameTimer = function (task, interval = 1e3) {
    this.task = task
    this.interval = interval
}

GameTimer.prototype.start = function () {
    if (typeof this.task === 'function') {
        this.timerId = setInterval(() => {
            this.task()
        }, this.interval);
    }

}
GameTimer.prototype.stop = function () {
    clearInterval(this.timerId);
}

fighterAI = function (name, info) {
    this.info = info
    this.msgList = {}
    this.name = name
    this.conditionObj = new Condition(this.name)
}

fighterAI.prototype.setName = function (name) {
    this.name = name;
}

fighterAI.prototype.bind = function (msgId, callback) {
    this.msgList[msgId] = callback
}
fighterAI.prototype.fight = (async function () {
    var _that = this
    this._listener = function (msg) {
        var msgId = msg.id,
            msgData = msg.data
        if (_that.msgList && msgId in _that.msgList) {
            // console.log("战斗机器人受到消息",msg)
            _that.msgList[msgId](msgData)
        }
    };
    msgObserver.addSubscriber(this._listener)
})
fighterAI.prototype.notify = function () {
    // this.conditionObj.notify()
    msgObserver.removeSubscriber(this._listener)
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function random(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
filterDebugRecvMsgTable = [
    -1606, -1166, -1346,
    -1412,
    -1402,
    -1206,
    -1208,
    -1006, -9050, -9034, -9035,
    -1204, -3302,
    -1289, //经验副本接受打怪数目killnum
    -1113, // 获取经验
    -2203, // 聊天消息
    -8230, // npc刷新
    -6043, // bossHp更新
    -1137, // hpMap更新
    -1271, -1037, -27166, //更新什么血脉超级Boss位置暂且用不到
]
// 这里面的消息客户端界面不会响应
filterRecvMsgTable = [-8017]
// 这里存放任务还没有开始前，需要初始化的一些操作initMsgCallback即是收到这些消息后的处理事件
initRecvMsgTable = [-1701, -1913]

function initMsgCallback(msgId, data) {
    switch (msgId) {
        case -1701: //邮件列表
            //设置矿洞和镖车为已经阅读，然后调用批量删除
            console.log("邮件过滤:", data)
            // if (!data.hasOwnProperty('mails')) break;
            var list = data.mails
            for (var i in list) {
                l = list[i]
                // if (l.isRead === false && (l.logReasonId === 14786 || l.logReasonId === 14776)) {
                // MailControl.getInstance().reqReadMail(l.id)
                // MailControl.getInstance().reqTidyMail(2) //批量删除
                // }
            }
            break;
        case -1913: //接受消息自动弹出框
            var openType = data.openType
            var items = data.items
            if (openType === 10 && items[0] && items[1]) {
                if (items[0].onlyId && items[0].onlyId.toNumber() === 2349879048 &&
                    items[1].onlyId && items[1].onlyId.toNumber() === 2349879047) {
                    // OpenBoxWinControl.getInstance().close()
                    return false
                }
            }
            default:

                break;
    }
    return true;
}

filterSendMsgTable = [
        -1205, //野外地图打怪经验增加消息
        -1207, //野外地图打怪自动捡东西消息
        -1260, //
        -1005, //心跳检测
        -1270, //自动寻路
        -1804, -1349,
        -27005, //龙城自动寻路
    ], noSendMsgTable = [

    ],
    recvMsgFinishFlagTable = {

    }



//有用的消息id存储表结合messageTable使用存储服务器消息响应来编码
HookRecvMsgTable = [
    -1572, -31533, -31536, -1281, -8205, -8932, -7804, -7809, -8503, -3524, -31531, -31441, -1236, -9164, -9176,
    -8211, -1902, -6031, -9036, -5072, -6041, -6042, -6031, -6040, -8226, -10833
]
HookSendMsgTable = [
    -1270, -27005
]
sendMessageTable = {}

function HookSendMsg(t, e) {
    sendMsgObserver.sendMsg({
        "id": e,
        "msg": t
    });
    // !filterSendMsgTable.includes(e) && console.log("发送消息", t, e, "===================")
    if (HookSendMsgTable.includes(e)) {
        sendMessageTable[e] = t
    }
    // 所有系统发送的消息都需要经过这里，而脚本主动发送的消息不会经过这里

    // 不想要发送的消息，可以在这里return false
    // if(noSendMsgTable.includes(e)) return false
    return true
}

function HookRecvMsg(t, i, s) {
    msgObserver.sendMsg({
        "id": t,
        "data": i
    });
    // !filterDebugRecvMsgTable.includes(t) && console.log("接受消息", t, i, recvMsgFlag + "===================")
    if (filterRecvMsgTable.includes(t)) {
        return false
    }
    if (HookRecvMsgTable.includes(t)) {
        messageTable[t] = i
    }
    if (initRecvMsgTable.includes(t)) {
        return initMsgCallback(t, i)
    }
    return true
}



function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


// 每半小时领取每日奖励，直到元宝
async function getPointTask() {
    // 领取扫荡后的活跃度
    setInterval(() => {
        for (var i in taskList) {
            var task = taskList[i]
            if (task.isOpen === true && task.canGet === true) {
                DayTaskControl.getInstance().reqGetActiveEventReward(task.id)
            }
        }
        var taskArr = TaskModel.getInstance().initTaskData.finishPointIds
        var finishPoint = TaskModel.getInstance().initTaskData.finishPoint
        var finishPointRewIdList = TaskModel.getInstance().initTaskData.finishPointRewIdList
        var idx = TaskModel.getInstance().whichIdx(TaskModel.getInstance().whichPosition(finishPoint))
        for (var i in taskArr) { //s:[23,24,25,26,27,28]
            if (i > idx) break;
            !finishPointRewIdList.includes(taskArr[i]) && DayTaskControl.getInstance().reqAddPointReward(taskArr[i])
        }
        GodHoodBossCtrl.getInst().cmGodhoodGetHelpReward()
        GodHoodBossCtrl.getInst().cmGodhoodSendHelp()
    }, 60e3);
}


//巅峰宝藏一键领取定时任务
async function GetVipTreasurePointTask() {
    // 开启巅峰宝藏任务
    if (VipModel.getInstance().checkIsNeedAccept()) {
        VipControl.getInstance().reqTaskVipTreasureAccept()
    }
    setInterval(() => {
        for (var i = 0; i < 10; i++) {
            // 1622 {taskId:300041-50} 巅峰宝藏一键领取
            var cm_GetVipTreasurePoint = new CM_GetVipTreasurePoint
            cm_GetVipTreasurePoint.taskId = 300041 + i
            if (VipModel.getInstance().checkHasPoint(cm_GetVipTreasurePoint.taskId)) {
                conn.send(cm_GetVipTreasurePoint, 0)
            }
        }
        var trCfg = VipTreasureRewardTb.instance.getAllCfgs()
        for (var i in trCfg) {
            var tr = trCfg[i]
            if (VipModel.getInstance().checkTreasureHasCanGet()) { //有宝藏可领取
                if (VipModel.getInstance().vipTreasurePoint >= tr.condition &&
                    !VipModel.getInstance().vipTreasureRewardIds.includes(tr.id)) {
                    VipControl.getInstance().reqTaskVipTreasureGetReward(tr.id)
                }
            }
        }

    }, 60e3); //1分钟领取一次
}
/**
 * 扫荡任务
 */
function sweepTask() {
    return new Promise(resolve => {
        // 发送1573 接受1572为扫荡次数，与配置和对比
        var cm_SweepInfo = new CM_SweepInfo
        conn.send(cm_SweepInfo, 0)
        var dtc = setInterval(() => {
            if (messageTable[-1572]) {
                var sweeplist = CfgMgr.getTableData("SweepResource")
                msgSweepList = messageTable[-1572].sweeplist;
                console.log("已经获取服务器扫荡数据", msgSweepList)
                for (var i in msgSweepList) {
                    var cm = new CM_Sweep();
                    var item = sweeplist[i]
                    if (item['isHide'] === 0) { //功能开启了，可以扫荡
                        cm.sweepResourceId = parseInt(i), cm.times = msgSweepList[i]['leftCount'],
                            cm.objectId = 0, cm.needSweepItem = false;
                        FG.mainConnecter.send(cm, 0)
                    }
                }
                FG.popmanager.closeCueBox()
                console.log("扫荡完成")
                clearInterval(dtc)
                resolve()
            } else {
                console.log("正在从服务器获取扫荡数据")
            }
        }, 1000);

    })
}

/** 挖矿和护送
护送
31449 护送完成领取奖励 31433提升镖车 31439开始护送
=====================================================
挖矿
// 发送31532，接受31533，然后遍历list，发送31540指令根据id和robStatus是否发送到行会帮助
31540{id:513} 发送矿石帮助 id,robStatus=0,robType=2表示被掠夺了，
可以喊行会帮忙,robStatus=1表示已经夺回成功，RobType表示抢夺别人的
robStatus表示是否被掠夺，0掠夺了1夺回成功
robType表示是抢还是被抢 1抢2被抢
31528 领取矿石奖励 31525提升矿石质量 31522开始挖矿
进入矿洞地图id:1400281 发送31535响应31536获取待抢夺矿工列表，

*/

async function MinerTask() {
    // 可以用内挂助手的话，可以简化
    // AssistCtrl.getInst().reqAutoDo() //自动挖矿，镖车，领取
    while (1) {
        // 防止次数获取为Nan 先等待一下
        await waitFor(() => typeof getTimesById(8) !== 'undefined' && typeof getTimesById(19) !== 'undefined')
        // 挖矿次数
        var wkTimes = getTimesById(8)
        var robTimes = getTimesById(19)
        console.log("挖矿剩余次数%d,矿洞抢夺次数%d", wkTimes, robTimes)
        if (robTimes < 1 && wkTimes < 1) {
            console.log("矿洞整个任务完成")
            SwitchMapControl.getInstance().reqSwitchMap(SwitchMapControl.getInstance().preMapId)
            break;
        }
        // 如果可以领取，先领取然后在挖矿
        MinerModel.getInst().canGetReward && MinerControl.getInst().reqMinerGetReward()
        if (wkTimes > 0) {
            // MinerControl.getInst().reqMinerDig()
            if (ToolKit.getServerTime() - MinerModel.getInst().minerEndTime <= 0 && getTimesById(19) < 1) {
                console.log("矿洞任务准备休眠，时间:%ds", MinerModel.getInst().minerEndTime - ToolKit.getServerTime())
                await timeout(MinerModel.getInst().minerEndTime - ToolKit.getServerTime() * 1e3 + 5e3)
                MinerControl.getInst().reqMinerGetReward()
            }
        }
        if (getTimesById(19) > 0) {
            messageTable[-31536] = false;
            var info = await waitFor(() => {
                return !isCross() && getMinerTaskDataForLock()
            }, 8 * 60 * 60e3, 30e3);
            console.log("矿洞任务有数据，可以锁定", info)
            // 又列表才开始执行
            await tasklock.lock()
            console.log("矿洞任务锁定成功")
            CityControl.getInstance().switchCityScene(!1)
            SwitchMapControl.getInstance().reqSwitchMap(1400281)
            await timeout(3e3)
            MinerControl.getInst().reqMinerRob(info.account, EncounterControl.getInstance().signPos(), 0)
            await waitFor(() => MinerControl.getInst().endPanel && MinerControl.getInst().endPanel.isOpen, 30e3)
            var ret = await getMessageFromServerById(-31531, 3e3)
            MinerControl.getInst().closeEndPanel()
            if (ret && !ret.isWin) { //如果失败，记录失败次数
                minerFilterList[info.account] = minerFilterList[info.account] ? minerFilterList[info.account] + 1 : 1;
            } else { //成功如果存在，剔除
                typeof minerFilterList[info.account] !== 'undefined' && delete minerFilterList[info.account]
            }
        }
        tasklock.unLock();
        console.log("矿洞任务解锁成功")
        MinerControl.getInst().exitMap()
        await timeout(3e3)
    }
}

minerFilterList = {}

function getMinerTaskDataForLock() {
    MinerControl.getInst().reqMinerSimpleInfoList()
    var msg = messageTable[-31536];
    if (msg && msg.list && Object.keys(msg.list).length > 0) {
        var list = msg.list
        for (var i in list) {
            var info = list[i];
            var filterAccountIds = Object.keys(minerFilterList)
            if (info &&
                info.battleScore && info.account &&
                info.battleScore.toNumber() < UserObj.instance.getTotalFightPower() + 2e6 &&
                !filterAccountIds.includes(info.account + "")
            ) {
                return info;
            } else {
                if (minerFilterList[info.account] && minerFilterList[info.account] <= 3) { //最多挑战3次
                    return info
                }
            }
        }
    }
    return false
}

function getTaskDayConfigTime(taskName) {
    if (localStorage.getItem(taskName + "_" + dateFormat("YYYY-mm-dd", new Date()))) {
        return localStorage.getItem(taskName + "_" + dateFormat("YYYY-mm-dd", new Date()))
    }
    return 0;
}

function setTaskDayConfigTime(taskName, times) {
    localStorage.setItem(taskName + "_" + dateFormat("YYYY-mm-dd", new Date()), times)
}

var taskList, LimitTimeTaskList;
// 用定时任务来不断更新taskTimes值
function updateTaskTimes() {
    setInterval(() => {
        taskList = TaskModel.getInstance().getActiveEventsByType(1)
        LimitTimeTaskList = TaskModel.getInstance().getActiveEventsByType(2)
    }, 100);
}

// index 代表日常3个tab 1为默认
function getTimesById(id, info = false, index = 1) {
    var list;
    if (index === 2) {
        list = LimitTimeTaskList
    } else {
        list = taskList
    }
    for (const taskid in list) {
        if (list.hasOwnProperty(taskid)) {
            const task = list[taskid];
            if (task.id === id) {
                return info ? task : task.nowValue;
            }
        }
    }
}

// 护送
async function AllianceTask() {
    // 可以用内挂助手的话，可以简化
    // AssistCtrl.getInst().reqAutoDo() //自动挖矿，镖车，领取

    while (1) {
        // 防止次数获取为Nan 先等待一下
        await waitFor(() => typeof getTimesById(18) !== 'undefined' && typeof getTimesById(20) !== 'undefined')
        // 护送次数
        var wkTimes = getTimesById(18)
        var robTimes = getTimesById(20)
        console.log("护送剩余次数%d,护送抢夺次数%d", wkTimes, robTimes)
        if (robTimes < 1 && wkTimes < 1) {
            console.log("护送整个任务完成")
            AllianceYuenControl.getInstance().exitMap()
            SwitchMapControl.getInstance().reqSwitchMap(SwitchMapControl.getInstance().preMapId)
            break;
        }
        AllianceYuenControl.getInstance().canGetReward() && AllianceYuenControl.getInstance().reqAllianceEscortGetReward()
        if (wkTimes > 0) {
            var t = AllianceYuenModel.getInstance().startTime,
                e = AllianceYuenConst.RUNNING_TIME - (ToolKit.getServerTime() - AllianceYuenModel.getInstance().startTime);
            // AllianceYuenControl.getInstance().reqAllianceEscorStart()
            if (e > 0 && getTimesById(20) < 1) { // 如果只剩下护送，并且还在护送中，就睡眠
                await timeout(e * 1e3 + 5e3)
                // 最后一次领奖
                AllianceYuenControl.getInstance().reqAllianceEscortGetReward()
            }
        }
        if (robTimes > 0) {
            messageTable[-31441] = false
            var info = await waitFor(() => {
                return !isCross() && getAllianceDataForLock()
            }, 8 * 60 * 60e3, 30e3);
            console.log("劫镖获取到数据，可以进行锁定", info);
            await tasklock.lock()
            await timeout(5e3)
            console.log("护送任务锁定成功")
            CityControl.getInstance().switchCityScene(!1)
            console.log("截取镖局账号%s:%s,%s", info.serverName, info.nickName, info.accountId)
            AllianceYuenControl.getInstance().reqAllianceEscorRob(info.accountId) //31434
            // await waitFor(() => AllianceYuenControl.getInstance().rewardView, 30e3)
            // AllianceYuenControl.getInstance().closeRewardView()
            var ret = await getMessageFromServerById(-1236, 30e3)
            if (ret && ret.passLevel === -1) { //失败
                allianceTaskFilterList[info.accountId] = allianceTaskFilterList[info.accountId] ? allianceTaskFilterList[info.accountId] + 1 : 1
            } else {
                typeof allianceTaskFilterList[info.accountId] !== undefined && delete allianceTaskFilterList[info.accountId]
            }
            AllianceYuenControl.getInstance().exitMap()
            await timeout(3e3)
            AllianceYuenControl.getInstance().closeAll()
            console.log("护送面板关闭")
            tasklock.unLock();
            console.log("护送任务解锁成功")
        }
        AllianceYuenControl.getInstance().exitMap()
        AllianceYuenControl.getInstance().closeAll()
        await timeout(5e3)
    }
}

allianceTaskFilterList = {}

function getAllianceDataForLock() {
    AllianceYuenControl.getInstance().reqAllianceEscorRobList() //31435
    var msg = messageTable[-31441]
    if (msg && msg.carVOList && Object.keys(msg.carVOList).length > 0) {
        var list = msg.carVOList;
        for (var i in list) {
            var info = list[i];
            if (info.allianceId.toNumber() === UserObj.getInstance()._playerInfo._allianceId.toNumber()) { //本行会的不抢
                continue;
            }
            var filterAccountIds = Object.keys(allianceTaskFilterList)
            if (info &&
                info.battleScore && info.accountId &&
                info.battleScore.toNumber() < UserObj.instance.getTotalFightPower() + 2e6 &&
                !filterAccountIds.includes(info.accountId + "")
            ) {
                return info;
            } else {
                if (allianceTaskFilterList[info.accountId] && allianceTaskFilterList[info.accountId] <= 3) { //最多挑战3次
                    return info
                }
            }
        }
    }
    return false
}


function getMessageFromServerById(t, timeout = 60e3) {
    return new Promise(resolve => {
        var timeoutTimes = 0
        var dtc = setInterval(() => {
            if (messageTable[t]) {
                clearInterval(dtc)
                var msg = messageTable[t]
                resolve(msg)
            } else {
                if (timeoutTimes > timeout) { //1分钟超时
                    clearInterval(dtc)
                    console.log("服务器相应消息id:%d,超时", t)
                    resolve()
                }
                console.log("正在从服务器获取id:" + t + "的消息数据")
            }
            timeoutTimes = timeoutTimes + 1000
        }, 1000);
    })
}

// 野战
async function EncounterTask() {
    while (true) {
        // 可挑战次数，0为最低
        var ecountCnt = EncounterModel.getInstance().getRestTimes()
        // 下次刷新的秒数，如果小于0则不能再挑战
        var recoverTime = EncounterModel.getInstance().recoverTime - ToolKit.getServerTime();
        // 任务结束的控制
        if (ecountCnt === 0) {
            if (recoverTime > 0) {
                console.log("野战任务正在休眠中,休眠时间:" + ToolKit.timerFormat(recoverTime, 1))
                await timeout(recoverTime * 1000)
            } else {
                console.log("野战任务结束");
                break; //结束野战任务
            }
        }
        // 发送野战列表请求
        await tasklock.lock()
        await timeout(1e3)
        console.log("野战任务锁定成功")
        if (MapControl.getInstance().isCrossMap()) {
            CrossServerControl.instance.cmCrossServerLeave()
            await timeout(5e3)
        }
        // 进入主城
        if (!CityModel.getInstance().isInCity)
            CityControl.getInstance().switchCityScene(!1)
        await timeout(3e3)
        EncounterControl.getInstance().reqEncounterInfo()
        // 等待获取列表数据-1281
        var encounters = await getMessageFromServerById(-1281)
        var encounterList = encounters.challengeList
        // -1280挑战
        EncounterControl.getInstance().reqEncounterChallenge(encounterList[0], false)
        await timeout(3e3)
        // 退出
        EncounterControl.getInstance().reqEncounterEnd()
        await timeout(7e3)
        tasklock.unLock();
        console.log("野战任务解锁锁成功")
        await timeout(1e3)
    }
}


checkEnterTime = function () {
    return this
}
checkEnterTime.prototype.checkNeutralEnterTime = (async function () {
    // 地图进入冷却时间
    messageTable[-8205] = false
    await waitFor(() => {
        //更新CD请求
        NeutralControl.getInstance().protocol.getNeutralBossInfos() //8213
        var msg = messageTable[-8205],
            t = Math.floor(NeutralModel.instance.getEnterCDEndTime() / 1e3) - ToolKit.getServerTime();
        console.log("暗域冷却%ds中，等待进入", t < 0 ? 0 : t)
        return msg && NeutralControl.instance.isCd === false
    })
});
checkEnterTime.prototype.checkLegendEnterTime = (async function (stage = 1) {
    //  进入地图冷却时间
    var mapId = stage === 1 ? 30016 : 30043,
        descTxt = stage === 1 ? '秘境' : '神石';
    await waitFor(() => {
        var reqTimer = new CM_LegendBossInfos
        reqTimer.stage = stage
        conn.send(reqTimer)
        var msg = messageTable[-8932],
            t = LegendBossModel.inst.getEnterCd(mapId) - ToolKit.getServerTime()
        console.log("%s需要等待时间%ds", descTxt, t < 0 ? 0 : t)
        return msg && t < 0
    }, 60e3)
});


function getNeutralBossWaitForLock() {
    // 刷新数据
    NeutralControl.getInstance().protocol.getNeutralBossInfos()
    var bossLevelArr = [545, ]
    //暗域所有boss包括仙岛id
    // var bossIdsArr = SmallMapTb.getInstance().getNeutralBossMapIds()

    // 所有暗域地图Id 
    var neutralMapIdsArr = SmallMapTb.getInstance().getNeutralMap()
    neutralMapIdsArr = neutralMapIdsArr.concat(SmallMapTb.getInstance().getXianDaoMap())
    var bossList = {},
        sortedBossList = {};
    // 通过配置拿到怪物等级信息和名字
    for (var i in neutralMapIdsArr) {
        var mapInfo = neutralMapIdsArr[i]
        var bossIdsArr = SmallMapTb.getInstance().getNeutralBossMapIdsByMap(mapInfo.id)
        for (var t in bossIdsArr) {
            var bossId = bossIdsArr[t]
            var monCfg = MonsterTb.getInstance().getCfgById(bossId)
            bossList[bossId] = {
                "name": monCfg.name,
                "id": bossId,
                "level": monCfg.level,
                "mapId": mapInfo.id
            }
        }
    }
    var sortedBossKeys = Object.keys(bossList).sort()
    for (var k = sortedBossKeys.length - 1; k >= 0; k--) { //倒叙遍历，从等级最高的打起
        var index = parseInt(sortedBossKeys[k])
        var boss = bossList[index]
        var bossInfo = NeutralModel.instance.getNeutralMapBossVo(boss.id)
        if (!bossInfo || !boss) continue;
        bossInfo["name"] = boss.name ? boss.name : '**'
        bossInfo["id"] = boss.id
        bossInfo["level"] = boss.level
        bossInfo["mapId"] = boss.mapId
        if (bossLevelArr.includes(boss.level)) {
            if (bossInfo._isDead === false) {
                return bossInfo
            } else {
                var reliveTime = Math.floor(bossInfo._reliveTime.toNumber()) - ToolKit.getServerTime()
                if (reliveTime < 30) {
                    console.log("暗域Boss%s很快复活，先过去", boss.name)
                    return bossInfo
                }
            }
        }
    }
    return false
}
// 暗域boss循环打监控
async function NeutralBossTask() {
    while (true) {
        // 更新获取boss信息
        NeutralControl.getInstance().protocol.getNeutralBossInfos()
        // 等待获取8205信息
        var neutralBossInfos = await getMessageFromServerById(-8205)
        // 剩余挑战次数
        var restTimes = NeutralModel.instance.restTimes
        if (restTimes < 1) {
            console.log("暗域Boss任务完成");
            NeutralControl.getInstance().reqExitNeutralMap()
            break;
        }
        // 监控Boss
        var boss = await waitFor(() => {
            return getNeutralBossWaitForLock()
        }, 8 * 60 * 60e3)
        console.log("找到目标:%s,准备锁定", boss.name)
        // 等待冷却进入
        await (new checkEnterTime).checkNeutralEnterTime()
        // 开始打怪
        await tasklock.lock()
        console.log("暗域Boss%s，锁定成功", boss.name);
        SwitchMapControl.getInstance().reqSwitchMap(boss.mapId)
        await waitFor(() => MapControl.getInstance().isNeutral())
        NeutralControl.getInstance().findPathToTrans(boss.id)
        sendMessageTable[-1270] = false
        // 到了等待复活
        await waitFor(() => {
            var msg = sendMessageTable[-1270]
            return msg && msg.curX === msg.tarX && msg.curY === msg.tarY
        })
        // 抢怪
        messageTable[-6042] = false
        messageTable[-8226] = false
        var ret = await waitFor(() => {
            var bossChecker = NeutralModel.instance.getNeutralMapBossVo(boss.id)
            boss.mapCfg = SmallMapTb.getInstance().getMapById(boss.id)
            var t = Math.floor(bossChecker._reliveTime.toNumber() / 1e3) - ToolKit.getServerTime()
            // t<60 表示Boss正要复活或者0 已存活的Boss,而不会有刚刚死亡情况
            var msg = messageTable[-6042]
            if (t > 60) {
                return -2
            }
            if (messageTable[-8226] && messageTable[-8226]._bossID === boss.id)
                SwitchMapControl.getInstance().reqSwitchMap(boss.id)
            return getBossOwner(msg, boss, boss.id)
        }, 60e3, 100)
        if (ret === -1) { //退出
            NeutralControl.getInstance().reqExitNeutralMap()
        } else if (ret === 1) { //杀怪
            //杀怪
            await waitFor(() => NeutralControl.instance._endPanel && NeutralControl.instance._endPanel.isOpen, 3 * 60e3)
            NeutralControl.instance.closeEndPanel()
        } else if (ret === -2) { //Boss已经死亡
            console.log("Boss:%s已经死亡,继续下一个", boss.name)
        }
        tasklock.unLock()
        console.log("暗域Boss%s，解锁锁成功", boss.name);
        await timeout(3e3)
    }
}

async function LegendBossTask() {
    var bossLevel = 230; //怪物级别
    while (true) {
        var getRemainCount = LegendBossModel.getInst().getRemainCount(30016);
        if (getRemainCount < 1) {
            console.log("传世Boss任务完成");
            // SwitchMapControl.getInstance().reqSwitchMap(SwitchMapControl.getInstance().preMapId)
            LegendBossCtrl.getInst().reqExitMap()
            break;
        }
        var boss = await waitFor(() => {
            return getLegendBossByLevel(1, bossLevel)
        }, 8 * 60 * 60e3, 3e3)
        console.log("秘境发现目标Boss:%s，准备锁定", boss.monCfg.name)
        //  进入地图冷却时间
        await (new checkEnterTime).checkLegendEnterTime(1)
        await tasklock.lock()
        console.log("lock:传世Boss锁定成功")
        await timeout(3e3)
        if (LegendEquipData.instance.getTotalFightPower() >= boss.cfg.legendSword) {
            SwitchMapControl.getInstance().reqSwitchMap(30016)
            await timeout(3e3)
            LegendBossCtrl.getInst().findPathToTrans(boss.cfg.id)
            sendMessageTable[-1270] = false
            await waitFor(() => {
                var msg = sendMessageTable[-1270]
                return msg && msg.curX === msg.tarX && msg.curY === msg.tarY
            })
            console.log("lock:开始打%s", boss.monCfg.name)
            messageTable[-8211] = false
            await getMessageFromServerById(-8211, 3 * 60e3)
            LegendBossCtrl.getInst().reqExitMap()
        } else {
            console.log("传世装备战力不够,任务结束")
            break;
        }
        await timeout(5e3)
        tasklock.unLock()
        console.log("传世任务解锁成功")
    }
}

function getLegendBossByLevel(stage, level) {
    var reqTimer = new CM_LegendBossInfos
    reqTimer.stage = stage
    conn.send(reqTimer)
    var mapId = stage == 1 ? 30016 : 30043
    var bossList = LegendBossModel.getInst().getAllInfo(mapId)
    for (var i in bossList) {
        var boss = bossList[i]
        if (boss.monCfg.level === level) {
            return boss.isDead === false && boss;
        }
    }
    return false
}


async function checkLegendBossTone() {
    var bossLevel = 320
    setInterval(() => {
        var getRemainCount = LegendBossModel.getInst().getRemainCount(30043);
        var boss = getLegendBossByLevel(2, bossLevel)
        boss.isDead === true
    }, 1e3);
}

BossTask = function () {

}

// 是否存活
BossTask.prototype.isAlive = function () {

}

// 是否可以进入
BossTask.prototype.canEnter = function () {

}
// 剩余次数
BossTask.prototype.getRemainCount = function () {

}
// 剩余次数
BossTask.prototype.getRemainCount = function () {

}

async function LegendBossToneTask() {
    var bossLevel = 340
    while (true) {
        var getRemainCount = LegendBossModel.getInst().getRemainCount(30043);
        if (getRemainCount < 1) {
            console.log("传世神石Boss任务完成");
            LegendBossCtrl.getInst().reqExitMap()
            break;
        }
        var boss = await waitFor(() => {
            return getLegendBossByLevel(2, bossLevel)
        }, 8 * 60 * 60e3, 3e3)
        console.log("神石发现目标Boss:%s，准备锁定", boss.monCfg.name)
        //  进入地图冷却时间
        await (new checkEnterTime).checkLegendEnterTime(2)
        await tasklock.lock()
        await timeout(5e3)
        console.log("lock:传世神石锁定成功")
        if (LegendBossModel.getInst().getStoneFightPower() >= boss.cfg.legendSword) {
            SwitchMapControl.getInstance().reqSwitchMap(30043)
            await timeout(3e3)
            LegendBossCtrl.getInst().findPathToTrans(boss.cfg.id)
            sendMessageTable[-1270] = false
            await waitFor(() => {
                var msg = sendMessageTable[-1270]
                return msg && msg.curX === msg.tarX && msg.curY === msg.tarY
            })
            console.log("lock:开始打%s", boss.monCfg.name)
            messageTable[-8211] = false
            await getMessageFromServerById(-8211, 3 * 60e3)
            LegendBossCtrl.getInst().reqExitMap()
        } else {
            console.log("传世神石战力不够,任务结束")
            break;
        }
        await timeout(5e3)
        tasklock.unLock()
        console.log("传世神石任务解锁成功")
    }
}

function getCDTime(t) {
    var e = CoolDownModel.getInstance().getCDTime(t)
    if (typeof e === 'undefined') return 0
    var cdtime = Math.floor(e.toNumber() / 1e3) - ToolKit.getServerTime();
    return cdtime
}


async function startExpFb() {
    startExpFb: while (1) {
        await waitFor(() => typeof getTimesById(2) !== 'undefined')
        var times = getTimesById(2)
        console.log("经验副本剩余次数：%d", times)

        if (times < 1) {
            console.log("经验副本完成");
            break;
        }
        CityControl.getInstance().switchCityScene(!1)
        await timeout(3e3)
        NpcControl.instance.realDealNpc(NpcTb.getInstance().getNpcById(11005))
        //3103
        await waitFor(() => getCDTime("EVIL_SQUARE"), 5e3)
        var cdTime = getCDTime("EVIL_SQUARE");
        console.log("经验副本冷却时间%d秒", cdTime)
        var mapId = CopyControl.getInstance()._panel && CopyControl.getInstance()._panel._mapCfg &&
            CopyControl.getInstance()._panel._mapCfg.id
        console.log("当前地图Id", mapId)
        CopyControl.getInstance().closePanel()
        if (typeof mapId === 'undefined' || mapId === 0 || mapId == false) {
            continue startExpFb;
        }
        if (cdTime > 0) {
            await timeout(cdTime * 1e3)
        }
        await tasklock.lock()
        await timeout(3e3)
        console.log("lock:经验副本锁定成功,processing")
        SwitchMapControl.getInstance().reqSwitchMap(mapId) //21138  21126
        console.log("当前挑战经验副本地图id%s", mapId)
        var ret = await waitFor(() => MapControl.getInstance().curMapCfg.id === mapId, 10e3);
        if (!ret) {
            console.log("经验副本锁定失败，直接解锁");
            tasklock.unLock();
            continue startExpFb;
        }
        await waitFor(() => CopyControl.getInstance()._endPanel && CopyControl.getInstance()._endPanel.isOpen, 100e3)
        CopyControl.getInstance().closeEndPanel()
        SwitchMapControl.getInstance().reqSwitchMap(UserObj.getInstance().playerInfo.mapId)
        await timeout(5e3)
        tasklock.unLock()
        console.log("lock:经验副本finish")
    }
}

function waitFor(condition, timeout = 60e3, ms = 1e3) {
    return new Promise(resolve => {
        var dtc = setInterval(() => {
            if (typeof condition === 'function') {
                var res = condition()
                if (res) {
                    resolve(res)
                    clearInterval(dtc)
                }
            }
        }, ms);
        setTimeout(() => {
            resolve()
        }, timeout);
    });
}

function getBloodCaveTaskForLock() {
    var bossLevelArr = [240, 230, 220, 210, 200, 190, 180]
    // 所有Boss信息
    var bossList = BloodCaveModel.inst.getAllInfo(30071)
    for (var i = bossList.length - 1; i >= 0; i--) {
        var boss = bossList[i]
        if (boss.isDead === false && boss.attention === 1 &&
            bossLevelArr.includes(boss.monCfg.level) &&
            !Object.keys(filterBossList).includes(boss.cfg.id + "")
        ) {
            console.log("发现血脉Boss:%s可挑战，准备锁定", boss.cfg.monsterName)
            return boss
        } else {
            var t = boss.reliveTime - ToolKit.getServerTime()
            if (boss.isDead === true && t < 60) {
                console.log("血脉Boss%s还有%ds复活，提前准备", boss.cfg.monsterName, t)
                return boss
            }
        }
    }
    console.log("没有合适的血脉Boss可以锁定");
    if (MapControl.getInstance().isBloodCave()) {
        CrossServerControl.instance.cmCrossServerLeave()
    }
    return false
}

// 血脉任务
async function BloodCaveTask() {
    // 获取次数
    var stage = 30071
    BloodCaveTask: while (1) {
        var leftCount = 0 //留几次
        var times = BloodCaveModel.inst.getRemainCount(stage)
        if (times < leftCount + 1) {
            console.log("血脉任务完成")
            BloodCaveControl.getInst().reqExitMap()
            break;
        }
        var boss = await waitFor(() => {
            return getBloodCaveTaskForLock()
        }, 8 * 60 * 60e3)
        // 等待进入,
        await waitFor(() => BloodCaveModel.getInst().getEnterCd(stage) - ToolKit.getServerTime() <= 0, 70e3)
        await timeout(3e3)
        await tasklock.lock()
        console.log("血脉任务锁定成功");
        SwitchMapControl.getInstance().reqSwitchMap(stage)
        var ret = await waitFor(() => MapControl.getInstance().isBloodCave(), 3e3)
        if (!ret) {
            console.log("血脉任务锁定失败，直接解锁");
            tasklock.unLock()
            continue BloodCaveTask
        }
        BloodCaveControl.getInst().findPathToTrans(boss.cfg.id)
        // 抢怪
        sendMessageTable[-27005] = false
        // 等待到达
        await waitFor(() => {
            var msg = sendMessageTable[-27005]
            return msg && msg.currentX === msg.targetX && msg.currentY === msg.targetY
        })
        // 抢怪
        messageTable[-6042] = false
        messageTable[-8226] = false
        var ret = await waitFor(() => {
            var bossChecker = BloodCaveModel.getInst().getBossByMapId(boss.cfg.id)
            var t = bossChecker.reliveTime - ToolKit.getServerTime()
            // t<60 表示Boss正要复活或者0 已存活的Boss,而不会有刚刚死亡情况
            var msg = messageTable[-6042]
            if (t > 60) {
                return -2
            }
            if (messageTable[-8226] && messageTable[-8226]._bossID === boss.cfg.id)
                BloodCaveControl.getInst().reqSwitchMap(boss.cfg.id)
            return getBossOwner(msg, boss, boss.cfg.id)
        }, 60e3, 100)
        if (ret === -1) { //退出
            BloodCaveControl.getInst().reqExitBossMap()
        } else if (ret === 1) { //杀怪
            await challengeBossProcess(boss, boss.cfg.id, BloodCaveModel.inst.getAllInfo(30071))
            BloodCaveControl.inst.reqExitBossMap()
            BloodCaveControl.getInst().reqExitBossMap()
        } else if (ret === -2) { //Boss已经死亡
            console.log("Boss:%s已经死亡,继续下一个", boss.cfg.monsterName)
        }
        tasklock.unLock()
        console.log("血脉任务解锁成功")
        await timeout(3e3)
    }
}
// 战纹塔挑战
// 1251战纹塔挑战 mapid增加即为下一关 1253失败提醒

// 7802通天塔列表 7801挑战 结合1201 mapid下一关
async function zwtChallenge() {
    while (1) {
        this._mapCfg = SmallMapTb.getInstance().getMapById(UserObj.getInstance().playerInfo.mapId + "");
        CopyControl.getInstance().reqCopyJyReport(this._mapCfg.nextCheckpoint)

    }
}

function getLittleBossInvadeForLock() {
    var star = 0
    var littleBossInfos = LittleBossInvadeModel.inst.littleBossInfos
    var execStar = star ? star : LittleBossInvadeModel.getInst().getRecommend();
    for (var i in littleBossInfos) {
        var lit = littleBossInfos[i]
        if (lit.cfg.monsterStar === execStar && lit.isDead === false) { //1星怪
            return lit;

        }
    }
    return false;
}

//苍神之谜
async function cangShenTask() {

    cangShenTask: while (1) {
        // 刷新数据
        // LittleBossInvadeControl.getInst().
        var times = LittleBossInvadeModel.getInst().enterCount
        if (times < 1) {
            console.log("苍神任务完成");
            SwitchMapControl.getInstance().reqSwitchMap(SwitchMapControl.getInstance().preMapId)
            break;
        }
        var lit = await waitFor(() => getLittleBossInvadeForLock(), 8 * 60 * 60e3);
        await tasklock.lock()
        console.log("仓神任务已经锁定")
        // 获取进入怪物所在的地图
        var refreshMapId = LittleBossInvadeModel.getInst().refreshMapId;
        // 进入之前需要执行地图进入的冷却检测，先获取进入的地图类型
        if (MapControl.instance.isLegend(refreshMapId)) { //传世地图
            await (new checkEnterTime).checkLegendEnterTime(refreshMapId === 30016 ? 1 : 2)
        } else { //暗域名
            await (new checkEnterTime).checkNeutralEnterTime()
        }
        SwitchMapControl.getInstance().reqSwitchMap(refreshMapId)
        var ret = await waitFor(() => MapControl.getInstance().curMapCfg.id === refreshMapId, 10e3);
        if (!ret) {
            console.log("苍神任务锁定失败，直接解锁");
            tasklock.unLock();
            continue cangShenTask;
        }
        LittleBossInvadeControl.getInst().findPathToTrans(lit.bossMapId);
        sendMessageTable[-1270] = false
        await waitFor(() => {
            var msg = sendMessageTable[-1270]
            return msg && msg.curX === msg.tarX && msg.curY === msg.tarY
        })
        LittleBossInvadeControl.getInst().reqChallengeLittleBoss(lit.bossMapId)
        await waitFor(() => LittleBossInvadeControl.getInst().littleBossEndPanel &&
            LittleBossInvadeControl.getInst().littleBossEndPanel.isOpen, 150e3)
        LittleBossInvadeControl.getInst().littleBossEndPanel &&
            LittleBossInvadeControl.getInst().littleBossEndPanel.close()
        await waitFor(() => {
            SwitchMapControl.getInstance().reqSwitchMap(SwitchMapControl.getInstance().preMapId)
            CityControl.getInstance().switchCityScene(!0)
            return CityModel.getInstance().isInCity
        })
        tasklock.unLock()
        console.log("仓神任finish")
        await timeout(2e3)
    }
}

function isCross() {
    return MapControl.getInstance().isCrossMap() ||
        MapControl.getInstance().isBloodCave() ||
        MapControl.getInstance().isBloodCaveBoss() ||
        MapControl.getInstance().isBloodCavePk() ||
        MapControl.getInstance().isYijie() ||
        MapControl.getInstance().isYijieBoss() ||
        MapControl.getInstance().isYijiePVE() ||
        MapControl.getInstance().isYijieElite() ||
        MapControl.getInstance().isYijiePK() ||
        MapControl.getInstance().isCrossServerBoss() ||
        MapControl.getInstance().isCrossServer() ||
        MapControl.getInstance().isCrossServerPVE() ||
        MapControl.getInstance().isCrossServerElite() ||
        MapControl.getInstance().isCrossServerPk() || MapControl.getInstance().isCrossWorldBoss() ||
        MapControl.getInstance().isCrossMirage() || MapControl.getInstance().isCrossMirageBoss() ||
        MapControl.getInstance().isCrossMiragePVE() || MapControl.getInstance().isCrossMiragePk() ||
        MapControl.getInstance().isCrossMirageElite()
}

function isNormal() {
    return !isCross()
}

async function comeCity(condition) {
    var ret;
    if (typeof condition === 'function') {
        ret = condition()
    }
    if (isCross() && ret) {
        CrossServerControl.instance.cmCrossServerLeave()
        console.log("正在等待返回主城")
        await waitFor(() => isNormal())
        console.log("返回主城成功")
    }
}

//通天塔挑战
async function babelTask() {
    var canChallengeTimes = 50
    //回到主城
    await tasklock.lock()
    await timeout(5e3)
    console.log("lock:通天塔任务锁定成功")
    if (MapControl.getInstance().isCrossMap()) {
        CrossServerControl.instance.cmCrossServerLeave()
        await timeout(5e3)
    }
    CityControl.getInstance().switchCityScene(!1)
    await timeout(3e3)
    for (var i = 0; i < canChallengeTimes; i++) {
        BabelCtl.instance.cmBabelChallenge()
        console.log("通天塔当前挑战次数%d,剩余次数%d", i, BabelModel.instance.canChallengeTimes)
        messageTable[-7809] = false
        var result = await getMessageFromServerById(-7809)
        if (result && result.passLayer && result.passLayer != 0) { //胜利 不需要发送，倒计时结束后自动开始
            BabelCtl.instance.closeEndPanel()
        } else { //失败 重新发送挑战
            MapControl.getInstance().isBabel() && ServerFightControl.getInstance().exitMap();
            BabelCtl.instance.closeEndPanel()
            await timeout(5e3)
        }
        if (BabelModel.instance.canChallengeTimes === 0) {
            break;
        }
    }
    BabelCtl.instance.exitBabel()
    ServerFightControl.getInstance().exitMap();
    BabelCtl.instance.closePanel();
    await timeout(5e3)
    tasklock.unLock();
    console.log("lock:通天塔任务解锁锁成功，结束")
}

// 摇钱树
// 7002摇钱树，两次
async function MoneyTreeTask() {
    while (1) {
        var spaceTime = parseInt(ConfigValueTb.getInstance().getDataById(10211).content) //８小时
        var t = MoneyTreeControl.getInst().lastTime + spaceTime - ToolKit.getServerTime()

        if (t > 0) {
            console.log("摇钱树任务等待下一次免费摇，休眠时间为%s", ToolKit.timerFormat(t, 1));
            await timeout(t * 1e3)
        } else {
            console.log("摇钱树摇钱")
            MoneyTreeControl.getInst().reqRoll();
            await timeout(1 * 60e3)
        }
    }
}

// 处理邮件
async function MailTask() {
    setInterval(() => {
        if (MailModel.getInstance().mailSize > 0) {
            var list = MailModel.getInstance().mailList
            for (var i in list) {
                var l = list[i]
                MailControl.getInstance().reqReadMail(l.id)
            }
            MailControl.getInstance().reqAllRewMail() //批量领取
            MailControl.getInstance().reqTidyMail(2) //批量删除
        }
    }, 60e3);
}

// 传奇世城
async function ExpeditionTask() {
    while (1) {
        // 是否是3颗星
        console.log("传世奇城任务次数:%d", ExpeditionModel.instance().dailyRemainCount)
        if (ExpeditionModel.instance().dailyRemainCount < 1) {
            console.log("传世奇城任务完成")
            break;
        }
        var limit = 2
        await tasklock.lock()
        await timeout(5e3)
        console.log("传世奇城任务锁定成功")
        if (MapControl.getInstance().isCrossMap()) {
            CrossServerControl.instance.cmCrossServerLeave()
            await timeout(5e3)
        }
        CityControl.getInstance().switchCityScene(!1)
        await timeout(3e3)
        for (var i = 0; i < limit; i++) {
            if (ExpeditionModel.instance().dailyRemainCount < 1) {
                console.log("csqc task finished")
                ExpeditionControl.instance.exitMap()
                break;
            }
            ExpeditionControl.instance.reqChallengeExpedition(ExpeditionModel.instance().flagStage)
            await waitFor(() => ExpeditionControl.instance.expeditionEndPanel &&
                ExpeditionControl.instance.expeditionEndPanel.isOpen)
            ExpeditionControl.instance.closeExpeditionEndPanel()
            var msg = messageTable[-8503]
            if (msg && msg.passStageInfo && msg.isPass) {
                var passStageInfo = msg.passStageInfo
                if (msg.isPass && passStageInfo.finishStar === 3) {
                    ExpeditionControl.instance.reqGainRewards(ExpeditionModel.instance().flagStage)
                    ExpeditionControl.instance.exitMap()
                    break;
                } else {
                    if (i === limit - 1) { //i从0开始的，所以limit-1代表limit次(如果不是limit-1下面代码永远走不到)都失败，直接扫荡
                        console.log("传世奇城任务经历%d都挑战失败，直接扫荡", i)
                        ExpeditionControl.instance.protocol.ReqSweepExpedition()
                        break;
                    }
                }
            }
        }
        ExpeditionControl.instance.exitMap()
        ExpeditionControl.instance.closeExpeditionPanel()
        await timeout(5e3)
        tasklock.unLock()
        console.log("传世奇城任务解锁成功")
    }

}

//竞技场任务
async function DanTask() {
    while (1) {
        await waitFor(() => typeof getTimesById(6) !== 'undefined')
        var times = getTimesById(6);
        console.log("竞技场任务剩余次数:%d", times)
        if (times < 1) {
            console.log("竞技场任务完成")
            return
        } else {
            DanControl.getInstance().sendMsg()
            var t = DanModel.getInstance().detailInfo;
            if (!t) return false
            var e = Math.floor(t.cDEndTime.toNumber() / 1e3) - ToolKit.getServerTime();
            console.log("竞技场冷却时间:%ds", e)
            if (e > 0) await timeout(e * 1e3)
            DanControl.getInstance().reqMatchAndPkTarget()
        }
    }
}

// 命盘
async function GodHoodBossTask() {
    GodHoodBossTask: while (1) {
        await waitFor(() => typeof getTimesById(32) !== 'undefined');
        var times = getTimesById(32)
        if (times < 1) {
            console.log("命盘任务完成")
            break;
        }
        // 9168 发送列表请求，响应9164
        messageTable[-9164] = false
        await waitFor(() => {
            GodHoodBossCtrl.getInst().cmGodhoodPanel()
            var msg = messageTable[-9164]
            return msg && msg.helpList && Object.keys(msg.helpList).length > 0
        }, 8 * 60 * 60e3, 30e3);
        var list = messageTable[-9164].helpList
        console.log("命盘任务有数据，可以锁定了", list)
        await tasklock.lock()
        await timeout(5e3)
        console.log("命盘任务锁定成功")
        CityControl.getInstance().switchCityScene(!1)
        for (var l in list) {
            if (getTimesById(32) < 1) {
                console.log("命盘任务完成")
                break;
            }
            // 9162 发送组队挑战
            GodHoodBossCtrl.getInst().cmGodhoodChallenge(l)
            var skill = (new CM_UseSkill)
            skill.skillId = 7007
            for (var i = 0; i < 10; i++) {
                await timeout(10e3)
                conn.send(skill, 0)
            }
            await waitFor(() => GodHoodBossCtrl.getInst().endPanel && GodHoodBossCtrl.getInst().endPanel.isOpen, 6 * 60e3)
            GodHoodBossCtrl.getInst().endPanel && GodHoodBossCtrl.getInst().endPanel.close()
            await timeout(5e3)
        }
        // await timeout(5e3)
        tasklock.unLock()
        console.log("命盘任务解锁成功")
    }
}

// 浮岛
async function YijieTask() {
    while (1) {
        var times = getTimesById(30)
        if (times < 1) {
            console.log("浮岛任务完成")
            break;
        }
        if (BagModel.getInstance().getItemNumByModelId(429) < 10) {
            console.log("浮岛卷不足，退出任务，完成");
            break;
        }
        // 根据配置打哪个Boss
        // stage 表示层，后面数组表示[星辰,元素，混沌]过滤Boss信息
        var stage = 1,
            bossLevel = 5,
            bossType = 'hd'; // 这配置表示打第一层的xc5级Boss
        var bossArr;
        switch (bossType) {
            case 'xc':
                bossArr = [1, 0, 0]
                break;
            case 'ys':
                bossArr = [0, 1, 0]
                break;
            case 'hd':
                bossArr = [0, 0, 1]
                break;
            default:
                bossArr = [1, 0, 0]
                break;
        }
        var bossInfo = YijieData.getInst().getMapInfoByStage(stage).getShowBossInfosByArr(bossArr)
        await tasklock.lock()
        await timeout(5e3)
        console.log("浮岛任务锁定成功")
        YijieCtrl.getInst().doSwitchMap(bossInfo[bossLevel - 1].cfg.soulWeaponMapId) //进入地图 300501层30051二
        YijieCtrl.getInst().findPathToTrans(bossInfo[bossLevel - 1].cfg.monId)
        await waitFor(() => YijieCtrl.getInst().yijieEndPanel && YijieCtrl.getInst().yijieEndPanel.isOpen, 100e3)
        YijieCtrl.getInst().yijieEndPanel && YijieCtrl.getInst().yijieEndPanel.close()
        await timeout(5e3)
        tasklock.unLock()
        console.log("浮岛任务解锁成功")
    }
}

function getCrossServerBossByLevel(level = 355) {
    // 下面是所有Boss信息
    var bossInfos = CrossServerBossModel.inst.bossInfos
    for (var bossIndex in bossInfos) {
        var bossInfo = bossInfos[bossIndex]
        if (bossInfo.mapCfg.lvl[0] === level) {
            return bossInfo;
        }
    }
}

// 监控boss列表
var bossLevelArr = [355, 350, 345, 340, 335, 330]
//  285, 280, 275, 270, 265, 260]
var bossMaxIndex = 3 //最大几层
// 排除Boss列表 键为bossId 以便保持唯一
filterBossList = {}
//获取当前最大可挑战的Boss进行挑战
function getMaxLevelBossToChallenge() {
    // 下面是所有Boss信息
    var bossInfos = CrossServerBossModel.inst.bossInfos
    var aliveChallengeBossList = {} //当前可挑战的Boss列表
    for (var bossIndex in bossInfos) {
        var bossInfo = bossInfos[bossIndex]
        if (bossInfo.attention === 1 && bossInfo.isDead === false &&
            bossLevelArr.includes(bossInfo.mapCfg.lvl[0]) &&
            !Object.keys(filterBossList).includes(bossInfo.cfg.id + "") && //这里有个语法注意，Object.keys()返回数字索引为字符串
            bossInfo.mapCfg.index <= bossMaxIndex
        ) {
            aliveChallengeBossList[bossInfo.cfg.id] = bossInfo
            //mapCfg.name为boss名字
        }
    }
    // console.log("lc:当前过滤表里面的龙城Boss", filterBossList)
    // console.log("lc:当前可挑战的龙城Boss", aliveChallengeBossList);
    // 当前最大可挑战的Boss等级和bossId
    var maxBossLevel = 0,
        maxBossId = 0;
    for (var bossId in aliveChallengeBossList) {
        var bossInfo = aliveChallengeBossList[bossId]
        var bossLevel = bossInfo.mapCfg.lvl[0];
        if (bossLevel > maxBossLevel) {
            maxBossLevel = bossLevel
            maxBossId = bossId
        }
    }
    if (aliveChallengeBossList[maxBossId]) {
        var bossInfo = aliveChallengeBossList[maxBossId],
            reliveTime = bossInfo.reliveTime - ToolKit.getServerTime();
        // 这里按逻辑Boss应该是存活的，可测试的时候发现会有死亡的boss走到这里来，好在
        // 活着的bossreliveTime=0,符合下面复活<60秒的情况，直接更严格判断试试
        if (reliveTime < 60) {
            console.log("当前发现可挑战的Boss:%s,Level:%d，龙城任务可以锁定", bossInfo.mapCfg.name, bossInfo.mapCfg.lvl[0])
            return bossInfo;
        }
    } else {
        return getMonitorCrossServerBoss()
    }
    // 如果不结合maxbossId，可以直接用下面的，但性能会差点，数据却会准确些
    //return getCrossServerBossByLevel(maxBossLevel)
}

exitCrossServerSign = false, exitCrossServerDomainSign = false;

function getMonitorCrossServerBoss() {
    exitCrossServerSign = false;
    // 下面是所有Boss信息
    var bossInfos = CrossServerBossModel.inst.bossInfos
    var monitorBossList = {} //当前可挑战的Boss列表
    for (var bossIndex in bossInfos) {
        var bossInfo = bossInfos[bossIndex]
        if (bossInfo.attention == 1 && bossInfo.isDead == true &&
            bossInfo.mapCfg.index <= bossMaxIndex &&
            bossLevelArr.includes(bossInfo.mapCfg.lvl[0])) {
            monitorBossList[bossInfo.cfg.id] = bossInfo
        }
    }
    // 当前最快复活的boss
    var quickBossTime = 1787736571,
        maxBossId = 0;
    for (var bossId in monitorBossList) {
        var bossInfo = monitorBossList[bossId]
        var reliveTime = bossInfo.reliveTime;
        if (reliveTime < quickBossTime) {
            quickBossTime = reliveTime
            maxBossId = bossId
        }
    }
    if (monitorBossList[maxBossId]) {
        var bossInfo = monitorBossList[maxBossId],
            reliveTime = bossInfo.reliveTime - ToolKit.getServerTime();
        if (reliveTime < 60) {
            console.log("lc:Boss%s正准备复活,还有%d秒,提前过去等待", bossInfo.mapCfg.name, reliveTime);
            return bossInfo
        }
    }
    // console.log("没有合适的龙城Boss可以锁定");
    exitCrossServerSign = true;
    if (MapControl.getInstance().isCrossServer() && exitCrossServerDomainSign === true) {
        CrossServerControl.instance.cmCrossServerLeave()
    }
    return false
}

// 龙城
async function CrossServerBossTask() {
    CrossServerBossTask: while (1) {
        var leftCount = 0 //留几次
        var times = CrossServerBossModel.inst.remainCount
        if (times < leftCount + 1) {
            console.log("lc:龙城遗迹任务完成")
            exitCrossServerSign = true;
            CrossServerBossModel.inst.chaosSecondLayerBossRemainCount == 0 && CrossServerBossCtrl.getInst().reqExitMap()
            break;
        }
        var bossInfo = await waitFor(() => {
            return getMaxLevelBossToChallenge()
        }, 8 * 60 * 60e3)
        // 等待进入,9403配合更准确,以后可以优化
        await waitFor(() => CrossServerBossModel.inst.enterCd - ToolKit.getServerTime() <= 0, 70e3)
        await timeout(3e3)
        await tasklock.lock()
        console.log("龙城任务锁定成功")
        CrossServerBossCtrl.getInst().gotoFightBoss(bossInfo.mapCfg.id)
        var ret = await waitFor(() => MapControl.getInstance().isCrossServer() && MapControl.instance.curMapCfg.id === 30045, 3e3)
        if (!ret) {
            console.log("进入龙城地图失败,直接解锁")
            tasklock.unLock()
            continue CrossServerBossTask;
        }
        console.log("进入龙城地图成功")
        sendMessageTable[-27005] = false
        // 到了等待复活
        await waitFor(() => {
            var msg = sendMessageTable[-27005]
            return msg && msg.currentX === msg.targetX && msg.currentY === msg.targetY
        })
        // 抢怪,这里实际出现过这种情况，上面监控Boss的时候(getMaxLevelBossToChallenge)Boss是复活的
        // 但是跑到这里的时候Boss正好刚刚die,而不是死亡等待复活，要排除这种情况
        messageTable[-6042] = false
        messageTable[-8226] = false
        var ret = await waitFor(() => {
            var bossChecker = CrossServerBossModel.inst.getBossByMapId(bossInfo.mapCfg.id)
            var t = bossChecker.reliveTime - ToolKit.getServerTime()
            // t<60 表示Boss正要复活或者0 已存活的Boss,而不会有刚刚死亡情况
            var msg = messageTable[-6042]
            if (t > 60) {
                return -2
            }
            if (messageTable[-8226] && messageTable[-8226]._bossID === bossInfo.mapCfg.id)
                CrossServerBossCtrl.getInst().reqEnterBoss(bossInfo.mapCfg.id)
            return getBossOwner(msg, bossInfo, bossInfo.cfg.id)
            // return msg&&msg.ownerAcount && bossInfo.reliveTime - ToolKit.getServerTime() <= 0
        }, 60e3, 100)
        if (ret === -1) { //退出
            SwitchMapControl.getInstance().doCrossServerSwitchMap(bossInfo.cfg.mapId)
        } else if (ret === 1) { //杀怪
            await challengeBossProcess(bossInfo, bossInfo.cfg.id, CrossServerBossModel.inst.bossInfos)

        } else if (ret === -2) { //Boss已经死亡
            console.log("Boss:%s已经死亡,继续下一个", bossInfo.mapCfg.name)
        }
        tasklock.unLock()
        console.log("龙城任务解锁成功")
        await timeout(3e3)
    }
}


function getDomainBossForLock() {
    exitCrossServerDomainSign = false;
    // 下面是所有Boss信息
    // CrossServerBossModel.inst.getMapInfo(30047) 30080为第５层
    var index = 5
    var stage = index === 4 ? 30047 : 30080
    var bossLevelArr = [500, 510, 520, 530, 540, 550, 560, 570, 580]
    var bossInfos = CrossServerBossModel.inst.getMapInfo(stage).bossInfos
    for (var i = bossInfos.length - 1; i >= 0; i--) {
        var boss = bossInfos[i]
        // 神兽战力达到要求
        var petBattleScore = LegendPetMdl.getInst().battleScore
        // CrossServerBossUtil.getSSPowerStr(i)
        var condition = boss.cfg.enterCondition
        // SwitchMapModel.instance.checkMapCondition(e)
        if (boss.attention === 1 && petBattleScore >= condition && boss.mapCfg.index === index &&
            !Object.keys(filterBossList).includes(boss.cfg.id + "") && bossLevelArr.includes(boss.monCfg.level)
        ) {
            if (boss.isDead === false) {
                console.log("发现可挑战的神域Boss:%s,准备锁定", boss.mapCfg.name)
                return boss;
            } else {
                var t = boss.reliveTime - ToolKit.getServerTime()
                if (boss.isDead === true && t < 60) {
                    console.log("神域Boss%s还有%ds复活，提前准备", boss.mapCfg.name, t)
                    return boss
                }
            }
        }
    }
    exitCrossServerDomainSign = true;
    // console.log("没有合适的神域Boss可以锁定");
    if (MapControl.getInstance().isCrossServer() && exitCrossServerSign === true) {
        CrossServerControl.instance.cmCrossServerLeave()
    }
    return false
}

// 神域
async function CrossDomainBossTask() {
    CrossDomainBossTask: while (1) {
        var leftCount = 0 //留几次
        var times = CrossServerBossModel.inst.chaosSecondLayerBossRemainCount
        if (times < leftCount + 1) {
            console.log("龙城神域任务完成")
            exitCrossServerDomainSign = true
            CrossServerBossModel.inst.remainCount == 0 && CrossServerBossCtrl.getInst().reqExitMap()
            break;
        }
        var bossInfo = await waitFor(() => {
            return getDomainBossForLock()
        }, 8 * 60 * 60e3)
        // 等待进入
        await waitFor(() => CrossServerBossModel.inst.enterChaosSecondLayerCD - ToolKit.getServerTime() <= 0, 70e3)
        await timeout(3e3)
        await tasklock.lock()
        console.log("神域锁定成功");
        CrossServerBossCtrl.getInst().gotoFightBoss(bossInfo.mapCfg.id)
        var ret = await waitFor(() => MapControl.getInstance().isCrossServer() && MapControl.instance.curMapCfg.id === 30047, 3e3)
        if (!ret) {
            console.log("进入神域地图失败,直接解锁")
            tasklock.unLock()
            continue CrossDomainBossTask;
        }
        console.log("进入神域地图成功")
        sendMessageTable[-27005] = false
        // 到了等待复活
        await waitFor(() => {
            var msg = sendMessageTable[-27005]
            return msg && msg.currentX === msg.targetX && msg.currentY === msg.targetY
        })
        // 抢怪
        messageTable[-6042] = false
        messageTable[-8226] = false
        var ret = await waitFor(() => {
            var bossChecker = CrossServerBossModel.inst.getBossByMapId(bossInfo.mapCfg.id)
            var t = bossChecker.reliveTime - ToolKit.getServerTime()
            // t<60 表示Boss正要复活或者0 已存活的Boss,而不会有刚刚死亡情况
            var msg = messageTable[-6042]
            if (t > 60) {
                return -2
            }
            if (messageTable[-8226] && messageTable[-8226]._bossID === bossInfo.mapCfg.id) {
                CrossServerBossCtrl.getInst().reqEnterBoss(bossInfo.mapCfg.id)
                messageTable[-8226] = false
            }
            return getBossOwner(msg, bossInfo, bossInfo.cfg.id)
            // return msg&&msg.ownerAcount && bossInfo.reliveTime - ToolKit.getServerTime() <= 0
        }, 60e3, 100)
        if (ret === -1) { //退出
            SwitchMapControl.getInstance().doCrossServerSwitchMap(bossInfo.cfg.mapId)
        } else if (ret === 1) { //杀怪
            await challengeBossProcess(bossInfo, bossInfo.cfg.id, CrossServerBossModel.inst.bossInfos)
            SwitchMapControl.getInstance().doCrossServerSwitchMap(bossInfo.cfg.mapId)
            // SwitchMapControl.getInstance().reqSwitchMap(SwitchMapControl.getInstance().preMapId)
        } else if (ret === -2) { //Boss已经死亡
            console.log("Boss:%s已经死亡,继续下一个", bossInfo.mapCfg.name)
        }
        tasklock.unLock()
        console.log("神域任务解锁成功")
        await timeout(3e3)
    }
}


function getBagItemModelIdByName(name) {
    //BagTb.Inst()　这个里面有所有的装备modelId和描述，包括元宝(1)
    for (var i in BagTb.Inst().map) {
        var l = temp1[i]
        if (l.name.indexOf(name) !== -1) {
            console.log(l)
            return l.id
        }
    }
    return 0;
}

// 玩家表
playerTable = {}
// return -1没有抢到归属 1自己归属，false需要继续抢怪
function getBossOwner(msg, bossInfo, bossuniquId) {
    if (msg && msg.ownerAcount && msg.playerList) {
        var ownerAccount = msg.ownerAcount //这里服务器拼写错误，重新赋值后使用正确的拼写
        var playerList = msg.playerList
        var ownNickName;
        for (var ownIndex in playerList) {
            var player = playerList[ownIndex],
                accountId = player.accountId
            if (typeof playerTable[bossuniquId] === 'undefined') {
                var accountObj = playerTable[bossuniquId] = {}
                accountObj[accountId] = player.serverName + "-" + player.nickName
            }
            if (player.accountId === ownerAccount) {
                ownNickName = player.nickName
                break;
            }
        }
        console.log("%s获得Boss:%s归属", ownNickName, bossInfo.mapCfg.name)
        if (ownerAccount != UserObj.getInstance()._countId) { //归属不是自己，直接退出，找下一个Boss杀
            filterBossList[bossuniquId] = bossInfo
            return -1
        } else { //自己归属
            return 1
        }
    }
    return false
}

/* 27168 battleRankList挑战者列表，定时刷新accountId,battleScore
    6036有人离开，主动和杀死都会触发account 6038有人进入account playerList:FighterInfoVO
*/
async function challengeBossProcess(bossInfo, bossuniquId, bossList) {
    var crossBossFighterAi = new fighterAI(bossInfo.mapCfg.name, bossInfo)
    crossBossFighterAi.bind(-6041, function (msg) { //打架响应事件6041
        if (msg.target == UserObj.getInstance()._countId) {
            console.log("受到%s攻击,反击", playerTable[bossuniquId][msg.attacker])
            ServerFightRealControl.getInstance().cmCrossServerSwitchTarget(msg.attacker)
        } else {
            if (playerTable[bossuniquId]['killerAccount']) { //自己被人kill过直接杀回去
                ServerFightRealControl.getInstance().cmCrossServerSwitchTarget(playerTable[bossuniquId]['killerAccount'])
            }
            console.log("%s正在攻击目标%s", playerTable[bossuniquId][msg.attacker], playerTable[bossuniquId][msg.target])
        }
    })
    crossBossFighterAi.bind(-6038, function (msg) { //6038
        var account = msg.account,
            playerList = msg.playerList;
        var nickName = "";
        for (var i in playerList) {
            var player = playerList[i]
            if (player.accountId === account) {
                nickName = player.serverName + "-" + player.nickName
                break;
            }
        }
        playerTable[bossuniquId][account] = nickName;
        console.log("玩家%s于%s进来打扰", nickName, ToolKit.timeFormat6(ToolKit.getServerTimeMS()))
    })
    crossBossFighterAi.bind(-6036, function (msg) { //6036
        var nickName = playerTable[bossuniquId][msg.account] ? playerTable[bossuniquId][msg.account] : ""
        console.log("玩家%s于%s离开", nickName, ToolKit.timeFormat6(ToolKit.getServerTimeMS()))
    })

    crossBossFighterAi.bind(-6040, (async function (msg) { //打架响应事件6040
        console.log(playerTable);
        if (msg.deadAccount == UserObj.getInstance()._countId) {
            console.log("被玩家%s杀害，杀回去", playerTable[bossuniquId][msg.killerAccount])
            playerTable[bossuniquId]['killerAccount'] = playerTable[bossuniquId][msg.killerAccount];
            if (CrossServerBossCtrl.getInst().isCrossServerBoss) { //龙城
                SwitchMapControl.getInstance().doCrossServerSwitchMap(bossInfo.cfg.mapId)
            } else if (InvadeBossCtrl.getInst().isCrossServerBoss) { //圣坛
                BloodCaveControl.getInst().reqExitBossMap()
            } else { //非跨域
                SwitchMapControl.getInstance().reqSwitchMap(MapControl.getInstance()._preMapId)
            }
            await timeout(3e3);
            CrossServerBossCtrl.getInst().gotoFightBoss(bossuniquId)
            ServerFightRealControl.getInstance().cmCrossServerSwitchTarget(msg.killerAccount)
        } else { //其它人的死亡信息直接舍弃
            console.log("玩家%s被%s杀害", playerTable[bossuniquId][msg.deadAccount], playerTable[bossuniquId][msg.killerAccount])
        }
    }))
    crossBossFighterAi.fight()
    await waitFor(() => {
        //filter列表里面有，或者boss死亡，或者归属面板打开
        for (var bossIndex in bossList) {
            var boss = bossList[bossIndex]
            if (boss.cfg.id === bossInfo.cfg.id && boss.isDead === true) {
                console.log("boss%s死亡", bossInfo.mapCfg.name)
                delete filterBossList[bossuniquId]
                delete playerTable[bossuniquId]
                return true
            }
        }
        if (typeof filterBossList[bossuniquId] === 'undefined') {
            return false
        } else {
            return true;
        }
    }, 6 * 60e3)
    crossBossFighterAi.notify();
    console.log("%s任务结束", bossInfo.mapCfg.name)
}

function checkGameIsOk() {
    return new Promise(resolve => {
        var dtc = setInterval(() => {
            if (window.FG && window.FG.mainConnecter) {
                console.log(FG)
                clearInterval(dtc)
                resolve()
            } else {
                console.log("FG还没有准备好");
            }
        }, 1000);
    })
}

async function BloodMinerTask() {
    var limit = 3;
    await tasklock.lock()
    console.log("失落矿洞Boss挑战锁定成功")
    for (var i = 0; i < limit; i++) {
        if (BloodMineMdl.getInst().leftCount === 0) {
            console.log("失落矿洞任务完成")
            break;
        }
        var selectedIndex = 0;
        for (var t = 0; t < BloodMineMdl.getInst().caves.length; t++) {
            if (!BloodMineMdl.getInst().caves[t].isOccupied) {
                selectedIndex = t;
                break
            }
        }
        var curCaveInfo = BloodMineMdl.getInst().caves[selectedIndex]
        BloodMineCtrl.getInst().confirmEnter(curCaveInfo)
        console.log("失落矿洞挑战第%d次", i + 1)
        messageTable[-10833] = false
        await waitFor(() => BloodMineCtrl.getInst().bossEndPanel && BloodMineCtrl.getInst().bossEndPanel.isOpen)
        BloodMineCtrl.getInst().bossEndPanel && BloodMineCtrl.getInst().bossEndPanel.close()
        var msg = await getMessageFromServerById(-10833, 3e3)
        if (msg && msg.isWin) { //胜利
            BloodMineCtrl.getInst().confirmExitBoss();
            i = 0;
            SwitchMapControl.getInstance().reqSwitchMap(SwitchMapControl.getInstance().preMapId)
            await timeout(3e3)
        } else { //失败
            if (i + 1 == limit) { //直接扫荡
                BloodMineCtrl.getInst().reqSweep()
            }
        }
    }
    BloodMineCtrl.getInst().closeAll();
    tasklock.unLock()
    console.log("失落矿洞解锁成功");
}

function getBloodMinerRobTaskDataForLock() {
    var list = BloodMineMdl.getInst().robList
    for (var i in list) {
        var robItem = list[i]
        if (robItem.inCD === false && robItem.rankInfo.battleScore.toNumber() < UserObj.instance.getTotalFightPower() + 2e6) { //可以抢夺
            return robItem;
        }
    }
}
bloodMinerFilterList = {}
async function BloodMinerRobTask() {
    while (1) {
        if (BloodMineMdl.getInst().leftRobCount === 0) {
            console.log("矿坑抢夺完成")
            break;
        }
        var info = await waitFor(() => {
            return getBloodMinerRobTaskDataForLock()
        }, 8 * 60 * 60e3, 30e3);
        console.log("矿坑任务有数据，可以锁定", info)
        // 又列表才开始执行
        await tasklock.lock()
        console.log("矿坑任务锁定成功")
        await timeout(3e3)
        BloodMineCtrl.getInst().reqMineCaveRob(info.rankInfo.account)
        await waitFor(() => BloodMineCtrl.getInst().robEndPanel && BloodMineCtrl.getInst().robEndPanel.isOpen, 30e3)
        if (BloodMineCtrl.getInst().robEndPanel && !BloodMineCtrl.getInst().robEndPanel.isWin) { //如果失败，记录失败次数
            bloodMinerFilterList[info.account] = bloodMinerFilterList[info.account] ? bloodMinerFilterList[info.account] + 1 : 1;
        } else { //成功如果存在，剔除
            typeof bloodMinerFilterList[info.account] !== 'undefined' && delete bloodMinerFilterList[info.account]
        }
        BloodMineCtrl.getInst().closeAll()
    }
    tasklock.unLock();
    console.log("矿坑任务解锁成功")
}

(async () => {
    await checkGameIsOk()
    // console.group()
    console.log("FG已经准备好，可以开始Hook")

    console.log("开始准备执行任务")
    var reqSwitchMap = new window.ReqSwitchMap,
        cm_MapMove = new window.CM_MapMove,
        reqCopyJySweepMap = new(window.ReqCopyJySweepMap),
        conn = FG.mainConnecter;
    window.conn = conn;
    await timeout(10e3)
    //-6203
    console.log("十秒等待完毕")
    updateTaskTimes()
    // babelTask()
    // BloodMinerTask()
    // return
    //========这里是只需发送消息的任务，优先测试完成start============
    //巅峰宝藏一键领取定时任务
    GetVipTreasurePointTask()

    // 6810 传世手册一键领取,没有效果，可能需要先发送打开界面，因为这个活动不是每次都有，不重要
    conn.send((new CM_LegendBookReward), 0)
    // 战纹塔免费扫荡3次
    reqCopyJySweepMap.times = parseInt(ConfigValueTb.getInstance().getContenById(10282)) - CopyModel.getInstance().sweepTimes;
    conn.send(reqCopyJySweepMap, 0);
    await waitFor(() => CopyControl.getInstance()._jyQuickEndPanel &&
        CopyControl.getInstance()._jyQuickEndPanel.isOpen, 3e3);
    CopyControl.getInstance().closeJyQuickEndPanel()
    // vipBoss总是会再次多出一次,处理掉
    var cm = new CM_Sweep();
    cm.sweepResourceId = 1, cm.times = 1,
        cm.objectId = 0, cm.needSweepItem = false;
    conn.send(cm, 0)
    // 扫荡任务
    sweepTask()
    // 签到DanTask
    SignControl.getInstance().reqSign(SignControl.getInstance())
    // 第3,7,14,28天的签到领取
    var signData = SignModel.getInst().signData;
    SignControl.getInstance().reqReward(signData.totalDays);

    // 3257 每日排行榜
    var cm_DoWorship = new CM_DoWorship
    conn.send(cm_DoWorship, 0)
    // 7172 2637 沙城每日俸禄，以前是后面那个现在(更新行会领地战后)变成前面的了，两个都去请求
    TerraWarCtrl.instance.reqTerraWarSalary();
    ShabakShowControl.getInstance().getAllianceCSSalary()

    // 竞技场每日奖励 CM_RewDanPreRank 3525
    var cm_RewDanPreRank = new CM_RewDanPreRank
    conn.send(cm_RewDanPreRank, 0)

    // 行会商店兑换 4103 id=14(暗域boss卷抽),num=2,20矿工，24镖车，15烧猪，16财富
    AllianceMallControl.getInst().reqBuyAllianceMall(14, 2)
    AllianceMallControl.getInst().reqBuyAllianceMall(17, 3) //矿石
    AllianceMallControl.getInst().reqBuyAllianceMall(20, 2)
    AllianceMallControl.getInst().reqBuyAllianceMall(24, 2)

    // 声望商店购买
    PrestigeShopCtrl.getInst().reqBuyItem(101, 6)
    PrestigeShopCtrl.getInst().reqBuyItem(104, 1) //图纸
    PrestigeShopCtrl.getInst().reqBuyItem(112, 3) //灵丹
    PrestigeShopCtrl.getInst().reqBuyItem(111, 3)

    // 领取活跃度异步定时任务
    getPointTask()

    //摇钱树
    MoneyTreeTask()
    // 邮件自动处理
    MailTask();
    //========这里是只需发送消息的任务，优先测试完成end============
    // return;
    // ===== 主城任务start =============
    // 野战
    EncounterTask()

    BagModel.getInstance().getItemNumByModelId(201) // 铁矿石　
    BagModel.getInstance().getItemNumByModelId(51) // 烧猪
    BagModel.getInstance().getItemNumByModelId(58) // 财富指南　
    BagModel.getInstance().getItemNumByModelId(71) // 镖车升级令牌　
    BagModel.getInstance().getItemNumByModelId(429) // 浮岛

    if (BagModel.getInstance().getItemNumByModelId(51) < 6) { //烧猪
        AllianceMallControl.getInst().reqBuyAllianceMall(15, 6 - BagModel.getInstance().getItemNumByModelId(51))
    }
    if (BagModel.getInstance().getItemNumByModelId(58) < 6) { //财富指南　
        AllianceMallControl.getInst().reqBuyAllianceMall(16, 6 - BagModel.getInstance().getItemNumByModelId(58))
    }
    console.log("烧猪:%d,浮岛:%d,财富:%d", BagModel.getInstance().getItemNumByModelId(51),
        BagModel.getInstance().getItemNumByModelId(429),
        BagModel.getInstance().getItemNumByModelId(58));

    //竞技场
    DanTask()
    // 经验
    startExpFb()
    //命盘
    GodHoodBossTask()
    // 传世奇城
    ExpeditionTask()

    // 通天塔
    babelTask()

    // 挖矿
    // MinerTask()
    // 护送
    // AllianceTask()
    // ===== 主城任务end =============

    // ====== Boss任务start ===========

    // 浮岛
    YijieTask()
    // 传世
    LegendBossTask()
    LegendBossToneTask()
    // return
    // 暗域
    NeutralBossTask()
    // return
    // ====== Boss任务end ===========

    //======= 跨服任务start ========

    await waitFor(() => {
        return getTimesById(32) === 0 && //命盘
            getTimesById(2) === 0 && //经验副本
            EncounterModel.getInstance().getRestTimes() === 0 && //野战
            ExpeditionModel.instance().dailyRemainCount === 0 && //传世奇城
            // LittleBossInvadeModel.getInst().enterCount === 0 && //苍神
            (getTimesById(30) === 0 || BagModel.getInstance().getItemNumByModelId(429) < 10) && //　浮岛
            LegendBossModel.getInst().getRemainCount(30016) === 0 && //秘境
            NeutralModel.instance.restTimes === 0 //&& //暗域
        LegendBossModel.getInst().getRemainCount(30043) === 0 //神石
    }, 8 * 60 * 60e3)
    console.log("主线任务完成");
    // 苍神
    cangShenTask();
    // 龙城
    CrossServerBossTask()
    BloodCaveTask()
    CrossDomainBossTask()
    //======= 跨服任务end ======
    return;

    // 2377 _no:1 _answer:1行会答题 7902 7903 邀请传功
    // -8854 刷新战将商店商品
    // 8851 {goodsIndex:0,num:1} 购买战将商店商品
    // 1413 {roleId:a} 角色升级按钮
    // 2450 护盾装备一键替换
    // 6571 神格一键强化 type=10 playerid type=0 装备一键强化 11护盾一键淬炼 4血脉
    // 6579 神兵 type:1蚩尤甲 2轩辕剑 4后羿弓 6577 内功功法一键修炼
    // 31338 内功功法突破  1531 金钟罩一键修炼consume:83
    // 2908 宝石一键镶嵌 31495:神翼淬火
    // 7006 3517 日常 限时活动  5503 id:111为Boss入侵领取32为陨落神迹
    // 8804 巅峰战报名
    // 8601 战纹升级 6580战灵Boss解锁 6561进入挑战 6562确认召唤战灵 6567 可能是提示召唤卷不足，可以退出
    // 1251战纹塔挑战 mapid增加即为下一关 1253失败提醒
    // 合成灵丹最高 2401 composeID:74
    // 5643 Boss入侵消息提醒
    // 发送2454刷新护盾装备打造响应 2458   2448打造  ShieldEquipMdl.getInst().checkIsBetter(this.info.itemInfo, !0) 是否更好
    // 2718 购买藏身商店 shopId:101 111





})()
