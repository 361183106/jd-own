/*
202107014 tom

软件名：红包     一天3~5元   cron设置每10分钟一次

食用方法：首页看一个视频，等待获取红包即可

签到没有写，就写了看视频，想要提现1元需要签到5天
/////////////////////////////////////////////////////////////////////////////
撸了不一定有，不撸肯定没有！
TG频道 https://t.me/tom_ww


[task_local]
*\/10 * * * *  hbsp.js, tag=红包视频, enabled=true

boxjs地址 ： https://raw.githubusercontent.com/xl2101200/-/main/tom.box.json
/////////////////////////////////////////////////////////////////////////////
v2p配置

【REWRITE】
匹配链接（正则表达式） https://hbapi.qudianyue.com/video
对应重写目标   https://raw.githubusercontent.com/xl2101200/-/main/hbsp.js

【MITM】
hbapi.qudianyue.com

/////////////////////////////////////////////////////////////////////////////
*/



const $ = new Env('红包视频');
let status;
status = (status = ($.getval("hbspstatus") || "1")) > 1 ? `${status}` : ""; // 账号扩展字符
let hbsphd = '{"Content-Type":"application/x-www-form-urlencoded","Host":"hbapi.qudianyue.com","Connection":"Keep-Alive","Accept-Encoding":"gzip","User-Agent":"okhttp/3.10.0"}';
let hbspbody = 'is_chaping=0&umeng_token=&system_info=NOH%2CHUAWEI%2CNOH-AN00&lng=121.477292&data=%7B%22is_chaping%22%3A%220%22%2C%22umeng_token%22%3A%22%22%2C%22system_info%22%3A%22NOH%2CHUAWEI%2CNOH-AN00%22%2C%22lng%22%3A%22121.477292%22%2C%22channel%22%3A%22yingyongbao%22%2C%22video_index%22%3A%221%22%2C%22videoId%22%3A%223%22%2C%22language%22%3A%22cn%22%2C%22type%22%3A%220%22%2C%22is_root%22%3A%220%22%2C%22m%22%3A%22getGold%22%2C%22userId%22%3A%224678946%22%2C%22version%22%3A%223.1.0%22%2C%22device_info%22%3A%22NOH-AN00%22%2C%22t%22%3A%221626239455171%22%2C%22is_doublerunning%22%3A%220%22%2C%22play_ad%22%3A%22native%22%2C%22device%22%3A%222b918a941149fd52%22%2C%22m_total_gold%22%3A%220%22%2C%22lat%22%3A%2231.224748%22%7D&channel=yingyongbao&sign=pzQynJg%2BxSyaqi79ys14xvb6nqKnbGCDs6toaa2fw7rNJ8GYAeJt6LTttmS3wZSm45jmuNBbE5s9%0ADmBxgNspI2u%2BtlX4JfWMMi0y5cRM21EUnFIDiCwuOk4TlfClXMqUdHLSTRQ4FMxTiVU7yBFDZ%2Fsi%0A7%2B1uvd92f2uSQ0b9mF5XOyGLfIwyrMvZm%2F%2BKR9lKS8yzHATgKxajZkNHhXUQoqeclgEoTu47wIxZ%0AS1lbkLtRdHANhqCF8aPsoAu74KILSXLDrqbhREoG6D3LFVomvRep4kRi4pQqv1OHyqDr%2Ffs3RYTt%0AkzupV0bKJS3wIz78K9s1lb5oV3m6dwWyUmetu0I3lsHRJHRv3%2FxU1SxMftD5XqlsyUaghUxI0OJA%0AWUhnws3v3T6iJr1JsLIM6OPVwdqpcOXVQCK%2Fi1544O5kRLt23i8Vl2%2BGRd6Pqu03ry3GsVakBK6h%0AUERaLX3BVkBNzvpEGF0M7yynyz7ZngPdEBMVpgbh8GRUFgcF7R5P4YtObCbR6ZnBKTD6nJLH5e7P%0ATQl80hcu%2BZ2umwrf8znG%2F533eyMtjfzWk6EevQm9H6Ls4TbnHm%2FVCG%2BPm3D85xXp4bctHFWWFq94%0ArhPmzm2NemRM7uKpmc31DUCM44Oe7TNcSIUMULWLru6zqUlewrjYuxuSaMjrzMAytIMKc3Ptw5o%3D&video_index=1&videoId=3&language=cn&type=0&is_root=0&m=getGold&userId=4678946&version=3.1.0&device_info=NOH-AN00&t=1626239455171&is_doublerunning=0&play_ad=native&device=2b918a941149fd52&m_total_gold=0&lat=31.224748|||is_chaping=0&umeng_token=&system_info=NOH%2CHUAWEI%2CNOH-AN00&lng=121.477292&data=%7B%22is_chaping%22%3A%220%22%2C%22umeng_token%22%3A%22%22%2C%22system_info%22%3A%22NOH%2CHUAWEI%2CNOH-AN00%22%2C%22lng%22%3A%22121.477292%22%2C%22channel%22%3A%22yingyongbao%22%2C%22video_index%22%3A%227%22%2C%22videoId%22%3A%224%22%2C%22language%22%3A%22cn%22%2C%22type%22%3A%220%22%2C%22is_root%22%3A%220%22%2C%22m%22%3A%22getGold%22%2C%22userId%22%3A%224679126%22%2C%22version%22%3A%223.1.0%22%2C%22device_info%22%3A%22NOH-AN00%22%2C%22t%22%3A%221626242880185%22%2C%22is_doublerunning%22%3A%220%22%2C%22play_ad%22%3A%22native%22%2C%22device%22%3A%220dd49750e8a7d406%22%2C%22m_total_gold%22%3A%221428%22%2C%22lat%22%3A%2231.224748%22%7D&channel=yingyongbao&sign=b9Klv4mwzuJ7%2FN4jt%2FWxGz%2B%2BgTbrDi9G7JZAdnjJOulJTigJ2mr3pYoaxTwyUi%2BHuNmWURWlOENo%0AKmIlunqM0XYx8hUgQQNHRh%2Bw2BNeZX7x%2Bjetx9GFUh7sZDnlkKD1l7z7eTwkogohNDtEgbHvnK%2Bw%0ADP%2BjSWDvb3uTisprK4SabR47fYjoY6AeLVXghf8zHamprIaNVoXIAywSH5JPxdTKUwm9e6C974T8%0Am1LG9FS0l1o0gOyD%2FUTwCdY1%2FppKRqM%2BIBioKS%2BYQR2RgqNvJG5w547cTPdwaY7qcexFeq%2BAzOoL%0AGadT7J%2FsvtOb2anUdhdhRNhTGJIzMT8i7bPm9nHDXTFtQK2Pfv8CKnXeyYRSaJnZMKrcwU%2Bxcx8q%0AeUiYfLTYK6kdSaX9dEgpc0z7SA7Nz8SCjeeC7BfBe5N44uRfLS%2B1vfcZPsY1LqA36ZFNZa1UAOMQ%0AhO%2FHCqQzpGPJub7ppvMhUqRC%2FagEbiAPR75l8JUsxcE4i%2FSlM7qmg74Qb6oYmdxhqpQ%2BQvDTwkyF%0AEQMpeu%2Fa5Aa1XNaK9jZujv3e1jRvMou%2BstE5lDe1a9%2FyfYYjsnfheNB7QldSG8fnPqiJy9BCPE7S%0A9tw82pBzFScGrTLVr4SxLXCyZJJ0ukMAp%2F4swG8Ad9VRPN8rSmA9cIkDAKQR9qC8aEUo6ChgdMo%3D&video_index=7&videoId=4&language=cn&type=0&is_root=0&m=getGold&userId=4679126&version=3.1.0&device_info=NOH-AN00&t=1626242880185&is_doublerunning=0&play_ad=native&device=0dd49750e8a7d406&m_total_gold=1428&lat=31.224748';
let times = new Date().getTime();
let DD = RT(60000, 100000);
let tz = ($.getval('tz') || '1');
$.message = ''


!(async () => {
    let hbspbodys = hbspbody.split("|||");
        console.log(
            `\n\n=============================================== 脚本执行 - 北京时间(UTC+8)：${new Date(
                new Date().getTime() +
                new Date().getTimezoneOffset() * 60 * 1000 +
                8 * 60 * 60 * 1000
            ).toLocaleString()} ===============================================\n`
        );
        console.log(`=================== 共${hbspbodys.length}个账号 ==================\n`)
        for (let i = 0; i < hbspbodys.length; i++) {
            if (hbspbodys[i]) {
                hbspbody = hbspbodys[i];
                $.index = i + 1;
                console.log(`\n【 红包视频 账号${$.index} 】`)

                await $.wait(DD)

                for (let x = 0; x < 5; x++) {
                    $.index = x + 1
                    console.log(`\n第${x + 1}次看视频！`)

                    await hbspksp()
                    await $.wait(18000)


                }

            }
        }
    message()
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())



//看视频
function hbspksp(timeout = 0) {
    return new Promise((resolve) => {
        let url = {
            url: `https://hbapi.qudianyue.com/video?&t=${times}&m=getGold`,
            headers: JSON.parse(hbsphd),
            body: hbspbody,
        }
        $.post(url, async (err, resp, data) => {
            try {
                data = JSON.parse(data)

                if (data.success == true) {

                    console.log(`【看视频领金币】：${data.result}\n`)
                    $.message += `【看视频领金币】：${data.result}\n`

                } else {

                    console.log(`【看视频领金币】：${data.failDesc}\n`)
                    $.message += `【看视频领金币】：${data.failDesc}\n`
                }

            } catch (e) {

            } finally {
                resolve()
            }
        }, timeout)
    })
}





function message() {
    if (tz == 1) { $.msg($.name, "", $.message) }
}

function RT(X, Y) {
    do rt = Math.floor(Math.random() * Y);
    while (rt < X)
    return rt;
}



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


function Env(name, opts) {
    class Http {
        constructor(env) {
            this.env = env
        }
        send(opts, method = 'GET') {
            opts = typeof opts === 'string' ? {
                url: opts
            } : opts
            let sender = this.get
            if (method === 'POST') {
                sender = this.post
            }
            return new Promise((resolve, reject) => {
                sender.call(this, opts, (err, resp, body) => {
                    if (err) reject(err)
                    else resolve(resp)
                })
            })
        }
        get(opts) {
            return this.send.call(this.env, opts)
        }
        post(opts) {
            return this.send.call(this.env, opts, 'POST')
        }
    }
    return new (class {
        constructor(name, opts) {
            this.name = name
            this.http = new Http(this)
            this.data = null
            this.dataFile = 'box.dat'
            this.logs = []
            this.isMute = false
            this.isNeedRewrite = false
            this.logSeparator = '\n'
            this.startTime = new Date().getTime()
            Object.assign(this, opts)
            this.log('', `🔔${this.name
            }, 开始!`)
        }
        isNode() {
            return 'undefined' !== typeof module && !!module.exports
        }
        isQuanX() {
            return 'undefined' !== typeof $task
        }
        isSurge() {
            return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
        }
        isLoon() {
            return 'undefined' !== typeof $loon
        }
        isShadowrocket() {
            return 'undefined' !== typeof $rocket
        }
        toObj(str, defaultValue = null) {
            try {
                return JSON.parse(str)
            } catch {
                return defaultValue
            }
        }
        toStr(obj, defaultValue = null) {
            try {
                return JSON.stringify(obj)
            } catch {
                return defaultValue
            }
        }
        getjson(key, defaultValue) {
            let json = defaultValue
            const val = this.getdata(key)
            if (val) {
                try {
                    json = JSON.parse(this.getdata(key))
                } catch { }
            }
            return json
        }
        setjson(val, key) {
            try {
                return this.setdata(JSON.stringify(val), key)
            } catch {
                return false
            }
        }
        getScript(url) {
            return new Promise((resolve) => {
                this.get({
                    url
                }, (err, resp, body) => resolve(body))
            })
        }
        runScript(script, runOpts) {
            return new Promise((resolve) => {
                let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
                httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
                let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
                httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
                httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
                const [key, addr] = httpapi.split('@')
                const opts = {
                    url: `http: //${addr}/v1/scripting/evaluate`,
                    body: {
                        script_text: script,
                        mock_type: 'cron',
                        timeout: httpapi_timeout
                    },
                    headers: {
                        'X-Key': key,
                        'Accept': '*/*'
                    }
                }
                this.post(opts, (err, resp, body) => resolve(body))
            }).catch((e) => this.logErr(e))
        }
        loaddata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                if (isCurDirDataFile || isRootDirDataFile) {
                    const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
                    try {
                        return JSON.parse(this.fs.readFileSync(datPath))
                    } catch (e) {
                        return {}
                    }
                } else return {}
            } else return {}
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                const jsondata = JSON.stringify(this.data)
                if (isCurDirDataFile) {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                } else if (isRootDirDataFile) {
                    this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                } else {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                }
            }
        }
        lodash_get(source, path, defaultValue = undefined) {
            const paths = path.replace(/[(d+)]/g, '.$1').split('.')
            let result = source
            for (const p of paths) {
                result = Object(result)[p]
                if (result === undefined) {
                    return defaultValue
                }
            }
            return result
        }
        lodash_set(obj, path, value) {
            if (Object(obj) !== obj) return obj
            if (!Array.isArray(path)) path = path.toString().match(/[^.[]]+/g) || []
            path
                .slice(0, -1)
                .reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
                path[path.length - 1]
                ] = value
            return obj
        }
        getdata(key) {
            let val = this.getval(key)
            // 如果以 @
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?).(.*?)$/.exec(key)
                const objval = objkey ? this.getval(objkey) : ''
                if (objval) {
                    try {
                        const objedval = JSON.parse(objval)
                        val = objedval ? this.lodash_get(objedval, paths, '') : val
                    } catch (e) {
                        val = ''
                    }
                }
            }
            return val
        }
        setdata(val, key) {
            let issuc = false
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?).(.*?)$/.exec(key)
                const objdat = this.getval(objkey)
                const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
                try {
                    const objedval = JSON.parse(objval)
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                } catch (e) {
                    const objedval = {}
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                }
            } else {
                issuc = this.setval(val, key)
            }
            return issuc
        }
        getval(key) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.read(key)
            } else if (this.isQuanX()) {
                return $prefs.valueForKey(key)
            } else if (this.isNode()) {
                this.data = this.loaddata()
                return this.data[key]
            } else {
                return (this.data && this.data[key]) || null
            }
        }
        setval(val, key) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.write(val, key)
            } else if (this.isQuanX()) {
                return $prefs.setValueForKey(val, key)
            } else if (this.isNode()) {
                this.data = this.loaddata()
                this.data[key] = val
                this.writedata()
                return true
            } else {
                return (this.data && this.data[key]) || null
            }
        }
        initGotEnv(opts) {
            this.got = this.got ? this.got : require('got')
            this.cktough = this.cktough ? this.cktough : require('tough-cookie')
            this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
            if (opts) {
                opts.headers = opts.headers ? opts.headers : {}
                if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
                    opts.cookieJar = this.ckjar
                }
            }
        }
        get(opts, callback = () => { }) {
            if (opts.headers) {
                delete opts.headers['Content-Type']
                delete opts.headers['Content-Length']
            }
            if (this.isSurge() || this.isLoon()) {
                if (this.isSurge() && this.isNeedRewrite) {
                    opts.headers = opts.headers || {}
                    Object.assign(opts.headers, {
                        'X-Surge-Skip-Scripting': false
                    })
                }
                $httpClient.get(opts, (err, resp, body) => {
                    if (!err && resp) {
                        resp.body = body
                        resp.statusCode = resp.status
                    }
                    callback(err, resp, body)
                })
            } else if (this.isQuanX()) {
                if (this.isNeedRewrite) {
                    opts.opts = opts.opts || {}
                    Object.assign(opts.opts, {
                        hints: false
                    })
                }
                $task.fetch(opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => callback(err)
                )
            } else if (this.isNode()) {
                this.initGotEnv(opts)
                this.got(opts)
                    .on('redirect', (resp, nextOpts) => {
                        try {
                            if (resp.headers['set-cookie']) {
                                const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
                                if (ck) {
                                    this.ckjar.setCookieSync(ck, null)
                                }
                                nextOpts.cookieJar = this.ckjar
                            }
                        } catch (e) {
                            this.logErr(e)
                        }
                        // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
                    })
                    .then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body
                            } = resp
                            callback(null, {
                                status,
                                statusCode,
                                headers,
                                body
                            }, body)
                        },
                        (err) => {
                            const {
                                message: error,
                                response: resp
                            } = err
                            callback(error, resp, resp && resp.body)
                        }
                    )
            }
        }
        post(opts, callback = () => { }) {
            const method = opts.method ? opts.method.toLocaleLowerCase() : 'post'
            // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
            if (opts.body && opts.headers && !opts.headers['Content-Type']) {
                opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            if (opts.headers) delete opts.headers['Content-Length']
            if (this.isSurge() || this.isLoon()) {
                if (this.isSurge() && this.isNeedRewrite) {
                    opts.headers = opts.headers || {}
                    Object.assign(opts.headers, {
                        'X-Surge-Skip-Scripting': false
                    })
                }
                $httpClient[method](opts, (err, resp, body) => {
                    if (!err && resp) {
                        resp.body = body
                        resp.statusCode = resp.status
                    }
                    callback(err, resp, body)
                })
            } else if (this.isQuanX()) {
                opts.method = method
                if (this.isNeedRewrite) {
                    opts.opts = opts.opts || {}
                    Object.assign(opts.opts, {
                        hints: false
                    })
                }
                $task.fetch(opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => callback(err)
                )
            } else if (this.isNode()) {
                this.initGotEnv(opts)
                const {
                    url,
                    ..._opts
                } = opts
                this.got[method](url, _opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => {
                        const {
                            message: error,
                            response: resp
                        } = err
                        callback(error, resp, resp && resp.body)
                    }
                )
            }
        }
        /**
         *
         * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
         *    :$.time('yyyyMMddHHmmssS')
         *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
         *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
         * @param {string} fmt 格式化参数
         * @param {number} 可选: 根据指定时间戳返回格式化日期
         *
         */
        time(fmt, ts = null) {
            const date = ts ? new Date(ts) : new Date()
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'H+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
                'q+': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds()
            }
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            for (let k in o)
                if (new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            return fmt
        }
        /**
         * 系统通知
         *
         * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
         *
         * 示例:
         * $.msg(title, subt, desc, 'twitter://')
         * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         *
         * @param {*} title 标题
         * @param {*} subt 副标题
         * @param {*} desc 通知详情
         * @param {*} opts 通知参数
         *
         */
        msg(title = name, subt = '', desc = '', opts) {
            const toEnvOpts = (rawopts) => {
                if (!rawopts) return rawopts
                if (typeof rawopts === 'string') {
                    if (this.isLoon()) return rawopts
                    else if (this.isQuanX()) return {
                        'open-url': rawopts
                    }
                    else if (this.isSurge()) return {
                        url: rawopts
                    }
                    else return undefined
                } else if (typeof rawopts === 'object') {
                    if (this.isLoon()) {
                        let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
                        let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                        return {
                            openUrl,
                            mediaUrl
                        }
                    } else if (this.isQuanX()) {
                        let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
                        let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                        return {
                            'open-url': openUrl,
                            'media-url': mediaUrl
                        }
                    } else if (this.isSurge()) {
                        let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
                        return {
                            url: openUrl
                        }
                    }
                } else {
                    return undefined
                }
            }
            if (!this.isMute) {
                if (this.isSurge() || this.isLoon()) {
                    $notification.post(title, subt, desc, toEnvOpts(opts))
                } else if (this.isQuanX()) {
                    $notify(title, subt, desc, toEnvOpts(opts))
                }
            }
            if (!this.isMuteLog) {
                let logs = ['', '==============📣系统通知📣==============']
                logs.push(title)
                subt ? logs.push(subt) : ''
                desc ? logs.push(desc) : ''
                console.log(logs.join('\n'))
                this.logs = this.logs.concat(logs)
            }
        }
        log(...logs) {
            if (logs.length > 0) {
                this.logs = [...this.logs, ...logs]
            }
            console.log(logs.join(this.logSeparator))
        }
        logErr(err, msg) {
            const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
            if (!isPrintSack) {
                this.log('', `❗️${this.name
                }, 错误!`, err)
            } else {
                this.log('', `❗️${this.name
                }, 错误!`, err.stack)
            }
        }
        wait(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        }
        done(val = {}) {
            const endTime = new Date().getTime()
            const costTime = (endTime - this.startTime) / 1000
            this.log('', `🔔${this.name
            }, 结束!🕛${costTime}秒`)
            this.log()
            if (this.isSurge() || this.isQuanX() || this.isLoon()) {
                $done(val)
            }
        }
    })(name, opts)
}