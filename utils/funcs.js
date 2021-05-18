const models = require("../models");
const {QueryTypes} = models.Sequelize;
const svgCaptcha = require('svg-captcha');  //验证码模块
const bcryptjs = require("bcryptjs");       //加密模块

const funcs = function () {
};



//设置保持登录功能，设置cookie
funcs.setCookies=async function(name,req,res){
    let now = new Date().valueOf();
    let tokenVal = bcryptjs.hashSync(name + now, 10);
    let userid = bcryptjs.hashSync(name, 10);
    await models.users.update({
        remember_token: tokenVal
    }, {
        where: {
            name: name
        }
    });
    res.cookie('token', tokenVal, {expires: new Date(Date.now() + 1000*60*60*24*7), httpOnly: true});
    res.cookie('userid', userid, {expires: new Date(Date.now() +  1000*60*60*24*7), httpOnly: true});
}

//获取图形验证码对象
funcs.getCaptcha = function () {
    let codeConfig = {
        size: 4,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 5, // 干扰线条的数量
        height: 40,
        inverse: false,
        fontSize: 40,
    }
    let captcha = svgCaptcha.create(codeConfig);
    // req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    // let captchaImg = captcha.data;
    return captcha;
}



//处理表格数据，保留符合columnCount(可以是多个数，例如{7，8})列数的记录，并返回。
funcs.filteTable = function (table, columnCount) {
    let t = [];
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < columnCount.length; j++) {
            if (table[i].length === columnCount[j]) {
                t.push(table[i]);
            }
        }
    }
    return t;
}
//读取csv文件
funcs.readCvsToJson = function (fileName) {
    return new Promise((resolve, reject) => {
        const iconv = require('iconv-lite');
        let fs = require("fs");
        fs.readFile(fileName, {encoding: 'binary'}, function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            let table = [];
            let buf = Buffer.from(data, 'binary');
            let str = iconv.decode(buf, 'GBK');
            str = str.replace(/\t/g, "").replace(/\"/g, "")
            funcs.ConvertToTable(str, function (data) {
                table = data;
            });
            resolve(table);
        });
    })
}


funcs.ConvertToTable = function (data, callBack) {
    data = data.toString();
    let table = [];
    let rows;
    rows = data.split("\r\n");
    for (let i = 0; i < rows.length; i++) {
        table.push(rows[i].split(","));
    }
    callBack(table);
}




//获取某天偏移的日期
funcs.getYesterday = function (date, day) {
    let dd = new Date(date);
    dd.setDate(dd.getDate() + day);
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
    let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
}

module.exports = funcs;