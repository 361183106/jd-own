/*
16,46 * * * * https://gitee.com/misyi/jd-own/raw/master/wool/ttayn_autoup.js, tag=天天爱养牛快速合成, enabled=true

环境变量：多个账号用|||分割
ttayn_userid
ttayn_token

todo 邀请、出售低级牛、自动活动
*/
const $ = new Env('天天爱养牛快速合成');
// const notify = $.isNode() ? require('./sendNotify') : '';
// let userid = process.env.ttayn_userid;
// let token = process.env.ttayn_token;

let buy_level = 5;
let cow_map = new Map()
let process_map = new Map()
let reFlag = false, afk, energy = 0

let userIdList, tokenList
let default_header = {
    "Accept-Encoding": "identity",
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; MI 8 MIUI/9.9.3)",
    "Host": "8.140.168.52",
    "Connection": "keep-alive"
}


!(async () => {
    if (!process.env.ttayn_userid) {
        console.log(`没有配置账号，不执行脚本`)
        return
    }
    userIdList = process.env.ttayn_userid.split('|||');
    tokenList = process.env.ttayn_token.split('|||');
    console.log(`--- 牛牛挂机：共计 ${userIdList.length} 个账号 ---\n`)
    for (let num = 0; num < userIdList.length; num++) {
        console.log(`----- 账号 ${num+1} 开始操作 -----\n`)
        await cow_info(num, true)
        await user_home(num)
        await cow_afk(num)
        if (afk > 0) {
            console.log(`有离线金币，等待 35 秒进行翻倍`)
            await $.wait(35000)
            await cow_afk_doubled(num)
        }
        // todo 清理低级牛
        for (const cowKey in cow_map) {
            let level = cow_map[cowKey].level;
            if (level < buy_level) {
                console.log(`可购买 ${buy_level} 级，应该清理 位置：${cow_map[cowKey].post}, 等级：${level}`)
            }
        }

        // 转盘
        await turntables_info(num);
        if (energy > 0) {
            console.log(`--- 开始转盘 ---`)
            for (let energy_count = 0;energy_count<energy;energy_count++) {
                let info = await turntables_start(num);
                if (info.turntables_id == 2) {
                    console.log(`开始攻击`)
                    let allAlong = true
                    while (allAlong) {
                        console.log(`开始作弊，一直攻击！`)
                        allAlong = await attack(num, info.enemy[0].id)
                    }
                }
                if (info.turntables_id == 4) {
                    // 偷取能量
                    console.log(`开始偷取金币`)
                    let allAlong = true
                    while (allAlong) {
                        console.log(`开始作弊，一直偷取！`)
                        allAlong = await steal(num, info.goal[0].id)
                    }
                }
            }
        }

        let count = 1;
        while (true && buy_level && !reFlag) {
            await $.wait(357)
            // console.log(`开始第 ${count} 波操作！`)
            let length = Object.keys(process_map).length;
            if ((length < 1) || (length == 1 && process_map['null'] != null)) {
                await cow_buy(num, buy_level)
            } else {
                for (let processMapKey in process_map) {
                    if (processMapKey && processMapKey != 'null' && process_map[processMapKey]) {
                        let post = process_map[processMapKey];
                        console.log(`合成牛：[${post[0].post}],[${post[1].post}], 合成等级 ${post[0].level+1}`)
                        await cow_upgrade(num, post[0].post, post[1].post)
                    }
                }
                await cow_info(num, false)
            }
            count++
        }

        // 开始领取红包
        console.log("----------------- 开始领取红包 -------------------")
        let envelope_info = await envelope_home(num);
        let shengyu_cishu = await get_user_envelope_num(num);
        console.log(`可领取红包的剩余次数：${shengyu_cishu}`)
        if (shengyu_cishu > 0) {
            let worldList = envelope_info.word_group.history_message_list;
            if (worldList) {
                console.log(`开始领取世界红包`)
                let hasRedCount = 0
                for (let worldKey in worldList) {
                    // 红包状态： 1-已过期 2-待领取 3-已领取
                    if (worldList[worldKey].status == 2) {
                        let flag = await envelope_obtain(num, 'all', worldList[worldKey].type, worldList[worldKey].id);
                        if (!flag) {
                            console.log(`无法再领取红包，直接跳出！`)
                            return
                        }
                        console.log(`等待 35 秒再领取下一个红包！`)
                        await $.wait(35278)
                        hasRedCount++
                        if (hasRedCount >= 10) {
                            console.log(`单次运行最多领 10 个红包！`)
                            return
                        }
                    }
                }
            }
        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

// 购买牛
function cow_buy(num, level, timeout=0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/buy_pet?user_id=${userIdList[num]}&token=${tokenList[num]}&allow_buy=${level}`,
            headers: default_header
        }
        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code == 20000) {
                    buildCowMap(result.data)
                    console.log(`购买牛：${level}级 -》` + result.msg)
                } else {
                    console.log(`购买牛：${level}级 -》` + result.msg)
                    // notify.sendNotify("合成失败", result.message);
                    if (result.msg.indexOf("没有空位了") != -1) {
                        await cow_info(num, false)
                    }
                    if (result.msg.indexOf("金币不足") != -1) {
                        reFlag = true
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

// 合成牛
function cow_upgrade(num, one, two, timeout=0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/upgrade?user_id=${userIdList[num]}&token=${tokenList[num]}&one_position_serial_number=${one}&two_position_serial_number=${two}`,
            headers: default_header
        }
        $.get(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    buy_level = result.data.allow_buy;
                } else {
                    console.log(`结果：` + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

// 获取牛信息
function cow_info(num, showMsg, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/enter_farms?user_id=${userIdList[num]}&token=${tokenList[num]}`,
            headers: default_header
        }
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    let data = result.data;
                    buy_level = data.allow_buy;
                    console.log('金币数量 ' + data.gold)
                    if (showMsg) {
                        console.log('现金：' + data.RMB)
                        console.log('金币：' + data.gold)
                        console.log('允许购买等级：' + data.allow_buy)
                        console.log('最大等级：' + data.max_level)
                        console.log('金币增长速度：' + data.total_gold_income)
                        console.log('------------ 牛信息 ---------------')
                        let niu = result.data.niu;
                        for (let index in niu) {
                            if (niu[index].pet_serial_number) {
                                console.log(`位置：${niu[index].position_serial_number}, 等级：${niu[index].pet_serial_number}`)
                            }
                        }
                    }
                    buildCowMap(data)
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}



// 查询离线信息
function cow_afk(num, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/afk_gold_income?user_id=${userIdList[num]}&token=${tokenList[num]}`,
            headers: default_header
        }
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    let data = result.data;
                    console.log(`离线金币 ${data.afk_gold_income}`)
                    afk = data.afk_gold_income
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}


// 离线金币翻倍
function cow_afk_doubled(num, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/afk_gold_income_doubled?user_id=${userIdList[num]}&token=${tokenList[num]}`,
            headers: default_header
        }
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    console.log(`离线金币翻倍成功, 总金币 ${result.data}`)
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}


// 出售低级牛
function cow_recycle(num, position, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/recycle?user_id=${userIdList[num]}&token=${tokenList[num]}&position_serial_number=${position}`,
            headers: default_header
        }
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    console.log(`离线金币翻倍成功, 总金币 ${result.data}`)
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}


// 转盘信息
function turntables_info(num, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/turntables_info?user_id=${userIdList[num]}&token=${tokenList[num]}`,
            headers: default_header
        }
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    console.log(`转盘可以转 ${result.data.energy} 次`)
                    energy = result.data.energy
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

// 开始转盘
function turntables_start(num, timeout = 0) {
    return new Promise((resolve) => {
        let info
        let url = {
            url: `http://8.140.168.52/api/turntables_start?user_id=${userIdList[num]}&token=${tokenList[num]}`,
            headers: default_header
        }
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    info = result.data;
                    if (info.turntables_id == 1) {
                        console.log(`转到【少量收益】`)
                    } else if (info.turntables_id == 2) {
                        console.log(`转到【攻击】`)
                    } else if (info.turntables_id == 3) {
                        console.log(`转到【少量收益】`)
                    } else if (info.turntables_id == 4) {
                        console.log(`转到【偷取】`)
                    } else if (info.turntables_id == 5) {
                        console.log(`转到【大量收益】`)
                    } else if (info.turntables_id == 6) {
                        console.log(`转到【护盾】`)
                    } else if (info.turntables_id == 7) {
                        console.log(`转到【战斗能量】`)
                    }
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(info)
            }
        }, timeout)
    })
}


// 偷取
function steal(num, steal_user_id, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
        url: `http://8.140.168.52/api/steal?user_id=${userIdList[num]}&token=${tokenList[num]}&steal_user_id=${steal_user_id}&type=3`,
        headers: default_header
        }
        let allAlong = true
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    console.log(`偷取成功!`)
                } else {
                    allAlong = false
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(allAlong)
            }
        }, timeout)
    })
}


// 用户信息
function user_home(num, attack_user_id, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
        url: `http://8.140.168.52/api/user_home?user_id=${userIdList[num]}&token=${tokenList[num]}`,
        headers: default_header
        }
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    if (!result.data.parent_id || !result.data.parent_name) {
                        console.log("用户没有上级，开始绑定默认上级！")
                        parent_add(num)
                    }
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

// 添加邀请人
function parent_add(num, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/parent_add?user_id=${userIdList[num]}&token=${tokenList[num]}&invite_code=83S91T`,
            headers: default_header
        }
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    console.log('\n ' + result.msg)
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

// 红包主页信息
function envelope_home(num, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/envelope_home?user_id=${userIdList[num]}&token=${tokenList[num]}`,
            headers: default_header
        }
        let envelope_info
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    envelope_info = result.data
                    console.log('\n ' + result.msg)
                } else {
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(envelope_info)
            }
        }, timeout)
    })
}

// 获取可领取红包数量
function get_user_envelope_num(num, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/get_user_envelope_num?user_id=${userIdList[num]}&token=${tokenList[num]}`,
            headers: default_header
        }
        let count
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    count = result.data.shengyu_cishu
                    console.log( result.msg)
                } else {
                    count = 0
                    console.log(result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(count)
            }
        }, timeout)
    })
}

// 领取红包
function envelope_obtain(num, group, type, envelope_id, timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `http://8.140.168.52/api/envelope_obtain?user_id=${userIdList[num]}&token=${tokenList[num]}&group=${group}&type=${type}&envelope_id=${envelope_id}&status=2`,
            headers: default_header
        }
        let flag = true
        $.get(url, (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 20000) {
                    console.log(`红包领取成功：${result.data.number}`)
                } else {
                    flag = false
                    console.log('\n ' + result.msg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(flag)
            }
        }, timeout)
    })
}




function buildCowMap(data) {
    let niu = data.niu;
    cow_map = new Map()
    for (let i = 0; i < niu.length; i++) {
        let positionSerialNumber = niu[i].position_serial_number;
        let petSerialNumber = niu[i].pet_serial_number;
        if (petSerialNumber) {
            let cowMapElement = cow_map[petSerialNumber];
            if (!cowMapElement) {
                cowMapElement = []
            }
            cowMapElement.push({post:positionSerialNumber,level:petSerialNumber})
            cow_map[petSerialNumber] = cowMapElement
        }
    }
    process_map = new Map()
    for (let cow_key in cow_map) {
        if (cow_key && cow_map[cow_key].length >= 2) {
            let cowValue = cow_map[cow_key];
            process_map[cow_key] = cowValue
        }
    }
}

function message() {
    if (tz == 1) {
        $.msg($.name, ``, $.message)
    }
}

function RT(X, Y) {
    do rt = Math.floor(Math.random() * Y);
    while (rt < X)
    return rt;
}

console.log('\n' + getCurrentDate());

function getCurrentDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }

        send(t, e = "GET") {
            t = "string" == typeof t ? {url: t} : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }

        get(t) {
            return this.send.call(this.env, t)
        }

        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }

    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
        }

        isNode() {
            return "undefined" != typeof module && !!module.exports
        }

        isQuanX() {
            return "undefined" != typeof $task
        }

        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }

        isLoon() {
            return "undefined" != typeof $loon
        }

        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }

        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }

        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {
            }
            return s
        }

        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }

        getScript(t) {
            return new Promise(e => {
                this.get({url: t}, (t, s, i) => e(i))
            })
        }

        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), a = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {script_text: t, mock_type: "cron", timeout: r},
                    headers: {"X-Key": o, Accept: "*/*"}
                };
                this.post(a, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }

        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
            return r
        }

        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }

        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }

        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }

        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }

        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }

        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }

        get(t, e = (() => {
        })) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => {
                const {message: s, response: i} = t;
                e(s, i, i && i.body)
            }))
        }

        post(t, e = (() => {
        })) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t)); else if (this.isNode()) {
                this.initGotEnv(t);
                const {url: s, ...i} = t;
                this.got.post(s, i).then(t => {
                    const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                    e(null, {status: s, statusCode: i, headers: r, body: o}, o)
                }, t => {
                    const {message: s, response: i} = t;
                    e(s, i, i && i.body)
                })
            }
        }

        time(t) {
            let e = {
                "M+": (new Date).getMonth() + 1,
                "d+": (new Date).getDate(),
                "H+": (new Date).getHours(),
                "m+": (new Date).getMinutes(),
                "s+": (new Date).getSeconds(),
                "q+": Math.floor(((new Date).getMonth() + 3) / 3),
                S: (new Date).getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
            return t
        }

        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {"open-url": t} : this.isSurge() ? {url: t} : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
                        return {openUrl: e, mediaUrl: s}
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
                        return {"open-url": e, "media-url": s}
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {url: e}
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
            let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
            h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
        }

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
            this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
